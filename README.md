# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 1, 2026.** Nov 1, late evening: Sprint 1 is closing. Cache fixes, category and neighborhood pages (U-035) and the checkout audit fixes are on main; the no-script browse fix (PF-7) is a partial fix; the audit log (U-020) has passed its checks and goes into integration after a sync. Audit findings are now 187 tickets in a Maintenance sprint, 179 open. Production still runs 44dd004: none of tonight's work is deployed.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Jan 15, 2027 (late case Jan 27, 2027) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Give the ramble-agents App Issues read and write. Set the permission and accept it on the installation. Ticket labels dropped silently without it and a first run double-filed 181. The PM then labels the 187 tickets, closes the duplicates and files SC-1 to SC-26.
- Decide the PF-7 client island. With JavaScript off, the first load of a large browse result shows only 5 cards. One client component fed plain data fixes it, and needs your approval under B8. Recommended.
- Confirm MFA for U-102. U-102 stays In Progress until you confirm MFA is on.
- Stop stray local servers. kill 7104 8217 9069 6395 and kill 7626. The last one holds port 3100.
- Rerun the production-demo seed. From a current main checkout (docs/runbooks/seed.md). The PM cannot: it needs the production env file. Closes BC-48 and lets the last seeded booking check run.
- Sandbox: allow api.github.com and local port binding. GitHub reads fail inside the sandbox (board dates, nightly merge list) and reviewers cannot run Postgres, Chromium or ports, so QA falls back to static checks.
- Turn off unused connectors in Ramble chats. Token review fix 3: every chat starts at 99K tokens. Finance, Gmail, Drive, Docs, iOS simulator, computer use; Vercel only in deploy chats.
- Try a card decline then success on production. Use the Demo test cards on the payment step; the PM does not type card numbers there.
- Check the integration branch survives the next promotion. delete_branch_on_merge is on; the ruleset bypass is now pull_request. If it vanishes again, change the repo setting or the promotion step.
- Neon console. Delete the stray database from the first migrate run if it is stale (H-11).
- Vercel and Sentry. Beacon firewall rule (PR 193), BotID, Sentry DSNs and projects, alert rules in docs/runbooks/alerting.md.
- GitHub. Enable private vulnerability reporting; the BE-1 Vercel firewall rule from PR 263 is skipped by decision.

**Decisions needed**

- None

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

Unit status and actual days live on the [project board](https://github.com/users/defaultdave/projects/19). The plan of record (PRD, ADRs, the seven planning artifacts, `units.yaml`) stays in the code repo, versioned with the code it shapes.

## How it is kept

The project manager agent updates these files at the end of each working session and publishes them straight to `main`. There are no pull requests here and no CI, so a status update never touches the code repo. The roadmap is rebuilt from the code repo with `bun scripts/plan/roadmap.ts`, which writes `index.html` and the block under **Now**.

History before 2026-10-22, when these files moved here, is in the code repo's git log under `docs/plan/`.
