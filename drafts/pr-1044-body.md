Closes #1005

Gives the two browser form posts under `/api/auth` their own rate-limit key, as B15 requires. They stay Route Handlers (owner decision, DECISIONS 2026-11-17).

## What changed
- `src/lib/rateLimits.ts`: new surfaces `confirm_sign_in` (10 an hour per client address) and `end_session` (30 per 10 minutes per client address). Sign-out does not share the tight `forms` surface. Two plain functions now hold the decisions the server code used to make: `counterRefusal` (a counter that could not be read refuses with 503, a counter over its limit refuses with 429 and a retry time) and `addressCountFollows` (the per-address sign-in count is spent only when the client counter let the request through, so a refused client cannot use up an address's count and lock a guest out).
- `src/server/auth/forms.ts`: each handler consumes its own surface after the origin check and before reading the body or calling Better Auth.
- `src/server/auth/refusal.ts` (new): `refusal` and `noStore` moved out of `handler.ts`, plus `countRateLimit`, `refusalFor` and `refuseOverLimit`, which call the two lib functions above. Over the limit gives an empty 429 with `Retry-After` and `no-store`; an unreachable counter gives 503, logging the error kind only. Both fail closed.
- `src/server/auth/handler.ts`: the sign-in handler uses `addressCountFollows` and `refuseOverLimit` instead of its own comparisons.
- Tests for the two lib functions, the limit being hit, the refusal, counter failure, no spend on a foreign origin, the address count not spent for a refused or failed client, and sign-out never touching `forms`. Sign-in README updated.

## Not built
BotID on sign-in, lockout after failures, any schema change.

## Gates
format, lint, typecheck, knip, build with no database, gitleaks, unit and database tests: see the CI checks on the head commit for the current counts.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
