# U-047a pattern note (draft 2026-10-29, e2e-money lane)

Goes into U-047a's scope manifest. U-047a is the first money Server Action: `startPayment` turns an open hold into an order and a live payment attempt, idempotently, and hands the checkout page (U-047b) a client secret for the fake card form (U-045b). It is human-led in the plan; Dave moved the money core to agent builders under pattern notes (DECISIONS 2026-10-29), and since 2026-10-29 the PM proceeds on its recommendations where Dave has not answered (DECISIONS: "do not hold up work just for my decision"), so the Q answers below apply unless he overrules them.

Sources: `docs/plan/units.yaml` U-047a (scope; depends on U-014a, U-045a, U-019, U-018, U-008b, U-111, U-015) and the scopes of U-047b, U-048, U-049; design doc 4.2.3 ("Rules every money and hold transaction follows" 1 to 8, "Orders" with the `startPayment` contract and steps 1 to 6, "Payment in flight", the capability-token amendment) and 5.2 (S6, S7, S9); ADR 0002 and 0003; PRD-14, 15, 16, 19, 22, 23, 24; `drafts/u-014a-pattern-note.md` (lock order, `Device`, `paying`, `readOpenHeldSeats`); `.claude/standards/architecture.md` (B2, B6, B7, B9, B13, B17); code on `integration`: U-014a (`src/server/device.ts`, `src/server/db/holds.ts`, `src/server/db/locks.ts`, `src/lib/holds.ts`), U-015 (`src/lib/orders.ts`, `payments.ts`, `src/server/tokens.ts`, schema `orders.ts`, `payments.ts`), U-019 (`src/server/db/guests.ts`), U-045a and U-045b (`src/server/ports/payments/`, `gateway.ts`), U-018 (`src/server/db/legal.ts`, `settings.ts`, `legal_acceptances`), U-008b (`src/lib/rateLimits.ts` surface `payment_tries`), U-111 (`src/lib/pricing.ts`).

Where a line says "Q", it is a call the PM made without a firm source; the questions are at the end.

---

**Pattern note**

