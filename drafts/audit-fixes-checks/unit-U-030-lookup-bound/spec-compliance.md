# Spec Compliance: unit/U-030-lookup-bound (audit H-54)

Commit: d5754cc8db5789cb08f6438c4a6528576248b3da
Base: origin/main 15c6130582edbd257c02242725f040efd9271171
Repo: /Users/davidfleming/Workspace/ramble (read-only check; tests not run)

**Verdict: all ACs PASS.**

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| AC1 | Lookup bound (240) derived from editorialLimits.homeModules x picksCandidates, not a bare literal | PASS | `src/lib/idLookup.ts:12` `cardLookupLimit = editorialLimits.homeModules * picksCandidates`; `src/lib/editorial.ts:39` `homeModules: 20`; `src/lib/idLookup.ts:7` `picksCandidates = 12`. Old literal `cardLookupLimit = 240` removed from `src/lib/experienceCards.ts` (origin/main:12). |
| AC2 | One shared length-first ID-list schema used by HomeExperienceIdsSchema and CoverLookupSchema | PASS | `src/lib/idLookup.ts:17-19` `idListSchema(max)` = `z.array(z.unknown()).max(max).pipe(z.array(EntityIdSchema))`; used at `src/lib/pages/home.ts:38` (HomeExperienceIdsSchema) and `src/lib/photoViews.ts:24` (CoverLookupSchema). Length-first holds: zod 4 `handlePipeResult` (`node_modules/zod/v4/core/schemas.js`, `$ZodPipe`) skips the right-hand ID check once the left side has any issue. |
| AC3 | photos.ts does not import home.ts; no import cycle | PASS | `src/lib/photos.ts:3` imports `./idLookup` (not `./pages/home`, not `./experienceCards`). Source import chain: idLookup -> catalog, editorial; editorial -> cacheTags, catalog, richText/*, text; none import photos, photoViews, home, or idLookup. photoViews -> idLookup, photos; home -> idLookup, photoViews. No cycle. Only test file `src/lib/idLookup.test.ts:4-5` imports pages/home and photos, which is test-only. |
| AC4 | Tests prove AC1 and AC2 (over-long array of non-IDs yields only a too_big issue) | PASS | AC1: `src/lib/idLookup.test.ts:10-13` (equals homeModules x picksCandidates), `:15-19` (home/photo bounds equal cardLookupLimit). AC2: `src/lib/idLookup.test.ts:35-42` 201 non-numbers `42` -> asserts exactly 1 issue with code `too_big`. Also `src/lib/photoViews.test.ts:68-73` (over-long `'x'` array, 1 issue). Length-first is covered by the too_big assertion. |
| AC5 | Nothing outside manifest (OUT: db, migrations, UI, other audit items; one docs/runbooks/home.md line noted) | PASS | Branch touches 8 files: `docs/runbooks/home.md:52` (the noted one-line update, cardLookupLimit now in idLookup.ts); `src/lib/experienceCards.ts` and `.test.ts` (removal of cardLookupLimit and its test, needed to break the photos -> experienceCards -> photoViews cycle); `src/lib/idLookup.ts` and `.test.ts` (new); `src/lib/pages/home.ts`, `src/lib/photoViews.ts`, `src/lib/photos.ts` (imports/bound source). No db, migrations, UI, or other audit-item files touched. Note: the manifest itself was not supplied to me, so the experienceCards.ts edit is judged as necessary for AC3, not checked against a manifest entry. |

## Notes
- Tests were not executed: the check was read-only and no worktree was created. The PASS results rest on reading the diff, the test bodies, and the zod 4.6.7 pipe source.
- `picksCandidates = 12` is now a literal in `idLookup.ts:7`, the single source. The 240 bound is no longer a literal.
