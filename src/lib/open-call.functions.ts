import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { OPEN_CALL_DEADLINE, openCallSchema } from "./open-call-schema";

let loggedDeployedIpHeaders = false;

export const getOpenCallState = createServerFn({ method: "GET" }).handler(() => ({
  closed: Date.now() > Date.parse(OPEN_CALL_DEADLINE),
}));

const WORK_TYPE_LABELS: Record<string, string> = {
  one_page_website: "One-page website (usually about THB 15,000)",
  marketing_plan: "30-day marketing plan on one page (usually about THB 10,000)",
  content_set: "Content set: 4 posts with captions (usually about THB 8,000)",
  concept_note: "Concept note or short proposal, up to 5 pages (usually about THB 15,000)",
  consultancy: "Consultancy: 2 online sessions of 90 minutes on communication, digital or fundraising (usually about THB 6,000)",
};
const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  line: "LINE",
  phone: "Phone",
  messenger: "Facebook Messenger",
  other: "Other",
};
const BUDGET_LABELS: Record<string, string> = {
  "0": "THB 0",
  up_to_2000: "Up to 2,000",
  "2000_5000": "2,000–5,000",
  over_5000: "Over 5,000",
};

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
    if (data.hp_extra) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Prefer the edge-provided visitor address; never use the first XFF entry.
    const req = getRequest();
    const cfIp = req.headers.get("cf-connecting-ip")?.trim();
    const forwarded = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
    const ip = (cfIp || forwarded || "unknown").slice(0, 64);
    // One narrow diagnostic per deployed worker isolate; never log cookies,
    // authorization, or form answers. Check the first deployed request against
    // the visitor's independently known public IP before declaring it verified.
    if (!loggedDeployedIpHeaders && new URL(req.url).hostname === "armsrichau.com") {
      loggedDeployedIpHeaders = true;
      console.info("open call deployed IP check", {
        cfConnectingIp: cfIp?.slice(0, 64),
        forwardedLast: forwarded?.slice(0, 64),
      });
    }
    let slot: boolean;
    try {
      const { data: accepted, error: slotError } = await supabaseAdmin.rpc("open_call_take_slot", { p_ip: ip, p_limit: 5 });
      if (slotError || typeof accepted !== "boolean") {
        console.error("open call rate reservation failed", slotError?.code ?? "invalid result");
        return { ok: false, reason: "error" };
      }
      slot = accepted;
    } catch {
      console.error("open call rate reservation unavailable");
      return { ok: false, reason: "error" };
    }
    if (!slot) {
      return { ok: false, reason: "rate_limited" };
    }

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

    if (error || !row) {
      console.error("open_call_applications insert failed", error);
      return { ok: false, reason: "error" };
    }

    // TanStack exposes no supported waitUntil accessor in this installed stack.
    // Await delivery for at most four seconds after persistence; a timeout is
    // logged, not a failed application or a claim of durable email queuing.
    const notification = (async () => {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const result = await sendTemplateEmail("open-call-notification", "srichausiripong@gmail.com", {
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
      if (!result.sent) {
        console.error("open call notification email not sent", result.reason);
      }
    })().catch((emailError: unknown) => {
      console.error("open call notification email failed", emailError);
    });

    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        notification,
        new Promise<void>((resolve) => {
          timeout = setTimeout(() => {
            console.error("open call notification email timed out after 4000ms");
            resolve();
          }, 4000);
        }),
      ]);
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
    }

    return { ok: true };
  });
