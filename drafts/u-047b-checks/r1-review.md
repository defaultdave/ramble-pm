FAIL

## review-agent: U-047b "Checkout page" (head 60bb5a1)

Read the diff and the server paths; suites not run.
### Blocking
- `src/server/actions/rehold.ts:25-30` `reholdSpaces` re-holds a live hold as well as a lapsed one: `readCheckoutView` returns any `active` or `paying` hold and nothing checks the deadline. Two tabs, a double tap or a script calling it N times on a live hold inserts N holds for the whole party (on the base used here `reserveSpaces` does not supersede). It hard-codes the bot verdict `'human'`, so one BotID-passed reserve gives a bot-check-free reserve loop bounded only by the per-device `reserve` limit. Fix: refuse unless the hold's deadline has passed on the database clock (a pure lib check on `expiresAt`/`serverNow`, answering `unbookableSession` as for another device's hold); better, release or supersede the lapsed row in the same transaction as the new insert. The party is read from the server (`partyReserveInput(read.view)`), correctly.
- Test gaps (`tests/db/checkout-view.db.test.ts:129-170`, no `rehold.test.ts`): a live `active` hold refused; a lapsed hold re-held twice leaves one open hold; a `paying` hold refused; `consumeRateLimit('reserve', deviceKey)` called and `blocked` returned when spent; a limiter outage fails closed.
### Non-blocking
- `tests/checkout-no-sentry.test.ts:82-95`: the `env.ts` exemption is right but too wide; keep the `sentry-cdn|ingest.sentry` host patterns for that file and drop only `SENTRY_BROWSER_DSN` from its regex.
- `?t=` token: `Referrer-Policy: strict-origin-when-cross-origin` (`securityHeaders.ts:135`) limits Referer leaks to same origin; history and logs remain (BC-20); U-050 should read it once and `router.replace` to a tokenless URL.
- Route-group move sound (URLs unchanged, `(site)` layout, not-found and error bring `SiteShell`, headers test strips groups, closure test walks `(site)`); demo click-through intact (`isDemoHold` before any read, `/orders/RMB-DEMO01` resolves); `readDevice` sets no cookie; `readCheckoutView` refusals uniform; `startPayment` only from `submit()`.
Unconfirmed: `soldOutCopy` says "your details are saved" but form values live only in component state and S6/S7 navigate away; maintenance not enforced server-side (BC-21).
