PASS

## spec-compliance: U-030 "one session window and two named session predicates" (head f50394e, round 2)

### Blocking
None.

### Non-blocking
- `tests/db/browse.db.test.ts:777-811` and `coverage.test.ts:321-357` rely on minute-aligned fixtures (`2026-10-28T15:00:00Z`, `2026-10-26T12:00:00.000Z`); a fixture with seconds would move the "1 ms before now" case inside the minute cut. Hygiene only.
- `coverage.ts:448-455`: the bookable-party probe keeps `upcoming(s)` (the 121-day browse window) as the outer filter and adds the 14-day `isUpcomingSession` check; correct, two windows in one probe.

### Unconfirmed
- The new db tests and `tests/db/home.db.test.ts` not run (no Postgres). Dates checked by reading: asOf 2026-10-26T12:00Z is 2026-10-26 in New York (EDT); asOf + 121 days is 2027-02-24T12:00Z, 2027-02-24 in New York (EST), so the `slice(0,10)` assertions name the right local days.

### Round 2 items
1. Browse window edges (PASS): exact-asOf session offered and matched (`opening`, :777-794); session at exactly asOf + browseWindowDays neither (`closing`, :796-811); SQL under test `db/browse.ts:100-104` and `hasSpace` at :111; header comment line 43.
2. `this-week` probe (PASS): `coverage.ts:289` `upcomingWindow(minuteAsOf(s.now), homeLimits.thisWeekDays)`, :290-296 `status === 'scheduled' && isOpenSession(session, week)`; same call shape as `src/server/home.ts:84`.
3. `bookable-party` (PASS): `bookablePartyDays = 14` at :90-91; `isUpcomingSession(x, fortnight)` at :453; no literal 14 left in the probe.
4. Imports (PASS): sessionWindow imports at :4-8; `msPerDay` still used by kayak and seedDays.
5. `coverage.test.ts` (PASS): this-week edges at :321-337, sold-out at :339-347, fortnight edges at :349-357. `vitest run src/lib/seed/coverage.test.ts src/lib/sessionWindow.test.ts`: 2 files, 103 tests pass.

### Scope of the delta
Exactly 3 files, all in the round 2 manifest. `browseWindowDays` and `browseDateHorizonDays` remain in `src/lib/browse.ts:24,27`. The kayak probe (`coverage.ts:435-445`) is unchanged.

### Round 1 criteria (spot-check)
Browse's edges on both pages (`db/home.ts:75-76`, `sessionWindow.ts:30`, home tests updated); sold-out via `hasSpace` in browse SQL and `isOpenSession` in the seed mirror; predicates at `sessionWindow.ts:19,25,34`; home uses `isOpenSession` (`home.ts:69`). Areas the delta touches hold.

PM note (not part of the verdict): checked at f50394e; posted on e464629, the merge of origin/main 41e3d5c (PRs 259 and 260) into it. The PM resolved one import-only conflict in src/server/db/home.ts (both sides kept); the gte/lt edges are unchanged; format, lint, typecheck, knip, build, test (3791) and gitleaks pass on e464629; the CI db job reruns the database tests.
