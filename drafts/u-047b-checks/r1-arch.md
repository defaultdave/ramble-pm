FAIL

## architecture-audit: U-047b "Checkout page" (head c76e047)

### Blocking
- B17: `src/lib/pages/checkoutPage.ts` `childrenIn` has the same body as `childCount` (`src/lib/checkout.ts:140`); call `childCount`.
- B17: `src/lib/time.ts` `zoneDateLabel`, `zoneTimeLabel`, `zoneDateTimeLabel` duplicate `src/lib/zonedLabels.ts` (`zonedDayLabel`, `zonedTimeLabel`, `zonedDeadlineLabel`, `plain()`); extend that module with a variant without `timeZoneName`, move the tests.
- B17, general helpers in a page module (`checkoutPage.ts`): `holdDeadline`, `isCheckoutHold` restate `isOpenHold`/`HoldTimes` (`src/lib/holds.ts:190`), move there; `cancellationLine` nearly duplicates `cancellationTermsLabel` (`src/lib/bookingEmails.ts:103`), share one with a parameter; `ageRequirements` is the design doc's shared `ageRule.requirements` (line 685; screens 04b, 04c, 05, 08) and restates `childAgeAllowed`/`AgeSubject`, move to `src/lib/checkout.ts`.
- B8/A6: `src/components/CheckoutPage/useMinWidth.ts` is a new `'use client'` hook not on the allowlist; use a CSS media query for the summary's default-open state (or get it allowlisted).
- B16: `CheckoutPage.module.css:78`, `:141` `min-block-size: 44px`; use `var(--size-touch-target)`.
### Non-blocking
- One island wrapping form, summary toggle and timer fits the allowlist's spirit (named separately there); log it.
- `reholdSpaces`: party from the server via `readCheckoutView` for the calling device only; abuse bounded (needs the device's own lapsed hold, which needed a BotID-checked first hold; `reserve` limit per call; device lock first); residual: only the device key is limited, as in `reserveSpaces`; four data-layer calls, mirroring `reserveSpaces`.
- `readCheckoutView` server-only with the B6 device check; no B2 in the data layer; `readDevice` sets no cookie.
- `tests/checkout-no-sentry.test.ts` exempting `src/server/env.ts` does not meaningfully weaken ADR 0007; tighten by asserting `env.ts` has no `sentry-cdn` or `ingest.sentry` text.
- B2 borderline: `message(...keys)` with `keys.find` in `CheckoutPage.tsx`; move into `checkoutForm.ts`.
- B16 advisory: `outline-offset: 2px` (`:87`, `:150`), `minmax(8rem, ...)` (`:93`), `22rem` (`:182`) literals.
- A2: a whole `view` passed to the island.
Unconfirmed: the stray `0014_order_parent_foreign_keys.sql` (since removed at 60bb5a1); knip not run.
