PASS

## review-agent: U-047a round 2 (head eb30c2b)

Blocking: none.
Verified: round 1 audit items unchanged; PM rulings respected. The move changed no behaviour: `startCheckoutPayment` spends `payment_tries`, then `startPaymentTx`, provider call, `recordProviderPayment`; device check before any lock and rechecked under lock; retrieve, find-or-create, create match the old `providerPayment`, a stored id missing at the provider still throws `not_found`; idempotency key `attempt.providerKey`; logged catch stays and the secret is returned; `storesPayment(step)` true exactly when `providerPaymentId` was null. No new B2 in `src/server/checkout.ts`. `lockAttemptRow` in `locks.ts` ("taken alone, by the payment's second transaction only"). Data-layer B2 fixed (`attemptNo` on `create`, `{ write, stored }`, `newsletterConsent` in lib, `Decision` from `StartDecision`). Alphabet from one constant; test asserts `0123456789ABCDEFGHJKMNPQRSTVWXYZ`. TODO trimmed. Scope 11 files. No duplication.
Ran (scratch copy): unit 48 files 1023 pass (`src/lib/checkout`, `src/lib/orders`, `src/server`); db `tests/db/checkout*` 3 files 71 pass with `--maxWorkers=2` including the race tests; typecheck clean.
Non-blocking: `providerPayment` dispatches on step kind twice (could return lookup args from `providerStep`); carried audit items BC-9, BC-10.
