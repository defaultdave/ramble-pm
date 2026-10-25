# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Oct 24, 2026.** Prototype wave 1 ran as a parallel agent swarm: U-009, U-025, U-026 and U-117 merged into main the same evening, with the U-102 dependency fix. U-011, the catalog pattern-setter, is built and reviewed, waiting only for the integration branch to be recreated. The Prototype forecast moves to Nov 6 (P90 Nov 10).

| Milestone | Likely |
|---|---|
| Prototype | Nov 5, 2026 (late case Nov 10, 2026) |
| Launch-ready | Feb 16, 2027 (late case Mar 8, 2027) |

Forecast: Push: 20 h this week, then 12.5 h.

**Next for Dave**

- Recreate the integration branch. Promotion PR 181 deleted it (delete-branch-on-merge under your login bypasses the ruleset). Run: gh api repos/defaultdave/ramble/git/refs -f ref=refs/heads/integration -f sha=<current main sha>. U-011's PR waits on it.
- Bypass-merge PR 188. Writes the B6 guest-read and B7 first-caller exemptions you approved into the architecture standard; .claude/ is protected, so scope-manifest fails by design.

**Decisions needed**

- None

**Held up**

- Real-job only: legal review, sponsor terms, Stripe review: Client facts with no one to ask in this demo; logged, not blocking
<!-- roadmap:status:end -->

## What is here

| File | What it holds |
|---|---|
| [`STATUS.md`](STATUS.md) | Where the project is, what is in flight, what waits on the owner, and the next action |
| [`DECISIONS.md`](DECISIONS.md) | Every decision with its date, who made it, and why |
| [`delta-log.md`](delta-log.md) | Where reality departs from the frozen plan, one line per departure |
| [`index.html`](index.html) | The roadmap page: key dates as ranges, decisions needed, the sprint chart |
| [`roadmap/`](roadmap/) | The page's template and data: `status.json` (the PM's digest) and `schedule.json` (the forecast) |

Unit status and actual days live on the [project board](https://github.com/users/defaultdave/projects/19). The plan of record (PRD, ADRs, the seven planning artifacts, `units.yaml`) stays in the code repo, versioned with the code it shapes.

## How it is kept

The project manager agent updates these files at the end of each working session and publishes them straight to `main`. There are no pull requests here and no CI, so a status update never touches the code repo. The roadmap is rebuilt from the code repo with `bun scripts/plan/roadmap.ts`, which writes `index.html` and the block under **Now**.

History before 2026-10-22, when these files moved here, is in the code repo's git log under `docs/plan/`.
