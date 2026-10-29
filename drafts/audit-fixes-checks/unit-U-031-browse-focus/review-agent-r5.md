PASS

## review-agent: U-031 "Browse focus" (head 823bbac)

### Blocking
None.

### Non-blocking
- src/server/browse.ts:66-77: getBrowseTitle catches everything from `getFilterOptions()`, including the CachedReadError that readOrRefuse throws, so a failed metadata read gives the nameless title. A failed read logs once from this function (the page body logs its own read separately, so a request logs twice, once per failed read; that is expected).
- BrowseContent.tsx still renders the empty `role="status"` paragraph above the error view. Main's version had only BrowseResults; the paragraph is this branch's addition from round 2, and a test covers it (BrowseContent.test.tsx "renders the live region empty on the error path").

### Unconfirmed
- None. The e2e error-state specs were not rerun by me; I relied on the PM's gate run (161 e2e). I ran `pnpm test` in the worktree: 170 files, 3726 tests passed.

### What I checked
- getBrowseTitle: `rethrowOrLog` runs first (unstable_rethrow), so framework control-flow errors pass through; the test "passes a framework control-flow error through" asserts the notFound digest is rethrown and nothing is logged. A read failure logs once with `{digest, kind}` and no query text or slugs (test asserts exact args and that the slug is absent from the logged calls), then returns `browseTitle(filters, {categories: [], neighborhoods: []})`, which drops the unnamed slugs (browseTitle skips slugs with no option) and keeps the date. It does not throw for a read failure. Never fails open on the page itself: the page's own read still shows the error state.
- BrowseContent catch: `rethrowOrLog('Browse could not be read', error)` then returns the empty status paragraph plus `BrowseResults` with `errorView(query)`. This matches main's PR 248 pattern. The unstable_rethrow and logger imports are gone with no leftover.
- Merge resolution against `git show 1816fe5`: main's rethrowOrLog replacement in BrowseContent.tsx and the move of readOrRefuse into src/server/cache/readOrRefuse.ts (with the `'Browse'`, `'Browse dates'`, `'Filter options'` labels) are all present in the branch. This branch's additions (browseHeading live region, `view` variable, browseTitle metadata, FilterBar changes) are intact. Net diff against origin/main touches only the 13 files in scope for U-031; nothing from PR 248 is lost.
- Defect classes: no unbounded work, no new database-versus-Zod gap, no raw errors or params in logs (kind and digest only; field is `kind`, not `name`), no failing open. Duplication: getBrowseTitle reuses getFilterOptions, browseTitle, and rethrowOrLog; no new duplicate found.
