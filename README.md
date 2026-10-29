# Ramble project status

Ramble is a demo marketplace for bookable experiences, built to prove a planning method and an AI agent team workflow. The code lives in [defaultdave/ramble](https://github.com/defaultdave/ramble). This repo is the project's current state: where it stands, what was decided, where reality left the plan, and the roadmap.

**[Open the roadmap](https://defaultdave.github.io/ramble-pm/)** · [Project board](https://github.com/users/defaultdave/projects/19) · [Figma](https://www.figma.com/design/tGNKJSWGHyx4UVmpnd5LUp) · [Frozen plan](https://github.com/defaultdave/ramble/tree/plan-frozen-2026-10-20/docs/plan)

## Now

<!-- roadmap:status:start -->
**As of Oct 29, 2026.** New targets from the owner on Oct 29: Sprint 1 work done by Oct 30, and a guest books a seeded session end to end (home, browse, experience, booking, checkout, confirmation) on the fake payment adapter by Monday Nov 2; no Stripe. The Prototype's 21 units are all live at ramble-sand.vercel.app; the checkout and confirmation stubs the plan listed were never built, so that glue goes first. The deep-review hold is lifted: U-005 and U-014a go into integration now, and the audit's fixes run in their own lane beside the build. The src/lib layout (H-18) is adopted; its seven-PR refactor plan is written. The refit below puts the money core on agents (the owner's call for U-016, U-047a and U-049) and still says December for the confirmation page, because it prices every unit at its estimate with review rounds; agent actuals so far run well under that, which is what a Monday landing depends on.

| Milestone | Likely |
|---|---|
| Prototype | Nov 10, 2026 (late case Nov 11, 2026) |
| Launch-ready | Jan 21, 2027 (late case Feb 3, 2027) |

Forecast: Lever 4 too (money core to agents), Dave 12.5 h.

**Next for Dave**

- undefined.
- undefined.
- undefined.
- undefined.
- undefined.
- undefined.
- undefined.

**Decisions needed**

- undefined.
- undefined.
- undefined.
- undefined.

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
