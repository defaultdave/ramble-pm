# Lane w2-money history

## 2026-11-10 (first chat)
Claimed the lane, ran U-056 (4 rounds, PR 935 merged `2e9b805`), U-106 (6 rounds, PR 937 merged `b001c83`), U-055 (6 rounds, PR 944 open, head `a801f1a`).

### Lessons to carry into every builder brief
- Every domain decision (comparison, threshold, state rule, mapping to a domain result, including error-to-outcome and gate outcomes) is a plain tested `src/lib` function; the data layer and actions only fetch, lock, persist and act on the lib verdict (architecture B2). Display copy too: components render what lib returns.
- No `catch` that returns or recovers a value (B13): read the provider first and decide beforehand; let errors propagate. No lock on a row the `locks.ts` plan takes alone; use a status-guarded write under the order lock. Parse every exported entry's input with Zod (B5). A server action's data-layer function takes a value only the token check can produce (B6).
- No new client island without Dave's approval (B8): use a server-rendered form.
- One shared helper per concept (B17): search `src/lib` and `src/server` by concept before writing; extract the shared one when a copy would be needed.
- The review agent mutates every branch: write tests that pin each branch (boundary minute, one minor unit either side, a second row of the same kind untouched, app-clock skew vs database clock, lock waits with `raceAgainstOpenTransaction`, every status in a constant by iterating the constant, stubbed ports for refusals).
- Test files under the 800-line hard limit: new tests in new files.
- Builders run Chromium only with the sandbox off (e2e, Storybook); QA agents cannot.
- Parallel lanes land on `main` while you work: rebase before the checks and again before posting.

### Process notes
- Round count: the architecture audit (haiku) finds new instances each round; the cap in DECISIONS 2026-11-10 (after round 4 its findings are follow-ups) was not applied here. Apply it.
- Posting: `post-check.ts` for the four checks on the head SHA copied from `git rev-parse`; verdicts from an earlier head may be reposted only when the source is identical (tests-only commits), saying so in the summary.


## Moved from STATUS.md 2026-11-11 (chat 1 Next chat block)
### Next chat: w2-money

**Before you start (Dave):** approve PR 944 (U-055, `human-read`). **Run:** `/ramble-pm lane: w2-money`, Sonnet, medium. **Prompt:** Lane `w2-money`, continue W2-B from `drafts/mvp-replan-2026-11-10.md` (section 4 Wave 2 and the section 2 rows): U-057 (move a booking: same-price date of the same experience only, depends on U-055) then U-059 (session cancellation fan-out: `cancelSession` in a new `db/cancelSession.ts` calling existing hold release, no edits to `sessions.ts` or `holds.ts`; one full refund per order via `requestRefund`; email with other dates; the `session_cancelled` branch in `db/refundPath.ts` replacing the stub; no commission return). U-059 depends only on U-056, so start it now in parallel if PR 944 is still waiting. First check `git ls-remote` and `gh pr view 944` for U-055, set U-055 Done on board #19 when merged (item id from `gh project item-list 19`), remove its worktree and branches. Pipeline per unit: overlap check, `senior` builder in a worktree of the ramble checkout (base `origin/main`), then `review` (mutation proof), `spec-compliance`, `architecture-audit`, `qa`, `scripts/merge-desk/agent-git.ts push|pr|review|automerge` and `post-check.ts`, board In Progress on pickup. Put the lessons in `lanes/w2-money.md` into the builder brief from the first commit (decisions in tested `src/lib`, no recovering `catch`, no new client island, B5 parse at every entry, mutation-proof every branch, one shared helper per copy, tests in new files under the 800-line limit). **Apply DECISIONS 2026-11-10: architecture-audit findings after its fourth round are follow-ups, not more rounds**; bring only blocking review-agent findings to the builder after that. Don't touch `db/sessions.ts` (host lane) or CLAUDE.md. Scripts that read `~/.config/ramble-agents/app.conf` need the sandbox off, one command at a time. Done = U-057 and U-059 merged or waiting on Dave's read, the lane entry and this block updated, handed off. Publish with `bun scripts/pm/site.ts publish`.

