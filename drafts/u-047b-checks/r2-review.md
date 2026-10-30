FAIL

## review-agent: U-047b round 2 (head 8c8d1bb)

Read the diff and server paths; migrations diff against b2314f1 empty.
### Blocking
- Desktop toggle (`CheckoutPage.module.css:190-192`, `OrderSummary.tsx:113`), WCAG 4.1.2: from 768 px the panel is forced visible (`.summary div[hidden]{display:flex}`) while the toggle stays in the tab order and tree with `aria-expanded="false"`; Enter/Space flips it to true with no visible change. Fix locally: at `min-width:768px` `.summary button[aria-controls]{display:none}` instead of `pointer-events:none`; a story or test that the toggle is not exposed at 1280 px. No shared change needed.
### Round 1 findings
Re-hold fixed (`claimLapsedHold` accepts only the device's `active` booking hold past expiry on the database clock, `src/server/db/rehold.ts:37-49`, `isLapsedHold` `src/lib/holds.ts:241`; others `unbookableSession`; limiter consumed first, outage fails closed; `'human'` verdict documented per ADR 0007). Test gaps closed (`tests/db/rehold.db.test.ts`). `env.ts` exemption narrowed.
### Deviation 1 acceptable
A lapsed hold takes no seats, so releasing it first frees nothing it kept; a failed reserve loses the guest nothing usable; it cannot race into two holds (session then hold lock, re-judged at database time; supersede leaves one open hold); party from the hold's own lines.
Non-blocking: `?t=` token in history and logs (BC-20). B17 items in place; only `TODO(U-086)` added.
Unconfirmed: check no other copy still says details are saved.
