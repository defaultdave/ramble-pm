PASS

# Architecture Audit: unit/U-030-home-reads (head 9f735e270845d74f9da6d0fc61c083e8fdc82a12)

Rules: `.claude/standards/architecture.md` (project, in worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-acc08469565e54567`)
Scope: in scope (`src/lib`, `src/server`, `src/app`). Non-test source diff reviewed; checks B1 to B17 applied.

## Blocking

None.

Checked and clear:
- B1, B4 (layers): `src/lib/experienceCards.ts`, `src/lib/home.ts`, `src/lib/browse.ts` import only `src/lib` and Zod. `src/server/db/home.ts:9-19` imports `@/lib/*` and `./photos`, which is allowed. `src/app/(guest)/new-york/browse/BrowseContent.tsx` drops its import of `@/server/guestCovers`; no new cross-layer edge.
- B2: `coverImage` (`src/server/db/photos.ts:114`) and `photoView` are lib functions reached from the data layer. The `covers ? ... : ...` branch in `src/server/db/home.ts:55-60` is a shape flag, not a domain rule. The lowest-position rule is an ORDER BY (`src/server/db/photos.ts:60`), which B2 exempts.
- B5: `GuestPhotoSchema.parse` runs on every joined cover (`photos.ts:115`, `home.ts:58`), and `CardExperienceSchema` still parses at the boundary.
- B6: `listBrowseExperiences`, `listHomeExperiences`, and `listGuestCoverPhotos` filter by `guestVisible` and take no caller. This matches the exemption.
- B9, B10, B12: no new writes, no money math, no new time reads.
- B13 (the diff itself): `listBrowseExperiences`, `listHomeExperiences`, and `readCollections` add no catch. Failures reach `readOrRefuse` (`src/server/cache/readOrRefuse.ts`), then `BrowseContent.tsx` catch (`rethrowOrLog` plus `errorView`) and `HomeContent.tsx` catch (`HomeError`). The combined read's failure reaches the page's existing error path, as the brief requires.
- B14 and guest fields: `coverWith` (`src/server/db/photos.ts:66-82`) and `coverSelection` (`photos.ts:98-110`) name their columns and exclude the storage key and rights record. `GuestPhotoSchema` (`src/lib/photos.ts:242`) has no caller fields. The cached `getBrowseResults` (`src/server/browse.ts:25`), `getThisWeek` (`src/server/home.ts:81`) entries hold only what a guest sees on a card. Photo visibility is the same as before this diff: `listGuestCoverPhotos` had no photo-level status either, so nothing new is exposed.
- B7: no new export consumed only by tests. `coverWith`, `guestCoverOf`, `coverSelection`, and `coverImage` each have a non-test caller.

## Non-blocking

- `src/server/db/photos.ts:60` and `:66`: the lowest-position cover rule is now in SQL in three reads (browse, this-week, and `listGuestCoverPhotos` via `guestCoverOf`). `src/lib/photoViews.ts:43` (`coversByExperience`) keeps the TypeScript copy for Picks. The mirror is the DB tests only (`tests/db/browse.db.test.ts` "covers" block, `tests/db/home.db.test.ts:206`). Suggest one test that runs `coversByExperience` and the SQL over the same fixture so the two cannot drift. Advisory, not blocking under B2.
- Cache invalidation for covers (`src/lib/cacheTags.ts:8-19`, `CacheChange` union): there is no photo change kind. Browse and This-week entries now hold covers under the `browse` profile, and they reach the experience only through `tags.experience(id)`. `addPhoto` (`src/server/db/photos.ts:144`) is `TODO(U-074b): first caller` and has no caller yet, so nothing is stale today. When U-074b lands, it must emit a change that invalidates `tags.experience(experienceId)`, or a new cover shows only after the browse profile expires. Worth a line in the U-074b scope manifest.
- B13, pre-existing and untouched by this diff: `src/server/guestCovers.ts:22-24` catches and returns `new Map()`. The runbook (`docs/runbooks/home.md`, Cover photos section) defends this as intentional for Picks decoration. It matches the literal B13 pattern in `server/**`. Dave should decide whether to keep it as a logged exception or move it to the error path; not introduced here.
- The new `CardImageSchema` (`src/lib/experienceCards.ts:21-27`) restates the `PhotoView` shape as Zod. It is type-checked against `PhotoView` via `satisfies`, so drift is caught at compile time. No existing `PhotoView` schema was found, so no B17 duplicate.
- Docs drift, not an architecture rule: `docs/runbooks/home.md` names `getCoverPhotos` in `src/server/coverPhotos.ts` and `coverLookupIds`. Both exist, so the references are correct.
