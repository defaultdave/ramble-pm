# Lane: agents-cloud

Moving the agent jobs off the owner's Mac. Opened 2026-11-18 from a side chat (not a PM chat), recorded 2026-11-19 at the owner's request so the PM knows what exists.

## Live: cloud nightly audit (2026-11-18)

- **Routine:** "Ramble nightly audit (cloud)", a Claude Code cloud routine on the owner's subscription: https://claude.ai/code/routines/trig_019AVDCqk2jbtu79azLejPE2
  - Daily at 07:30 UTC (02:30 New York in winter), Sonnet, no connectors, Default cloud environment.
  - Clones `ramble` and `ramble-pm` fresh each run.
- **What it does, all hard limits:**
  - Gates on `git log origin/main --since='24 hours ago'`; no merges, no report.
  - Drops PM bookkeeping, promotion and sync PRs; audits at most the 15 largest code PRs and lists the rest as not covered.
  - Three code-reading lenses (architecture, code and DRY, accessibility when UI files changed), one verifier. At most four subagents, 45-minute cap.
  - Applies the 11-04 filing bar and the record format in `audits/README.md`, with a duplicate check against earlier files.
  - Pushes branch `audit/nightly-<date>` to `ramble-pm` (the report and its README row). Never `main`, no issues, PRs, check runs or comments.
- **Not covered compared with the local audit:** the visual and performance lenses (need Docker and a seeded database), and ticket filing (`tools/audit-tickets.ts --run` stays a lead step).
- **Pushes go through the Claude GitHub connection, not the `defaultdave-agents` App.** Fine for an audit branch in this repo; the reason the fix agent below uses Actions instead.

