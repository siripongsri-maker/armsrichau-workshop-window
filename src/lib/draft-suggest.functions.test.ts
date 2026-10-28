import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), gen: vi.fn() }));
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
vi.mock("@tanstack/react-start/server", () => ({
  getRequest: () => new Request("http://localhost/", { headers: { "cf-connecting-ip": "203.0.113.8" } }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { rpc: mocks.rpc } }));
vi.mock("@lovable.dev/ai-gateway", () => ({
  generateResponse: mocks.gen,
  GatewayError: class extends Error {},
  RateLimitError: class extends Error {},
  PaymentRequiredError: class extends Error {},
}));
import { suggestDraftRevision } from "./draft-suggest.functions";

const input = { field: "problem", text: "Nobody knows our group yet.", lang: "en" } as const;

beforeEach(() => vi.clearAllMocks());

describe("Draft suggestions", () => {
  it("allows 20 suggestions per visitor per hour", async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.gen.mockResolvedValue({ output: [{ type: "message", content: [{ type: "output_text", text: '{"suggestion":"Better.","notes":[]}' }] }] });
    expect(await suggestDraftRevision({ data: input })).toEqual({ ok: true, suggestion: "Better.", notes: [] });
    expect(mocks.rpc).toHaveBeenCalledWith("ai_suggest_take_slot", { p_ip: "203.0.113.8", p_limit: 20 });
  });

  it("does not call the model once the limit is reached", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    expect(await suggestDraftRevision({ data: input })).toEqual({ ok: false, reason: "rate_limited" });
    expect(mocks.gen).not.toHaveBeenCalled();
  });

  it("rejects drafts over 600 characters", () => {
    expect(() => suggestDraftRevision({ data: { ...input, text: "a".repeat(601) } })).toThrow();
  });
});
