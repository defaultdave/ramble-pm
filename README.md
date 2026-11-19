# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 19, 2026.** Nov 19: zero open tickets and PRs; PR 1048 (the B6 follow-up) merged. A cloud nightly audit now runs each night; a nightly fix agent is drafted. Next: test guest sign-in, then the walkthrough and its page-change units.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Dec 2, 2026 (late case Dec 8, 2026) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Test guest sign-in on the deployed site. Check EMAIL_MODE is sink; a new email gets the on-screen link and lands signed in; a staff or host address gets 'link sent' and the link shows only in /ops/mailbox.
- Check the cloud nightly audit's run log. No audit/nightly-2026-11-19 branch was pushed. Once one night runs clean, turn off the local ramble-nightly-audit task (it loses the visual and performance lenses).
- Fix two paths in the nightly agent-review task. agent-memory to agent-memory-local; scripts/plan/site.ts to scripts/pm/site.ts.
- Production migrations 0024 to 0034. Run the db-migrate-production workflow before the next production deploy.
- Create the U-129 issue and board item. PR 978 (image underlay) merged Nov 14 with no issue, so it cannot be set Done.
- Sentry setup, when the demo is shared. Server and browser projects, the ops address, three alert rules (docs/runbooks/alerting.md), then the two DSNs in Vercel.

**Decisions needed**

- Walk the site as guest, host and ops. Recommended: Run it next..

**Held up**

- Last night's cloud audit left no report branch: A look at the routine's run log; main had merges in the window
- Nightly fix agent (ADR 0011) is drafted, not pushed: Your call to take it up, then the bypass merge, a spend-capped API key, the App secrets and the label
- Schedule refit and board dates: Solo estimates for U-120 to U-130 and a rebuilt board Sprint field
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
