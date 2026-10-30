# Architecture Audit: unit U-030 (home Picks read)

Commit: `0c89b4c8be668a271965c268455392b965a19817` on `unit/U-030-home-picks-read` (base `origin/main` 6b572a3)
Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project)
Diff: `git diff origin/main unit/U-030-home-picks-read` (9 files, read-only)
Files audited: `src/server/db/editorial.ts`, `src/lib/pages/home.ts`, `src/server/home.ts`, plus the tests and runbook in the diff

## Blocking rules

| Rule | Result | Evidence |
|---|---|---|
| B1 data layer only touches DB/network | PASS | Only `src/server/db/editorial.ts:123-171` and `src/server/home.ts:46-49` do I/O; no `fetch` or SDK call outside `src/server/` |
| B2 decisions live in `src/lib/` | PASS (note) | See B2 notes below |
| B3 server-only | PASS | `src/server/db/editorial.ts:1` has `import 'server-only'`; `src/server/home.ts:1` too. Only `src/lib/pages/home.ts` changes outside `server/`, and it reads no `process.env` |
| B4 imports one way | PASS | `src/server/db/editorial.ts:53-58` and `src/server/home.ts:7-20` import `@/lib/...` and `@/server/...` only. `src/lib/pages/home.ts:2-16` imports lib modules only |
| B5 validate at boundary, Ramble types out | PASS | Input: `HomePickIdsSchema.parse` at `src/server/db/editorial.ts:126`. Output: `HomePickSchema.array().parse(rows)` at `:171`, returns `HomePick` (`src/lib/pages/home.ts:71`), not a raw row |
| B6 caller checked against the row | PASS | `listHomePicks` takes no `Caller` and reads only published Picks through the shared `guestVisible` condition (`src/server/db/editorial.ts:167`, `src/server/db/catalog.ts:32`). That is the guest-visible read exemption. `getHomeContent` is already cached (`src/server/home.ts:38-40`) |
| B7 no export that exists for a test | PASS | `HomePickSchema` (`src/lib/pages/home.ts:62`) is imported by production `src/server/db/editorial.ts:54`. `HomePickIdsSchema` (`:74`) is imported by production `editorial.ts:53`. `homePickIds` (`:77`) is called by production `src/server/home.ts:48`. `HomePick` type and `listHomePicks` both have production callers. `getPublishedPick` (`src/server/db/editorial.ts:176`) has only test importers, which is exempt because it carries `TODO(U-036): first caller` (`editorial.ts:174`), a pre-existing marker this diff leaves in place |
| B8 `'use client'` on allowlist only | PASS | No `'use client'` added or moved |
| B9 multi-row writes in one transaction | N/A | Read-only change |
| B10 money and hold transactions | N/A | No money or hold code touched |
| B11 ports are the only vendor door | PASS | No vendor SDK import added in `src/` |
| B12 integer cents, clock | PASS | No money arithmetic, no `Date.now()` or `new Date()` in `src/server/**` or `src/lib/**` in the diff. The `new Date()` in `tests/db/editorial.db.test.ts` is test code |
| B13 errors propagate | PASS | No `catch` added in the diff. `listHomePicks` lets errors through |
| B14 cached code never reads the caller | PASS | `listHomePicks` takes only `collectionIds`. `getHomeContent` tags the home and catalog (`src/server/home.ts:39-41`) |
| B15 Route Handlers on the list | N/A | None added |
| B16 styles use tokens | N/A | No CSS or primitive changed |
| B17 reuse before writing | FAIL | `src/server/db/editorial.ts:123-171` (`listHomePicks`) rebuilds the lateral guest-visible items read that already exists in `readCollections` (`src/server/db/editorial.ts:77-107`, `guestVisible` join at `:90-96`). The two differ only in the output shape: `listHomePicks` caps at `picksCandidates`, adds a window count, and returns IDs. A parameter on `readCollections` (an item limit and a count, or an ID list) with its test would cover it, instead of a second lateral query beside it. Fix: extend `readCollections` with a variant and keep one guest-visibility join. A reviewer may judge this a near-duplicate rather than a copy, so the call is close |

## B2 notes (the three items asked about)

- **12-entry cap in SQL** (`src/server/db/editorial.ts:139`, `.limit(homeLimits.picksCandidates)`). The number is owned by `src/lib/idLookup.ts:6` and `src/lib/pages/home.ts:29`, and the lib layer applies the same cap again at `src/lib/pages/home.ts:226`. The SQL LIMIT is a read bound, not a page decision. Which entries become cards is still decided in lib (`pickModuleIds` and `viewOf`). Recorded as a note: the cap is enforced in two places, and only the DB test (`tests/db/editorial.db.test.ts`, "finds a named pick past the list limit") pins the SQL one.
- **Guest visibility** (`:137`, `:167`). Uses the shared `guestVisible` from `src/server/db/catalog.ts:32`, not a new rule. Allowed as a WHERE clause, and B6 exempts it.
- **Kind filter** (`:167`, `eq(collections.kind, 'pick')`). A WHERE clause, which B2 does not count as a decision.
- **Sort order** (`:141`, `asc(position), asc(experienceId)`). ORDER BY, allowed. It matches the order the lib layer slices.
- **Window count** (`:133`, `count(*) over ()`). An aggregate of the same guest-visible rows, not a page decision. The "See all N" wording is in lib (`src/lib/pages/home.ts:296`).

## Advisory

- `src/server/db/editorial.ts:53-58` (the import of `@/lib/pages/home`): the data layer now imports a page module, not only shared lib. This is allowed by B4. Consider moving `HomePickSchema` and `HomePickIdsSchema` to a shared editorial lib module if a second caller appears.
- `src/server/db/editorial.ts:139` and `src/lib/pages/home.ts:226`: the 12-entry cap is applied in SQL and again in lib. Either alone gives the same result today. If one changes, the other silently diverges.
- `tests/db/seed.db.test.ts:412`: the seed test now uses `getPublishedPick`, the only caller of a `TODO(U-036)` export. This does not add a new export, so B7 is unaffected.

## Verdict

Blocking violations: 1 (B17 at `src/server/db/editorial.ts:123-171`).
REQUEST_CHANGES in the standard's terms. Written here as REJECT.

ARCH_VERDICT=REJECT
