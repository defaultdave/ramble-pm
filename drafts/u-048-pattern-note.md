# U-048 pattern note (draft 2026-10-29, e2e-money lane)

Goes into U-048's scope manifest. U-048 takes the payment provider's webhooks in, stores each event once, and processes events for one order one at a time, following the design doc's event table. It is human-led in the plan; it goes to an agent builder under this note (DECISIONS 2026-10-29), and the Q answers below are the PM's recommendations, applied unless Dave overrules them.

Sources: `docs/plan/units.yaml` U-048 ("Raw-body signature check, `provider_events` with dedupe, per-order serial processing, the event table from design doc 4.2.3, matching by metadata; alerts go through `alerts.raise` (U-007)"; depends on U-045a, U-005, U-007, U-015, U-014a) and the scopes of U-049, U-056, U-079a, U-081, U-109; design doc 4.2.3 (money rules 1 to 8, "Payment in flight": `payment_attempts`, `provider_events`, webhook intake, "What each event does", and the `confirmOrder` steps); ADR 0003; code on `integration`: `src/server/ports/payments/` (`verifyWebhook`, `maxWebhookBodyLength`, `ProviderEvent`), `tests/support/paymentEvents.ts` (U-045b's late, out-of-order, repeated delivery), U-015 schema `payments.ts` (`provider_events`, `payment_attempts`) and `src/lib/payments.ts` (transitions), U-014a `src/server/db/holds.ts` and `locks.ts`, U-005 jobs (`src/lib/jobs.ts`, `src/server/jobs/`), U-007 `src/server/monitoring/alerts.ts`, the email webhook route `src/app/api/webhooks/email/` (U-006) as the route pattern.

---

**Pattern note**

Intake (one Route Handler, `src/app/api/webhooks/payments/route.ts`, on the email webhook's pattern)
- Read the raw body as text with the length capped at `maxWebhookBodyLength` before anything else; a larger body answers 413 with nothing written.
- `PaymentsPort.verifyWebhook` on the raw body; a bad or missing signature answers 400 with nothing written and nothing logged but the kind.
- In one transaction: insert into `provider_events` with `ON CONFLICT (provider, provider_event_id) DO NOTHING` (a repeat is a no-op, rule "repeats are no-ops"), carrying `ramble_order_id` and `ramble_record_id` from the object's metadata, the amount and currency, `occurred_at`, `received_at`, and the trimmed verified payload; and enqueue one `process_provider_event` job (payload: the event row id) through U-005's outbox, only when the insert created the row. Answer 2xx. The route takes no `Caller`: the signature is the capability (B6 exemption by design).

Processing (`src/server/jobs/providerEvents.ts` handler; decisions in `src/lib/providerEvents.ts`)
- The handler takes a transaction-level advisory lock on the order id first (`lockFor(tx, 'order-events:' + orderId)`, rule 8), then follows the one lock order in `locks.ts` (session, hold, order) to act. An event with no order id is matched by metadata through `PaymentsPort.retrieve` (rule 7); still unmatched, it is retried with backoff and alerts through `alerts.raise` after 5 attempts (`attempts`, `last_error` on the row).
- `providerEventAction(event, attempt, order, now)` in `src/lib/providerEvents.ts`, a pure function with a table test per row of the design doc's "What each event does", returns what to do:
  - `payment.succeeded` on the order's live attempt with the order `pending_payment`, `payment_failed` or `void`: attempt `succeeded` and hand to `confirmOrder` (Q1).
  - `payment.succeeded` on an attempt already `succeeded`: no-op.
  - `payment.succeeded` on any other payment for the order: the duplicate-payment refund path (Q2).
  - `payment.failed` on the live attempt with the order `pending_payment`: attempt `failed_try`, `failed_tries + 1`, order `payment_failed`, hold back to `active` if `expires_at > now()`; at 5 tries the attempt is canceled and the order voided.
  - `payment.failed` on anything else: that attempt's row only.
  - `payment.requires_action` on the live attempt: attempt `requires_action`, `paying_until` extended once (a U-014a holds function).
  - `payment.canceled`: attempt `canceled`.
  - `refund.*`, `transfer.*`, `dispute.*`: not this unit's (Q3).
- Every status change goes through U-015's transition functions; a terminal state never changes (rule 3). Decisions use processing time (`now()`), never `occurred_at` (rule 2). `processed_at` is set in the same transaction as the action.

Tests
- Intake: signature refused, body too large refused, a repeat stored once and enqueued once, metadata ids recorded.
- Each row of the event table from a seeded state (table test in lib, db tests for the writes).
- Per-order serial processing: two events for one order handled concurrently run one at a time (a locked re-check test that fails if the advisory lock is removed).
- Late, out-of-order and repeated delivery with U-045b's `deliverEmittedEvents`: the final state is the same as in-order delivery.
- Unmatched event: retried, then alerted after 5.

Not in this unit
- `confirmOrder` (U-049), the duplicate-payment refund (U-109), refund and transfer and dispute processing (U-056, U-079a, U-081), the Stripe adapter (U-046), the ledger postings (U-049 and later).

---

**Questions (PM recommendation first; adopted unless Dave overrules)**

- **Q1. `confirmOrder` is U-049's, built next.** Recommendation: U-048 defines the seam, a typed `ConfirmOrder` function the handler calls inside its transaction, and ships it as "not available yet": the handler marks the attempt `succeeded` but leaves the event unprocessed and returns, so the job retries without an alert and nothing is confirmed until U-049 replaces the seam. No money state is guessed. Alternative: U-048 waits for U-049.
- **Q2. A success for a payment that is not the live attempt.** The design doc refunds it; the refund path is U-109's. Recommendation: alert through `alerts.raise` (one per event) and leave the event unprocessed for U-109 to drain; no partial refund logic here.
- **Q3. Refund, transfer and dispute events.** Recommendation: stored and deduplicated by intake, and the handler leaves them unprocessed without retrying or alerting (a `deferredUntil`-style skip keyed on the type), so the owning units drain them later; the demo produces none.
- **Q4. The route path.** Recommendation: one route for the fake gateway now, `src/app/api/webhooks/payments/route.ts`, with the provider taken from the adapter; U-046 adds the Stripe adapter behind the same route.
