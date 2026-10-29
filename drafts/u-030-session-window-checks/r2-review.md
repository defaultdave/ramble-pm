PASS

## review-agent: U-030 "one session window and two named session predicates" (head f50394e, round 2)

Postgres unavailable to this check, so the two new db tests were read and reasoned about, not run; vitest not run.

### Blocking
None. Both round 1 blockers are fixed:
1. Browse's SQL window edges: `the window edges` in `tests/db/browse.db.test.ts`. The opening session starts exactly at `asOf`; the test requires its day offered and `list` with that date to return it; `gte` to `gt` in `scheduledInWindow` (`src/server/db/browse.ts:100-105`) fails both assertions. The closing session starts at `asOf + browseWindowDays * msPerDay`; the test requires no day and no item for that date; `lt` to `lte` fails it (`IsoDateSchema` has no horizon check, so the date filter is accepted). Both tests reach `listBrowseDayRows` (line 247) and `listBrowseExperiences` (line 122), and `hasSessionOn` through the date filter. Default allocation 8, so `hasSpace` holds and only the window edge can fail them.
2. Seed `this-week` probe (`src/lib/seed/coverage.ts:289-296`) reads `upcomingWindow(minuteAsOf(s.now), homeLimits.thisWeekDays)` with `isOpenSession`; `coverage.test.ts` pins exactly now (true), 1 ms before (false), 7 days minus 1 ms (true), exactly 7 days (false), sold out (false). Reverting to `<=` fails the end case; dropping the space check fails the sold-out case. `bookable-party` uses `isUpcomingSession` with `bookablePartyDays = 14` (lines 90-91, 451-454), fortnight edges tested.

### Non-blocking
- `coverage.ts:3` imports `homeLimits` from `@/lib/home` (H-96, ruled for PR G).
- Kayak refund-window probe still hand-writes a one-day horizon (H-95, ruled).
- The this-week probe repeats `session.status === 'scheduled'` beside `isOpenSession` (predicates take no status), as `upcoming()` does.
- Round 1 non-blocking items did not regress; the delta touches only `coverage.ts`, `coverage.test.ts`, `browse.db.test.ts`; the main merge (PR 258) adds plan scripts and the PM agent file; no ticket-naming comments, logging, unbounded work or duplication added.

### Unconfirmed
- The new db tests and coverage cases were not executed here; CI runs them.

PM note (not part of the verdict): checked at f50394e; posted on e464629, the merge of origin/main 41e3d5c (PRs 259 and 260) into it. The PM resolved one import-only conflict in src/server/db/home.ts (both sides kept); the gte/lt edges are unchanged; format, lint, typecheck, knip, build, test (3791) and gitleaks pass on e464629; the CI db job reruns the database tests.
