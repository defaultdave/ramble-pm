# Token review: Claude Code sessions, 2026-10-29

Source: `~/.claude/bin/token-audit --since 2026-10-29 --project ramble` (18 sessions, 6,986 model calls, about $580 at client-side prices) plus a per-session profile of the transcripts (context per call, tool output sizes, polling, status-file reads). Costs are estimates; the ranking is what matters.

## Where the tokens went

| Bucket | Cost | Share | What drives it |
|---|---|---|---|
| Orchestrator chats (the PM lanes, "interactive") | $356 | 61% | 2,335 calls reading 903M cached tokens: long chats with a large context, re-read on every turn |
| Builders (`senior`) and general-purpose agents | $84 | 14% | Sonnet, about 220K context per call for builders |
| Checks (`review`, `qa`, `spec-compliance`, `architecture-audit`, `a11y-audit`) | $140 | 24% | Four to five checks per round per unit, several rounds per unit |

By model: Opus $299 on 1,898 calls (average context about 400K tokens per call), Sonnet $174, Haiku $66, Fable $41. The orchestrators ran on Opus although the PM agent is defined as Sonnet: a desktop `/ramble-pm` chat runs on whatever model the chat picker holds.

The four biggest sessions were all lane orchestrators: e2e-money ($174; 1,280 calls; average context 512K, peak 965K), the deep-review lead ($91; 547 calls; average 428K), audit-fixes ($68; 1,040 calls; average 462K), lib-refactor ($38; 520 calls; average 348K).

## Findings, largest saving first

1. **Orchestrator context grows without limit.** Cost per turn is the whole context. Each lane's chat ran 500 to 1,300 turns and its context reached 600K to 965K tokens; every agent notification, poll and status edit re-read all of it. Fix: a lane hands off to a fresh chat when its context passes about 250K tokens, or after each unit lands, whichever comes first. The hand-off already exists (Next chat block); only the trigger is new. Expected saving: about half of the orchestrator cost.
2. **Orchestrators run on Opus.** Dispatching agents, posting checks and recording status is Sonnet work by the PM's own tiering rule. Fix: lane chats start on Sonnet; Opus only for a design call or an estimate, in its own chat. Combined with (1), the orchestrator bucket could fall from about $356 to under $100 a day.
3. **Every chat starts at 99K tokens before any work.** The fixed load is the system prompt, every connected tool's instructions (Vercel's 200-plus tools, Figma, Gmail, finance and other connectors), the skills list, both CLAUDE.md files and memory. It is paid on every one of the 6,986 calls. Fix: turn off connectors that Ramble work does not use in Ramble chats (finance data, Gmail, Drive, Docs, iOS simulator, computer use), and keep the Vercel plugin off except in deploy chats. Worth measuring after one change: each 10K tokens cut from the baseline saves about 70M cache reads a day at today's volume.
4. **`STATUS.md` is 122 KB and is read again and again.** The lane sections are append-only logs (each entry 1 to 2 KB); e2e-money touched the file 51 times, audit-fixes 32, the lead 29. Fix: `STATUS.md` holds current state only (one short paragraph per lane, the Next and Blocked lists); each lane's history moves to `lanes/<name>.md`, which only that lane reads. Target under 25 KB.
5. **Polling with sleep loops.** 30 to 40 sleep or `gh pr checks` polls in each big lane, each one a full-context turn. Fix: rely on agent completion notifications; when waiting on CI, one long background wait, never a loop of short ones.
6. **Whole transcripts and tool-output files read into context.** Single Reads of 250K to 570K characters (persisted subagent outputs and earlier transcripts) in the `/senior` chat, the conflict-resolution chat, lib-refactor and the analytics chat; one read stays in context for the rest of the chat. Fix: never `Read` a subagent output or transcript file whole; `tail`, `grep`, or ask the agent for its summary.
7. **Review rounds.** Units took two to five rounds, each re-running four or five checks in full. Already partly handled (all B2 findings in round 1; the PM rules on stricter Haiku re-checks). Further fix: a round after round 1 re-runs only the checks that failed, plus one focused re-check, unless the fix touched code another check covers.
8. **Prompt cache drops: about $50.** Mostly parallel agent results landing at the same second and idle gaps past the cache lifetime. Small next to the above; no action beyond (1).

## Is the nightly checking for agent improvements?

No. `ramble-nightly-audit` (02:30 daily, one run so far on 2026-10-29) audits the code merged to `main` through the five lenses. Nothing reviews the agents themselves: tokens, rounds, bounced checks, rulings. The daily self-improvement review the owner planned has not been built.

Proposal: a second scheduled task, `ramble-nightly-agent-review`, about 03:00, findings only. It runs `token-audit` for the day by agent, session and cache health; profiles each session's context and polling; lists the day's review rounds, failed checks and PM rulings from `DECISIONS.md` and the lane logs; and writes `audits/agents-<date>.md` with at most five proposed rule changes, each naming the file it would change. The owner approves which ones land. Haiku for the data pull, one Sonnet pass for the proposals.
