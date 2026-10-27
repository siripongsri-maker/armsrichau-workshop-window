<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The /apply open-call form submits through `src/lib/open-call.functions.ts` (createServerFn), which validates with the shared zod schema in `src/lib/open-call-schema.ts`, enforces the deadline and an ad-hoc per-IP rate limit (5/hour via `open_call_rate_log`), and inserts with supabaseAdmin — the `open_call_applications` table has no anon/authenticated grants or policies, so all access goes through that function.
