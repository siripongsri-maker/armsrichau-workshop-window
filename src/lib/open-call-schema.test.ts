import { describe, expect, it } from "vitest";
import { OPEN_CALL_DEADLINE, openCallSchema } from "./open-call-schema";

const valid = {
  organisation: "Test organisation", link: "example.org/path", about: "Community work",
  workType: "one_page_website", problem: "No website", oneMonthChange: "More enquiries",
  contactName: "Test contact", email: "test@example.org", channel: "email",
  channelDetail: "", agreeTerms: "yes", budget: "0", language: "en", hp_extra: "",
};

describe("Open-call input rules", () => {
  it("normalizes links without a protocol", () => {
    expect(openCallSchema.parse(valid).link).toBe("https://example.org/path");
  });
  it("accepts a filled honeypot up to 500 characters", () => {
    expect(openCallSchema.parse({ ...valid, hp_extra: "x".repeat(500) }).hp_extra).toHaveLength(500);
    expect(openCallSchema.safeParse({ ...valid, hp_extra: "x".repeat(501) }).success).toBe(false);
  });
  it("enforces the 200-character channel-detail limit", () => {
    expect(openCallSchema.safeParse({ ...valid, channelDetail: "x".repeat(200) }).success).toBe(true);
    expect(openCallSchema.safeParse({ ...valid, channelDetail: "x".repeat(201) }).success).toBe(false);
  });
  it.each(["javascript:alert(1)", "https://", "not a link", "ftp://example.org", "https://user:pass@example.org"])("rejects unsafe/invalid link %s", (link) => {
    expect(openCallSchema.safeParse({ ...valid, link }).success).toBe(false);
  });
  it("retains the exact Bangkok deadline", () => {
    expect(Date.parse(OPEN_CALL_DEADLINE)).toBe(Date.UTC(2026, 10, 8, 16, 59, 59));
  });
  it.each(["organisation", "about", "problem", "oneMonthChange", "contactName", "email"])("rejects empty required field %s", (name) => {
    expect(openCallSchema.safeParse({ ...valid, [name]: " " }).success).toBe(false);
  });
  it.each(["workType", "channel", "agreeTerms", "budget"])("requires a choice for %s", (name) => {
    expect(openCallSchema.safeParse({ ...valid, [name]: "" }).success).toBe(false);
  });

  it.each(["concept_note", "consultancy"])("accepts the %s work type", (workType) => {
    expect(openCallSchema.safeParse({ ...valid, workType }).success).toBe(true);
  });
});