Where things live
- Decisions: `src/lib/checkout.ts` with unit tests: the `StartPaymentInputSchema` (the design doc's Zod contract, ids lowercased, every string length-bounded first), the result union, `attendeeIssues(experience, attendees)` (PRD-23 from `ageRule`, `minAge`, `maxAge`; children ages each in range; a guardian when children are present; 21+ needs `ageConfirmed`), `legalIssues(experience, input, current)` (terms is the current published version; the waiver is required exactly when `waiverRequired`, and must be that experience's document), `startPaymentDecision(state)` (the order of the outcomes below as one pure function over what the transaction read), `orderSnapshot(hold, experience, settings, tier, startsAt)` (every snapshot column), and `newOrderReference(random)` (`RMB-` plus 6 Crockford base32, through U-015's format check). Reuse U-015's `orders.ts` money helpers and `pricing` (B17); no second tax or commission formula.
- Data layer: `src/server/db/checkout.ts` with `import 'server-only'`: `startPaymentTx(device, input)` (transaction 1) and `recordProviderPayment(attemptId, providerPaymentId)` (transaction 2). Locks only through `locks.ts`, in the order written there: session row, hold row, then the order row (a new `lockOrderRow` in `locks.ts`, after the hold). No device lock: that one is reserve-only (design doc rule 1).
- Action: `src/server/actions/checkout.ts` (`'use server'`), `startPayment(input)`: `getDevice()`, Zod parse, the `payment_tries` rate limit keyed on the hold id (U-008b; fail closed), `startPaymentTx`, then the provider call, then transaction 2. `TODO(U-047b): first caller`.
- Payments: the action takes the gateway from `getFakePayments()` (U-045b) for the demo, behind the `PaymentsPort` interface, so U-046's Stripe adapter swaps in without touching this unit.
- Migration: one generated migration adding the foreign keys U-015 left as `TODO(U-047a)` (orders to holds, sessions, legal documents), each `ON DELETE RESTRICT`.

The steps (design doc 4.2.3 "startPayment", made exact)
1. Validate (Zod), then `attendeeIssues` and `legalIssues`; any issue returns `invalid` with field errors and writes nothing.
2. Read the hold's session id without a lock, then lock session, hold, and any order whose key is `book:{hold_id}`.
3. The hold must belong to the caller: `hold.device_key = device.deviceKey`; otherwise the answer is identical to a missing hold (Q1).
4. `startPaymentDecision` over the locked state:
   - order `confirmed`: `already_confirmed` (the order token only when the device matches, else the reference alone);
   - order with a live attempt that has a `provider_payment_id`: return that attempt's client secret, re-fetched with `PaymentsPort.retrieve` (no new provider payment; rule 4);
   - attempt `failed_tries` at 5, or the rate limit spent: `too_many_tries`;
   - hold not open at processing time (`isOpenHold`, rule 2): `hold_expired` with `canRehold` and `spacesLeft` from `readOpenHeldSeats`, or `sold_out` with U-014a's alternatives when no spaces remain;
   - otherwise create or reuse.
5. Create: the order (`book:{hold_id}` key, a new reference with up to 3 tries on a unique clash, then throw; items copied from `hold_items` with label snapshots; every snapshot from `orderSnapshot`: tax treatment from the experience, `tax_rate_ppm` from `pricing.taxRatePpm` over that treatment and the settings rate, commission at the settings rate (Q3), `cancellation_tier_id` and `free_cancel_until` from the tier and `starts_at`, attribution from the input), the guest by `findOrCreateGuest(tx, email)` and the newsletter consent by `recordConsent` (U-019, source `checkout`, only when ticked), the terms and waiver acceptances in `legal_acceptances`, attempt 1 (`pay:{order_id}:1`, amount = `amount_due_minor`, status `created`), and the hold to `paying` with `paying_until` from U-014a's rule (Q4). Reuse (an order in `pending_payment`, `payment_failed` or `void` with no live attempt): a new attempt with the next `attempt_no`. Commit.
6. Outside any transaction: `PaymentsPort.createPayment` with the attempt's provider key and metadata `{ order_id, attempt_id }` (rule 6). Then transaction 2 stores `provider_payment_id`; if that write fails, the order stays matchable by metadata and the action still returns the client secret. If the provider call fails, the action throws a typed provider error (no row is rolled back; the next call finds the live attempt without a provider id and looks it up by metadata with `retrieve` before creating, rule 7).
7. Return `requires_payment` with `orderId`, `reference`, `{ provider, clientSecret }`, `amountDueMinor`, and the order token (`capabilityToken('order', orderId, manage_token_version)`) when the device matches.

Tests (unit and real-database)
- Every outcome above, each from a seeded state, with the database left as the outcome says (nothing written on `invalid`, `hold_expired`, `sold_out`, `too_many_tries`).
- Idempotency: two calls on one hold (two tabs) give one order and one attempt; the second returns the same client secret. A third after a decline reuses the attempt.
- Concurrency with the locked re-check: the hold expires or is released while the call waits on the session lock; the call answers `hold_expired`, and the test fails if the re-check is removed.
- The tries limit: the sixth call on one hold answers `too_many_tries` and writes nothing.
- Provider failure between the transactions: the order and attempt stay, the next call does not create a second provider payment.
- Device mismatch is answered exactly as a missing hold (same result, same timing class, no write).
- The migration's foreign keys refuse an order pointing at a missing hold, session, or document.

Not in this unit
- The checkout page and the card form wiring (U-047b), webhook intake (U-048), `confirmOrder` (U-049), gift purchase and redemption (U-062a, U-064a), the Stripe adapter (U-046), the ledger (U-016), hold upkeep (U-014b).

---

**Questions (PM recommendation first; adopted unless Dave overrules)**

- **Q1. A hold that is not the caller's.** Recommendation: answer exactly as a missing or expired hold (`hold_expired`, `canRehold: false`), so a guessed hold id leaks nothing (the builder rules' uniform-refusal lesson). Alternative: a distinct `invalid`.
- **Q2. "A reused key with a different payload is rejected."** The design doc says it, but a guest who fixes a typo in their name after a decline would be refused. Recommendation: the money side of the payload cannot differ (it comes from the hold), so on reuse the pending order's contact, lead guest, attendee fields, consent and acceptances are updated to the latest input; a confirmed order answers `already_confirmed` whatever was sent. Alternative: refuse any change with `invalid`.
- **Q3. Where the commission rate comes from.** Recommendation: the settings row if U-018 holds a commission rate, else a named constant (1500 bps, Q-03) in `src/lib/pricing.ts`; the order snapshots it either way. The builder checks which exists and says so.
- **Q4. The paying grace.** Recommendation: U-014a's `paying_until = greatest(expires_at, now()) + grace` with the grace from `readHoldSettings`, computed by a `src/lib/holds.ts` function (reuse it if U-014a shipped one).
- **Q5. Rate limit and attempt tries together.** Recommendation: both stay: `payment_tries` (5 calls per hold, U-008b) bounds calls before any lock; `failed_tries` (5 declines per attempt, ADR 0002) is the provider-side count. Either one at its limit answers `too_many_tries`.
