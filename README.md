# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Nov 28, 2026.** Nov 28: the build is done and the nightly agents run on their own. Production is still on the Nov 4 build because its database password is stale. The weekly secret scan has failed since Oct 26 on fake test values; PR 1062 clears it. Next: the production secret, then test guest sign-in, then the walkthrough.

| Milestone | Likely |
|---|---|
| Prototype | Nov 13, 2026 (late case Nov 18, 2026) |
| Launch-ready | Dec 2, 2026 (late case Dec 8, 2026) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- Fix the production database secret, then migrate and deploy. Run 45052497572 failed on a stale neondb_owner password. Reset DATABASE_URL_UNPOOLED in the production-database environment, set BETTER_AUTH_SECRET (and SIGN_IN_LINK_SECRET if missing) in Vercel production, rerun db-migrate-production, then make a new production build and promote it.
- Bypass-merge PRs 1063 and 1064. Dependabot's jest-dom 8 and minor-and-patch bumps with test-only lint fixes, replacing 1060 and 1061. All checks green except scope-manifest, which a dependency bump cannot pass.
- Test guest sign-in on the deployed site. Check EMAIL_MODE is sink; a new email gets the on-screen link and lands signed in; a staff or host address gets 'link sent' and the link shows only in /ops/mailbox.
- Fix two paths in the nightly agent-review task. agent-memory to agent-memory-local; scripts/plan/site.ts to scripts/pm/site.ts.
- Create the U-129 issue and board item. PR 978 (image underlay) merged Nov 14 with no issue, so it cannot be set Done.
- Sentry setup, when the demo is shared. Server and browser projects, the ops address, three alert rules (docs/runbooks/alerting.md), then the two DSNs in Vercel.

**Decisions needed**

- Walk the site as guest, host and ops. Recommended: Run it next..

**Held up**

- Production is on the Nov 4 build: The production database secret reset; migrations 0024 to 0034 and a new build wait on it, and so does the guest sign-in test
- Dependabot bumps (jest-dom 8, 17 minor updates): Your bypass merge of PRs 1063 and 1064 (CI green)
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
