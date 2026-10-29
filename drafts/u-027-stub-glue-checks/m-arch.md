PASS

## architecture-audit: U-027 stub glue, merge of main (head e8dac1c)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- None.

- Merge delta: against round 3 (`f8dee66`) the only branch-owned file that changed is `src/lib/experiencePage.ts`; it differs from main's by exactly the `demoCheckoutPath` import, the `bookHref` field with its TODO(U-041) comment, and the `bookHref` value. Main's `formatPrice` removal and `perPersonAmount` change are unchanged.
- B4: `experiencePage.ts` and `demoCheckout.ts` import only `src/lib`; the checkout pages import `@/lib` and their `_demo` folder.
- B2, B12, B17: no new filter, sort, reduce, `Date.now()`, float money, `process.env` or `fetch`; the only decision code (`demoSummary` arithmetic) is in `src/lib`; main's `experienceCards.ts` does not overlap any branch addition.
- B7: every remaining export has a non-test importer.
- The checkout layout equals main's.
