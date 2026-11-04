# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 4, 2026.** Nov 4: maintenance wave 3 is in: P16 to P20 merged to main, P26 into integration, P15 (PR 838) re-running a flaky db test. The test audit found 28 items (TA-1 to TA-29 with your CI size warning) and test-fix wave 1 is 4 of 5 merged. Plan of record unchanged: Sprint 2 stabilization to Nov 30, Sprint 3 login and admin Dec 1 to 14, test bed after, by Dec 30.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Dec 2, 2026 (late case Dec 8, 2026) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Fix three issue states from wave 3. #359 (BE-17) closed when PR 820 merged, but its fix was reverted: gh issue reopen 359 --repo defaultdave/ramble. Close #401 (H-104, comment rewritten) and #687 (SC-3, won't fix): gh issue close 401 687 --repo defaultdave/ramble.
- Eyeball two small visual changes on the next preview. Home empty state heading is one size smaller (PR 837); the home gift button has Button's 4 px focus ring (PR 838).
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

- Gallery strip tab stop (BE-17). Recommended: Approve the island and give it to the next maintenance wave; it joins the client islands review at the sprint end..

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
