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

## 2026-11-21, bug finder built (agents-cloud chat)
- One builder (Sonnet) in worktree `ramble/.claude/worktrees/nightly-fix`; commit `3b17e96` on local `pm/nightly-fix-agent` (parent `41c1f94`, ADR 0011). Files: `docs/adr/0012-bug-finder.md` (Proposed), `docs/adr/README.md` row, `.github/workflows/bug-finder.yml` (workflow_dispatch, input `area`; jobs area, investigate, verify, file; only `file` holds the App credential), `scripts/bug-finder/` (area, file, both tested; two prompts), `scripts/nightly-fix/pick.ts` +12 lines (`- Unit: U-xxx` on finder-labelled App tickets, checked against units.yaml). `nightly-fix.yml` unchanged. PM checked: files match the manifest, `bun test scripts/bug-finder scripts/nightly-fix` 76 pass, no schedule.
- Not checked: actionlint (not installed; both files parsed with Bun.YAML), tsc and eslint (no node_modules in the worktree). Never run on Actions.
- Open questions the builder settled (recorded in the ADR): duplicate check is open and closed `audit` issues with the same file and overlapping lines, or the same title; unknown unit or off-limits file is still filed with `needs-owner`; the workflow builds and starts the seeded site (db:http shim, `pnpm start --port 3101`) before the agent runs, the least certain step. Flagged: the day-number area rotation visits only 4 of 8 trees on an every-second-day schedule; fix before adding a schedule.
- Needs: secrets `ANTHROPIC_API_KEY`, `RAMBLE_APP_ID`, `RAMBLE_APP_INSTALLATION_ID`, `RAMBLE_APP_PRIVATE_KEY`; repo variable `CLAUDE_CODE_VERSION`; labels `finder`, `needs-owner`, `nightly-fix` (`audit` exists).
- Owner commands, in order:
  1. `git -C /Users/davidfleming/Workspace/ramble push -u origin pm/nightly-fix-agent`
  2. `gh pr create --repo defaultdave/ramble --base main --head pm/nightly-fix-agent --title "PM bookkeeping: ADR 0011 nightly fix agent and ADR 0012 bug finder" --body "Proposes ADR 0011 and ADR 0012 with their workflows (hand dispatch only) and scripts. Tests: bun test scripts/bug-finder scripts/nightly-fix, 76 pass."`
  3. `gh pr merge <n> --repo defaultdave/ramble --merge --admin`
  4. `gh label create finder --repo defaultdave/ramble`; same for `needs-owner` and `nightly-fix`
  5. After both ADRs are accepted: the four secrets and the variable, then `gh workflow run bug-finder.yml --repo defaultdave/ramble -f area=checkout` (then `area=ops`, `area=browse`). Label one good finding `nightly-fix` and run `gh workflow run nightly-fix.yml --repo defaultdave/ramble`.
