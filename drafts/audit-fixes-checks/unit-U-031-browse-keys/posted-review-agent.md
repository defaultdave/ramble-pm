Posted on head 3f5a636. This verdict is on 93d0ee3. 3f5a636 adds one commit after it, a runbook sentence and a comment, which this review asked for. The PM ran every gate on 93d0ee3, and format, lint and the profile test on 3f5a636. No UI change, so no a11y check.

PASS

Head 93d0ee3, `git diff origin/main...HEAD`. Scope: only BE-1 files (browse, filters, cacheProfiles, experiencePage, db/browse, two runbooks, tests). No out-of-scope change.

## Blocking
None.

## Non-blocking
1. `docs/runbooks/experience.md:36` says each missed request "reads the database once". `/experiences/[slugAndId]/page.tsx` calls `getExperiencePage` from both `generateMetadata` and the page body, and an `expire: 0` entry is never stored, so a hidden id can cost two reads per request (only concurrent in-flight calls are shared). Still bounded and cheap; either soften the sentence ("at most one read per call") or leave it.
2. Junk filters plus a stale `after` now show "Nothing matches those filters" instead of "outdated". Correct (the list matches nothing, as a row-less slug always did) and covered by the runbook text. There is no test with junk filters plus a stale `after`; one line in BrowseContent.test.tsx would pin it.
3. The `uncached` comment in `cacheProfiles.ts` says Next.js "drops the entry at once". That is true in production only; `next dev` keeps it for the minimum retention (default.js:113-122). No effect on correctness.

## Item 2 (cacheLife zero profile), verified against installed Next source
- Stores nothing at runtime: the default handler skips `set` when `entry.expire === 0` outside dev (`node_modules/next/dist/server/lib/cache-handlers/default.js:113-122`). `next.config.ts:20` passes `cacheProfiles` as `cacheLife`, so `uncached` is a registered profile and the build accepted it. A custom `cacheHandlers` is not configured.
- Shortest wins: `cache-life.js` keeps `explicitRevalidate`, `explicitExpire`, `explicitStale` as the minimum of every call (lines ~59-77), and `use-cache-wrapper.js:766` uses `explicitExpire`. The hit branch calls only `cacheLife('catalog')` (and `'browse'` in `getBrowseResults`), so a hit keeps its profile. The `uncached` call is conditional on the miss, after the read.
- Prerendering: docs `cacheLife.md:266` say `revalidate: 0` or `expire` under 5 minutes is excluded from prerenders and becomes a dynamic hole resolved at request time. It is not an error here. The nested-short-cache build error (`use-cache-wrapper.js:623,1696,1741`) needs a short inner cache inside an outer `use cache` with no explicit `cacheLife`. `getExperiencePage` has an explicit `cacheLife('catalog')`, and its callers (page, generateMetadata) are not `use cache`. `getBrowseResults` also has an explicit `'browse'`, and BrowseContent already calls `connection()`, so it is dynamic.
- `/experiences/sample`: `generateStaticParams` returns `sample`, which `parseExperienceAddress` rejects (no `-<guid>` suffix, routes.ts:44-53). The route calls `notFound()` before `getExperiencePage`, and `generateMetadata` returns early. The cache function never runs for it, so there is no hole and no build effect. For a real guid that misses during a prerender, the consequence is a dynamic hole filled at request time, not an error.

## Other checks
- `getFilterOptions()` awaited first: it is `use cache` with `catalog`, so on a hit it is a memory lookup; on a cold miss it adds one round trip before the two reads, which were parallel with it before. Acceptable. When it fails, the error state is unchanged.
- B2: `knownFilters`, `emptyBrowsePage` and the profile live in `src/lib`, pure, no I/O. Pass.
- B17: the only slug-set lookup added is `keepKnown` (filters.ts:122-129); the other `Set(slug)` uses are in `src/lib/seed`, a different concern. No duplicate. `emptyBrowsePage` is the one shared empty page.
- B13: not defined in the docs I could reach; the nightly audit of 2026-10-29 lists no B13 violation, and this diff adds none I can see.
- Comments: each states a why; none names a ticket. Pass.
- Runbooks: browse.md and experience.md match the code (see non-blocking 1).
- Item 3: `visibleCursor` is read once (db/browse.ts:195), and a null cursor returns before the page query. `pastCursor` compares bound `(name, id)` values. Item 4: `getBrowseResults` calls `uncached` when `!page.ok` (server/browse.ts:33). Item 1: the filter rule is applied before both cached reads (BrowseContent.tsx:40-48), and the address is kept.

## Evidence
- src/lib/filters.ts:98-130; src/lib/browse.ts:90-95; src/lib/cacheProfiles.ts:29
- src/app/(guest)/new-york/browse/BrowseContent.tsx:40-48
- src/server/browse.ts:25-40; src/server/experiencePage.ts:30-54; src/server/db/browse.ts:165-228
- tests: BrowseContent.test.tsx, filters.test.ts, experiencePage.test.ts, tests/db/browse.db.test.ts
- Next source: node_modules/next/dist/server/use-cache/cache-life.js, use-cache-wrapper.js:623,766,1684-1744,2173-2200; lib/cache-handlers/default.js:113-122; docs 04-functions/cacheLife.md:266,449-453
