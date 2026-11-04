# Test-bloat measurement (2026-11-04)

**Scope:** Dave's article on AI agents writing too many tests. A script indexed every test title on `main` at `37efb586c3ce87eb96338f9e3bc6090b27f29f1f` (4,086 tests in 385 files) and two models judged the 48 titles repeated across files. Nearly all were the same rule applied to different code, not copies. The write-up is in Dave's vault (`Writing/current/test-bloat/Measurement 2026-11-04.md`). One pair is worth acting on. Lane: `role-tests`. Source for every row: "test-bloat measurement 2026-11-04".

## Digest

Test tidiness is below the filing bar (DECISIONS 2026-11-04), so no ticket is filed; the fix goes straight to a PR (`U-001:` test-only).

| ID | Item | Lens | From | Size | Status |
|---|---|---|---|---|---|
| TB-1 | `tests/db/audit.db.test.ts:412` (`the insert-only guard`) and `tests/db/ledger.db.test.ts:476` (`the append-only guard`; moved to `tests/db/ledger-guard.db.test.ts:114` by PR 895 on 2026-11-04) each hold "can create the role a second time without failing, as a second schema or branch would". The bodies are identical apart from the role name. Each writes its own copy of the migration's `DO $$ ... CREATE ROLE ... EXCEPTION WHEN duplicate_object ... $$` block inline and runs it twice, so neither runs the real migration SQL (`0021_audit_log_guards.sql`, `0016_ledger_guards.sql`): if the migration's idempotency guard changed or broke, both would still pass. A weak test written twice. Fix: see the decision below. | code and DRY | test-bloat measurement 2026-11-04 | XS | open: fix PR [899](https://github.com/defaultdave/ramble/pull/899) in flight (checks posted, auto-merge queued) · ticket [#894](https://github.com/defaultdave/ramble/issues/894) |

## Decision (PM, 2026-11-04, Dave can overrule)

Drop both tests, do not rewrite them against the migration file. Why: `createFreshDatabase` in `tests/db/harness.ts` makes a schema per test file and applies every committed migration into it, while roles belong to the cluster. Every db test file after the first therefore runs the real role block with the role already present, so the real migration SQL is exercised about as many times as there are db files, and a broken guard fails the whole db suite, not two tests. A rewrite that reads the SQL back out of the migration file would add a parser and still prove less than that. The fix PR must show it: with the guard removed from `0016` and `0021` the db suite fails on the second file, and the dropped tests would not have noticed.
