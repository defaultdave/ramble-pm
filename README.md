# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 16, 2026.** Nov 16: every slim-MVP build unit is merged except U-130, the guest sign-in link shown on screen while email is off (issue #989, critical tier, about 0.75 agent-days). Next is the walkthrough as guest, host and ops, then page-change units from its findings. Your asks today: bypass-merge PR 990, and run the production migrations 0024 to 0032 before the next deploy.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Dec 2, 2026 (late case Dec 8, 2026) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Bypass-merge PR 990. Adds U-130 to units.yaml so the U-130 PR passes scope-manifest. gh pr merge 990 --repo defaultdave/ramble --merge --admin
- Production migrations 0024 to 0032. Run the db-migrate-production workflow before the next production deploy.
- Create the U-129 issue and board item. PR 978 (image underlay) merged Nov 14 with no issue, so it cannot be set Done.
- Walk the site as guest, host and ops. Script and findings table in drafts/walkthrough-2026-11.md; a walkthrough lane chat runs it with you.
- Sentry setup, when the demo is shared. Server and browser projects, the ops address, three alert rules (docs/runbooks/alerting.md), then the two DSNs in Vercel.

**Decisions needed**

- None

**Held up**

- Guest sign-in on the deployed site: U-130, which waits on PR 990
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
