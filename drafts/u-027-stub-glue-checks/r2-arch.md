FAIL

## architecture-audit: U-027 stub glue round 2 (head 7c0291f)

### Blocking
- `src/app/(checkout)/_demo/DemoPage.tsx:1-18` (B17): re-implements the page heading `src/components/PageHeading.tsx:3-9` already provides (`<header><h1>{title}</h1>{children}</header>`, used by ops pages, `ErrorNotice`, `NotFoundNotice`, `RoutePlaceholder`). Fix: render `<PageHeading title={title} />` inside the `.page` div and style it from `DemoPage.module.css`, or extend `PageHeading` with an optional class. Filed non-blocking in round 1; under B17 severity is set by the rule.

### Round 2 items and merge
- Items 1 to 4 resolved (base.css import matching the guest layout; fixtures in `demoCheckout.ts:40-56`; neutral title at `:41`, tested; the two consts private, every remaining export with a non-test importer).
- Merge `7c0291f`: `bookHref` intact across the view model, component, fixtures and test; import directions hold; no B1, B3, B5, B6, B9, B10, B12, B13, B14, B15 surface.
- `DemoOrderSummary.tsx` `'use client'` not a finding (DECISIONS 2026-10-29); B8 is clean once `pm/order-summary-island` lands.

### B2 sweep
Toggle state is UI; path builders, price times guests, label and total in `src/lib` with tests; no decision in the pages, layout or component.

### Advisory
- `DemoPage.module.css:4` `max-inline-size: 40rem`; `--size-content-max` exists.
- `experiencePage.ts:12` imports `./demoCheckout`; goes with U-047b.
- `DemoOrderSummary` spreads the full `DemoSummary`; every field is read, so A2 is clean.
