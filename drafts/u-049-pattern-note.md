# U-049 pattern note (draft 2026-10-29, e2e-money lane)

Goes into U-049's scope manifest. U-049 is `confirmOrder`, the one function that turns a paid order into a booking: it replaces U-048's `ConfirmOrder` seam, so the webhook's success events (and the retries U-048 schedules while the seam answers "unavailable") confirm orders. It is human-led in the plan; it goes to an agent builder under this note (DECISIONS 2026-10-29, "do not hold up work just for my decision"), and the Q answers below are the PM's recommendations, applied unless Dave overrules them.

Sources: `docs/plan/units.yaml` U-049 (scope; depends on U-048, U-016, U-014a, U-054) and the scopes of U-109 (refund path), U-056 (refund processing), U-050 (confirmation page), U-062a, U-064a, U-065a (the stubbed branches); design doc 4.2.3 ("Rules every money and hold transaction follows" 1 to 8, the hold and order state tables, `confirmOrder` steps 1 to 5, Transfers, the ledger postings table and worked example, the capability-token amendment); code on `integration` at `16231c0`: U-048's seam `src/server/db/confirmOrder.ts` and its caller in `src/server/db/providerEvents.ts` (`afterConfirm`, the retry), U-016 `src/lib/ledger.ts` (`bookingPaid`, `cardFee`) and `src/server/db/ledger.ts` (`postEntries`), U-014a and U-014b `src/lib/holds.ts`, `src/server/db/holds.ts`, `locks.ts`, U-015 `src/lib/orders.ts`, `payments.ts`, `transfers.ts` (`transferProviderKey`), `src/server/tokens.ts` (`capabilityToken`, `hashToken`), schema `orders`, `transfers`, U-054 `src/server/jobs/bookingEmails.ts` (`guest-confirmation`, `host-booking-notice`), U-005 `enqueue`, U-007 `alerts.raise`, the fake gateway's `feeMinor`.

---

**Pattern note**

Where things live
- Decisions: `src/lib/confirmOrder.ts` (new), pure and unit-tested: `confirmDecision(input)` returns one of `already_confirmed`, `confirm`, `refund_path` (with a reason: `amount_mismatch`, `currency_mismatch`, `session_cancelled`, `sold_out_after_lapse`), or a typed `not_built` for the gift-purchase, zero-due and exchange branches. Inputs are plain values: the order (status, amount due, currency, kind), the payment (amount, currency), the session (status, allocation, seats sold), the hold (status, seats, deadlines), other open holds' seats, and `at`.
- Writes: `src/server/db/confirmOrder.ts` replaces U-048's stub and keeps its exported `ConfirmOrder` type and call contract, so `processProviderEvent` needs no change beyond what the type forces. It runs inside the caller's transaction, after the caller's locks: U-048 already holds the `order-events:<id>` advisory lock, then session, hold, order (`locks.ts`). `confirmOrder` takes no lock of its own except the ones a branch needs that the caller does not hold (none for bookings; the gift lock is U-062a's). Any future caller (U-064a `redeemGift`, U-065a exchange) takes the events lock first (audit BC-17); say so in the header comment.
- Time: `at` is the database time read after the locks (`readDatabaseTime`), never the event's `occurred_at` (rule 2).

