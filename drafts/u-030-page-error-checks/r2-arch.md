PASS

## architecture-audit: U-030 "one PageError for the home and experience error states, and one retry width" (head 4e13d94, round 2)

### Blocking
None. B17 from round 1 is fixed: `PageError.tsx:25` renders `<PageHeading title={title}>` with the Alert and the retry form as children; no second shell; `PageError.module.css` deleted.

### Non-blocking
- `PageHeading.module.css` new rules: a sound extension of the shared component, scoped to a form whose only child is a button, comment states the why, tokens only (B16).
- Every PageHeading caller checked (direct children only): ops mailbox unlock form has fields, so no match; mailbox message page, checkout and order `DemoPage`, ErrorNotice, NotFoundNotice, RoutePlaceholder have no form. No other caller changes.
- The lone-action rule now spans four selectors in one file; an extension of one owned rule, advisory: fold the form case into the existing list if it grows.
- Stale comment: `BrowseResults.module.css:101` says the retry takes its label's width "as PageError's does"; that width now comes from PageHeading. (PM: H-102.)
- Pre-existing, unchanged: H-99, H-100, H-101.
- The home error's 64 to 32 px padding is the PM ruling, not an architecture finding.

### Unconfirmed
- The 768 px retry width is correct on paper; needs a Storybook check. (PM: confirmed in `home-error-768-light-after.png` and the 1280 px captures.)

### Clean
- B2: no decisions; app shells' catch branches only choose a component, with `rethrowOrLog` in place. B1, B3 to B6, B8, B9, B11 to B16: clean or not in scope. B7: `PageErrorProps` used by stories. Imports one way. B17: PageError reuses PageHeading, Alert and Button.
