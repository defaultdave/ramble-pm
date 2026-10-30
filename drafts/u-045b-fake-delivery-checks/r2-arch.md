PASS

## architecture-audit: U-045b "Fake payment delivery" (head caeeb60)

Rules: `.claude/standards/architecture.md` (project). I checked the round 2 diff `a5d41b0..1d95c81` (17 files) against B1 to B17.

Blocking count: 0.

Round 1 blocking items, all fixed:
- **B2, size caps:** the caps (`maxIdempotencyKeys`, `maxFingerprintLength`, `maxClientSecretLength`, `maxActionRounds`) are now in `fakeGatewayLimits` in `src/lib/payments.ts`. `fakeState.ts` and `fake.ts` only read them. `fakeDrainTime`, `fakeDrainLeadMs` and `fakeDrainWaitMs` sit in `src/lib/fakePayment.ts`.
- **B2, missing row:** the missing-row rule is now the data constant `emptyFakeStateDocument` in `fakeState.ts`. `fakeGateway.ts` only falls back to it with `?? emptyFakeStateDocument`.
- **B13:** the drain catch is gone, and the diff adds no catch anywhere. `settleWithin` uses try/finally with `Promise.allSettled`, so a failed drain neither throws into the action nor goes unreported. `after(drained)` reports the failure, and the wait is capped at `fakeDrainWaitMs`. The timer is cleared in `finally` on every path.
- **B17:** `signatureHeader` is exported from `paymentWebhook.ts` and imported by `fakePaymentDelivery.ts`. The copy is removed. `CurrencySchema` is exported from `ports/payments/index.ts` and reused, and the duplicate in `fakeState.ts` is removed. I searched `src/` for another timeout or race helper and found none, so `settleWithin` is not a duplicate.

Nothing else broke on the architecture rules:
- **B3, B4, B11, B12:** `src/server` imports only `src/server` and `src/lib`. The module copy gets no new vendor import. Time comes from `systemClock` and `fixedClock`. No `Date.now()` was added.
- **B7:** `emptyFakeStateDocument` has callers in `fakeGateway.ts`. `hasServerActionDirective` is a test-file helper under `tests/`, so B7 does not apply. `signatureHeader` and `CurrencySchema` have non-test importers.
- **B9, B10:** the transaction and lock structure of `withFakeGatewayState` is unchanged. The drain runs only after a taken delivery.
- **`.strict` and gateway sharing:** the strict schemas are built from the port's own schemas. The gateway is now per module copy and only the secret is shared through `globalThis`, which removes the cross-bundle `PaymentsError` problem.
- **`tests/checkout-no-sentry.test.ts`:** it keeps the same `'use server'` skip, now as a named function with a fixture table. The regex only matches a directive at the top of the file after comments.

Advisory:
- A1: the `fakeState.ts` strict schemas rely on `satisfies z.ZodType<...>` for the adapter's types. Anything the adapter writes beyond them fails at runtime, not at compile time. The new fakeState tests cover this.
- I did not trace `confirmOrder` and `processProviderEvent` for the database-time check. That is outside the architecture rules and belongs to review.

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
