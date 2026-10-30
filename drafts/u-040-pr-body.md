Unit U-040, issue #46. Standard tier, into `integration` (U-014b's cached spaces-left read lives there; DECISIONS 2026-10-29). One round; all five checks passed (review, qa, spec-compliance, architecture-audit, a11y-audit), then a merge of `integration` (U-047b) that only dropped this unit's copy of the identical `zonedShortDayLabel`; the PR diff is otherwise byte-identical to the reviewed one.

SCOPE MANIFEST
IN SCOPE: streamed session rows with reserved space; runtime-cached spaces left; sold out stays listed; `?date=` from checkout's S7 links.
OUT OF SCOPE: the booking bar, sheet and panel (U-041), `reserveSpaces`, checkout, home, `docs/plan/`, `.github/`, `.claude/`.

## What was built
- **Upcoming dates** on the experience page stream behind Suspense with a six-row skeleton the loaded rows match (CLS 0 on a seeded production build); each row shows the date and time in the session's zone, the price, and spaces left from `getSpacesLeft` (this unit is its first caller); sold out stays listed without a link.
- **Bounded read** (`listUpcomingSessions`): the next 6 scheduled sessions within 90 days, served by `sessions_experience_starts_at_idx`; the list is cached per experience and minute, spaces per session.
- **`?date=`** marks that date's rows (`aria-current="date"`) on the session's own calendar; empty and error states for the dates section only.

## Gates
format:check, lint, typecheck, knip; test 6,084; test:db 1,558 with `--maxWorkers=2`; build; db:check, `db:generate` with no changes; e2e 163; storybook:test 237 (axe); gitleaks (no leaks). QA on a seeded production build at 320 to 1280 px: spaces left match the database and refresh within the cache window; one spaces read per row; EXPLAIN shows Limit 6 on the index.

## Not done
- The booking bar (U-041). Audit items BC-31 and BC-33 in `ramble-pm` `audits/booking-checkout.md`.

## Evidence
`evidence/pr/unit-U-040/` and `evidence/pr/unit-U-040-qa-agent/` in `ramble-pm`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
