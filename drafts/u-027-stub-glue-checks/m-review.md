PASS

## review-agent: U-027 stub glue, merge of main (head e8dac1c)

### Blocking
None.

### Non-blocking
- None from the merge.

### Unconfirmed
- Gates not rerun in a scratch tree; builder's results and static checks relied on.

### Checked
- Merge parents `f8dee66` (branch) and `56e66d2` (main).
- `src/lib/experiencePage.ts`: against main, the branch's diff is exactly the `demoCheckoutPath` import, the `bookHref` field with its TODO(U-041) doc comment, and `bookHref: demoCheckoutPath(experience.id)`; main's refactor intact.
- No conflict markers; the other 14 branch files byte-identical to `f8dee66`; the checkout layout equals main's.
- Every import in the 15 branch files resolves in the merged tree; `bookHref` consumed at `ExperiencePage.tsx:116`.
- The round 3 verdict holds at `e8dac1c`.
