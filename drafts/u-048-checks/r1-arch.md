FAIL

## architecture-audit: U-048 "Webhook intake" (head 05cf1a7)

Static read of all 18 files; no tests run.

### Blocking (B2: decisions in `src/lib` with a unit test)
- `src/server/paymentWebhook.ts:34-39`: which `PaymentsError` codes (`invalid_signature`, `invalid_input`) count as a refused signature. Fix: `isRefusedSignature(code)` in lib.
- `src/server/paymentWebhook.ts:78-80` (and siblings 52-58 413, 84-86 429, 88 ignored 200): status chosen from outcomes in the server module. Fix: one lib function mapping intake outcome to status.
- `src/server/db/providerEvents.ts:238-239`: provider ids normalised with `.toLowerCase()`; metadata not Zod-parsed. Fix: parse `EventMetadata` with an `EntityIdSchema`-based schema in lib.
- `src/server/db/providerEvents.ts:114`, `:126`: `tries = event.attempts + 1`, `runAfter = now + retryAfterSeconds * 1000`. Fix: `unmatchedOutcome` takes `now` and returns `runAfter`.
- `src/server/db/providerEvents.ts:195-210`: `action.orderStatus !== null`, `action.reopenHold && holdId !== null` applied in the data layer. Fix: fold into the action type.
- `src/server/db/providerEvents.ts:246`, `:257`, `:264`: missing order or order id becomes "unmatched" in the data layer. Fix: a fact into `providerEventAction`.
- `src/server/db/providerEvents.ts:311-313`: `confirm_unavailable` decides the event stays unprocessed (Q1 policy in the data layer; judge with Q1).
- `src/server/db/providerEvents.ts:339`: `action.extendPaying && hold`. Fix: `providerEventAction` knows whether a hold exists.
- `src/server/jobs/providerEvents.ts:51-66`: alert choice and the `${key}:gave-up` key built in the job. Fix: `alertFor(result, eventId)` in lib.
- `src/server/jobs/providerEvents.ts:27`: `port.provider !== event.provider` refusal. Fix: lib or the port lookup.

### Non-blocking
- B10 passes: events advisory lock, then session, hold, order; ids read unlocked then decision re-read under locks; time read after locks. Later paths (confirm, cancel, refund) must take the events lock first; name it in U-049.
- Q1: nothing picks a `confirm_unavailable` event up again (`processed_at` null, no retry job). U-049 must replace the stub and sweep `provider_events` where `processed_at is null` and the type is a success (or enqueue one job per stuck event), with a test that a success stored before U-049 settles the order. Same for `duplicate_payment` events left for U-109.
- Q2 acceptable (one `payment-duplicate` alert per event).
- `lookupMetadata` calls `port.retrieve` inside the job's open transaction; consider doing it before the transaction or bounding it with a timeout.
- B1, B3, B4, B5, B7, B9, B11, B12, B13, B15 pass.
- B17: `lockOrderRow(tx, orderId)` vs U-047a's `lockOrderRow(tx, idempotencyKey)`; reconcile on landing.
Unconfirmed: tests not run.
