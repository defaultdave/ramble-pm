PASS

## review-agent: U-035 "Category and neighborhood pages" (head 799c73d, round 3; round 2 at 5ee5376)

Scope audit: `git diff 5ee5376 799c73d` is the merge of `main` (`a3386ba`, PR 677, cache audit fixes) plus `799c73d`. The unit's own part is two files, `src/server/landing.ts` (comment only) and `src/server/landing.test.ts`. Everything else in the range is main's: 12 files under `src/lib`, `src/server` and `docs/runbooks`, none of which the unit edited. Proof the merge brought nothing unit-owned or foreign: `git diff --stat a3386ba 799c73d` (the unit against the main it merged) lists 28 files, all U-035 files (the landing route, `LandingPage`, `BrowseResults`, `BrowseSkeleton`, `lib/pages/landing`, `cacheTagBudget` (+2 lines), `catalog.ts`, `editorial.ts` TODO removal, the e2e rows, the tests). None of the 14 main-only files appears in it. The range touches nothing in `src/app`, `src/components`, `e2e` or `tests`. Checked in a scratch worktree at 799c73d (removed after; checkout untouched): `tsc --noEmit` (after `next typegen`) clean, `eslint --max-warnings 0` over `src` and `e2e` clean, `knip` clean, vitest over `src/server`, `src/lib`, `src/app` and `src/components/BrowseResults`: 192 files, 5856 tests passed. Playwright and the db suite were not run here.

### The four things asked

1. The test change is right. `tagsForChange` no longer exists (main deleted it, keeping `tagsForChanges`), so `tagsForChanges([change])` is the only correct call, and the assertion keeps its meaning: a `categoryCopy` or `neighborhoodCopy` change publishes a tag the entry carries. The expected profiles change from `['editorial','catalog']` to `['editorial','editorial']` because `getFilterOptions` now reads `cacheLife('editorial')` (`src/server/filterOptions.ts`), and the landing entry's own call is `editorial` and comes first. Mutations in the scratch copy: landing's own profile set to `catalog` fails both profile rows; an extra `cacheTag('x')` in the entry fails both rows (the `toHaveLength(cacheEntryTagCounts.landing)` and the sorted equality); dropping `cacheTag(tags.taxonomy)` from `getFilterOptions` fails both rows. The test still pins what it names.
2. The new comment is true. `src/lib/cacheTags.ts` at this head has no `taxonomy` case in `tagsFor` and no `{ kind: 'taxonomy' }` in `CacheChange`; `grep` over `src` finds no other producer. `tags.taxonomy` is attached only by `getFilterOptions`, which the landing entry calls, so the entry carries it but no publisher invalidates it. Both entries use `editorial` (revalidate 1 h, expire 24 h), so "a rename shows when the `editorial` profile runs out" holds. It agrees with `docs/runbooks/cache-conventions.md:19` and `browse.md:31` from main. The old wording ("a rename through `tags.taxonomy`") was false after the merge, so the repair was needed.
3. The landing tag budget holds. The entry carries `landingTag(kind, slug)` plus the nested `taxonomy`: 2, equal to `cacheEntryTagCounts.landing` in `src/lib/pages/cacheTagBudget.ts:31`, asserted by `landing.test.ts` against the real `getFilterOptions`. Nothing in `landing.ts` calls `tagExperiences`, and main's change to that helper (one `cacheTag()` call per ID) does not reach this entry. The cards come from `getBrowseResults`, a separate entry at `1 + browsePageSize` (13), unchanged in count by main's refactor (the loop became `tagExperiences`, same tags). A landing response is far under 128.
4. The merge changes nothing else in this unit. The only merged files a landing page executes are `filterOptions.ts` (profile `catalog` to `editorial`, which moves the landing entry's lifetime from the shortest-wins 15 minutes to 1 hour, matching the `editorial` profile it declares) and `browse.ts` (`tagExperiences`, same tags). Neither changes what a page renders. The unit's `cacheTagBudget.ts` edit merged cleanly beside main's.

### Carry-over of the other verdicts at 5ee5376

- spec-compliance (criterion 1 re-check, PASS by the recorded 2026-11-01 PM decision): carries. It depends on `generateStaticParams` and the prerender departure, and the range touches neither `src/app` nor `DECISIONS.md`. Criteria 2 to 10 rest on files the range does not touch.
- architecture-audit (round 2, APPROVE, B2 ledger `landingView` and `landingErrorView`): carries. The range adds no decision to the unit; `tagExperiences` is main's and already audited there; the unit's `landing.ts` change is a comment.
- qa-agent (round 2, PASS): carries for what it tested, which is rendered wording, states and layout. The range touches no rendering code, route, component or style, and the unit's `landing.ts` change is a comment. One caveat for the record: QA's production build ran at 5ee5376, not at this head, and the filter-options lifetime change affects freshness of names only. If the PM wants a build at the merge head before auto-merge, that is a cheap smoke run, not a finding.

### Blocking

None.

### Non-blocking

- `src/server/landing.ts:34-38`: the repaired comment wraps raggedly (the `uncached` line breaks after four words). Cosmetic; rewrap on the next touch.
- The landing test's profile assertion `['editorial','editorial']` cannot say which call is the entry's own and which is `getFilterOptions`'s. It is still enough (either one changed fails it, shown above), but a reader may take it for a duplicate. No change needed.

### Unconfirmed

- Playwright (cookies, headers, landing specs) and the db suite were not run at 799c73d; the range touches neither spec nor `tests/db`, and round 2's results were taken as reported.
- The Reuse section of the builder's PR body was not available to me, as in earlier rounds.

### Evidence

No files added to `evidence/pr/`. Checked from the diffs, the scratch worktree at 799c73d (checks and mutations above), and `grep` for `tagsForChange` and `kind: 'taxonomy'` (remaining hits are only in frozen plan and ADR docs, which are read-only).
