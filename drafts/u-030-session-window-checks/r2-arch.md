PASS

## architecture-audit: U-030 "one session window and two named session predicates" (head f50394e, round 2)

Rules: `.claude/standards/architecture.md` (B1 to B17). Round 2 delta (1e9beb9..8a35e03) read in full with the surrounding `coverage.ts` lines; tests not run. Files: `src/lib/seed/coverage.ts`, `src/lib/seed/coverage.test.ts`, `tests/db/browse.db.test.ts`.

### Round 1 items
1. `this-week` probe: fixed. It builds `upcomingWindow(minuteAsOf(s.now), homeLimits.thisWeekDays)` and filters with `isOpenSession`; the inline `7 * msPerDay`, `<= horizon` and raw now are gone. `coverage.test.ts` pins both edges (exactly now counts, 1 ms before does not, 1 ms before the week's end counts, exactly at the end does not) and a sold-out case.
2. `bookable-party`: fixed (edge through `isUpcomingSession(x, upcomingWindow(minuteAsOf(s.now), bookablePartyDays))`, named constant; tests at 14 days minus 1 ms and exactly 14 days). `kayak-other-dates`: ruled by the PM; accepted. The `> dayAway` at `coverage.ts:439` mirrors the refund window, which belongs to the cancellation rules; it stays open as H-95 and must close there.
3. `browseWindowDays`: ruled by the PM; agreed. It is browse's own horizon, read only by browse's data layer and seed mirror; imports run data layer into src/lib (B4 allows). Not a general helper. The seed's page-module imports predate D (H-96 for PR G).
4. Exact-instant tests of browse's SQL window edges: fixed. `the window edges` in `tests/db/browse.db.test.ts` covers `listBrowseDayRows` and `listBrowseExperiences` at exactly `asOf` (offered, matches) and exactly `asOf + browseWindowDays * msPerDay` (neither); header comment updated.

### Blocking
None.

### Advisory
- H-96: `coverage.ts:3` now imports `homeLimits` from `@/lib/home`, a new seed-to-page-module import of the same class; recorded against H-96 for PR G.
- H-95: `coverage.ts:439` (`dayAway`) is the one inline window edge left in the seed.
- `this-week` checks `session.status === 'scheduled'` inline (about `coverage.ts:292`), as the shared `upcoming()` does at line 100; a seed mirror, not blocking; fold into the H-96 cleanup.
- No new B2 decision or duplication in the delta; the tests' `7 * msPerDay` and `14 * msPerDay` are expected values.

PM note (not part of the verdict): checked at f50394e; posted on e464629, the merge of origin/main 41e3d5c (PRs 259 and 260) into it. The PM resolved one import-only conflict in src/server/db/home.ts (both sides kept); the gte/lt edges are unchanged; format, lint, typecheck, knip, build, test (3791) and gitleaks pass on e464629; the CI db job reruns the database tests.
