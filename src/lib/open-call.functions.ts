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

    // Owner notification email is wired once the sender domain is verified
    // (Lovable email setup). Until then applications are stored only.
    void row;
    return { ok: true };
  });
