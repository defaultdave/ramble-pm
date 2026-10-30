PASS

## review-agent: U-030 "lookup bound" H-54 (head d5754cc)

### Blocking
None.

### Non-blocking
- src/lib/idLookup.ts:15-19 and src/lib/idLookup.test.ts:30-37: the "length-first" premise does not hold under the installed Zod (4.6.7). A plain `z.array(z.uuid()).max(3)` given five non-strings returns exactly one `too_big` issue, so the old HomeExperienceIdsSchema was already effectively length-first. I replaced the body with `z.array(EntityIdSchema).max(max)` in a scratch worktree and all 9 tests in idLookup.test.ts still passed, so no test fails if the ordering is broken. The `z.unknown()` + `.pipe` layer is harmless but redundant, and the doc comment ("Zod checks every ID of an array even when the array is already too long") is not true for this version. Suggest: drop the pipe and the claim, or keep it as insurance and soften the comment. The same claim was already on main in photoViews.ts, so this is not new.
- src/lib/idLookup.test.ts:11-13: the derivation test is tautological by construction. Setting `cardLookupLimit = 240` or `picksCandidates = 13` left every test green (the latter because every assertion compares through the same constant). Nothing pins the 240 the runbook states. The removed test pinned `20 * homeLimits.picksCandidates`, which is the same strength, so it is no regression. Optional: add `expect(cardLookupLimit).toBe(240)`.
- src/lib/idLookup.ts:5-6: `picksCandidates` is a home concept living in the neutral module. It is needed there to avoid a cycle, and home.ts re-exposes it as `homeLimits.picksCandidates`, so it is acceptable.

### Checked, no finding
- Import cycle: idLookup.ts imports `zod`, `./catalog` (imports zod, ./rules) and `./editorial` (imports cacheTags as type only, catalog, richText/*, text). Grep of those files for photos, idLookup, photoViews, pages/home, experienceCards: no match. photos.ts imports idLookup only; no photos -> home edge, no cycle.
- B17: `idListSchema` replaces two schemas (HomeExperienceIdsSchema, CoverLookupSchema) and duplicates nothing else; repo-wide grep for the `z.array(z.unknown()).max().pipe(z.array(EntityIdSchema))` shape finds only idLookup.ts. Consumers (src/server/coverPhotos.ts:24, src/server/db/photos.ts:305, src/server/db/home.ts:31) are unchanged.
- `cardLookupLimit` removed from experienceCards.ts, its old test moved into idLookup.test.ts (bound equality, accepts bound, refuses bound+1, malformed IDs). No stale references remain. The keep-equal comment in photos.ts is removed.
- Tests: idLookup, pages/home, photoViews, photos test files: 168 passed (scratch worktree, removed).
- Scope: only the files above plus docs/runbooks/home.md. No behaviour change except the over-long error shape (now a single too_big issue; already the case for Home on this Zod). Migrations, UI, other audit items untouched.
- docs/runbooks/home.md:52 pointer: accurate (path moved from experienceCards.ts to idLookup.ts, 20 x 12 = 240) and would be stale otherwise. In scope; approved.

### Unconfirmed
- None.
