Posted on head 3f5a636. This verdict is on 93d0ee3. 3f5a636 adds one commit after it, a runbook sentence and a comment, which this review asked for. The PM ran every gate on 93d0ee3, and format, lint and the profile test on 3f5a636. No UI change, so no a11y check.

PASS

# Spec compliance: BE-1 code half, branch unit/U-031-browse-keys (head 93d0ee3)

Spec: audit row BE-1, `audits/browse-experience-2026-10-28.md`. The Vercel firewall rule is out of scope. Diff: `git diff origin/main...HEAD`, 15 files. No protected path, schema, proxy, or copy file is touched.

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Unknown category or neighborhood slugs never reach Postgres or form a dates or results cache key; rule in `src/lib`, tested | PASS | Rule: `src/lib/filters.ts:109-121` (`knownFilters`), `:123-126` (`keepKnown`). Call site before the cached reads: `src/app/(guest)/new-york/browse/BrowseContent.tsx:42` and `:46-47` (`known.filters` is the only filter value passed to `getBrowseDates` and `getBrowseResults`). Tests: `src/lib/filters.test.ts:382-436`; `BrowseContent.test.tsx:164-178` (exact-once args carry known slugs only) and `:180-192` (no date or result read when none known). |
| 2 | Known filters behave as before; a mixed list keeps its known slugs | PASS | `filters.ts:116-120` keeps order and drops only unknown slugs; `matchesNothing` is set only when a non-empty list has no known slug. Tests `filters.test.ts` cases "keeps known slugs and the date", "drops an unknown slug beside a known one, in order", "does not read a category slug as a neighborhood". |
| 3 | Missing experience, or non-uuid id, not kept in cache; still renders not-found | PASS | `src/server/experiencePage.ts:33-35` (non-uuid gives `uncached` then `null`); `:52` (null from a missing or hidden experience gives `uncached`). The not-found path is unchanged: `src/app/(guest)/experiences/[slugAndId]/page.tsx:39` and `:55` still call `notFound()`, covered by existing `page.test.tsx`. |
| 4 | `visibleCursor` runs once per request; page order and cursor semantics unchanged | PASS | Single call: `src/server/db/browse.ts:195` (`await visibleCursor(after)`); the old second use inside the page query is gone (`pastCursor(cursor)` at `:222` compares literal name and id, same `(name, id) >` order at `:174-178`, same `orderBy` at `:225`). Empty cursor returns the same empty page with null cursor (`:197-199`), and `toBrowsePage` (`src/lib/browse.ts:118-119`) still maps it to `cursor_not_found`. Test: `tests/db/browse.db.test.ts:1017-1030` (cursor query counted once). |
| 5 | Made-up `after` cursor keeps no cache entry per uuid | PASS | `src/server/browse.ts:32-33` (`if (!page.ok) cacheLife('uncached')`). Profile: `src/lib/cacheProfiles.ts:30` (`expire: 0`). Test: `src/server/browse.test.ts:84-95` (`toHaveBeenLastCalledWith('uncached')`); db test `browse.db.test.ts:1005-1015` (one query for an invisible cursor). |
| 6 | Tests cover 1, 3, 4, 5 | PASS | 1: `filters.test.ts`, `BrowseContent.test.tsx`. 3: `src/server/experiencePage.test.ts:99-109`. 4: `browse.db.test.ts:1017-1030`. 5: `browse.test.ts:84-95`, `browse.db.test.ts:1005-1015`. Also `src/lib/cacheProfiles.test.ts:17-24`. |
| 7 | Runbooks match the change | PASS | `docs/runbooks/browse.md:16` (`knownFilters`, matches-nothing, no read), `docs/runbooks/browse.md:37` (cursor read once, `uncached`). `docs/runbooks/experience.md:36` (misses and non-uuid ids return null under `uncached`, one read per request). Each claim matches the code above. |
| 8 | Nothing out of scope touched | PASS | `git diff origin/main...HEAD --name-only` contains no `.github/`, `.claude/`, `CLAUDE.md`, `scripts/merge-desk/`, `docs/adr/`, `docs/plan/`, `src/proxy*`, or schema path. JSX in `BrowseContent.tsx` is unchanged (diff touches imports and the try body only). No copy changes. |

## Blocking

None.

## Non-blocking

- `tests/db/browse.db.test.ts:1017-1030` identifies the cursor query by the substring `"experiences"."id" = $1`. That is fragile against a SQL or driver change. An explicit query marker would be more robust.
- AC 3's render half (not-found) is not re-tested by this diff; it relies on the existing `page.test.tsx`. Acceptable, since the route is unchanged.
- The `uncached` profile (`expire: 0`) runtime effect on a real Next.js cache (whether a miss is truly never stored) is a QA question, not something the diff can show.

---
<sub>spec-compliance | haiku | read-only</sub>
