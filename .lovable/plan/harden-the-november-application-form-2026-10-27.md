# Harden the November application form

- Keep the home page and its shared files untouched.
- Make spam protection atomic, enforce five submissions per IP and 50 globally per hour, and expire raw IP logs.
- Fix honeypot handling, body-size protection, nonblocking owner emails, and remove unused sign-in middleware.
- Improve bilingual validation, link normalization, server-rendered deadline handling, focus management, accessible fields, language controls, and the requested privacy notice.
- Run focused tests and the real application flow, verify stored answers, and delete test records.

## Technical details and limitations
- Use one service-role-only database function for atomic rate reservations.
- Prefer supported background execution; otherwise use the requested logged fire-and-forget fallback.
- The deployed visitor-IP check needs the updated code published. This task will not publish without your request; report that check as pending.
- Keep focused regression tests next to the allowed form/schema files. Automatic build verification is used rather than manually invoking the build.