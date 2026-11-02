PASS

## architecture-audit: U-031 "cache audit fixes" (head 9d4b9f7)

Rules: `.claude/standards/architecture.md` (project) in `/Users/davidfleming/Workspace/ramble`, read at head 9d4b9f7. Diff `053bd1a...9d4b9f7`, 11 files, including the new `src/server/cache/tagExperiences.ts` and its test.
Files audited: `src/lib/cacheProfiles.ts`, `src/lib/cacheTags.ts`, `src/lib/cacheTags.test.ts`, `src/server/browse.ts`, `src/server/home.ts`, `src/server/home.test.ts`, `src/server/filterOptions.ts`, `src/server/filterOptions.test.ts`, `src/server/experiencePage.ts`, `src/server/cache/tagExperiences.ts`, `src/server/cache/tagExperiences.test.ts`.

### Blocking
- None. B1 to B17 checked against the diff. No new `fetch`, DB, or SDK call outside `src/server/`; `tagExperiences.ts` carries `import 'server-only'` (B3); imports point one way (B4); no vendor SDK import (B11); no `'use client'`, route handler, CSS, money, clock, or catch-block change (B8, B12, B13, B15, B16). `tagExperiences` is called from `browse.ts` and `home.ts`, so it is not test-only (B7). `tagsForChange` was removed and has no remaining importer (`tagsForChanges` is used by `invalidate.ts`). Cached callers (`getBrowseResults`, `getHomeContent`, `getThisWeek`, `getFilterOptions`) read no caller, cookie, or token (B14).

B2 enumeration, every comparison or state rule in data-layer and route code touched by this diff:
- `src/server/browse.ts:31` `if (!page.ok) cacheLife('uncached')`: pre-existing, unchanged logic.
- `src/server/browse.ts:34` `if (page.ok) tagExperiences(...)`: the guard predates the diff; only the loop was folded into the helper. Cache-tagging policy, not a domain result. Not new.
- `src/server/home.ts` `homeExperienceIds(...)` and `getThisWeek` `content.experiences.map(...)`: existing selection, and the map projects IDs for tagging. Not a decision.
- `src/server/filterOptions.ts:cacheLife('editorial')`: profile choice, configuration in `src/lib/cacheProfiles.ts`. Not a decision.
No new decision was added to the data layer outside `src/lib/`.

B5 (input validation): `tagExperiences` takes IDs produced by data-layer reads (`page.items`, `homeExperienceIds`, `content.experiences`), not client input, so no Zod parse is needed at this boundary.

B17 (reuse): `tagExperiences` does not duplicate an existing helper. Two loops predating this diff do the same job and are logged as audit items below.

### Non-blocking
- `src/server/coverPhotos.ts:25` `for (const id of ids) cacheTag(tags.experience(id.toLowerCase()));` and `src/server/upcomingSessions.ts:37` `cacheTag(tags.experience(id));` duplicate the per-ID tagging that `tagExperiences` now owns. Pre-existing, so not blocking. audit item (log in `audits/` in ramble-pm): reuse `tagExperiences` at both sites. `coverPhotos` needs `ids.map((id) => id.toLowerCase())` passed in, or the helper takes a normaliser.
- `src/server/cache/tagExperiences.ts:10` does not lowercase the ID. `experiencePage.ts:34`, `upcomingSessions.ts:37`, and `coverPhotos.ts:25` all lowercase before `tags.experience(...)`. If a caller ever passes a mixed-case ID, the tag will not match the lower-case tag the other paths publish. Current callers pass DB IDs; consider lowercasing in the helper so the rule lives in one place.
- Behaviour change, not an architecture break: the `taxonomy` change kind is removed, so a category or neighbourhood rename now reaches the home and experience entries only when their cache profile runs out (`editorial`, revalidate 3600 s). `docs/plan/01-design-doc.md` and the ADRs do not state an invalidation requirement for renames, so no design-doc conflict was found. The product owner should confirm that a stale name for up to an hour is acceptable.
- `src/server/home.ts` comment around line 358 runs past the line width (prettier/format issue, not an architecture rule).

### Unconfirmed
- Whether every experience ID reaching `tagExperiences` is already lower-case (the lowercasing note above depends on it). Not verified against the schema here.
- The builder's Reuse section and PR Decisions were not in the brief, so B17's "Reuse section" check could not be run against them.

---
<sub>architecture-audit | haiku | read-only</sub>
