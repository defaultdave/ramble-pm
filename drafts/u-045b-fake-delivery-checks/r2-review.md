PASS
## review: U-045b "Fake payment delivery" (head caeeb60)

Scope: round 2 stays within the 17 files in the PM list. The final commit is a PM merge touching only home page files, outside this unit. No out-of-scope changes.

Round 1 blocking item (apple_pay/google_pay lost in the action test rewrite): fixed. `tests/db/fake-payment-delivery.db.test.ts` has an `it.each(['card','apple_pay','google_pay'])` case. It checks the method in the stored event, in the fake's event, and on the attempt. The old test on main checked only the fake's event, so the new one is stronger. I forced `method: 'card'` in the `emit` call in `fake.ts` in a scratch copy, and the apple_pay and google_pay cases failed. Forcing `card` only on `payment.method` did not fail any test. Nothing in the app reads that field, and I'm not holding it against the unit.

Judged items:
- **Drain failure or hang:** `settleWithin` races `Promise.allSettled([work])` against a 5 second timer, and clears the timer in `finally`. A rejected drain cannot fail the action, because `allSettled` absorbs it and `after(drained)` owns the report. A hung drain releases the reply at 5 seconds. There is no catch and no app log line, as ruled.
  - Mutations in a scratch copy: removing `clearTimeout`, replacing the race with `await work`, removing `after`, and removing the lead each failed 1 to 2 tests.
  - Side effect: `fixedClock` is `drainJobs`'s clock for lock expiry, `finishedAt` and retry backoff. With a clock 5 seconds ahead, a job's 5 minute lease is judged expired 5 seconds early and a retry backoff is 5 seconds short. `ownsClaim` guards a double run. Harmless.
- **`.strict` against what the adapter writes:** I read every write path in `fake.ts`.
  - Payments, refunds, transfers, reversals, events, `byMetadata` keys (82 characters against a 255 limit) and `actionRounds` (at most 3) all fit the schemas.
  - `clientSecret` is about 60 characters against a 512 limit.
  - Idempotency: at most one key per object plus one cancel key per payment, so 4,000 at the cap.
  - Idempotency responses are snapshots, so a payment refunded after its key was recorded still parses.
  - The `busyState` round trip in `fakeState.test.ts` covers refunds, transfers and reversals.
  - Removing strict fails 4 tests.
- **Clock ahead by 5 seconds:** the provider-event handler (`src/server/jobs/providerEvents.ts`) ignores `clock`. `processProviderEvent` reads `readDatabaseTime(tx)` and passes it to `confirmOrder` as `input.now`, and uses `clock_timestamp()` for its own stamps. `bookingEmails.ts` does not use the clock. Nothing money-related is stamped from the drain clock.
- **No new duplication:** `settleWithin` is the only race-with-timeout helper in `src` outside a test. Constants are shared from `lib` (`fakeGatewayLimits`, `fakeDrainLeadMs`, `fakeDrainWaitMs`), and `maxActionRounds` is now read by `fake.ts`. `signatureHeader` and `CurrencySchema` are exported, not copied.
- **`checkout-no-sentry`:** `hasServerActionDirective` is conservative. A `/* */` comment before the directive means the module is followed, not skipped. The 8-row fixture test passes.
- **Standards and docs:** the runbook is updated and matches the code (5 second wait, `after`, clock lead). The only ticket mention in a comment is `TODO(U-046)`. There are no `console.*` calls in the diff.

Checks I ran in a scratch copy of the head:
- Unit tests for the delivery, the payments port, `fakePayment` lib, the action and the Sentry guard: 220 passed.
- `fake-gateway.db` and `fake-payment-delivery.db`: 28 passed.
- eslint on the changed areas: clean. knip: clean.
- tsc: only the known `PageProps` and `LayoutProps` generated-type errors from the missing Next typegen in the scratch copy, none in changed files.

Nits, none blocking:
- `after(drained)` runs after the Pay request is already past the point of no return. If `after` ever threw outside a request scope, `drained` would be an unhandled rejection. In a server action this cannot happen.
- A running job's lease ends 5 seconds early for a concurrent drain. This is the accepted clock-lead cost.

I did not run qa-agent's browser steps (a) to (f); that is the QA check's job. The scratch copy has been removed.
