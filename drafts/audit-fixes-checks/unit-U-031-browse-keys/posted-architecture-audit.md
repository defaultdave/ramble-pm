Posted on head 3f5a636. This verdict is on 93d0ee3. 3f5a636 adds one commit after it, a runbook sentence and a comment, which this review asked for. The PM ran every gate on 93d0ee3, and format, lint and the profile test on 3f5a636. No UI change, so no a11y check.

PASS

# Architecture pass: branch unit/U-031-browse-keys (head 93d0ee3)

Verdict is PASS. No blocking item. Two non-blocking notes below.

## Layer direction
- `src/lib/filters.ts` `knownFilters` is pure. It takes the options as an argument and imports nothing from `server/`.
- `src/server/browse.ts` and `src/server/db/browse.ts` import from `lib` only in the expected direction. `src/server/experiencePage.ts` does the same.
- `src/lib/cacheProfiles.ts` holds the new `uncached` profile, and `next.config.ts` registers it. The cached functions name it through `cacheLife('uncached')`, which matches the convention in `tests/cache/conventions.ts`.
- No new reverse import.

## Cache-policy decision placement
- The "do not keep a miss" decision sits in the server layer, at the cache boundary, in `src/server/browse.ts:32-33` and `src/server/experiencePage.ts:33-35,52`. That is the correct layer: the cached function knows whether its result was a miss. The profile definition stays in lib.
- Gap (non-blocking, see below): the slug normalization that keeps unknown slugs out of cache keys is applied in the app layer, not at the cache boundary.

## B13 error handling
- B13 (`.claude/standards/architecture.md:76`) bans empty or value-returning catches in `lib/**` and `server/**`. The diff adds no catch.
- `getExperiencePage` now awaits `readOrRefuse` and then checks `null`. The `null` comes from the data (no visible experience), not from a swallowed error. `readOrRefuse` still throws `CachedReadError` (`src/server/cache/readOrRefuse.ts`).
- `listBrowseExperiences` now awaits `visibleCursor` directly. A failure still propagates to `readOrRefuse('Browse', ...)` in `getBrowseResults`.
- The app catch in `BrowseContent.tsx` is unchanged. It still calls `rethrowOrLog` and renders the error view, which is app presentation, not `lib` or `server`.

## Does BrowseContent now hold logic that belongs in server or lib?
- Partly. The branch `known.matchesNothing ? [[], emptyBrowsePage] : Promise.all([...])` at `BrowseContent.tsx:43-48` is a data-selection decision: which reads to run for which filters. It belongs in `src/server/browse.ts`.
- The pure part (which slugs are known) is correctly in `lib`. The orchestration is the part to move.
- Why it matters: `getBrowseResults` and `getBrowseDates` are exported cached functions. Their cache key is their arguments, so the guard works only for callers that remember to call `knownFilters` first. Today there is one caller (`BrowseContent.tsx:46-47`), so nothing is broken.
- The existing pattern (`BrowseContent` already fanned out the reads) means this is not a new layer violation. It is a growing one.

## Non-blocking
1. Move the normalization to the server. Add a non-cached `loadBrowse(query, asOf)` in `src/server/browse.ts` that calls `getFilterOptions`, `knownFilters`, and the cached reads. `BrowseContent` then calls only `loadBrowse`. A future caller then cannot form an unknown-slug key by mistake. Test in `src/server/browse.test.ts`.
2. Latency on cursor pages: `visibleCursor` is now awaited before the page query, so a cursor page is two sequential round trips (before, the two ran concurrently). The total query count drops, and `visibleCursor` runs once, as AC 4 asks. The cost is one extra round trip on cursor requests only. Worth a measure under the browse performance budget, but not a spec or architecture fail.

---
<sub>architecture-audit | haiku | read-only</sub>
