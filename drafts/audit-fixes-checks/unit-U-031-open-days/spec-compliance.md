PASS

## spec-compliance: U-031 "open-days" (head 6fa7ae5)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- AC 3 was verified by reading the test (tests/db/browse.db.test.ts:773-798) and the SQL (src/server/db/browse.ts:108, 120, 249), not by running it. The PM reports the run and the mutation check.

### Acceptance criteria
1. PASS. `spacesLeft` (src/lib/spaces.ts:7-9) and `hasSpaceLeft` (src/lib/spaces.ts:12-14) exist. `hasSpaceLeft` is `spacesStatus(spacesLeft(s)) !== 'sold-out'`, so sold out means 0 or fewer left. Unit tests in src/lib/spaces.test.ts:29-63, including a case that checks agreement with `spacesStatus`.
2. PASS. `hasSpace = sql\`seats_sold < allocation\`` (src/server/db/browse.ts:105-108), with a comment naming `hasSpaceLeft` in `src/lib/spaces.ts`. Applied only in `hasSessionOn` (browse.ts:120) and `listBrowseDayRows` (browse.ts:249). `listBrowseExperiences` without a date gets `hasSessionOn` returning undefined (browse.ts:111), so the unfiltered listing is unchanged.
3. PASS. tests/db/browse.db.test.ts:773-798. Day 2026-11-07 holds a sold-out session (4 of 4) and an allocation-0 session, and is neither offered nor matched. Day 2026-11-08 holds 3 of 4 sold (one space left) and is both offered and matched.
4. PASS. src/lib/home.ts:9 imports `hasSpaceLeft` and line 238 replaces the `spacesStatus(...)` expression with `hasSpaceLeft(session)`. `spacesStatus` has no other use in home.ts. The diff touches no other line in home.ts.
5. PASS. src/lib/seed/coverage.ts:3 imports the lib `spacesLeft`, and the local definition is removed. `spacesLeft` is used at lines 397, 418-420, 431, 442. The date-filter mirror `browseResults` applies `hasSpaceLeft(x)` at line 162.
6. PASS. No comparison operator changed in the diff. The `>=`, `<`, `>`, and `<=` lines in home.ts (around 233-236) and coverage.ts (around 160-161) are unchanged.
7. PASS. docs/runbooks/browse.md:41 adds one sentence: a day is offered on the calendar, and a date matches an experience, only through a session that day with space left.
8. PASS. The seven changed files are docs/runbooks/browse.md, src/lib/home.ts, src/lib/seed/coverage.ts, src/lib/spaces.test.ts, src/lib/spaces.ts, src/server/db/browse.ts, and tests/db/browse.db.test.ts. All are in the manifest. The coverage test file is allowed but unchanged.

SPEC_COMPLIANCE_VERDICT=APPROVE
SPEC_COMPLIANCE_FAILED_ACS=0