Steps (design doc 4.2.3, made exact)
1. Order already `confirmed`: return `already_confirmed`, write nothing.
2. The succeeded payment's amount and currency must equal `orders.amount_due_minor` and `orders.currency`; if not, `alerts.raise('payment-amount-mismatch', ...)` once per order, and take the refund path (Q1).
3. Booking branch (`kind = booking`):
   - Session not `scheduled`: refund path, reason `session_cancelled`.
   - Hold still open (`isOpenHold` at `at`): its seats are already counted; confirm.
   - Hold not open: `free = allocation - seats_sold - seats of other open holds` (one bounded read under the session lock, the same helper U-014b uses); `free >= hold.seats` confirms, otherwise refund path, reason `sold_out_after_lapse`.
   - Confirm, all in the caller's transaction: `sessions.seats_sold += seats`; hold `converted` (through U-014a's transition function); order `confirmed` with `confirmed_at = at` (U-015 transition); `orders.manage_token_hash = hashToken(capabilityToken('manage', order.id, manage_token_version))`; ledger `bookingPaid(...)` through `postEntries` (cash rows keyed on the provider payment id, so a replay answers `already_posted`); the card fee through a shared helper (below); one `transfers` row `scheduled`, `provider_key = transferProviderKey(order.id)`, `release_after` = session end plus 24 hours, no amount (set at release, U-079a); enqueue `guest-confirmation` and `host-booking-notice` with the order id (U-054's dedupe keys); then the session tag invalidation the hold functions use.
   - A CHECK refusal (SQLSTATE 23514) inside confirm: roll back to a savepoint taken before the confirm writes, and take the refund path (reason `sold_out_after_lapse`) in its place.
4. Gift purchase, zero-due (gift redemption) and exchange: typed stubs that throw a `NotBuilt` error naming U-062a, U-064a and U-065a (`TODO(U-062a)` etc.); no demo path reaches them.
5. Refund path: a typed seam owned by U-109 (Q1).

Shared fee helper
- `postProviderFee(tx, { providerPaymentId, feeMinor, orderId, at })` in `src/server/db/ledger.ts` beside `postEntries`: posts `cardFee` when the provider reported a fee, keyed on the provider payment id so a replay posts once; a `null` fee posts nothing and is not an error (Q3). U-062a and U-064a reuse it.

Tests
- Lib: a table test for `confirmDecision` covering every row above (already confirmed; amount and currency mismatch; session cancelled; hold open; hold lapsed with room, exactly enough room, one seat short; the not-built branches).
- Db: a confirmed booking writes exactly one of each (seat count, hold converted, order confirmed with the manage hash matching `capabilityToken`, the `bookingPaid` rows and the fee row, one transfer row with the right `release_after`, two email jobs); a replayed success writes nothing more and posts no second ledger row; the design doc's worked example (two guests at $65, fee $4.07) leaves the balances the ledger tests expect; a lapsed hold with room confirms and one without room takes the refund path; a CHECK refusal rolls back the confirm writes and takes the refund path; concurrency: two success events for one order processed at once confirm once (U-048's events lock), and a confirm racing a `reserveSpaces` for the last seat never oversells (a locked re-check test that fails if the session lock is removed).
- End to end through U-048: a signed `payment.succeeded` on the webhook route, drained, leaves the order `confirmed` and the guest email in the dev mailbox; and an event U-048 left retrying under the old seam confirms on its next retry.

Not in this unit
- The refund path's writes (U-109), refund execution (U-056), the transfer release (U-079a), the confirmation page (U-050), gift and exchange branches (U-062a, U-064a, U-065a), analytics.

---

**Questions (PM recommendation first; adopted unless Dave overrules)**

- **Q1. The refund path is U-109's, built after this unit.** Recommendation: U-049 calls a typed `TakeRefundPath` seam (`src/server/db/refundPath.ts`, stub answering `unavailable`, `TODO(U-109)`) for every refund-path case, and `confirmOrder` then answers `unavailable`, so U-048's handler keeps the `succeeded` mark and retries with backoff, as it does today; an alert fires only at U-048's give-up cap. No refund money state is guessed. Alternative: U-049 builds the minimal refund path now (order `refunded_after_lapse`, hold released, a `pending` refund row with `refundRequested` postings, the S10 email job), which is most of U-109.
- **Q2. The `booking_confirmed` event in step 3.** No event table or analytics unit takes it today. Recommendation: no write; a `TODO` naming the unit that adds server-side funnel events when one is planned (none in `units.yaml` yet, so the PM adds it to the backlog instead of a ticket-less TODO). Alternative: a row in a new `order_events` table now.
- **Q3. A `null` provider fee.** The fake gateway always reports one; Stripe reports it on the balance transaction, sometimes later. Recommendation: post nothing and do not fail the confirm; U-046 decides how Stripe's late fee arrives.
- **Q4. What `confirmOrder` returns.** Recommendation: `{ status: 'confirmed' | 'already_confirmed' | 'unavailable' }` plus the order reference, matching U-048's `afterConfirm`, so the caller decides finish or retry and nothing else changes in U-048.
