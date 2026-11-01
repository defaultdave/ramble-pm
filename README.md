# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 1, 2026.** Nov 1: a guest books end to end on production, ahead of Monday's Nov 2 goal. Production runs main at 44dd004, no PRs are open, and the pulse workflow runs every 30 minutes. Dave's Oct 31 home and browse feedback is merged and deployed. One owner item is left for the click-through: rerunning the production-demo seed so host notices stop failing (BC-48). Card decline then success and 3-D Secure are proven locally only. The forecast prices units at estimate, so it is the slow case against agent actuals of 4 to 42 percent of estimate.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Jan 15, 2027 (late case Jan 27, 2027) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Rerun the production-demo seed. From a current main checkout (docs/runbooks/seed.md). The PM cannot: it needs the production env file. Closes BC-48 and lets the last seeded booking check run.
- Try a card decline then success on production. Use the Demo test cards on the payment step; the PM does not type card numbers there.
- Check the integration branch survives the next promotion. delete_branch_on_merge is on; the ruleset bypass is now pull_request. If it vanishes again, change the repo setting or the promotion step.
- Neon console. Delete the stray database from the first migrate run if it is stale (H-11).
- Board dates sync. bun scripts/plan/board-dates.ts --run (gh cannot read the keychain in the sandbox).
- Vercel and Sentry. Beacon firewall rule (PR 193), BotID, Sentry DSNs and projects, alert rules in docs/runbooks/alerting.md.
- GitHub. Enable private vulnerability reporting; the BE-1 Vercel firewall rule from PR 263 is skipped by decision.

**Decisions needed**

- Sandbox: allow api.github.com and local port binding. Recommended: allow both.
- Tax-rate default: confirm 88,750 ppm (New York City 8.875%), or give the rate. Recommended: keep 88,750 ppm.
- Move lane orchestrator chats from Opus to Sonnet. Recommended: yes.

**Held up**

- BC-48 host notices on production: Dave rerunning the production-demo seed
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
