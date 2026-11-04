# Notes of interest

Ideas Dave flagged to dig into later. Not decisions and not work items; each one says what caught his eye and where to start reading.

## Tests split by concern (2026-11-04)

**What caught his eye.** The test audit's size target (warn over 500 lines, fail over 800 once the splits land; TA-29) led wave W5 to split every oversized DB test file into one file per concern, for example `orders.db.test.ts` (1651 lines) into `orders-rows`, `orders-money-status`, `orders-items-attempts`, `orders-provider-refunds` and `orders-transfers`, each with a shared `<area>Fixtures.ts`. Dave had not seen tests organised this way before and likes it, with smaller files also fitting agents' context loading better.

**The open concern.** Tests can repeat across files more easily. What guards it today: each split is a reviewed pure move (same names and count before and after, bodies byte-identical), shared setup lives in one fixtures file per area, and W4 (TA-7) moved the copied `unique()` and insert helpers into shared helpers. What does not: drift after the split, where a new case lands in one file that another already covers. Candidate guard: a lint step that flags duplicate test titles across files of one split family, or a copy detector over `tests/db`.

**Trade-offs seen so far.** Faster suite (the db project runs files in parallel, `maxWorkers: 4`), failing file names say what broke, but each file pays its own seeding.

**Where to start reading.**
- `audits/test-audit-2026-11-03.md` (ramble-pm): the findings, the size target and the fix waves.
- PR 874 (`guests.db` into three files) and PR 867 (`editorial.db` into seven): examples of the splits.
- `tests/db/*Fixtures.ts`, `tests/db/harness.ts`, `vitest.config.mts`, and `scripts/test-size.ts` (the size warning, `ENFORCE_HARD_LIMIT`) in ramble.
- `### Lane: test-fixes` in `STATUS.md`: the lane's rounds and follow-ups.
