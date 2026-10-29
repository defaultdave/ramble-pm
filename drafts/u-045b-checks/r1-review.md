PASS

## review-agent: U-045b "Fake payment UI and event simulator" (head a1af608)

### Blocking
None.

### Non-blocking
- `src/server/actions/fakePayment.ts:25-37`: refusals correct; the refusal-code check is exactly `not_found` and `invalid_state`; unknown payment, wrong secret, already succeeded, past max tries all return `{status:'refused'}`; the compare uses the shared `secureEqual`; input Zod-parsed with a 255-character cap; other errors rethrown (fails closed); no logging.
- Tests assert identical refusals and no emission; none asserts `secureEqual` is called (covered by its own module; low risk).
- Client double submit holds (`sending` ref plus reducer). Server side is not idempotent per attempt: two concurrent declined confirms each count a failed try, and a double `requires_action` counts two rounds; fake-only, bounded by `maxFailedTries` and `maxActionRounds`.
- A third `requires_action` round at the cap shows "no longer open. Reload the page" although the payment could still settle; demo copy.
- `FakePaymentForm.tsx:119` `new Date()` in a client component; allowed under B12; note for U-047b.
- Confirm action has no rate limit, as ruled; log for U-047b.
- Audit item (pre-existing duplication): `.visuallyHidden` is copied across 6+ component CSS modules (Button, Card, Header, SiteMenu, BrowseSkeleton, now FakePaymentForm); a shared utility would remove the copies.
- Duplication sweep: `secureEqual`, `formatMoney`, `createRandom`, `Alert`, `Button`, `systemClock`, `paymentMethods` reused; no existing card-input, digit-mask, decline-copy or wallet-label helper; `maxIdLength = 255` repeats a literal in `fake.ts` (trivial).
- Unbounded work bounded (100 events, 5 repeats, 1 day; card text 64 characters; adapter caps); planning over 100 throws `RangeError`.
- No failing open; no tables; scope: all 23 files in scope; no network or timers in the simulator.

### Unconfirmed
- Did not run e2e, Storybook with axe, build, knip, gitleaks; did not view evidence; did not exercise a dev-mode double module load.

Verified by running the 11 related test files in a scratch copy of a1af608: 305 tests passed.
