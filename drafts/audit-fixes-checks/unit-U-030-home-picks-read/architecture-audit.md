## Architecture Audit (Round 2) — APPROVE

Rules: `.claude/standards/architecture.md` (project)
Branch: `unit/U-030-home-picks-read` at b80cd3f, base origin/main 6b572a3, round-1 0c89b4c
Files audited: `src/server/db/editorial.ts`, `src/server/home.ts`, `src/lib/pages/home.ts`, `src/server/home.test.ts`, `src/lib/pages/home.test.ts`, `src/app/(guest)/HomeContent.test.tsx`, `tests/db/editorial.db.test.ts`, `tests/db/seed.db.test.ts`, `docs/runbooks/home.md` (no `.module.css`, no `'use client'` change in the diff)

### B17 (round-1 blocker) — PASS, cleared
- The collection-entry lateral (the guest-visibility join) exists once: `src/server/db/editorial.ts:101` `readCollectionRows`, guest filter at `:119` (`forGuest ? guestVisible : undefined`), joined at `:143` (`leftJoinLateral(entries, sql\`true\`)`).
- `listHomePicks` (`:167`) and `readCollections` (`:149`) both call `readCollectionRows` (`:172`, `:153`). No second copy of the lateral in `src/server/db/`.
- `count(*) over ()` and `json_agg` over collection entries appear only at `editorial.ts:112` and `:129`.
- Other `guestVisible` uses (`catalog.ts:32`, `browse.ts:56`, `home.ts:33,87`, `upcomingSessions.ts:37`, `photos.ts:312`) filter experiences or sessions, not collection entries. None is a near-copy.
- Ops read `src/server/db/seed/read.ts:128` joins `collectionItems` to `experiences` with no guest filter. It is a seed snapshot, not a guest read, so it is not B17 (see Advisory A-1).

### Blocking rules
| # | Result | Evidence |
|---|---|---|
| B1 | PASS | No `fetch`, Drizzle, or SDK call in `app/**`, `components/**`, or `lib/**` added. The new `lib/pages/home.ts` code is pure. |
| B2 | PASS | Caps come from lib constants: `picksCandidates = 12` at `src/lib/idLookup.ts:6` (re-exported in `homeLimits`, `src/lib/pages/home.ts:29`); the 60 default is `editorialLimits.collectionItems = 60` at `src/lib/editorial.ts:38`, used at `src/server/db/editorial.ts:123` (`entryCap ?? editorialLimits.collectionItems`). The `.limit()` and `.orderBy()` are SQL bounds, not decisions. `.filter` (`src/lib/pages/home.ts:78`) and the `.slice` at `:226` run in lib. The `.map` at `editorial.ts:186` only reshapes rows and makes no decision. The 12 cap applies in SQL at `editorial.ts:179` (`entryCap: homeLimits.picksCandidates`). |
| B3 | PASS | `import 'server-only'` at `src/server/db/editorial.ts:1` and `src/server/home.ts:1`. No new `process.env` read. |
| B4 | PASS | Server imports lib only (`editorial.ts:54-58` imports `@/lib/pages/home`). Lib imports lib only (`src/lib/pages/home.ts:4-16`). No `app` or `components` import added. |
| B5 | PASS | `HomePickIdsSchema.parse` at `editorial.ts:170` is the input boundary. Output goes through `HomePickSchema.array().parse` at `:181`. The returned `HomePick` is a Ramble type, not a Drizzle row. `readCollectionRows` returns raw rows but is unexported. |
| B6 | PASS | `listHomePicks` (`editorial.ts:167`) is a guest read of guest-visible rows only. It takes no `Caller`, and the collection-entry lateral is filtered by `guestVisible` (`:119`). That is the exempt case. |
| B7 | PASS | New exports: `HomePickSchema` (`lib/pages/home.ts:62`), `HomePickIdsSchema` (`:74`), `homePickIds` (`:77`), `listHomePicks` (`editorial.ts:167`). Each has a non-test importer: `HomePickSchema` and `HomePickIdsSchema` in `editorial.ts:54-56`; `homePickIds` and `listHomePicks` in `src/server/home.ts:7,20,48`. `readCollectionRows` and `CollectionRead` are unexported. |
| B8 | PASS | No `'use client'` added (grep of the diff is empty). |
| B9 | PASS | Read only. No write, no job, no outbox. |
| B10 | N/A | No money or hold path touched. |
| B11 | PASS | No vendor SDK import added under `src/`. `tests/db/*` change only exercises the read. |
| B12 | PASS | No `Date.now()`, argument-less `new Date()`, float, or `toFixed` added. |
| B13 | PASS | No `catch` added in the diff. Errors from `readCollectionRows` and the parses propagate. |
| B14 | PASS | `getHomeContent` (`src/server/home.ts:39`, `'use cache'`) reads no cookies, headers, `getCaller()`, or token. `listHomePicks` receives its IDs as an argument. |
| B15 | PASS | No Route Handler added. |
| B16 | PASS | No `.module.css` or `style=` in the diff. |
| B17 | PASS | See above. |

### Advisory
- A-1 `src/server/db/seed/read.ts:128`: the seed snapshot joins `collectionItems` to `experiences` with no guest filter. It is ops-only and predates this diff. Log it in `audits/` rather than block on it.
- A-2 `src/server/db/editorial.ts:85-93`: `columnsWithoutIntro` hand-lists the `collections` columns. If `collections` gains a column, the list can drift from `CollectionSchema`. Consider `omit`-style derivation from `getTableColumns(collections)`.
- A-3 `src/lib/pages/home.ts:226` re-slices `experienceIds` to `picksCandidates`. The SQL cap already limits the list to 12, so the second slice is redundant but harmless. It also guards other callers.
- A-4 Reuse (A4 or B17): `HomePickSchema` (`src/lib/pages/home.ts:62`) is a narrower view of `CollectionSchema`. It is a distinct shape, not a duplicate, so no block.

---
<sub>architecture-audit | haiku | read-only | round 2</sub>

ARCH_VERDICT=APPROVE
