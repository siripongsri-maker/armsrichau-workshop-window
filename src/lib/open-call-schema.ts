import { z } from "zod";

// Shared between the /apply form (client) and the submit server function.
export const OPEN_CALL_DEADLINE = "2026-11-08T23:59:59+07:00";

export const WORK_TYPES = ["one_page_website", "marketing_plan", "content_set"] as const;
export const CHANNELS = ["email", "line", "phone", "messenger", "other"] as const;
export const BUDGETS = ["0", "up_to_2000", "2000_5000", "over_5000"] as const;

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\/.+\..+/.test(v), { message: "url" });

export const openCallSchema = z.object({
  organisation: z.string().trim().min(1).max(200),
  link: optionalUrl,
  about: z.string().trim().min(1).max(600),
  workType: z.enum(WORK_TYPES),
  problem: z.string().trim().min(1).max(600),
  oneMonthChange: z.string().trim().min(1).max(600),
  contactName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  channel: z.enum(CHANNELS),
  channelDetail: z.string().trim().max(200).optional().or(z.literal("")),
  agreeTerms: z.enum(["yes", "no"]),
  budget: z.enum(BUDGETS),
  language: z.enum(["en", "th"]),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type OpenCallInput = z.infer<typeof openCallSchema>;
