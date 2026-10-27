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

- The public-only /apply flow uses its shared schema and server function with a service-role-only atomic rate-reservation RPC; no global browser auth middleware is needed, keeping public submissions independent of localStorage.
- Persist applications before attempting owner email; the installed TanStack server-function runtime exposes no supported waitUntil accessor, so await delivery with a four-second timeout and log failures without changing saved-application success. This bounds response latency without pretending the fallback is a durable queue.
