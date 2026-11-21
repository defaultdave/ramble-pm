# ADR 0012 (draft): Bug finder agent

- **Status:** Draft 2026-11-21, agents-cloud lane. Not in `ramble` yet; it goes in as `docs/adr/0012-bug-finder.md` in the same PR as ADR 0011.
- **Owner calls so far (2026-11-21):** runs on GitHub Actions; the owner opts each finding in to the fixer by hand.
- **Depends on:** ADR 0011 (nightly fix agent: same secrets, App, runner layout), ADR 0010 (the App, tiers).

## Question

Can an agent find one real bug or worthwhile improvement in one area of the site per run, and file it as a ticket the nightly fix agent can take?

## Why a finder, beside the nightly audit

The nightly audit reads only the last day's diffs, and only by reading code. With merges slowing, it mostly skips. Older code is never looked at again, and nothing runs the site. The finder looks at a whole area, whatever its age, and can run it.

## Design

New workflow `.github/workflows/bug-finder.yml`, same job split as ADR 0011, so the agent never shares a runner with the App key.

1. **area** (script, no agent): `scripts/bug-finder/area.ts` reads the table in `src/app/README.md` (eight trees today: guest, browse, experience page, sign-in, checkout, confirmation, host, ops). It picks by day number modulo the count, so the rotation is stateless and covers every tree in eight runs. A `workflow_dispatch` input `area` overrides it.
2. **investigate** (Claude Code, Sonnet, 60 turns, 45 minutes, no GitHub credential, Postgres service, seeded database):
   - Reads that tree's README page map, its code, the PRD requirements that name its routes, and `.claude/standards/architecture.md`.
   - May build and start the site and drive it with Playwright, mobile viewport first, and run the tests.
   - Writes `finding.json` with at most one finding, or `{ "none": "<what was checked>" }`.
   - A **bug** needs evidence: a failing test, a Playwright repro, or a `file:line` with the input that breaks it.
   - An **improvement** must cite a PRD requirement or a blocking rule it fails. Taste alone does not count.
   - A finding carries the unit that owns the file (from `docs/plan/units.yaml`), size, a fix suggestion, and the lens: bug, a11y, performance, visual, or rules.
3. **verify** (a second Claude Code run, read-only, fresh runner): tries to refute the finding from the evidence. Refuted means no ticket. Same idea as the nightly audit's verifier.
4. **file** (fresh runner, App token):
   - Duplicate check against open and closed issues: the same `file:line`, or a title match.
   - Opens one issue as the App, labels `audit` and `finder`, body in the `audits/README.md` record format, with the first line citing `path:line`, as the picker expects, and a `Unit: U-xxx` line.
   - Never adds `nightly-fix`. That label is the owner's opt-in.
   - The run summary says what was checked, even when nothing was filed.

## Changes to ADR 0011's picker

`pick.ts` takes a ticket only if it names a source PR whose title carries a unit. A finder ticket has no source PR, so the picker also accepts a `Unit: U-xxx` line from an App-filed issue labelled `finder`. There is one test for it in `pick.test.ts`.

## Limits on purpose (v1)

- One ticket a run at most. The duplicate check runs before filing.
- No code changes, branches or PRs. Fixing is ADR 0011's job, on the owner's label.
- Off-limits files (the picker's `OFF_LIMITS`) may be cited, but the ticket is labelled `needs-owner`.

## Security

Same as ADR 0011:
- The App key lives only on the `file` runner.
- `ANTHROPIC_API_KEY` is a dedicated, spend-capped key, exposed to the site and tests the agent runs.
- The finding is data, so the `file` step builds the issue from JSON fields and never runs text from it.

## Cost

About $3 to $8 a run (investigation with the site running plus a short verify), on the same key as the fixer. Run every other night: about $60 to $120 a month at the top end.

## Test plan (before any schedule)

1. Dispatch by hand three times: `checkout`, `ops`, `browse`. The owner reads each issue, or each "none" summary.
2. The owner labels one good ticket `nightly-fix` and dispatches `nightly-fix` by hand: the end-to-end test.
3. After two clean rounds, schedule the finder for 06:00 UTC on alternate days. The fixer stays at 09:00 UTC.

## What the owner does

1. Accept ADR 0011 and this one. One bypass merge carries both workflows.
2. The ADR 0011 secrets and variable: `ANTHROPIC_API_KEY`, `RAMBLE_APP_ID`, `RAMBLE_APP_INSTALLATION_ID`, `RAMBLE_APP_PRIVATE_KEY`, `CLAUDE_CODE_VERSION`.
3. Labels `nightly-fix`, `finder`, `needs-owner` (if missing).
4. The three hand dispatches above.

## Open questions

- **Tracking:** the `audits/` tracking rule wants every item recorded in ramble-pm. Proposal: the lead adds finder tickets to `audits/finder.md` when folding, since the workflow cannot write ramble-pm.
- **Rotation weights:** checkout and sign-in carry the most risk. Weight them double after the first rotation?