### Test run, 2026-11-18 19:16 UTC
- 3 minutes, 6 PRs (1041, 1042, 1044, 1045, 1046, 1047), none left out.
- 1 item: N1118-1 (B6, `authPurge.ts` deletes with no `Caller`). Resolved by PR 1048 (owner's bypass merge, `cfc4662`), which extended the B6 exemption.
- 6 digest rows, N1118-2 to N1118-7. N1118-7 (no log on the `unknown` client key) is probably a duplicate of the wave 3 audit; watch the duplicate check on the next nights.
- Branch `audit/nightly-2026-11-18` pushed, not merged.

## Drafted, not pushed: nightly fix agent (ADR 0011, Proposed)

- In `ramble`, worktree `.claude/worktrees/nightly-fix`, branch `pm/nightly-fix-agent`, commit `41c1f94` on `d4751af`. Local only.
- `.github/workflows/nightly-fix.yml` (09:00 UTC): a picker script chooses the lowest open App-filed ticket labelled `audit` and `nightly-fix`; Claude Code (Sonnet, 60 turns) fixes it on a runner with no GitHub credential; a fresh runner applies the patch, runs a size guard (6 files, 300 lines, no off-limits files) and opens the PR as the App with `Closes #n`; three read-only Claude checks post `review-agent`, `spec-compliance` and `architecture-audit`. No `qa-agent`, no auto-merge in v1.
- Files: `docs/adr/0011-nightly-fix-agent.md`, `scripts/nightly-fix/` (`pick.ts`, `guard.ts`, `fix-prompt.md`, `check-prompt.md`, `pick.test.ts`, 14 passing). Never run; flags and JSON fields are unverified until the first dispatch.
- **Owner steps before it can run:** push and open the PR (bypass merge, it touches `.github/` and `docs/adr/`); secrets `ANTHROPIC_API_KEY` (dedicated, spend-capped), `RAMBLE_APP_ID`, `RAMBLE_APP_INSTALLATION_ID`, `RAMBLE_APP_PRIVATE_KEY`; variable `CLAUDE_CODE_VERSION`; label `nightly-fix`.
- **First ticket:** N1111-11 (U-032, standard; browse zero-result suggestions cached by the raw filters, `BrowseContent.tsx:77`, from PR 930). Already moved to Items in `audits/nightly-2026-11-11.md` and in `ticket-titles.json`; not filed. To file: `bun tools/audit-tickets.ts --run`, then label the issue `nightly-fix`.

## For the lead
1. Owner decides whether to turn off the local scheduled task `ramble-nightly-audit` on the Mac. Until then two audits run each night; prefer the cloud report and drop the duplicate rows.
2. Merge the `audit/nightly-*` branches into `main` after reading them; mark N1118-1 resolved by #1048. Each night's branch is separate.
3. `~/.claude/scheduled-tasks/ramble-nightly-agent-review/SKILL.md` has two wrong paths: `.claude/agent-memory/ramble-pm/MEMORY.md` (private notes are in `agent-memory-local`) and `scripts/plan/site.ts` (now `scripts/pm/site.ts`). Not fixed.
4. `token-audit` cannot see cloud routine runs; read cost from the routine's run log.

## 2026-11-21, why no nightly since 11/18 (agents-cloud chat)

State of each nightly job:

| Job | Where | State | Last run |
|---|---|---|---|
| Ramble nightly audit (cloud) | claude.ai routine `trig_019AVDCqk2jbtu79azLejPE2`, 07:30 UTC | on; no report since the 11/18 test run, by design (below) | test run 2026-11-18 19:16 UTC |
| `ramble-nightly-audit` | desktop scheduled task, `30 2 * * *` | **off** (`enabled: false`) since the owner stopped automatic runs, DECISIONS 2026-11-13 | 2026-11-13 07:47 UTC |
| `ramble-nightly-agent-review` | desktop scheduled task, `0 3 * * *` | **off**, same decision | 2026-11-13 08:37 UTC |
| Nightly fix agent (ADR 0011) | ramble branch `pm/nightly-fix-agent` `41c1f94`, local only | parked; owner has not taken it up | never run |

- **Cloud, 11/19 skipped by design (from the repo; the run log itself was not read, this chat has no routine or browser tool).** The only merge in the 07:30 UTC window was PR 1048 (`cfc4662`, 03:43 UTC), from `pm/b6-auth-purges`, changing one line of `.claude/standards/architecture.md` and no product code. The routine drops PM bookkeeping, promotion and sync PRs; the 11/18 test run dropped PR 1043 (`pm/owner-pack`) the same way. With nothing left to audit it writes no report. 11/20 and 11/21: no merges to `main`, so the 24-hour gate stopped them. Routine prompt not changed. To confirm: the 11/19 run on the routine page should end with a no-code or no-audit line; if it shows an error instead, reopen this lane.
- **Local tasks, why silent:** both disabled in the desktop app's schedule store (`scheduled-tasks.json` under the app's `claude-code-sessions` folder): owner's 2026-11-13 decision. The 11-18 note "the local nightly audit stays on" (DECISIONS line 380, Blocked item 5) was wrong; there has been one audit a night (cloud) since 11-18, not two.
- **Keep the local audit?** Owner, 2026-11-21: leave it off (DECISIONS). Was the owner's call: Off, the project has no visual or performance lens; those need Docker and a seeded database, which the cloud run lacks. Re-enabling costs a Mac session per night with merges (it skips nights without) and duplicates the three code lenses the cloud run already covers.
- **Agent-review task paths** (`~/.claude/scheduled-tasks/ramble-nightly-agent-review/SKILL.md`), matter only if it is re-enabled: line 9 `.claude/agent-memory/ramble-pm/MEMORY.md` to `.claude/agent-memory-local/ramble-pm/MEMORY.md` (and the public memory now lives in `ramble-pm/memory/MEMORY.md`); line 42 `bun scripts/plan/site.ts publish` to `bun scripts/pm/site.ts publish`.

### For the lead (2026-11-21)
1. Correct `## Blocked on Dave` item 5: drop the 11/19 run-log check (skipped by design) unless the owner finds an error in the log; replace "turn off the local `ramble-nightly-audit` task" with nothing: the owner kept both local tasks off (DECISIONS 2026-11-21); the path fix applies only on re-enable.
2. Public memory: the cloud nightly audit skips nights whose merges are only `pm/` bookkeeping or standards PRs, and a skipped night leaves no branch, so a missing `audit/nightly-<date>` branch is not by itself a failure.
3. Done by the lane: DECISIONS 2026-11-21 records the owner keeping the local tasks off and corrects the 11-19 entry.

## 2026-11-21, bug finder designed
- Owner asked for a bug finder and fixer pair. Owner calls: GitHub Actions, opt-in per finding (DECISIONS 2026-11-21). Design: `drafts/adr-0012-bug-finder.md`. It reuses ADR 0011's runner split and secrets, and the fixer's picker gains a `Unit:` line for finder tickets.
- Next: a builder adds ADR 0012, `bug-finder.yml` (dispatch only) and `scripts/bug-finder/` on local branch `pm/nightly-fix-agent`, so one owner bypass merge carries both. Block: `### Next chat: agents-cloud` in STATUS.md.
- For the lead: Blocked item 5's fix-agent bullet now covers both agents (one PR, same secrets, plus a `finder` label); finder tickets are recorded in `audits/finder.md` when folded (open question in the draft).
