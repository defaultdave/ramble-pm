PASS

## review-agent: U-031 "Cache audit fixes (H-109, H-110, H-111)" (head dae03b8)

Round 2. Base 053bd1a. Reviewed `git diff 9d4b9f7 dae03b8` and read the files at `dae03b8` with `git show` and `git grep`; no checkout was changed and nothing was run, because the delta has no code change. Scope: the delta is four files, `docs/runbooks/browse.md`, `docs/runbooks/cache-conventions.md`, `docs/runbooks/experience.md`, and one doc comment in `src/server/db/sessions.ts`. Nothing outside the unit and no out-of-scope file.

### Blocking
None.

Round 1 blocking items, each checked at `dae03b8`:
- `docs/runbooks/browse.md:31` now says `getFilterOptions` runs on profile `editorial` (revalidate 1 h). Matches `src/server/filterOptions.ts:23` (`cacheLife('editorial')`) and `src/lib/cacheProfiles.ts:22` (`revalidate: 3_600`). Fixed.
- `tagsForChange` as the function to call: `cache-conventions.md:17`, `browse.md:35`, `experience.md:36` and the comment at `src/server/db/sessions.ts:105` now name `tagsForChanges` (`[change]` form where a call is shown). Fixed. `git grep "tagsForChange\b"` outside `docs/adr` and `docs/plan` finds one hit, `.claude/standards/architecture.md:77` (B14), which is protected and carried by the PM in a separate PR, so it is not a finding here.
- Rename not published: `cache-conventions.md:19` states once, next to the "adding a kind of change" line, that a category or neighborhood rename has no publisher and no kind of change, shows when the reading entry's profile runs out, and that `tags.taxonomy` stays on `getFilterOptions` as the hook for a later renaming unit. Fixed. It also covers the round 1 non-blocking ask to say the tag is kept on purpose.
- The `browse.md` consequence of the 1 h profile (round 1 asked for it to be mentioned): now in the `getFilterOptions` row. Done.

New runbook text against the code:
- `tagsForChanges(changes: readonly CacheChange[])` exists at `src/lib/cacheTags.ts:87`; `tagsForChanges([change])` is the form its tests and `invalidate.ts` use. True.
- "Adding a kind of change means adding one case there and one row to its test": `tagsFor` is a switch at `cacheTags.ts:57`, and `cacheTags.test.ts` has the table at line 83. True.
- No `CacheChange` kind returns `tags.taxonomy` (`cacheTags.ts:34-46` and the switch); `getFilterOptions` sets it (`filterOptions.ts:24`). True.
- Chips, title and slug check follow the profile: `BrowseContent.tsx:37-39` calls `getFilterOptions` then `knownFilters` and feeds the options to `FilterBar`; `browse.ts:57` builds the title from it. True.
- A `?category=<new slug>` address shows the empty state: `knownFilters` sets `matchesNothing` when a list had slugs and none is known (`filters.ts:135-148`), and `BrowseContent` then uses `emptyBrowsePage`. True for a lone unknown slug, which is what the text says.
- The `sessions.ts` comment's example `tagsForChanges([{ kind: 'schedule', experienceId }])` type-checks against the `schedule` member of `CacheChange`. True.

Carry-over: the delta changes docs and one comment only (7 insertions, 5 deletions, no code line), so the spec, architecture and QA verdicts at `9d4b9f7` carry over. The code, tests and diff at `dae03b8` are identical to `9d4b9f7` apart from that comment.

### Non-blocking
- Round 1 non-blocking items stand unchanged and need no action from this unit: the `coverPhotos.ts:25` duplicated tag loop (audit item, PM to log), the long doc-comment line in `home.ts`, and the browse card place lines waiting out the `browse` profile after a rename.
- `.claude/standards/architecture.md:77` (B14) still says `tagsForChange()`. PM carries it in a separate PR; until it lands the standard names a function that no longer exists.

### Unconfirmed
- `tsc --noEmit` was not run (round 1 saw route-type errors under `src/app` only because the generated `.next` types were absent). The delta changes no type, so this does not move.
