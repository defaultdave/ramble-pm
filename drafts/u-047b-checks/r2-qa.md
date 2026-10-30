FAIL

## qa-agent: U-047b round 2 (head 8c8d1bb)

Scratch copy, fresh seeded Postgres, `next build` + `next start`, Playwright at 320, 360, 390, 768, 1280; suites not run.
Round 1 fixed: header pill wraps at 320 (72 px header), no sideways scroll at 320, 360, 390 for 14:45 and 59:45, active and paying, light and dark (widest element ends 312/352/382); S9 offline no overflow. Re-hold: 12 replays on a live hold all refused (3 open before and after); 12 on one lapsed hold 1 `held`, 11 refused, 12 more refused; 12 parallel on one lapsed hold exactly 1 `held`, old released `expired`; another device, missing, paying all the same refusal.
### Blocking
- Desktop summary toggle (4.1.2): at 768 and 1280, JS on and off, the panel is visible (210 px) but the toggle has `aria-expanded="false"`, is in the tab order, enabled, `pointer-events: none`; Enter flips it with no visible change. New in round 2 (round 1 exposed `true` after hydration). Fix in the shared `OrderSummary`: from 768 remove the toggle from the tree and tab order (a heading instead, or `inert`/`display: none` keeping the title visible), or set the state from the same media query.
### Re-hold deviation
Safe: cannot lose a guest anything; claim and release under the session and hold locks, cannot race into two holds. When the reserve refuses after the claim (sold out, lapse block, paused, seat limit) the old hold stays released and a reload shows "We can't find that page" (`reload-released-after-blocked-390-light-r2.png`). UX gap: after a lapse block the panel says "Try again in a little while" but the next click says "We couldn't hold those spaces. Go back to the experience and choose them again" (`s6-blocked-retry-390-light-r2.png`); run `blockRefusal` before the claim or change the copy.
### Non-blocking
Focus: Continue focuses the "Payment" group with `role="status"` "Getting your payment ready", one Payment h2; S6 and S7 take focus; empty submit focuses email with "There are 4 things to fix"; a refused re-hold leaves focus on the button (Alert announced); a successful re-hold navigates, focus on BODY. Summary open at 768 and 1280 with JS on and off; collapsed at 320, 390. Pay flow with 4242 reaches `/orders/RMB-…?t=<token>`; no page or console errors.
Unconfirmed log noise: every `/checkout/<id>` request with a device cookie logs "The checkout page could not be read" (`kind: Error`) yet renders correctly; the only source is the catch at `src/app/(checkout)/checkout/[holdId]/page.tsx:53`.
Merge and scope: migrations match b2314f1; 63 files, nothing out of scope.
Evidence: `evidence/pr/unit-U-047b-qa-agent/` (`*-r2.png`, `header-*-after.png`).
