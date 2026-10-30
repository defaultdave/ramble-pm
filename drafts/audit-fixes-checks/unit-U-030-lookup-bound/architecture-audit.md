# Architecture Audit: unit/U-030-lookup-bound (d5754cc)

**Verdict: APPROVE** (0 blocking violations, 0 advisory notes)

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project; the global default is replaced by it)
Base: origin/main 15c6130. Read-only audit via `git diff origin/main unit/U-030-lookup-bound` and `git grep` on the branch. Nothing checked out or modified.

Files audited (in scope, `src/lib/**`):
- `src/lib/idLookup.ts` (new)
- `src/lib/pages/home.ts`
- `src/lib/photos.ts`
- `src/lib/photoViews.ts`
- `src/lib/experienceCards.ts` (cardLookupLimit removed)
- Tests and runbook (`src/lib/idLookup.test.ts`, `src/lib/experienceCards.test.ts`, `docs/runbooks/home.md`): read only

Scope: in scope (`lib/**/*.ts`), so no short-circuit.

## Blocking rules

| # | Result | Evidence |
|---|--------|----------|
| B1 | PASS | No `fetch(`, Drizzle, Neon, or SDK call in any changed file. The only consumers of the changed exports are server modules: `src/server/coverPhotos.ts:5,24`, `src/server/db/photos.ts:6,305`, `src/server/db/home.ts:8,31`. |
| B2 | PASS | The diff adds no filter, sort, reduce, parse, or display logic outside `src/lib/`. The `.slice(0, homeLimits.picksCandidates)` at `src/lib/pages/home.ts:199` is already in lib. |
| B3 | PASS | `src/lib` has no `process.env` read (grep clean on all changed files). `server-only` is not required for `lib/`. |
| B4 | PASS | Imports point one way. `idLookup.ts` imports only `./catalog` and `./editorial` (lines 2-3). `editorial.ts` and `catalog.ts` do not import `idLookup`, `pages/home`, `photos`, or `photoViews`, so there is no cycle. The diff also removes the old `photos.ts` to `experienceCards.ts` import (`photos.ts:3` now imports `./idLookup`), which takes out an existing `experienceCards` to `photoViews` to `photos` loop. |
| B5 | PASS | `idListSchema` (`src/lib/idLookup.ts:18-20`) validates the list length and then the element type with Zod. It returns the IDs unchanged, and no raw row or `*Dto` type crosses a boundary. |
| B6 | PASS | Not applicable. No data-layer function or Server Action is added or changed. |
| B7 | PASS | Each new export has a non-test importer. `picksCandidates` is used by `home.ts:22,24`, `cardLookupLimit` by `photos.ts:3,24` and `idLookup.ts`, and `idListSchema` by `home.ts:38` and `photoViews.ts:24`. |
| B8 | PASS | No `'use client'` added or changed. |
| B9 | PASS | Not applicable. No writes. |
| B10 | PASS | Not applicable. |
| B11 | PASS | No vendor SDK import. |
| B12 | PASS | No money, time, or `Date` use in the changed files. |
| B13 | PASS | No `catch` in any changed file. |
| B14 | PASS | No `'use cache'` function added or changed. |
| B15 | PASS | No Route Handler added. |
| B16 | PASS | No CSS or component change. |
| B17 | PASS | `idLookup.ts` is a shared module named for what it does, not a page module. It consolidates two copies of the same bounded-ID-list Zod pattern (`HomeExperienceIdsSchema` and `CoverLookupSchema`, previously `home.ts:38-40` and `photoViews.ts:24-29` on the base) into `idListSchema`. It also moves `cardLookupLimit` out of `experienceCards.ts` (a card module) into the shared module. No new duplicate of an existing helper was found, and `editorial.ts:204` (`.max(editorialLimits.homeModules)`) is a module list, not an ID list, so it is not a duplicate. |

## Advisory rules

| # | Result | Notes |
|---|--------|-------|
| A1 | PASS | No async component touched. |
| A2 | PASS | Not applicable. |
| A3 | PASS | Not applicable. |
| A4 | PASS | Reuse improved by the consolidation above. |
| A5 | PASS | Not applicable. |
| A6 | PASS | No hook added. |

Summary: no blocking violations. The diff removes an import cycle between `experienceCards`, `photoViews`, and `photos` and consolidates the duplicated bounded-ID schema. The `cardLookupLimit` constant has no consumers left in `experienceCards.ts` (grep clean), so the move is complete.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
