PASS

## spec-compliance: U-031 "cache audit fixes" (head 9d4b9f7)

Criteria: fixes named in H-109, H-110, H-111 of `audits/home-2026-10-28.md`. Diff `053bd1a...9d4b9f7`, read-only, no tests run.

| Row | Criterion | Status | Evidence |
|---|---|---|---|
| H-109 | Name a publisher for taxonomy renames and add `TODO(U-xxx)`, or drop the kind | PASS (drop option) | `src/lib/cacheTags.ts` removes `kind: 'taxonomy'` from `CacheChange` and its `tagsFor` case; `tags.taxonomy` comment (lines 16-20) states no change kind reaches it. Removed from `cacheTags.test.ts` and `home.test.ts`. |
| H-110 | `getFilterOptions` gets a profile no shorter than `editorial`, or the comment says the refresh rate | PASS (profile option, comment added) | `src/server/filterOptions.ts:23` `cacheLife('editorial')`; comment lines 13-16 explain the shortest-profile rule. `src/server/filterOptions.test.ts` updated to `editorial`. |
| H-111 | Drop the unused singular `tagsForChange`; add `tagExperiences(ids)` for the per-experience loop | PASS | `tagsForChange` removed from `src/lib/cacheTags.ts`. New `src/server/cache/tagExperiences.ts`. Loops replaced at `src/server/browse.ts:34`, `src/server/home.ts:57` and `src/server/home.ts:102`. Tests in `src/server/cache/tagExperiences.test.ts`. |

### Blocking
- None.

### Non-blocking
- `src/server/db/sessions.ts:105`: a doc comment still names `tagsForChange({ kind: 'schedule', experienceId })`, a function this diff removes. Change the name to `tagsForChanges` so the comment points at real code.
- H-110 scope note: `src/server/experiencePage.ts` still runs `cacheLife('catalog')` (900 s) on its own shell, so the experience page still refreshes every 900 s. The row's named fix (the `getFilterOptions` profile) is met; the experience page's own profile is unchanged by this diff and was not part of the row's fix.
- Audit item (pre-existing, not named in H-111): `src/server/coverPhotos.ts:25` and `src/server/upcomingSessions.ts:37` and `src/server/experiencePage.ts:34` still hold per-ID `cacheTag(tags.experience(...))` calls. Candidate for the same `tagExperiences` helper.

### Unconfirmed
- None.

---
<sub>spec-compliance | haiku | read-only</sub>
