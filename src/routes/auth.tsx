import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { utilityHead } from "@/lib/page-head";
import { T, UtilityShell } from "@/components/UtilityShell";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => utilityHead("Sign in · Arm Srichau", "Sign in or create an account on Arm Srichau's portfolio."),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<"confirm" | "reset" | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/account", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/account", replace: true });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/account" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/account", replace: true });
        else setNotice("confirm");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("reset");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    setError(null);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setError(result.error.message ?? "Sign-in failed.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/account", replace: true });
  }

  const title =
    mode === "signin" ? <T en="Sign in" th="เข้าสู่ระบบ" /> : mode === "signup" ? <T en="Create an account" th="สร้างบัญชี" /> : <T en="Reset password" th="ตั้งรหัสผ่านใหม่" />;

  return (
    <UtilityShell>
      <h1 className="h-section">{title}</h1>

      {notice ? (
        <p className="lede" role="status">
          {notice === "confirm" ? (
            <T en="Check your email to confirm your account, then sign in." th="กรุณาเปิดอีเมลเพื่อยืนยันบัญชี แล้วกลับมาเข้าสู่ระบบ" />
          ) : (
            <T en="If that email has an account, a reset link is on its way." th="หากอีเมลนี้มีบัญชีอยู่ ลิงก์ตั้งรหัสผ่านใหม่จะถูกส่งไปให้" />
          )}
        </p>
      ) : (
        <>
          {mode !== "forgot" && (
            <div style={{ display: "grid", gap: 12, marginTop: 32 }}>
              <button type="button" className="btn btn-line" onClick={() => social("google")}>
                <T en="Continue with Google" th="ดำเนินการต่อด้วย Google" />
              </button>
              <button type="button" className="btn btn-line" onClick={() => social("lovable")}>
                <T en="Continue with Lovable" th="ดำเนินการต่อด้วย Lovable" />
              </button>
              <p className="f-hint" style={{ textAlign: "center" }}>
                <T en="or use your email" th="หรือใช้อีเมล" />
              </p>
            </div>
          )}

          <form className="apply-form" style={{ marginTop: 16, gap: 20 }} onSubmit={onSubmit}>
            <div className="f-field">
              <label className="f-label" htmlFor="a-email"><T en="Email" th="อีเมล" /></label>
              <input id="a-email" className="f-input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div className="f-field">
                <label className="f-label" htmlFor="a-pass"><T en="Password" th="รหัสผ่าน" /></label>
                <input id="a-pass" className="f-input" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                {mode === "signup" && <span className="f-hint"><T en="At least 8 characters." th="อย่างน้อย 8 ตัวอักษร" /></span>}
              </div>
            )}
            {error && <p className="f-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-accent" disabled={busy}>
              {busy ? <T en="Please wait…" th="กรุณารอสักครู่…" /> : mode === "signin" ? <T en="Sign in" th="เข้าสู่ระบบ" /> : mode === "signup" ? <T en="Create account" th="สร้างบัญชี" /> : <T en="Send reset link" th="ส่งลิงก์ตั้งรหัสผ่านใหม่" />}
            </button>
          </form>
        </>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}>
        {mode !== "signin" && <button type="button" className="apply-back" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => { setMode("signin"); setNotice(null); }}><T en="Have an account? Sign in" th="มีบัญชีแล้ว? เข้าสู่ระบบ" /></button>}
        {mode !== "signup" && <button type="button" className="apply-back" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => { setMode("signup"); setNotice(null); }}><T en="New here? Create an account" th="ยังไม่มีบัญชี? สร้างบัญชี" /></button>}
        {mode === "signin" && <button type="button" className="apply-back" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => { setMode("forgot"); setNotice(null); }}><T en="Forgot password?" th="ลืมรหัสผ่าน?" /></button>}
      </div>
    </UtilityShell>
  );
}
