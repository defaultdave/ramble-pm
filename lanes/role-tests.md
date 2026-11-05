# Lane history: role-tests

## Moved from STATUS.md, 2026-11-04 (size trim)

### Lane: role-tests

**2026-11-04 14:05 (PM role-tests).** TB-1 (`audits/test-bloat-2026-11-04.md`, ticket #894): the two "can create the role a second time" db tests ran an inline copy of the migration's role block, never the migration SQL. Decision (DECISIONS 2026-11-04, PM, Dave can overrule): drop both, because `createFreshDatabase` runs the real block in every db file against a cluster that already holds the role. PR [899](https://github.com/defaultdave/ramble/pull/899) (`unit/U-001-role-tests`, head `83ad1e1a25091fb137108ddf1822430f9d72d5ad`, base `main`, closes #894) deletes both tests and the header clause, two files, 2 insertions and 38 deletions. Four checks posted, review requested, auto-merge queued. Proof in the PR body: with the role block in `0016` or `0021` replaced by a bare `CREATE ROLE`, a db test file fails in `createFreshDatabase` (`role ... already exists`), and the deleted tests still passed on the same mutation. The first branch targeted `ledger.db.test.ts`; PR 895 (W10f) split it while the builder worked, so the builder rebased and the ledger test is now in `ledger-guard.db.test.ts`.

**For the lead.** (1) Set #894 Status Done on board #19 once 899 merges (the App cannot close issues). (2) Follow-ups logged, not built: `createFreshDatabase` leaks its schema when `migrate` throws (the `try/finally` only guards the migrator pool; three orphan `t_<hex>` schemas sit in the shared Postgres from the mutation runs, harmless, not dropped because they could not be told apart from other lanes' schemas); the exists branch of the role block is only exercised from the second db file onward, so a brand-new cluster relies on worker order (unchanged by this PR). (3) Remove the worktree `.claude/worktrees/agent-ab9e564c7607201f1` and branches `unit/U-001-role-tests` and `worktree-agent-ab9e564c7607201f1` once 899 merges. (4) The `test-fixes` lane's later waves (W5 to W7) touch neighbouring db files; none touches these two tests.

### Next chat: role-tests

**Before you start:** nothing. **Run:** none needed; the lane is done once PR 899 merges. **Model and effort:** Haiku, low, if you check it at all. **Prompt:** Check `gh pr view 899 --repo defaultdave/ramble --json state,mergedAt`. If merged, set #894 Done on board #19, remove the worktree and branches named in the lane entry, and mark TB-1 `merged` in `audits/test-bloat-2026-11-04.md`. If it is blocked on Dave's approval, nothing else to do. Don't commit in the ramble main checkout.
