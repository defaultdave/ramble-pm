PASS

## architecture-audit: U-027 "Order summary, booking bar, booking panel" (head 8706832)

### Blocking
- None.

### Non-blocking
- B2 sweep, round 1: `DemoOrderSummary` toggle is UI state; `demoCheckout.ts` holds the line arithmetic and label with a test; `experiencePage.ts` `bookHref` is a plain value. No B2 violation; no data-layer or route-handler code.
- B17: `_demo/DemoPage.tsx` overlaps `src/components/PageHeading.tsx`; fix when U-047b replaces it.
- B8: `DemoOrderSummary` carries `'use client'` and is not on the allowlist; needs Dave's approval logged before merge. (Resolved: Dave approved the order summary as an island, DECISIONS and delta-log 2026-10-29.)
- Fixture values in `DemoOrderSummary.tsx` (`demoMeta`, tax literals) belong in `demoCheckout.ts`. (Taken in round 2.)
- `demoHoldId`, `demoOrderReference` exported but used only by the test. (Taken in round 2.)
- `DemoPage.module.css` `max-inline-size: 40rem` is a literal width; `--size-content-max` exists.
- `experiencePage.ts` imports `demoCheckout.ts`, which U-047b removes; the import changes with `bookHref`'s TODO(U-041).

Checked and clean: B1, B3, B4, B5, B6, B9, B10, B12, B13, B14, B15, B16 (colour, spacing, font tokens), B17 reuse.
