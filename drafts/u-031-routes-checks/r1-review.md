PASS

## review-agent: U-031 "routes.ts: one home for every guest address" (head 2c83761)

### Blocking
None.

### Non-blocking
- src/lib/routes.ts:10 and :35: `ExperienceRef` (private) and `ExperienceAddress` (exported) are the same type, `{ slug: string; id: string }`. Define `ExperienceAddress` once and use it in `experiencePath` and `guidePath`. Cosmetic.
- src/lib/routes.test.ts: the `paths` describe repeats four assertions the `literal addresses` table below it already makes (`categoryPath`, `neighborhoodPath`, `giftCheckoutPath`, `privateSessionPath`). The block was moved as is from experiencePage.test.ts:106-113; merge it into the table.
- Ruling 1 (routes.ts imports `isSlug` and `EntityIdSchema` from ./catalog): accepted. catalog.ts imports only zod, so there is no cycle with filters.ts, which now imports routes. It reuses the rule `filters.ts` uses rather than copying it.
- Ruling 2 (`@alias` on `privateSessionPath`): accepted; it keeps `privateSessionPath` as a named alias of `contactPath`, as ruled.
- Ruling 3 (`experienceCardPath` takes `status: string`): accepted. The comparison to `'guide_only'` is unchanged, routes.ts stays free of catalog types, and typecheck passes for both callers.
- Audit item: the second literal copies of addresses (`e2e/routes.ts`, `securityHeaders.ts:13`, `email/render.tsx:40`, and others) are out of scope and unchanged, as the plan lists.
- Duplication sweep: no new duplicates. `browsePath`, `experiencePath` and `experienceAddress` were each defined twice before; this PR leaves one definition each.

### Unconfirmed
- `pnpm storybook:test` not run by this reviewer; the plan's named risk is `HomeHero` importing `filters.ts`. The CI storybook job covers it.

### Verified
- `vitest run src/lib src/components/HomeModules src/components/GuestShell`: 67 files, 2389 tests pass. typecheck, knip and lint clean.
- Rendered hrefs unchanged: home rail `/new-york/browse?category=<slug>` (home.test.ts:525,530 and HomeModules.test.tsx:132 pass); card hrefs `/guide/...` for `guide_only`, `/experiences/...` otherwise; page.tsx retry `/experiences/<slug>-<id>`; `/#picks`, `/legal/terms`, `/legal/privacy` (distinct), `/help`, `/contact`, `/accessibility`, `/gifts`; hero field names `neighborhood` and `date`, pinned by a new filters.test.ts case.
- Deleted names: no importers left in src, e2e, tests or docs. `clientAddress.ts` has its own unrelated `maxAddressLength`.
- Coverage: experiencePath, experienceCardPath and every parseExperienceAddress case moved whole to routes.test.ts, plus a round-trip test. The old home `browseHref` cases are covered by filters.test.ts:242-263 (escaping, canonical order); the empty-value case belonged to the deleted function. No coverage lost.
- Scope: every changed file is in IN SCOPE. No comment names a ticket; both runbooks updated.
