import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), send: vi.fn(), request: new Request("http://localhost/apply") }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validator = (input: unknown) => input;
    const builder = {
      inputValidator: (fn: typeof validator) => { validator = fn; return builder; },
      handler: (fn: (args: { data: unknown }) => unknown) => (args?: { data: unknown }) => fn({ data: validator(args?.data) }),
    };
    return builder;
  },
}));
vi.mock("@tanstack/react-start/server", () => ({ getRequest: () => mocks.request }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { rpc: mocks.rpc, from: mocks.from } }));
vi.mock("@/lib/email-templates/send-email", () => ({ sendTemplateEmail: mocks.send }));
import { getOpenCallState, submitOpenCallApplication } from "./open-call.functions";

const valid = { organisation: "Test", about: "Community", workType: "content_set", problem: "Reach",
  oneMonthChange: "Enquiries", contactName: "Test", email: "test@example.org", channel: "email",
  agreeTerms: "yes", budget: "0", language: "en", hp_extra: "" } as const;

beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-27T00:00:00Z"));
  vi.clearAllMocks();
  mocks.request = new Request("http://localhost/apply", { headers: { "cf-connecting-ip": "203.0.113.8", "x-forwarded-for": "spoofed, 203.0.113.9" } });
  mocks.rpc.mockResolvedValue({ data: true, error: null });
  mocks.from.mockReturnValue({ insert: () => ({ select: () => ({ single: async () => ({ data: { id: "test-id" }, error: null }) }) }) });
  mocks.send.mockResolvedValue({ sent: true });
});

describe("Submission safeguards", () => {
  it("uses cf-connecting-ip before XFF and requests five hourly slots", async () => {
    expect(await submitOpenCallApplication({ data: valid })).toEqual({ ok: true });
    expect(mocks.rpc).toHaveBeenCalledWith("open_call_take_slot", { p_ip: "203.0.113.8", p_limit: 5 });
  });
  it("falls back to the last XFF entry and caps it at 64 characters", async () => {
    mocks.request = new Request("http://localhost", { headers: { "x-forwarded-for": `spoofed, ${"x".repeat(80)}` } });
    await submitOpenCallApplication({ data: valid });
    expect(mocks.rpc).toHaveBeenCalledWith("open_call_take_slot", { p_ip: "x".repeat(64), p_limit: 5 });
  });
  it("fails closed when the atomic limit returns an error", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "test-error" } });
    expect(await submitOpenCallApplication({ data: valid })).toEqual({ ok: false, reason: "error" });
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("does not insert or email when a slot is refused", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    expect(await submitOpenCallApplication({ data: valid })).toEqual({ ok: false, reason: "rate_limited" });
    expect(mocks.from).not.toHaveBeenCalled(); expect(mocks.send).not.toHaveBeenCalled();
  });
  it("returns fake success for a filled honeypot without storing it", async () => {
    expect(await submitOpenCallApplication({ data: { ...valid, hp_extra: "autofill" } })).toEqual({ ok: true });
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.from).not.toHaveBeenCalled();
  });
  it("responds without waiting for owner email delivery", async () => {
    mocks.send.mockReturnValue(new Promise(() => {}));
    expect(await submitOpenCallApplication({ data: valid })).toEqual({ ok: true });
  });
  it("closes the server-rendered form after the deadline and rejects stale submissions", async () => {
    vi.setSystemTime(new Date("2026-11-08T17:00:00Z"));
    expect(await getOpenCallState()).toEqual({ closed: true });
    expect(await submitOpenCallApplication({ data: valid })).toEqual({ ok: false, reason: "closed" });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
});