# Review agent, U-030 round 2 (head b80cd3f)

REVIEW_VERDICT=APPROVE_WITH_NITS (PASS)

Scope: round 2 diff touches only src/server/db/editorial.ts and tests/db/editorial.db.test.ts. In scope.

Test run: `pnpm vitest run --project db tests/db/editorial.db.test.ts` in a scratch detached worktree: 202/202 passed. Worktree removed.

B17: cleared. `listHomePicks` now calls the single `readCollectionRows` (editorial.ts:101); the duplicate lateral join is gone. B2: cleared. The only new code in the mapper is `.map` to a field; the ordering, cap, and count are SQL.

Regression checks on other callers:
- Staff list / forGuest false (editorial.ts:119): `forGuest ? guestVisible : undefined` inside `and(...)` drops the undefined, so drafts and non-guest-visible experiences still appear. The inner join to experiences is unchanged from before. Covered by existing listCollectionsForEditing tests (db test 1154, 1842, 1951).
- Gift guide and getPublishedPick: same `readCollections(..., true)` path, intro:true, no cap. Tests at 1148, 1192 and the new full-shape assertion (2613) pass.
- Default cap: `editorialLimits.collectionItems` = 60 (src/lib/editorial.ts:38). The schema check `collection_items_position_in_range` (position >= 0 and < 60) plus the unique (collection, position) index caps rows at 60 per collection, so the default LIMIT never trims a row. Rows unchanged.
- Window count with no cap: `count(*) over ()` is evaluated before LIMIT; with no rows the aggregate still yields one row (json_agg coalesced to '[]', total coalesced to 0), so the left lateral join keeps empty collections. `readCollections` does not spread `itemCount`, so the extra field cannot leak into CollectionSchema.
- Entry ordering: the added experienceId tiebreak is a no-op in practice (position is unique per collection) and is applied identically in the inner ORDER BY and the json_agg ORDER BY.
- Column list: `intro:true` uses `getTableColumns(collections)`, so a future column flows through to CollectionSchema automatically (z.object strips unknowns; no crash).

Findings (nits, non-blocking):
1. editorial.ts:84-93 `columnsWithoutIntro` is a hand-listed copy of the table columns and already omits `createdAt`. A column added later vanishes silently from the home-pick path only. It cannot crash anything today (HomePick reads id, slug, title, summary), and the typed union passes through the mapper. Safer: `const { intro: _intro, ...columnsWithoutIntro } = getTableColumns(collections)` so it cannot drift.
2. No test pins the staff-list path against the new cap/window shape beyond the existing suite; acceptable since those tests pass, and the full-shape assertion at 2613 covers intro + all entries on the shared read.

(tsc in the scratch worktree reports PageProps/typegen errors in src/app pages; these are unrelated to this diff and come from missing generated route types.)
