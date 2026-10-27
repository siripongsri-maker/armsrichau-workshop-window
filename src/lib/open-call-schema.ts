import { z } from "zod";

export const OPEN_CALL_DEADLINE = "2026-11-08T23:59:59+07:00";
export const WORK_TYPES = ["one_page_website", "marketing_plan", "content_set"] as const;
export const CHANNELS = ["email", "line", "phone", "messenger", "other"] as const;
export const BUDGETS = ["0", "up_to_2000", "2000_5000", "over_5000"] as const;

const requiredText = (limit: number) => z.string({ required_error: "required", invalid_type_error: "required" })
  .trim().min(1, "required").max(limit, `too_long:${limit}`);
const choose = <T extends string>(values: readonly [T, ...T[]]) =>
  z.enum(values, { errorMap: () => ({ message: "choose_one" }) });

const optionalUrl = z.string().trim().max(500, "too_long:500").optional()
  .transform((value) => {
    if (!value) return "";
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  })
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password &&
        url.hostname.includes(".") && !/\s/.test(value) && !value.includes("://", value.indexOf("://") + 3);
    } catch { return false; }
  }, { message: "url" });

export const openCallSchema = z.object({
  organisation: requiredText(200),
  link: optionalUrl,
  about: requiredText(600),
  workType: choose(WORK_TYPES),
  problem: requiredText(600),
  oneMonthChange: requiredText(600),
  contactName: requiredText(200),
  email: requiredText(255).email("email"),
  channel: choose(CHANNELS),
  channelDetail: z.string().trim().max(200, "too_long:200").optional(),
  agreeTerms: choose(["yes", "no"] as const),
  budget: choose(BUDGETS),
  language: choose(["en", "th"] as const),
  hp_extra: z.string().max(500, "too_long:500").optional(),
});

export type OpenCallInput = z.input<typeof openCallSchema>;
export type OpenCallData = z.output<typeof openCallSchema>;
