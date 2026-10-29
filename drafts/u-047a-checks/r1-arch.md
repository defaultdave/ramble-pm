FAIL

## architecture-audit: U-047a "startPayment action" (head 81240e4)

Tree check: `git diff 9174800 81240e4` is empty; the merged tree equals the feature commit.

### Blocking
- B2 (Server Action), `src/server/actions/checkout.ts:31-58`: `providerPayment` makes the provider-step decisions in the action (branches on `step.step === 'retrieve'` and `'find_or_create'`, throws `PaymentsError('not_found')` on `!found`, applies `existing ?? createPayment`). Fix: a tested `src/lib/` function taking the port calls as arguments, or a `src/server/` function behind the action; the action parses, gets the device and calls one function.
- B2 and the Server Actions row, `src/server/actions/checkout.ts:107`: `started.attempt.providerPaymentId === null` decides whether to store the provider id, and the action sequences the rate limit, `startPaymentTx`, the provider and `recordProviderPayment` (85-114) instead of one call. Fix: move it behind one server function; the "store or not" rule from `providerStep` or a sibling lib function.
- B2 (data layer), `src/server/db/checkout.ts:401`: `decision.kind === 'next_attempt' ? decision.attemptNo : 1` decides the attempt number (the default `1` is a domain rule). Fix: `startPaymentDecision` returns `attemptNo` for every new-attempt outcome.
- B2 (data layer), `src/server/db/checkout.ts:449-458`: `verdict === 'store'` and `verdict !== 'refuse'` compute the domain result. Fix: `storeProviderPayment` returns `{ write, stored }`.

### Non-blocking
- Borderline presence guards and dispatches on lib decisions (`checkout.ts:101`, `172-194`, `211-250`, `341-356`); the newsletter "grant only" rule at `checkout.ts:264` could move to lib.
- SQL on write paths is clause-level (`lockOrderRow` WHERE, latest attempt `orderBy ... limit(1)`, `onConflictDoNothing` on acceptances, `clock_timestamp()`).
- B13 vs design doc 4.2.3 step 6 (`src/server/actions/checkout.ts:68-77`): `rememberPayment` catches a failed transaction 2, logs kind and id, and continues; the design doc requires it, the standard allows only one catch exception. Flagged for the PM.
- B17 (audit item): `crockfordAlphabet` in `src/lib/checkout.ts:373` restates the set in `orderReferencePattern` (`src/lib/orders.ts:44`); derive both from one constant.
- B17 clean otherwise (`fieldErrorsFromIssues`, `remainingSpaces`, `isHoldOfDevice`, `payingUntil`, `payingHold`, `priceKindLabel`, reused reads and helpers).

### Clean
B4; B6 (device checked on the unlocked read before any lock; `recordProviderPayment` and `recordOrderAcceptances` check the device); B9 (one transaction for order, items, guest, consent, acceptances, attempt, hold; the provider call between two transactions); B10 (session, hold, order, then guest; `recordProviderPayment` locks `payment_attempts` alone, no attempt-then-order path found); B12; B7; B3, B5, B11.
