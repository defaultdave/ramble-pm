PASS

## spec-compliance: checkout audit fixes, BC-58, BC-29, BC-35, BC-39 (head 89e6ece, base 053bd1a) (agent verdict, recorded by the PM because the agent is read-only)

| # | Criterion | Status |
|---|---|---|
| 1 | BC-58: the checkout error state gets a server-rendered frame, not plain SiteShell | PASS (`checkout/layout.tsx`, `checkout/error.tsx`) |
| 2 | BC-58: vitest guard against `GuestShell` and `siteNav` in client modules | PASS (`tests/checkout-client-modules.test.ts`) |
| 3 | BC-58 with BC-54: `retry` vs `reset` | PASS: Next 16.4.2 passes both (`error-boundary.js:113-114`), `retry` is stable since v16.3.0, and `tests/error-boundaries.test.tsx` enforces it, so the row's premise is false and no change is needed |
| 4 | BC-29: `<h2>` no longer inside `<span>` | PASS |
| 5 | BC-29: h1 focus no longer hidden | PASS, with a browser check owed on `:focus-visible` after programmatic focus |
| 6 | BC-35: 44 px cells at 320 px | PASS by arithmetic, not measured |
| 7 | BC-35: unavailable dates not in `text-disabled` alone | PASS |
| 8 to 10 | BC-39: focus on the notice, first Escape closes, as the panel does | PASS |

Blocking: none. Tests not run by this agent. BC-54 and ticket #347 are stale for this Next version and should be closed.
