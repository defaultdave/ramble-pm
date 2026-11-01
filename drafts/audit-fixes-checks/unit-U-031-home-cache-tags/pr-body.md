Audit H-47, H-53 and the H-49 comment: a listing change no longer evicts the home entry, and the filter-option reads (categories and neighborhoods) live in one cached module.

## What changed
- Home is tagged `home` plus the experience IDs it asks for, not `catalog`. A listing write no longer reaches it unless a card on the page changed. A new `taxonomy` tag covers renames.
- `getFilterOptions` moved to `src/server/filterOptions.ts`; home, the experience page and browse use it (it replaces three inline copies of the categories-plus-neighborhoods read).
- The `getThisWeek` comment now says what is true (about 60 s, no ticket).
- A tag test per write kind in `src/lib/cacheTags.test.ts` and `src/server/home.test.ts`.
- `main` merged in: the home read keeps PR 285's `readCollectionRows` and `listHomePicks`, with this branch's tags.

## Checks
review, spec, architecture and qa PASS. qa removed each `cacheTag` call and each tag mapping one at a time (28 mutations); none survived. Gates: format, lint, typecheck, knip, build, 6586 unit tests, 1620 db tests, gitleaks over the range.

## Follow-ups logged, not built
- The `taxonomy` change has no publisher yet.
- `getFilterOptions` uses the 900 s `catalog` profile, so the home entry may refresh more often than its 3600 s profile.
- `tagsForChange` has no production caller; the per-experience tag loop repeats in three places.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
