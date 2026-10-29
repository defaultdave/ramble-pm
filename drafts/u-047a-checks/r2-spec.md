PASS

## spec-compliance: U-047a round 2 (head eb30c2b)

Blocking: none.
- Attempt lock: `lockAttemptRow` in `src/server/db/locks.ts:102-116` with the header line (`:21-22`), taken alone, called only from `recordProviderPayment` (`src/server/db/checkout.ts:445`); no inline `paymentAttempts` lock left.
- Rate-limit TODO (`src/server/ports/rate-limit/index.ts:35`) lists only U-004a, U-055, U-038, U-043; no U-047a reference left.
- Q1 per the 2026-10-29 ruling: `lapsedOutcome` answers `hold_expired` with `canRehold` from spaces left for a released or lapsed hold with no order (unchanged).
- Delta behaviour-neutral: `providerStep` as before; `lookupVerdict` reproduces `existing ?? createPayment` and retrieve-or-throw; `storesPayment` is `step !== 'retrieve'` (same as the old guard); `storeProviderPayment` `{write, stored}` same outcomes; `newsletterConsent` grants only when ticked; reference pattern text identical (`^RMB-[0-9A-HJKMNP-TV-Z]{6}$`), no CHECK change.
- `startPayment` parses, gets the device, spends `payment_tries` before any lock; device check inside `startPaymentTx` before any lock.
Unconfirmed: suites not run (static reading).
