PASS

## review-agent: U-030 "Read only the Picks the home modules name" (head 0c89b4c)

### Blocking
None.

### Non-blocking
- src/server/db/editorial.ts (listHomePicks, `.limit(homeLimits.picksCandidates)`): the 12-entry cap is applied as a SQL LIMIT using the lib constant, and src/lib/pages/home.ts `pickModuleIds` still slices to the same cap. A LIMIT is a work bound, not a decision, so B2 is met; the lib slice stays the tested rule. No change needed.
- src/server/home.ts: the Picks read now waits for listHomeModules (one extra sequential round trip inside the cached read). Unavoidable, since the modules name the Picks; the cache absorbs it.
- seed.db.test.ts edit is acceptable: the "published Picks" list assertion now queries the collections table directly in the test, and the entries assertion uses the existing getPublishedPick. Same coverage, no export kept alive for a test (B7). Imports (and, eq, collections) already exist in that file.

### Unconfirmed
None.

### Checked
- Scope: files are editorial.ts, home.ts (server, minimal), lib/pages/home.ts, tests, one runbook line, the HomeContent test fixture type update. No cache tags, UI, migrations, docs/plan. lib/editorial helpers reused (collectionIdsOf, editorialLimits), none added.
- Unbounded work: IDs validated with idListSchema(editorialLimits.homeModules=20), length checked before IDs; modules read is already limited to 20; entries limited to 12; no intro column selected; no 200-row list limit involved, so a pinned Pick cannot drop out past 200 published Picks (DB test with listed+1 published Picks passes and the named Pick sorts last by title).
- itemCount: `count(*) over ()` is evaluated before LIMIT inside the guest-visible lateral subquery, so it is the full guest-visible count (previously `items.length`, also guest-visible); DB test: 15 entries gives itemCount 15 with 12 ids; Pick with no visible entry gives 0 and []. "See all N" uses itemCount (home.ts).
- Ordering: entries by position then experienceId (stable, adds a tiebreak over the old query), json_agg re-orders by the same keys; Picks by title then id.
- Gift guide excluded: SQL filters kind = 'pick'; homePickIds takes only modules of kind 'picks'; server test asserts the gift_guide module's collection and null collections are not requested and duplicates are collapsed.
- Draft or missing Pick: omitted (DB test); module with a draft collection is already dropped by listHomeModules.
- Failing open / logs: invalid IDs throw ZodError (tested); output parsed with HomePickSchema; no catch added, no logging added; read still wrapped by existing readOrRefuse.
- B2: only SQL WHERE/ORDER/LIMIT in the data layer; module-kind filtering and ID dedupe are lib functions (homePickIds, collectionIdsOf) with tests. B3-B7 hold (server-only unchanged, imports point server -> lib, lib has no I/O, no test-only exports; HomePick types and schema live in lib).
- Stale callers: no reference to listPublishedPicks remains in the branch (src, tests, docs).
- Duplication: HomePickSchema/HomePickIdsSchema are home-specific and reuse idListSchema, EntityIdSchema, SlugSchema; no existing equivalent found.
- Runs (scratch detached worktree, removed afterwards): `pnpm vitest run --project db tests/db/editorial.db.test.ts tests/db/seed.db.test.ts`: 2 files, 227 tests passed. Unit/components for home.test.ts (lib and server), HomeContent.test.tsx, editorial.test.ts: 177 passed. tsc: only the pre-existing PageProps typegen errors (generated types absent in the scratch tree), nothing from this diff.
