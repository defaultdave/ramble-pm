PASS

## review-agent: U-031 "open days" merge re-check (head 2139df3)

### Blocking
None.

### Non-blocking
- Net change against origin/main (merge-base is 2bc8c4e, so the three-dot diff is exactly the branch): 7 files, 122 insertions, 7 deletions. It is the BE-7 fix and nothing else: `spacesLeft` and `hasSpaceLeft` in src/lib/spaces.ts; the `hasSpace` SQL in src/server/db/browse.ts, added to `hasSessionOn` and `listBrowseDayRows`; the one expression in src/lib/home.ts (`spacesStatus(...) !== 'sold-out'` replaced by `hasSpaceLeft(session)`, with the import swapped); the coverage mirror in src/lib/seed/coverage.ts; one runbook sentence; src/lib/spaces.test.ts and tests/db/browse.db.test.ts.
- Nothing from main lost or doubled. The merge-only diff (6fa7ae5 to 2139df3) of home.ts and browse.md is entirely PR 232's: the address helpers removed from home.ts, new imports from ./filters and ./routes, `experienceCardPath`, and the `hrefForFilters` category link, plus one runbook sentence about `routes.ts` and `browsePath`. Those are absent from the net diff, so main's edits are intact and not re-applied. browse.ts, spaces.ts and coverage.ts have no merge-only changes.
- home.ts: line 16 imports `hasSpaceLeft` from './spaces' and line 202 calls it in `thisWeekExperienceIds`, after main's import and address edits. No leftover `spacesStatus` import.
- Runbook: main's edit is on line 7 (the grammar paragraph). The branch's sentence is appended on line 41, in the date-matching paragraph. They do not touch, and the sentence reads correctly.
- The PM's gates on 2139df3 all passed (format, lint, typecheck, knip, 3632 unit tests, 733 db tests, build, gitleaks). I did not rerun them.

### Unconfirmed
None.
