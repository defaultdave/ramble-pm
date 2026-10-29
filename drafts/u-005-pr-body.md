Unit U-005, issue #9. Critical tier, into `integration`. Built under the approved pattern note (`drafts/u-005-pattern-note.md` in `ramble-pm`, with its amendments 1 to 12 of 2026-10-28). Three review rounds; all four checks passed round 3, and a focused round 4 re-checked the merge of `integration` (PR 222) into the branch.

SCOPE MANIFEST
IN SCOPE: `jobs` table written in the same transaction as the change; drain with SKIP LOCKED, backoff, dead letters; secured idempotent drain route; 30-minute pulse workflow (separate branch, see below); protected manual trigger with a date argument (demo); heartbeats; `Clock` port (`now()`) with the system adapter and a fixed test clock; the manual demo trigger passes its date through the clock; jobs read time only through it
OUT OF SCOPE: any real job handler (emails, reminders, gift delivery, transfers, provider events), the per-order advisory lock, the synthetic booking, the dump, an ops page for the trigger, Better Stack setup, `docs/plan/`, other units' scope (docs/plan/units.yaml).
REFERENCE CODE: docs/plan/01-design-doc.md 4.2, 4.2.1, 4.2.3 rule 8, 5.7; ADR 0002 (background jobs amendment) and ADR 0007.

## What was built
- **`jobs` table** (`src/server/db/schema/jobs.ts`, migration `0009_jobs_outbox`): `kind` as text with a CHECK, payload capped at 16 KB, permanent dedupe keys, every CHECK with a db test for its refusal.
- **Enqueue, registry, drain** (`src/server/jobs/`): `enqueue` inside the caller's transaction (`TODO(U-054): first caller`), a registry with only the `noop` kind, and a drain that claims with `FOR UPDATE SKIP LOCKED`, re-checks each row under a lock before running, backs off from 30 seconds doubling to 6 hours, and marks a job dead after 8 attempts with `alerts.raise('job-dead', …)`.
- **Decisions in `src/lib/jobs.ts`** with unit tests: `partitionClaims`, `claimFoundWork`, `tallyOutcome`, `tallyClaimBatch`, `heartbeatDue`, `decidePulse`, `parsePulseBody`, `chooseClock`. Every claimed row lands in exactly one bucket: `claimed = succeeded + retried + dead + lost + unrecorded`.
- **`POST /api/pulse`**: bearer `PULSE_SECRET` compared with `secureEqual`, rate limited (`pulse` and `pulse_failed` surfaces), drains (25 per claim, 60 seconds or 200 jobs per call), purges expired rate-limit rows, then sends the heartbeat. Counts only in the response.
- **`Clock` port** (`src/server/ports/clock/`): system and fixed adapters. The `asOf` demo trigger works only with `DEMO_CLOCK=on` and within 400 days.
- **Env**: `PULSE_SECRET` (with none set the route refuses everyone), `DEMO_CLOCK`, and `BETTERSTACK_HEARTBEAT_URL` in `src/server/env.ts` and `.env.example`. Runbook in `docs/runbooks/jobs.md`.

## Decisions to know about
- Each claim spends an attempt, so a job that kills its runner still reaches dead. A lapsed running row with no attempts left is marked dead without running.
- Before running, the drain re-reads the row `FOR UPDATE`; if it no longer matches the claim the outcome is `lost` and nothing runs.
- No heartbeat on an error, on an `asOf` run, or when any failure could not be recorded (`unrecorded > 0`).
- Other methods on `/api/pulse` answer 401. A wrong secret counts on `pulse_failed` (20 per 10 minutes, then 429). The body is capped at 1 KB and must be exactly `{ "asOf": ... }`.
- `last_error` holds the error name and a redacted message cut to 1,900 characters.

## Gates (on the merge head)
format:check, lint, typecheck, knip; test 3,579; build with no `DATABASE_URL`; gitleaks over the branch range (no leaks). QA round 4 on the merge head: test:db 769 (a known 5 s timeout in `email.db.test.ts`, not a U-005 file, in 1 of 4 runs), db:check and `db:generate` with no changes, e2e 153, storybook:test 154, and the real route on a production build (8 claimed: 7 succeeded, 1 lapsed row dead; no token and GET both 401).

## The pulse workflow (Dave)
`.github/workflows/pulse.yml` is on `unit/U-005-pulse-workflow` (the App cannot push workflows). It needs its own push, PR, and bypass merge, then `PULSE_SECRET` in Vercel and in Actions secrets and the `PULSE_URL` repository variable. Until then the drain runs only when called.

## Not done
- No real job handler; the first callers are U-054 and later units.
- Audit items logged, not fixed here: a repeated `error instanceof Error ? error.name : …` pattern across about ten files; three stale `TODO(U-005)` markers in other files.

## Evidence
No visible change: this unit adds a table, server code, and an API route. QA's live route run is in the `qa-agent` check summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
