# Notes of interest

Ideas Dave flagged to dig into later. Not decisions and not work items; each one says what caught his eye and where to start reading.

## Tests split by concern (2026-11-04)

**What caught his eye.** The test audit's size target (warn over 500 lines, fail over 800 once the splits land; TA-29) led wave W5 to split every oversized DB test file into one file per concern, for example `orders.db.test.ts` (1651 lines) into `orders-rows`, `orders-money-status`, `orders-items-attempts`, `orders-provider-refunds` and `orders-transfers`, each with a shared `<area>Fixtures.ts`. Dave had not seen tests organised this way before and likes it, with smaller files also fitting agents' context loading better.

**The open concern.** Tests can repeat across files more easily. What guards it today: each split is a reviewed pure move (same names and count before and after, bodies byte-identical), shared setup lives in one fixtures file per area, and W4 (TA-7) moved the copied `unique()` and insert helpers into shared helpers. What does not: drift after the split, where a new case lands in one file that another already covers. Candidate guard: a lint step that flags duplicate test titles across files of one split family, or a copy detector over `tests/db`.

**Trade-offs seen so far.** Faster suite (the db project runs files in parallel, `maxWorkers: 4`), failing file names say what broke, but each file pays its own seeding.

**Why Dave likes it (2026-11-04).** An agent working on one kind of test loads only the file it needs, so less context, and an agent running or checking tests has less to read. Files that grow too big lose focus, for people and agents alike.

**Ideas to follow up (2026-11-04).**
1. **A generated test map.** A script reads every test file and writes one index: file, `describe` blocks, test titles, and the "Behaviours under test" comment many db files already open with. Run it in `pnpm lint` beside `test-size.ts`, where it flags exact duplicate titles across a split family (`editorial-*`, `guests-*`). The analogy is TypeScript: types make duplicate shapes easy to find, and the map does the same for tests.
2. **A cheap "already covered?" check.** Before adding a test, a Haiku agent reads the map (not the test files) and answers whether the behaviour is covered and where. It catches near-duplicates the title check cannot, and the map keeps it cheap.
3. **One shared setup call.** PR 874's `openGuestsDatabase()` moves the per-file `beforeAll`/`afterAll` (fresh schema, HTTP shim, `DATABASE_URL`, dynamic imports) into the fixtures file, so each split file makes one call. The editorial split (PR 867) still repeats that block in all seven files. A generic `openTestDatabase()` in `harness.ts` would give every area the same call. Limit: `vi.mock(...)` stays in each test file, because Vitest hoists it per file. Separately, migrating once into a template database and copying it per file would cut the per-file seeding cost.

**Article angle.** AI writes a lot of tests and reviewers rarely read them in PRs. Research on what others say and on industry guidance: `drafts/reports/AI written test bloat.md` (notes behind it in `drafts/research_notes/AI written test bloat/`).

**Where to start reading.**
- `audits/test-audit-2026-11-03.md` (ramble-pm): the findings, the size target and the fix waves.
- PR 874 (`guests.db` into three files) and PR 867 (`editorial.db` into seven): examples of the splits.
- `tests/db/*Fixtures.ts`, `tests/db/harness.ts`, `vitest.config.mts`, and `scripts/test-size.ts` (the size warning, `ENFORCE_HARD_LIMIT`) in ramble.
- `### Lane: test-fixes` in `STATUS.md`: the lane's rounds and follow-ups.
