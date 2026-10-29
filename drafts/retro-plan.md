# Retrospective and agent-log audit (planned)

Owner's ask, 2026-10-28: when the current work is done, (1) review everything: what could have been done better and what to improve; (2) audit the Claude Code logs for issues, and for what agents could have done to work faster and more accurately. Runs after the post-Prototype deep review (the home audit pass and its follow-ups), before new scope starts. Findings only; the owner picks what changes.

## Part 1: the project retrospective

Inputs already collected:
- `drafts/post-prototype-review-notes.md` (build observations since wave 2, the pending lessons)
- `audits/` (every audit item, with status)
- `DECISIONS.md` (every ruling and override, with dates) and `delta-log.md` (every departure from the frozen plan, with actuals per unit)
- board #19 (estimates against actual days, tokens, owner minutes)
- the frozen plan (`docs/plan/`, tag `plan-frozen-2026-10-20`) for what was predicted

Questions it answers:
- Plan against reality: estimates (units ran 60 to 95% under), the forecast's dates, the critical path, where the method was right or wrong.
- Process: the merge desk, tiered auto-merge, promotions and syncs, review rounds per unit, the rules files, the owner's time.
- Product and code: what the audits found, which directions to change, what to stop doing.
- Owner experience: how many asks, decisions, and interruptions; what should have been batched or avoided.

## Part 2: the Claude Code log audit

Where the logs are (on the owner's Mac, never published raw):
- `~/.claude/projects/-Users-davidfleming-Workspace-ramble*/`: one folder per checkout or worktree that ran a session; `*.jsonl` per session; `<session>/subagents/workflows/<run>/journal.jsonl` plus `agent-*.jsonl` per workflow agent. On 2026-10-28: 29 session logs and 42 workflow runs across 8 folders.
- `~/.claude/bin/token-audit` (per-agent token use; it does not see workflow subagents, so workflow journals are read directly).

What to measure, per unit and per agent role:
- Rounds per unit, and which defect classes were found late (B2 decisions surfacing round by round was the wave 2 and 3 pattern).
- Wall-clock, tokens (input, output, cache writes), and idle time waiting on gates, locks, or the owner.
- Tool errors and refusals: permission denials, the worktree write guard, sandbox refusals (`gitleaks git`, `env -u`), hook blocks, and how agents responded (stopped and reported, or worked around).
- Rework: fixes that were reverted, findings that were wrong, reviews repeating work another check already did, fixers that stalled.
- Accuracy: claims in reports that a later check contradicted, invented values (the two hand-typed SHAs), instructions misread.
- Orchestration: workflows launched from the wrong folder, worktrees cut from the wrong repo, merges of `main` that broke a reviewed unit without a textual conflict.

Seed evidence from the 2026-10-28 session (to verify against the logs, not assume):
- Two workflow launches carried a hand-typed, wrong full SHA and were stopped (U-031, the U-021a follow-up).
- A fixer stopped at the worktree write guard instead of working around it (U-010 round 2); earlier fixers on another unit had written through Bash.
- A workflow launched from the ramble-pm checkout gave a fixer a ramble-pm worktree; the fixer stopped without changes.
- The PM's own sync-PR verdicts were refused as self-approval; four reviewer agents verified the sync instead.
- A merge of `main` broke U-031 with no textual conflict (a read it deleted was called by a newly merged seed test).
- The browse "empty unless a future date" report cost three fix rounds before the owner confirmed it was a dated search (H-8); the question to the owner could have come first.
- A PM-directed rewording outside the fixer's scope line failed review (U-021a round 4).
- Sandbox refusals forced substitutes (`gitleaks detect` for `gitleaks git`, no `env -u`).
- The home audit pass ran one performance agent through 48 Lighthouse passes in sequence (about 35 minutes), and the workflow waited for every lens before verifying any, so findings from the fast lenses sat idle. Split performance per variant and pipeline verification (owner, 2026-10-28).
- Tokens per unit this session: U-030 5.42 M, U-021a 5.01 M, U-031 6.83 M (plus later rounds), U-010 2.16 M, U-039 1.98 M.

Output: one ranked report: what to change in the agent rules, briefs, workflow scripts, permissions, and the PM's own behaviour, each with the evidence (log, session, or PR) behind it.
