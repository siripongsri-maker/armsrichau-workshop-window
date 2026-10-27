import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { OPEN_CALL_DEADLINE, openCallSchema } from "./open-call-schema";

const RATE_LIMIT_PER_HOUR = 5;

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "closed" | "rate_limited" | "invalid" | "error" };

export const submitOpenCallApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = openCallSchema.safeParse(input);
    if (!parsed.success) throw new Error("invalid");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<SubmitResult> => {
    // Server-side deadline: reject late submissions even if the page is stale.
    if (Date.now() > Date.parse(OPEN_CALL_DEADLINE)) {
      return { ok: false, reason: "closed" };
    }

    // Honeypot: bots that fill the hidden field get a fake success, nothing stored.
    if (data.website) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Ad-hoc per-IP rate limit: max 5 submissions per hour.
    const req = getRequest();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("open_call_rate_log")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, reason: "rate_limited" };
    }
    await supabaseAdmin.from("open_call_rate_log").insert({ ip });

    const { data: row, error } = await supabaseAdmin
      .from("open_call_applications")
      .insert({
        language: data.language,
        organisation: data.organisation,
        link: data.link || null,
        about: data.about,
        work_type: data.workType,
        problem: data.problem,
        one_month_change: data.oneMonthChange,
        contact_name: data.contactName,
        email: data.email,
        channel: data.channel,
        channel_detail: data.channelDetail || null,
        agree_terms: data.agreeTerms,
        budget: data.budget,
      })
      .select("id")
      .single();

    if (error) {
      console.error("open_call_applications insert failed", error);
      return { ok: false, reason: "error" };
    }

    // Notify the owner. The application is already stored, so an email
    // failure must not fail the submission — log and still return ok.
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("open-call-notification", "srichausiripong@gmail.com", {
        templateData: {
          organisation: data.organisation,
          link: data.link || undefined,
          about: data.about,
          workType: WORK_TYPE_LABELS[data.workType],
          problem: data.problem,
          oneMonthChange: data.oneMonthChange,
          contactName: data.contactName,
          email: data.email,
          channel: CHANNEL_LABELS[data.channel],
          channelDetail: data.channelDetail || undefined,
          agreeTerms: data.agreeTerms === "yes" ? "Yes" : "No",
          budget: BUDGET_LABELS[data.budget],
          language: data.language,
          submittedAt: new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" }),
        },
        idempotencyKey: `open-call-notification-${row.id}`,
      });
    } catch (emailError) {
      console.error("open call notification email failed", emailError);
    }

    return { ok: true };
  });
