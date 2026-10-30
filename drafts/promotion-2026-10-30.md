Promotion of `integration` to `main`, 2026-10-30: the Prototype money chain, from the jobs outbox to the booking bar. It lands after the sync PR 282 (`main` into `integration`), so this diff holds only `integration`'s own work.

## Critical units in the batch
Each passed review, qa, spec-compliance and architecture-audit (a11y-audit on UI units) into `integration`; verdicts in `ramble-pm` `drafts/<unit>-checks/`.

| Unit | PR | What it adds |
|---|---|---|
| U-005 | 231 | Jobs outbox, drain route, and the pulse |
| U-024 | 222 | Focus kept while loading; focus rings in forced colors |
| U-015 | 262 | Orders, payment attempts, provider events, refunds, transfers schema |
| U-014a | 266 | Holds core and `reserveSpaces` (race tests 20 of 20) |
| U-054 | 268 | Booking emails |
| U-016 | 269 | Ledger and its views (append-only, 25 account pairs pinned) |
| U-047a | 271 | `startPayment` |
| U-014b | 274 | Hold rules and upkeep (address lock, cleanup, 30-day scrub) |
| U-048 | 276 | Webhook intake and the event table (retries capped at 25 with one alert) |
| U-049 | 277 | `confirmOrder` for bookings (the worked example to the cent) |
| U-050 | 280 | Confirmation page and order status (refresh-safe token handoff, S9 poller) |

Standard units that went into `integration` because they build on these: U-019 (247), U-045b (249), U-047b (278, the checkout page), U-040 (279, dates and spaces left), U-041 (281, the booking bar, sheet and panel; retires the demo click-through).

## What guests see after a production redeploy
The experience page lists upcoming dates with spaces left and offers the booking bar on phones and the panel from 768 px. Continue places a real hold and opens the real checkout. **Known gap:** after Pay on the fake gateway the order stays "Checking your payment", because nothing in the app yet delivers the fake payment's event to the webhook intake (audit items BC-37 and BC-38 in `ramble-pm` `audits/booking-checkout.md`). The demo click-through is gone, so until that glue lands a guest cannot finish a booking on production. Hold the production redeploy until it does, or redeploy knowing that.

## Before merging
- Nightly smoke on `integration`: no `nightly-smoke` status was reported on `integration` when this was written; check it first (runbook E1).
- Ten migrations, `0009_jobs_outbox` to `0018_hold_limit_indexes`, run on the production database with the deploy.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
