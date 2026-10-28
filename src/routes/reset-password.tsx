import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { utilityHead } from "@/lib/page-head";
import { T, UtilityShell } from "@/components/UtilityShell";

export const Route = createFileRoute("/reset-password")({
  staticData: { sitemap: false },
  head: () => utilityHead("Set a new password · Arm Srichau", "Choose a new password for your account."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/account", replace: true });
  }

  return (
    <UtilityShell>
      <h1 className="h-section"><T en="Set a new password" th="ตั้งรหัสผ่านใหม่" /></h1>
      <form className="apply-form" style={{ gap: 20 }} onSubmit={onSubmit}>
        <div className="f-field">
          <label className="f-label" htmlFor="r-pass"><T en="New password" th="รหัสผ่านใหม่" /></label>
          <input id="r-pass" className="f-input" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="f-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-accent" disabled={busy}>
          <T en="Save password" th="บันทึกรหัสผ่าน" />
        </button>
      </form>
    </UtilityShell>
  );
}
