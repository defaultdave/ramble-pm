PASS

## architecture-audit: U-027 stub glue round 3 (head f8dee66)

### Blocking
- None.

### Round 3 scope
1. `_demo/DemoPage.tsx:11-16` renders `<PageHeading title={title}>{children}</PageHeading>` inside `.page`; the pages pass the alert, summary and button as children; `DemoPage.module.css` keeps only the column; `PageHeading.tsx` and its CSS have zero diff against `652fafd`. Round 2 B17 resolved.
2. Merge: the checkout layout still imports `@/styles/base.css` and `tokens.css`; `bookHref` intact across `routes.ts:78-79`, `demoCheckout.ts:17-19`, `experiencePage.ts:365,457`, `ExperiencePage.tsx`, the fixtures; round 3 touches only `DemoPage.tsx` and its CSS.

### B2, every decision on the branch
`demoCheckoutPath`, `demoOrderPath`, the line label, line amount and total in `src/lib/demoCheckout.ts`; `checkoutPath`, `orderPath` in `routes.ts`; `bookHref` in `experiencePage.ts`; the expand toggle in the allowlisted island is UI state; the `ExperiencePage` render guard is pre-existing. No data layer or route handlers. No B2 violation.

### B17 candidates
`DemoPage` vs `PageHeading` resolved; `DemoOrderSummary` wraps `OrderSummary` adding only caller-held state; no existing checkout or order route builder; no other line-label builder; `guestsLabel`, `formatPrice`, `browsePath`, `PageHeading`, `Alert`, `ButtonLink`, `OrderSummary` reused. Fixture and story repetition is test data.

### Advisory
- `DemoPage.module.css:2` `max-inline-size: 40rem` is outside B16's list; `--size-content-max` is 1200 px, not a substitute (drop the round 2 suggestion).
- `DemoOrderSummary.tsx` and `DemoPage.tsx` live under `src/app/(checkout)/_demo/` rather than `src/components/`; stubs U-047b removes. Log only.
- B8: Dave's approval is in DECISIONS (2026-10-29) and stands in until the standards edit (`pm/order-summary-island`) lands; the standards commit should be on `main` before this merges.
- `demoCheckout.ts:55` repeats the line-52 product.

### Checked and clean
B1, B3, B4, B5, B6, B7 (every new export has a non-test importer), B8 (only `DemoOrderSummary` carries `'use client'`), B9 to B16, B17.
