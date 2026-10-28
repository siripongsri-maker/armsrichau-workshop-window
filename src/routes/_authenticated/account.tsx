import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { utilityHead } from "@/lib/page-head";
import { T, UtilityShell } from "@/components/UtilityShell";

export const Route = createFileRoute("/_authenticated/account")({
  staticData: { sitemap: false },
  head: () => utilityHead("Your account · Arm Srichau", "Your signed-in account on Arm Srichau's portfolio."),
  component: AccountPage,
});

function AccountPage() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <UtilityShell>
      <h1 className="h-section"><T en="You're signed in" th="เข้าสู่ระบบแล้ว" /></h1>
      <p className="lede">{user.email}</p>
      <button type="button" className="btn btn-line" style={{ marginTop: 24 }} onClick={signOut}>
        <T en="Sign out" th="ออกจากระบบ" />
      </button>
    </UtilityShell>
  );
}
