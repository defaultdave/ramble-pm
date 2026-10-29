PASS

## spec-compliance: U-027 stub glue, merge of main (head e8dac1c)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- Unit, e2e, build and storybook not rerun; builder's gates on e8dac1c taken as reported.

### Merge checks
1. PASS: `src/lib/experiencePage.ts` at e8dac1c differs from main `56e66d2` only by the `demoCheckoutPath` import (line 9), the `bookHref` field with its TODO(U-041) doc comment (364-365), and `bookHref: demoCheckoutPath(experience.id)` (457); main's refactor kept (no `formatPrice` import remains).
2. PASS: `src/app/(checkout)/layout.tsx` matches main; the base.css import is intact.
3. PASS: the branch's 15 files are byte-identical to their round 3 content at `f8dee66`.
4. PASS: merge parents are `f8dee66` and `56e66d2`; main's changes not undone; the round 3 verdict holds.
5. PASS: `bookHref` consumed at `ExperiencePage.tsx:116` and covered by `experiencePage.test.ts:418`.
