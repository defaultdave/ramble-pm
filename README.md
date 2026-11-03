# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 3, 2026.** Nov 3: open PRs cleared (729 to 732 merged; P13 and P25 sit in integration for your promotion). Forecast refit for the demo re-plan: 67 parked and cut units dropped, 43 done. Unit work fits by about Dec 1 on paper; the plan of record is the board's sprints: Sprint 2 (stabilization, to Nov 30), Sprint 3 (login and admin, Dec 1 to 14), test bed after, by Dec 30. The launch milestone is gone.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Dec 2, 2026 (late case Dec 8, 2026) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Push unit/U-001-neon-skip and bypass-merge it. Local branch f548962 adds the head_ref filter so the expire-preview job stops failing on branches with no preview (N1030-1, BC-40). Workflow files need your login.
- One edit to .claude/standards/architecture.md. B6 exemption for system money paths (BC-15), B13 names presentation-only log-and-degrade reads (N1030-7), lib/pages zone in the diagram and B4 plus the client-island allowlist (N1030-8).
- Give the ramble-agents App Issues read and write. Set the permission and accept it on the installation. Ticket labels dropped silently without it and a first run double-filed 181. The PM then labels the 187 tickets, closes the duplicates and files SC-1 to SC-26.
- Decide the PF-7 client island. With JavaScript off, the first load of a large browse result shows only 5 cards. One client component fed plain data fixes it, and needs your approval under B8. Recommended.
- Confirm MFA for U-102. U-102 stays In Progress until you confirm MFA is on.
- Stop stray local servers. kill 7104 8217 9069 6395 and kill 7626. The last one holds port 3100.
- Rerun the production-demo seed. From a current main checkout (docs/runbooks/seed.md). The PM cannot: it needs the production env file. Closes BC-48 and lets the last seeded booking check run.
- Sandbox: allow api.github.com and local port binding. GitHub reads fail inside the sandbox (board dates, nightly merge list) and reviewers cannot run Postgres, Chromium or ports, so QA falls back to static checks.
- Turn off unused connectors in Ramble chats. Token review fix 3: every chat starts at 99K tokens. Finance, Gmail, Drive, Docs, iOS simulator, computer use; Vercel only in deploy chats.
- Try a card decline then success on production. Use the Demo test cards on the payment step; the PM does not type card numbers there.
- Neon console. Delete the stray database from the first migrate run if it is stale (H-11).
- Vercel and Sentry. Beacon firewall rule (PR 193), BotID, Sentry DSNs and projects, alert rules in docs/runbooks/alerting.md.
- GitHub. Enable private vulnerability reporting; the BE-1 Vercel firewall rule from PR 263 is skipped by decision.

**Decisions needed**

- Test audit and comment cleanup sooner?. Recommended: Start the test audit's first pass now as a findings-only lane beside wave 3 (no file overlap), and fold N1031-15 into wave 3 as one XS PR..

**Held up**

- Audit ticket labels, 26 new tickets and closing the duplicates: Issues permission on the ramble-agents App
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

Unit status and actual days live on the [project board](https://github.com/users/defaultdave/projects/19). The PRD, ADRs and `units.yaml` stay in the code repo, versioned with the code it shapes. The seven planning artifacts and the build plan are frozen in [`plan/`](plan/).

## Planning tools

- `tools/plan/` holds the plan scripts: forecast, critical path, breakdown, execution model, roadmap page, and the board scripts. Run them from this repo with bun, for example `bun tools/plan/forecast.ts --report schedule`.
- `plan/` holds the frozen planning artifacts (`01` to `07`, `BUILD-PLAN.md`, `estimate-panel.json`); see [`plan/README.md`](plan/README.md).
- The scripts read `units.yaml` from the ramble checkout beside this one, or from `RAMBLE_DIR` when it lives elsewhere.
- The board scripts (`board-dates.ts`, `issues.ts`) need a `gh` login.
- Tests: `bun test tools/`.

## How it is kept

The project manager agent updates these files at the end of each working session and publishes them straight to `main`. There are no pull requests here and no CI, so a status update never touches the code repo. The roadmap is rebuilt from the code repo with `bun scripts/plan/roadmap.ts`, which writes `index.html` and the block under **Now**.

History before 2026-10-22, when these files moved here, is in the code repo's git log under `docs/plan/`.
