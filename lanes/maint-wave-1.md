# Lane maint-wave-1

2026-11-01 night to 2026-11-02: Maintenance wave 1 (P01 to P07), all merged: 714, 716, 717, 718, 719, 720, 721.

- Overlap check at `1e55875`: P01 and P06 both edited the browse `page.module.css`; SC-2 moved to P16.
- Naming: `unit/U-xxx-maint-Pnn`, title `U-xxx: …`, owning standard unit per PR (P01 U-025, P02 and P03 U-018, P04 U-045b, P05 U-047b, P06 U-031, P07 U-001).
- Builders: seven `senior` agents in `.claude/worktrees/maint-Pnn`; P06 and P05 merged `main` twice because PRs 714 and 715 landed during the build.
- Gates run by the PM after each merge of `main`: gitleaks range, build with `DATABASE_URL` unset, `pnpm test`, `pnpm test:db` (under a lock, `ramble-maint-db.lock`), e2e under `ramble-wave3-e2e.lock` for P01, P05, P06.
- Review rounds: P03 needed a db-refusal test; P05 needed BC-30 part 3; P06 had a 768 px regression in the shared RetryAlert (fixed with a `fit` prop); P07 had wrong osv reasons and then lost its CLAUDE.md edit to `scope-manifest`.
- Reviewers ran `agent-git.ts review` and `automerge`; each PR showed MERGED within minutes.
