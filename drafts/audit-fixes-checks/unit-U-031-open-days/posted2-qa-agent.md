Reposted on head 2c87cba: main merged again (the lib-refactor PRs B, C and E touched the same import lines). The two conflicts were import lines only, resolved as unions, with spacesStatus dropped from home.ts where it became unused. Net diff against main is unchanged (7 files, +122 -7). The PM reran every gate on 2c87cba: format, lint, typecheck, knip, 3719 unit tests, all 733 db tests, build, gitleaks.

Posted on head 2139df3 (6fa7ae5 with main merged). This verdict was given on 6fa7ae5; a focused review of the merge passed (review-agent-merge.md), and the PM reran every gate on the merge commit, including all 733 db tests.

PASS

## qa-agent: U-031 "Browse offers only days with space" (head 6fa7ae5)

The browser walk-through was not possible in this sandbox, so this PASS rests on a static walk-through of every path that decides a browse day. It is not a visual check.

### Blocking
None.

### Non-blocking
- Not run: the sandbox refuses a connection to localhost:5432 ("Operation not permitted"), and the docker socket is also denied. So I could not seed a database, set a day sold out by SQL, or run the dev server and Chromium at 390 px. No second Postgres was started and the sandbox was not bypassed.
- Static walk-through, every path that decides a browse day:
  - FilterBar calendar: `BrowseContent.tsx` takes its days from `getBrowseDates` (`src/server/browse.ts`), which is `browseDays(listBrowseDayRows(...))`. `listBrowseDayRows` now adds `seats_sold < allocation` to the shared `shown` condition, so both the stored-date query and the hand-entered query drop sold-out sessions. A day whose sessions are all sold out is not offered. A day with one space left (`seats_sold = allocation - 1`) passes and is offered. A day with one sold-out and one open session stays offered, because the distinct dates come from the open session.
  - `browseDays`: unchanged. It only converts the rows it is given, so it cannot bring a sold-out day back.
  - `hasSessionOn` (the `?date=` match in `listBrowseExperiences`): it gets the same `hasSpace` predicate inside its EXISTS, together with the same `sessionLocalDate` expression and window. An experience whose only sessions that day are sold out is not listed. One with a session that has space is listed. The calendar and the match therefore agree on both the stored-date and the hand-entered path.
  - Empty state's "next day" link: `nextBrowseDay` and `datedEmpty` in `src/lib/browse.ts` read the same `days` from `getBrowseDates`, so the link cannot point at a sold-out day. Its message text ("The next day with experiences is ...") stays true.
  - Unfiltered listing: `hasSessionOn` returns undefined when `date` is null, so the unfiltered listing is untouched. The calendar rows are the only other change.
  - Other users of the rule: `home.ts` (thisWeekExperienceIds) now calls `hasSpaceLeft` with the same result as before. `seed/coverage.ts` mirrors browse with `hasSpaceLeft`, so the coverage matrix agrees with the SQL.
  - TS and SQL agree: `hasSpaceLeft` is `spacesStatus(allocation - seatsSold) !== 'sold-out'`, which is spaces left above 0. The SQL is `seats_sold < allocation`, the same inequality, and the PM's DB test pins the two together.
- No disagreement found between any of the paths.
- A day that sells out inside the browse cache window (`cacheLife('browse')`, about a minute, tagged `tags.catalog`) can show for up to that long. This is existing behavior, not part of this change.

### Unconfirmed
- The 390 px before-and-after screenshots: not taken (see Not run above). Suggested manual check for the owner on a local dev server: set every `scheduled` session on one date for one experience to `seats_sold = allocation`. Confirm that date is missing from the calendar and that `?date=` for it omits the experience. Then set one session on that date to `seats_sold = allocation - 1` and confirm the date is offered and the experience is listed.

**Evidence**
None. No files in /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-031-open-days/ and none added, because the sandbox could not reach Postgres, so no browser run was possible.
