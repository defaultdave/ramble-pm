Posted on head 2139df3 (6fa7ae5 with main merged). This verdict was given on 6fa7ae5; a focused review of the merge passed (review-agent-merge.md), and the PM reran every gate on the merge commit, including all 733 db tests.

PASS

## review-agent: U-031 "Browse offers only days with space left (BE-7)" (head 6fa7ae5)

### Blocking
None.

### Non-blocking
- src/lib/seed/coverage.ts:142: the doc comment line now runs past the wrapped width the rest of the file uses (prettier accepts it). Rewrap when next touched.
- Seed coverage `browseResults` was edited but no coverage test or probe was added for a sold-out date. Acceptable: the manifest allowed it only "if a probe expectation changed", and the PM ran seed.db.test.ts green (92 passed).

### Checked, no defect
- Scope: 7 files, all in the IN SCOPE list. Window edges, sessionWindow.ts, src/lib/browse.ts, src/server/db/home.ts, holds, docs/plan untouched. In db/browse.ts the condition is added only in hasSessionOn and listBrowseDayRows (the `shown` expression).
- Unfiltered listing unchanged (no date: no space condition). It stays consistent with the design doc, which says a sold-out session is still shown with a sold-out state (spacesStatus 'sold-out'), and the empty states: an experience with no space is still found by category, and a sold-out day simply is not offered. Pinned by the third db test "still lists an experience with no space left when no date is chosen".
- SQL mirror: `seats_sold < allocation` is exactly `hasSpaceLeft` (spacesLeft > 0). Allocation 0 gives 0 < 0 false, matching the lib; both cases are in the db test (allocation 4 sold 4, allocation 0 sold 0). Seats_sold above allocation cannot exist: sessions_seats_sold_within_allocation CHECK (migration 0007 snapshot, design doc section 4.2.2), so the unit test row {8 allocation, 9 sold} is a lib-only case and the two agree on every reachable row.
- Mixed day (one sold out, one with space) is offered and matched through the session with space: db test 2. Mutation by the PM (fragment replaced by `true`) fails test 1.
- Seed coverage mirror: `hasSpaceLeft(x)` sits in the same session predicate as scheduled/window/localDate, matching `listBrowseExperiences`, and the doc comment says so. `spacesLeft` is now imported from src/lib/spaces.ts and the local copy removed, so no duplicate definition remains. coverage.ts's other `spacesLeft(x)` uses (lines 397 to 442) keep their meaning.
- Other deciders of a day: `browseDays` (src/lib/browse.ts) only turns the rows listBrowseDayRows returns into days, so it inherits the filter; the empty-state "next day" works from the same days, so it no longer suggests a sold-out day. The only callers of listBrowseDayRows/hasSessionOn are src/server/browse.ts and listBrowseExperiences. The calendar's disabled days come from that same list. No disagreement found. src/server/db/home.ts is out of scope and untouched; its rule now goes through hasSpaceLeft in src/lib/home.ts (one expression, same result as the old `!== 'sold-out'`).
- Duplication sweep: no other `allocation - seatsSold` computation in src/lib, src/server, src/components (seed/plan.ts `seatsSoldFor` is the inverse, a seed builder, not a rule). The SQL fragment is the single named mirror, with a comment naming the lib function. Runbook sentence added.
- Defect classes: no new unbounded work (the existing caps on the day queries stay), no failing open, no logging, no schema or Zod change.
- Comments: none name a ticket.

### Unconfirmed
- DB tests (browse, home, seed) not run here (no Postgres in the sandbox); relied on the PM's run of 92 passed and the mutation result.

### Ran in the worktree
- pnpm test: 161 files, 3621 tests passed.
- pnpm typecheck: clean.
- prettier --check on the changed files: clean.
