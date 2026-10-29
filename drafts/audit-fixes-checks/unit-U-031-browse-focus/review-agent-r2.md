PASS

## review-agent: U-031 "Browse focus, live region, title" (head fe8c745)

Ran in the worktree: `pnpm test` 3701 tests pass. `git diff origin/main HEAD -- src/components/BrowseResults` is empty, so BrowseResults.tsx and its test equal main; ResultsHeading and its flag are gone.

### Blocking
None.

### Round-1 blockers against the rulings
1. Real-browser test: cleared. `FocusStaysOnTheChipWhenTheDayChanges` (FilterBar.stories.tsx:166-192) opens the disclosure by clicking the chip and waits for open=true, then changes the date from a control outside the bar. It waits for open=false and checks that the element holding "Sat, Nov 7" is `toBe` the original details node (same node, no remount). It then checks `chip` has focus (the same summary node captured before the change). The PM's mutation (remove `chip.current?.focus()`, story fails) shows focus is the part under guard. The story drives a prop change rather than a server navigation; it is the same React update the page produces, and the no-`key` code in WhenDetails.tsx:30-48 is what keeps the node.
2. Live region: accepted by ruling. In code it persists: BrowseContent.tsx renders `<p role="status">` as the first child on both the error path (empty, line 60) and the success path (line 70). Child index 0 is the same in both fragments, so React keeps the node on error to success; Suspense in page.tsx has no key, so a filter change does not remount it. Tests: BrowseContent.test.tsx "renders the live region empty on the error path", plus the count and empty-heading cases.

### Sweep of the round-2 diff
- `getFilterOptionsOrEmpty` (src/server/browse.ts:80-100): `unstable_rethrow` is first in the catch; the log carries `digest` only, never the error or the query. Tests cover success, failure (asserts `secret-slug` absent from the log) and a `notFound` pass-through.
- `browseTitle` (src/lib/browse.ts): builds a Map from the option arrays per call, with a lookup bounded by the catalog lists and the filter arrays already capped by `parseFilters`. An unknown slug is dropped, so the title is never made from raw input.
- Duplication: `browseHeading` and `browseTitle` reuse `dateChipLabel`, and no existing helper does the job. WhenDetails is the allowlisted date picker island.
- Defect classes 1-4: none new. A failed names read falls back to a plainer title, which is not a fail-open.

### Non-blocking
- The two e2e title tests have no database, so only the empty-options fallback title is exercised there. The named-title path is covered by unit tests only.

### Unconfirmed
- Actual screen reader announcement on a filter change; not run.
