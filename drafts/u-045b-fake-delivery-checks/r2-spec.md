PASS

The earlier handback followed the brief's "PASS first line, header, nothing else" format, so it carried no table. The full verdict is below. I checked the code by reading the round 2 diff and the files it touches. I did not run the test suites.

## Spec compliance: U-045b "Fake payment delivery" (head caeeb60)

**Verdict: PASS.** Every criterion is PASS or N/A, and there are no blocking items.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Pattern note call 1: state in one `fake_gateway_state` row as JSONB, read-lock-change-write | PASS | `src/server/db/fakeGateway.ts` (`readFakeGatewayState`, `withFakeGatewayState`), `src/server/ports/payments/gateway.ts:37-46` |
| 2 | Call 2: caps from the gateway, past them `provider_unavailable` | PASS | `src/lib/payments.ts:97-109`, used at `gateway.ts:64-65` and `fakeState.ts:29-36` |
| 3 | Call 3: in-process delivery through `paymentWebhookResponse`, awaited, every outcome delivered | PASS | `src/server/fakePaymentDelivery.ts:40-66` |
| 4 (as amended) | Reply waits for drain up to 5 s; clock 5 s ahead; `after()` keeps a longer drain and reports failure; failed drain does not fail the action | PASS | `fakePaymentDelivery.ts:20-32` (`settleWithin`, timer cleared in `finally`), `:64-66` (`fixedClock(fakeDrainTime(...))`, `after(drained)`, `await settleWithin(...)`); constants at `src/lib/fakePayment.ts:4-14` |
| 5 | Call 5: webhook secret random per process, no new env var | PASS | `gateway.ts:60-72` (`processSecret` on `globalThis`, `Symbol.for('ramble.fakeGatewaySecret')`); no env read |
| 6 | Call 6: click-through checked locally, then on production | N/A | Process and QA item, not diff-verifiable |
| R2-a | Global secret shared across module copies, gateway per copy | PASS | `gateway.ts:60-86`; test `tests/db/fake-gateway.db.test.ts` ("another copy of the module" describe in `src/server/ports/payments/gateway.test.ts`) |
| R2-b | Pay reply waits up to `fakeDrainWaitMs` | PASS | `fakePaymentDelivery.ts:20-32, 64-66`; test "stops waiting for a drain that never finishes" at `src/server/fakePaymentDelivery.test.ts:107` |
| R2-c | `after(drained)` with a longer drain, reports failure, no catch | PASS | `fakePaymentDelivery.ts:65`; `settleWithin` uses `Promise.allSettled`, so the rejection is handled without a catch in the action |
| R2-d | Drain clock 5 s ahead through `fakeDrainTime` | PASS | `fakePayment.ts:8-10`; `fakePaymentDelivery.ts:65`; test at `src/server/fakePaymentDelivery.test.ts:87`; unit test in `src/lib/fakePayment.test.ts` |
| R2-e | `.strict` state schemas | PASS | `src/server/ports/payments/fakeState.ts:55-125`. Shapes checked against adapter writes in `fake.ts`: payment (~391), refund (~462), transfer (~504), reversal (~541), events (`emit`, ~270). `failedTries` cannot exceed 5 (`fake.ts:324`), `actionRounds` cannot exceed 3 (`fake.ts:331, 370`) |
| R2-f | Pay method tests | PASS | `tests/db/fake-payment-delivery.db.test.ts:319-337` (`card`, `apple_pay`, `google_pay`, asserting event method, stored method, and attempt method) |
| R2-g | Caps in `fakeGatewayLimits`, incl. `maxActionRounds` read by `fake.ts` | PASS | `src/lib/payments.ts:97-109`; `fake.ts:40` |
| R2-h | `emptyFakeStateDocument` | PASS | `fakeState.ts` (exported, `satisfies StoredState`); used by `src/server/db/fakeGateway.ts` |
| R2-i | `signatureHeader` exported from `paymentWebhook.ts` | PASS | `src/server/paymentWebhook.ts:22`; imported at `fakePaymentDelivery.ts` |
| R2-j | `CurrencySchema` exported from `ports/payments/index.ts` | PASS | `src/server/ports/payments/index.ts:12`; imported at `fakeState.ts` |
| R2-k | `hasServerActionDirective` with its fixture test | PASS | `tests/checkout-no-sentry.test.ts:45, 69`; fixture table at `:137-150` |
| R2-l | Extra cap refusal tests | PASS | `src/server/ports/payments/fakeState.test.ts:285` (idempotency keys), `:307` (action rounds), `:331` (client secret), `:340` (fingerprint) |
| R2-m | Five-declines db test | PASS | `tests/db/fake-payment-delivery.db.test.ts:339` |
| R2-n | `src/server/fakePaymentDelivery.test.ts` | PASS | File exists, 170 lines, 6 `it` cases including drain lead, timer cleanup, and drain failure |
| R2-o | Runbook update | PASS | `docs/runbooks/jobs.md` "After Pay on the fake gateway" section |
| J-1 | `confirmOrder` and `processProviderEvent` take database time, so the 5 s lead cannot skew money stamps | PASS | `src/server/db/providerEvents.ts:124, 296` (`readDatabaseTime`); `confirmOrder` receives `now` from that call (`providerEvents.ts:331-340`). The provider-event job handler in `src/server/jobs/providerEvents.ts` does not read the clock |
| J-2 | Timer cleared on every path | PASS | `fakePaymentDelivery.ts:23-31` (`finally { clearTimeout(timer) }`) |
| J-3 | Round 2 stayed in its list | PASS | All 17 files map to a listed item. See non-blocking note on `fakeState.ts` |

### Blocking

None.

### Non-blocking

1. `src/server/ports/payments/fakeState.ts` also changed `FailureCodeSchema`, `failedTries`, and `clientSecret` to read caps from `paymentLimits` and `maxFailedTries` (in place of literal 64, 100, and 512). This is within the "caps" item, but it is a small change beyond the strict-schema change. The values are unchanged at the stored limits (64, 5, 512).
2. The `fixedClock` in `fakePaymentDelivery.ts:65` is fixed at drain start. A drain that runs up to 60 seconds keeps that start time. The pulse path has the same behaviour, so this is not new.
3. The round 2 change is recorded in `/Users/davidfleming/Workspace/ramble-pm/DECISIONS.md` line 206 (2026-10-30, "round 1 changes the fake delivery design"). I did not find a separate round 2 entry, although the brief cites "DECISIONS 2026-10-30" for it. The line 206 entry contains the amended call 4 wording.

### Unconfirmed

- Test results (test 6,448, test:db 1,595, e2e 161) were taken from the builder's gates in the brief. I did not rerun them.
- Runtime behaviour (forged-webhook status code, decline-then-success without reload, restart between Continue and Pay, drain-failure timing) belongs to qa-agent and is not verified here.
- The 5 s clock lead's effect on claim timing is accepted per the brief, and the db test only asserts that the drain clock is ahead.
