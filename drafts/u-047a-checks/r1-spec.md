FAIL

## spec-compliance: U-047a "startPayment action" (head 81240e4)

Blocking:
- `src/server/db/checkout.ts:445` `recordProviderPayment` takes the `payment_attempts` lock inline (`.for('update', { of: paymentAttempts })`); the note says "Locks only through `locks.ts`, in the order written there". No deadlock (taken alone in transaction 2). Fix: `lockAttemptRow(tx, attemptId)` in `src/server/db/locks.ts` with a lock-order header line (taken alone, transaction 2 only), called from `recordProviderPayment`.
Non-blocking:
- `src/server/ports/rate-limit/index.ts:35` TODO still lists U-047a as a future `payment_tries` caller; trim.
- Order of steps: code parses before `getDevice`; note says getDevice, parse, limit; equivalent.
- Signatures differ from the note's shorthand with the same inputs.
- Q1 wording: a `released` hold with no order answers `canRehold` from spaces left (test asserts `canRehold: true, spacesLeft: 10`), not `false, 0`; PM to confirm what "finished" means.
Unconfirmed: "same timing class" for device mismatch checked by reading only; suites not executed by spec.
Checked and matching: tree equality; Zod contract, `attendeeIssues`, `legalIssues`, `startPaymentDecision`, `orderSnapshot` (plus `commission_rate_bps` from `defaultCommissionRateBps`), `newOrderReference` 3 tries, `payingHold`/`payingUntil`, `paymentGraceMinutes`, `payment_tries` 5 per hour on hold id, provider retrieve/find-or-create/create, provider id stored once; migration 0014 four `ON DELETE restrict` FKs with tests; the note's tests exist; TODO(U-047a) all resolved or moved (U-074a, U-064a, U-086); 35 files under src/ or tests/.