- For the lead: Blocked item 5 now means one push, PR and bypass merge carrying both ADRs, plus the labels and secrets above; ADRs 0011 and 0012 wait on the owner's acceptance.
- 2026-11-21 10:40, at the owner's "run these": branch pushed (`3b17e96`), PR 1051 opened with the owner's login, labels `finder` and `nightly-fix` created (`needs-owner` already existed). The `--admin` merge was left to the owner (hard line).
- 2026-11-21: owner bypass-merged PR 1051; worktree `nightly-fix` and branch `pm/nightly-fix-agent` removed (local and remote). For the lead: Blocked item 5 is now accept ADRs 0011 and 0012, then the four secrets and `CLAUDE_CODE_VERSION`, then the first dispatch.
- 2026-11-21 11:00, first dispatch `area=checkout` (run 44921974659): `area` passed; `investigate` got through migrate, seed, build and site start (the risky step works), then stopped at Install Claude Code: `CLAUDE_CODE_VERSION` unset. None of the four secrets is set either (repo has only NEON_API_KEY, NEON_PROJECT_ID, PULSE_SECRET, PULSE_URL). Next: owner sets the variable (2.1.330, latest on npm today) and the four secrets, then re-dispatches.
- 2026-11-21 11:15, second dispatch (run 44922924694, checkout): success, 3 min, nothing filed. Pipeline proven end to end. Investigator stopped at 9 of 60 turns, $0.13, without Playwright or the payment form and actions; its own none admits it. Prompt says a none is a good result and sets no coverage floor. Proposed: a coverage floor in `investigate-prompt.md` (read every file the README lists, one Playwright run of the money path at Pixel 7 before a none). Logged in `audits/finder.md`.
- 2026-11-21 11:30: owner said yes to the coverage floor. PR 1052 (`pm/finder-coverage-floor`, `9fbdbff`, prompt only) opened as the App, review requested; scope-manifest will likely fail on a scripts/ change from a pm/ branch, so expect a bypass merge. Then re-dispatch checkout.
- 2026-11-21 12:10: PR 1052 merged (floor, plus prettier on bug-finder.yml, which 1051 had left failing format:check on main). Run 44927399230: real walk, no bug, INCOMPLETE at 32/60 turns. Turn-budget fix opened as a second prompt PR.
- 2026-11-21 13:10: PR 1053 merged. Run 44932982530: floor met, 41 turns, $0.48, none. Owner asked if a known bug exists: none, so recall is unmeasured; proposed a planted-bug canary on a pm/finder-canary-* branch dispatched with --ref. Two leads: seeded seats run out under repeated holds; back after pay shows checkout with a live timer (agent judged harmless, unverified).
- 2026-11-21 13:30: three canary branches planted (key in private memory), dispatched together. None scored: canary-2 cancelled by the concurrency group, canary-1 and canary-3 is_error (reason not logged; likely key spend cap, about $1.24 spent today). Fix commit on local pm/finder-run-errors (per-ref concurrency, log subtype and result); a .github change, so the owner pushes and bypass-merges.
- 2026-11-21 13:50: cause confirmed by the owner: the Anthropic organization's monthly spend limit was $1 ($1.23 spent), not credits ($310 promotional left). Owner raising it.
- 2026-11-21 14:00: canary round 2 scored (key in private memory). Caught 1 of 3 (a11y). Missed money (payment start check, needs a started session or a close read) and layout (clipped, not overflowing). Both missing runs found and confirmed a real main bug (Back after paying leaves a dead-end checkout), unfiled due to two file.ts faults: lines must be one range; duplicate check matches any overlapping lines in the same file (false hit on #777). #1055 is a canary-only ticket for the owner to close. Spend today about $3.
- 2026-11-22: PR 1056 (`pm/finder-file-lines`): line lists accepted, duplicate needs a similar title; 79 tests pass. Owner asked for the prompts and findings: `drafts/finder-prompts-and-findings-2026-11-21.md`. Own mistake: `audits/finder.md` and this lane file, both public, describe the planted bugs, and the finder can curl; reruns of the money and layout types need fresh plants with an unpublished key.
- 2026-11-22: scoring corrected in `audits/finder.md` (1 caught, 2 unscored because the Back bug masked them). Owner asked whether the prompt is too verbose and whether to use Copilot; recommendation: trim after a fair baseline, keep Claude for finding, Copilot as a later A/B.
- 2026-11-22: published prompts compared at the owner's request: `drafts/finder-prompt-comparison-2026-11-22.md`. Recommendation: prompt B in our own words, Elastic's structure, our area and JSON, no git history, run on the same canary.
- 2026-11-22 12:55: owner merged PR 1056; worktree `finder-file` and its local branch removed. Run 45051374931 on `main` (`area=checkout`) filed #1057 (Back after payment), verifier CONFIRMED, $0.43. The fixer is on a schedule (`0 9 * * *`): run 45006004860 at 04:07 picked nothing because no ticket carries `nightly-fix`. Waiting on the owner: #1057 to the fixer or to a builder; prompt B yes or no; close #1055.
- 2026-11-22 13:30: the owner labelled #1057 and dispatched the fixer (run 45052314507). PR 1058 opened, all CI and agent checks green; qa passed and `qa-agent` posted by this lane. Waiting on the owner's review of 1058. Open: the two-tab route (`submit`, line 136) has no ticket yet; PR titles from the picker are cut at 60 characters; `CheckoutPage` order page showed two `<main>` right after paying on both builds (unexplained).
- 2026-11-22: the owner merged PR 1058, the fixer's first fix to land. Open with the owner: file the two-tab route or not, prompt B or not, close #1055.
- 2026-11-22: the owner closed #1055 (not planned). The duplicate check reads open and closed tickets, so a new plant near #1055's lines with a similar title is not filed: score canaries from the run's `finding` artifact, and plant elsewhere. CI on `main` after PR 1058 is green.
