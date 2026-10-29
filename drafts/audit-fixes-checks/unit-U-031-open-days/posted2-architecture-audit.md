Reposted on head 2c87cba: main merged again (the lib-refactor PRs B, C and E touched the same import lines). The two conflicts were import lines only, resolved as unions, with spacesStatus dropped from home.ts where it became unused. Net diff against main is unchanged (7 files, +122 -7). The PM reran every gate on 2c87cba: format, lint, typecheck, knip, 3719 unit tests, all 733 db tests, build, gitleaks.

Posted on head 2139df3 (6fa7ae5 with main merged). This verdict was given on 6fa7ae5; a focused review of the merge passed (review-agent-merge.md), and the PM reran every gate on the merge commit, including all 733 db tests.

PASS

## architecture-audit: U-031 "open days" (head 6fa7ae5)

Rules: `.claude/standards/architecture.md` (project), B1 to B17.
Files audited: src/lib/spaces.ts, src/lib/home.ts, src/lib/seed/coverage.ts, src/server/db/browse.ts, src/lib/spaces.test.ts, tests/db/browse.db.test.ts, docs/runbooks/browse.md

### Blocking
None.

### B2 decisions in the data layer this round (complete list)
1. src/server/db/browse.ts:108 `hasSpace` (`seats_sold < allocation`), used at :120 (`hasSessionOn`, the date filter) and :249 (`listBrowseDayRows`, the calendar). This is the only new decision in the data layer. No other comparison, threshold, `.filter`, `.sort`, `.reduce`, or state rule was added in `src/server/` or `src/app/`. `src/server/db/home.ts:64-65` only selects the two columns and hands them to `src/lib/home.ts`, where the decision sits.

Ruling on it: not blocking. It is a SQL `WHERE` fragment, and B2 says in so many words that `WHERE` and `ORDER BY` clauses are not decisions. It is read-side and takes no caller, as with `sessionLocalDate` (browse.ts:73). It does decide "sold out" in the domain sense, so it is not a pure visibility filter. A SQL predicate cannot call a `src/lib` function, so the mirror is the only way to keep the day queries in the database. The PM's ruling (lib-refactor plan, 2026-10-29) covers it, and lib-refactor PR D folds it into `isOpenSession`.

### Non-blocking
- src/server/db/browse.ts:105-108: the mirror is guarded by an indirect pin. tests/db/browse.db.test.ts:773 runs fixed cases (full, allocation 0, one space left, mixed day) through the SQL. spaces.test.ts:56-64 pins `hasSpaceLeft` against `spacesStatus`. Nothing runs the two over the same inputs, so they agree only because both suites use similar rows. Cheap hardening in PR D or earlier: a db test that iterates `{allocation, seatsSold}` pairs and asserts `hasSpaceLeft(pair)` equals whether the session appears. Not required for this unit.
- Mirror hand-off: the comment at browse.ts:105 does not carry a `TODO(U-xxx)` naming PR D. That is not required by any rule (it is not a B7 case). It would help the unit that consolidates into `isOpenSession` find the duplicate.
- src/lib/seed/coverage.ts:142 (the comment): the line runs past the wrap used elsewhere in the file. Prettier-level only.

### B7: production callers
- `hasSpaceLeft`: src/lib/home.ts:238 and src/lib/seed/coverage.ts:162. Production code, not only tests.
- `spacesLeft`: called inside `hasSpaceLeft` (spaces.ts) and at src/lib/seed/coverage.ts:397, 418-420, 431, 442. It replaces the file-local `spacesLeft` that coverage.ts had, so it is a promotion with callers, not an export for a test. Pass.
- `SessionSpace` is type-only and not exported.

### B17: duplicate search
Searched `src/lib`, `src/server`, `src/components`, `src/app` for sold out, spaces, seats, allocation, capacity, `seatsSold`, `seats_sold`.
- The only prior helpers are `spacesStatus` and `spacesLabel` (spaces.ts), and `timeSlotState` (src/lib/timeSlot.ts), which calls `spacesStatus`. `hasSpaceLeft` is built on `spacesStatus`, so it reuses it and does not repeat the threshold.
- The old inline `allocation - seatsSold` in home.ts and the file-local `spacesLeft` arrow in coverage.ts are removed by this diff. That is a reduction in duplication.
- `seatsSoldFor` in src/lib/seed/plan.ts:35 computes seats sold from spaces left. It is the inverse and clamps for seeding, so it is not a duplicate.
- `checkAllocationChange` (src/lib/sessions.ts:241) compares a new allocation to seats sold for a host edit. That is a different decision.
- Components (`TimeSlot`, `BookingBar`, `BookingPanel`) take `spacesLeft` or a `sold-out` state as props and decide nothing.
- The one remaining repeat is the SQL fragment against `hasSpaceLeft`. It is intentional, documented, tested, and covered by the PM ruling.

### Other rules
- B1: no database call added outside `src/server/db/`. B4: `src/lib` imports only `src/lib` (`@/lib/spaces` from `lib/seed`). B6: the day queries are guest-visible reads with no caller, exempt. B12, B13: nothing touched. A4: same finding as B17, clean.
- Docs: docs/runbooks/browse.md states the rule and names both sides of the mirror.

Evidence: none relied on (static audit).

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
