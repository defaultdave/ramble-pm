PASS

## review-agent: U-027 stub glue round 3 (head f8dee66)

### Blocking
None.

### Verified
- Round 3 delta (`f44abfc` to `f8dee66`) touches only `src/app/(checkout)/_demo/DemoPage.tsx` and `DemoPage.module.css`: `DemoPage` renders `<PageHeading title>` inside `.page` with the alert, summary and button as children; the CSS keeps only `max-inline-size: 40rem` and `margin-inline: auto`; the duplicate h1 and title styles are gone (round 2 B17 resolved). `PageHeading.tsx` and its CSS unchanged by this branch. Whole branch against `652fafd`: 16 files, all in U-027 scope.
- Merge `f44abfc`: `src/app/(checkout)/layout.tsx` still imports `@/styles/base.css` and `tokens.css`; `bookHref` intact (view model 365, set at 457, used at `ExperiencePage.tsx:116`, fixtures and tests); nothing in `(checkout)` names Sentry.
- Scratch run on `f8dee66`: `tsc --noEmit` clean; six test files (demoCheckout, experiencePage, routes, ExperiencePage, checkout-no-sentry, error-boundaries) 176 of 176.
- Defect classes on the whole branch: the delta adds no loops, queries, logging, ticket comments or helpers; earlier conclusions hold; `PageHeading` reused.
- `checkout-1280-light-r3.png` shows "Pay (demo)" at its own width (about 125 px), as accepted.

### Non-blocking
- Round 2 nit: the `TODO(U-047b)` above the doc comment in `DemoOrderSummary.tsx:7-8` reads as part of it. Cosmetic.
- The shell's "Skip to main content" and "Ramble" links render unstyled at 1280 px; from `SiteShell` on `main`, not this branch. Audit item.

### Unconfirmed
- Full unit, e2e, storybook and build not rerun; 390 px and dark screenshots not opened.
