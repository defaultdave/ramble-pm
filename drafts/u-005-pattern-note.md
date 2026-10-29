# U-005 pattern note (approved 2026-10-26)

Goes into issue #9's scope manifest once approved. U-005 sets the pattern for every later unit that enqueues work (emails, reminders, gift delivery, transfers, webhook processing), so the rules below are the ones those units copy.

Sources: design doc 4.2 (rules 1 to 5), 4.2.1 (Operations row, `Clock` port), 4.2.3 rule 8, 5.7, the table of machine endpoints; ADR 0002 amendment 2026-10-18 (background jobs); ADR 0007 (one demo pulse, monitoring stack); `.claude/standards/architecture.md`; U-003 as landed (`db` is the only handle that opens a transaction).

Where a line says "Q", it is a call the PM made without a firm source; the questions are at the end.

---

**Pattern note (approved 2026-10-26 on the PM's recommendations; Dave delegated the three calls, DECISIONS 2026-10-26)**

Where things live
- Table: `src/server/db/schema/jobs.ts`, its own migration from `pnpm db:generate`.
- Outbox code: `src/server/jobs/` with `import 'server-only'`: `enqueue.ts`, `drain.ts`, `registry.ts`. Decisions (backoff delay, whether a job is due, whether it is dead) are plain functions in `src/lib/jobs.ts` with unit tests (ARCH-1).
- Clock: `src/server/ports/clock/` (the folder exists): `interface Clock { now(): Date }`, `systemClock`, and `fixedClock(at: Date)`. `fixedClock` has a real caller (the manual trigger), so it is not a test-only export.

The `jobs` table
- `id` uuid; `kind` text (Q1); `payload` jsonb; `dedupe_key` text, unique where not null; `status` (`pending`, `running`, `succeeded`, `dead`); `attempts` int; `max_attempts` int; `run_after`, `locked_until`, `created_at`, `finished_at` timestamptz; `last_error` text.
- CHECKs as strict as the Zod rules: `kind` lower kebab and at most 64 characters; `payload` at most 16 KB (`pg_column_size`); `attempts` between 0 and `max_attempts`; `max_attempts` between 1 and 20; `last_error` at most 2,000 characters; `finished_at` set exactly when status is `succeeded` or `dead`. A test proves the database refuses each bad row.
- Index on `(status, run_after)` for the claim query.

Enqueue
- `enqueue(tx, { kind, payload, dedupeKey?, runAfter? })` takes the caller's transaction handle, and its type accepts only a transaction, so a job can never be written outside the change it belongs to (design doc 4.2 rule 4).
- The payload is parsed with the kind's Zod schema from the registry before insert. An unknown kind or a bad payload throws; it never writes.
- With a `dedupeKey`, a second enqueue of the same key is a no-op (`on conflict do nothing`), so retried actions do not double-enqueue.

The registry
- One map from `kind` to `{ payload: ZodSchema, handle, maxAttempts }`. Later units add a kind by adding an entry and its handler; no migration (Q1).
- This unit ships one kind, `noop`, used by the tests and the demo trigger. Real handlers belong to their units.

Drain
- Claim: one short transaction selects due rows (`status = pending and run_after <= clock.now()`, plus `running` rows whose `locked_until` has passed) `FOR UPDATE SKIP LOCKED`, at most 25 per claim, and marks them `running` with `locked_until` 5 minutes ahead. Two drains running at once never take the same row; a `test:db` proves it.
- Run: each job then runs in its own transaction. The handler gets that transaction, the parsed payload, the job ID (its idempotency key for any provider call), and the clock. Delivery is at least once, so every handler must be idempotent; the registry's type says so in its name or docs.
- Success sets `succeeded` and `finished_at` in the handler's transaction. Failure rolls the handler back, then increments `attempts`, stores a bounded `last_error`, and sets `run_after` by backoff: 30 seconds doubling to a 6-hour cap, with jitter derived from the job ID so tests stay deterministic (Q3).
- Dead letter: when `attempts` reaches `max_attempts`, status `dead`, and `alerts.raise('job_dead', ...)` from U-007 with the kind and job ID as the dedupe key.
- Bounded work: one drain call stops claiming after 60 seconds or 200 jobs, whichever comes first, and reports what is left.
- The per-order advisory lock (design doc 4.2.3 rule 8) is taken by the provider-event handler, not by the drain. Not this unit.

The pulse route
- `POST /api/pulse` (the design doc's name for the drain route). Secret in `PULSE_SECRET`, sent as a bearer token and compared in constant time; any other method or a missing or wrong secret gets a uniform 401 with no work done. Rate limited through U-008b's limiter. A test for each refusal.
- Idempotent: concurrent calls are safe because of `SKIP LOCKED`. The response holds counts only (claimed, succeeded, retried, dead, left), never payloads.
- The pulse runs all due work in one call (ADR 0007). Today that is the job drain, the heartbeat, and `purgeExpiredRateLimits()` from U-008b (it carries `TODO(U-005): first caller`; call it until it returns fewer than its 1,000-row batch, within the call's time budget); the synthetic booking, timing checks, and dump trigger are later units' entries in the same list, each with `TODO(U-xxx)` where the slot is.
- Heartbeat: after a drain that finishes without error, one GET to `BETTERSTACK_HEARTBEAT_URL` with a 5-second timeout. With no URL set it does nothing. A failed heartbeat is logged and never fails the pulse.

The manual trigger and the clock
- Same route with a body `{ asOf: "<ISO date-time>" }`: the drain runs with `fixedClock(asOf)`, so the demo can show a reminder or gift delivery "tomorrow" without waiting. `asOf` is accepted only when `DEMO_CLOCK=on` (Q2), and must fall within 400 days of the real time; otherwise a 400 and no work.
- Jobs read time only through the clock. A lint rule (`no-restricted-syntax` on `Date.now()` and argument-less `new Date()`) under `src/server/jobs/` and `src/lib/jobs.ts` enforces it.

The pulse workflow
- `.github/workflows/pulse.yml`: cron every 30 minutes plus `workflow_dispatch` with an optional `as_of` input, calling `/api/pulse` on the production address with the secret. The App cannot push workflows, so the agent commits it to a local `unit/U-005-pulse-workflow` branch and lists it as a Dave step, as U-003 and U-024 did.

Not in this unit
- Any real job handler (emails, reminders, gift delivery, transfers, provider events), the per-order advisory lock, the synthetic booking, the dump, an ops page for the trigger (it needs U-004a's roles), and Better Stack account setup.

Secrets and settings (Dave, after merge)
- Add `PULSE_SECRET` to the Vercel project and as a GitHub Actions secret; land the pulse workflow branch; optionally create the Better Stack heartbeat and set `BETTERSTACK_HEARTBEAT_URL`. `DEMO_CLOCK` stays off until the demo needs it.

---

## PM notes for Dave (not part of the note)

**Q1. `kind` as text with a CHECK, not a Postgres enum.** Recommended. An enum means a migration every time a later unit adds a job kind, about a dozen of them, each a chance to collide with another unit's migration (wave 2 already has two migrations on two branches). The cost: the database accepts any well-formed kind, and the registry rejects unknown ones at enqueue and at drain. The alternative is a `pgEnum` built from the registry's tuple, as U-011 did for catalog enums: stricter, more migrations.

**Q2. Time travel only behind `DEMO_CLOCK=on`, off by default.** Recommended. The demo runs on the production deployment, so a date argument there could fire real-looking emails early. Off by default means you switch it on for a demo and off after. The alternative is to allow it on previews only, which would keep it out of the demo you show.

**Q3. The numbers.** 25 per claim, 60 seconds or 200 jobs per call, 5-minute lock, backoff 30 seconds doubling to 6 hours, 8 attempts by default (about 32 hours before a job goes dead), 16 KB payloads. These come from typical outbox practice, not a source in the plan. Change any you want.

**Why this is critical tier:** every later unit that sends an email or moves money writes through `enqueue` and is retried by this drain. A wrong idempotency or lock rule here turns into double emails or double transfers later, which is why you read it in the promotion batch.

---

## Amendments (PM rulings, 2026-10-28, from U-005's round 1 spec-compliance check)

These bring the note in line with what the builder shipped, where the shipped behaviour is the safer reading. Later units copy the note as amended. Dave can overrule any of them (DECISIONS 2026-10-28).

1. **Each claim spends an attempt.** `attempts` increments when a row is claimed, not when it fails. Without this, a job that kills its runner every time is reclaimed after each lapsed lock forever. A lapsed `running` row with no attempts left is marked `dead` and alerted without running. Dead still means `attempts` reached `max_attempts`.
2. **Locked re-check before running.** Each job's transaction first reads its row `FOR UPDATE` and runs the handler only if the row is still `running` with the same `attempts` and `locked_until` as the claim; otherwise the outcome is `lost` and nothing runs.
3. **Order of a pulse: drain, then purge, then heartbeat.** The heartbeat goes out only when both the drain and the purge finish without error, so a failing purge also alarms the monitor.
4. **No heartbeat on a manual `asOf` run.** A demo run says nothing about whether the schedule is healthy.
5. **Wrong secrets are counted.** A missing or wrong secret answers a uniform 401 and counts on the `pulse_failed` surface per source address; past 20 in 10 minutes it answers 429. Good calls count on the `pulse` surface (30 per 10 minutes).
6. **Kinds set their own `max_attempts`.** The registry requires it per kind (`noop` uses 3); 8 is only the column default. Each later unit picks its kind's number with its reason.
7. **Correction to Q3's arithmetic:** with backoff from 30 seconds doubling, 8 attempts means 7 waits of 30 s to 1,920 s, about 64 minutes before jitter, not 32 hours. A kind that must survive a longer outage needs a higher `max_attempts` (up to 20, where the 6-hour cap applies).
8. **Dedupe keys are permanent.** A key stays used after its job finishes; a retried action with the same key never enqueues again.
9. **The alert kind is `job-dead`** (the alerts module refuses underscores), with the dedupe key `<kind cut to 40>:<jobId>`.
10. **The pulse response adds `purged`** to its counts. Still counts only, never payloads.
11. **No heartbeat when a failure could not be recorded** (PM ruling 2026-10-28, from round 2 spec-compliance). A drain that reports `unrecorded > 0` counts as not finishing cleanly for amendment 3: the heartbeat is skipped, so the monitor alarms. A failure write that fails points at the database, which is what the heartbeat exists to catch. The rule lives in `decidePulse` (or beside it in `src/lib/jobs.ts`) with a unit test.
12. **Every claimed row lands in exactly one outcome count** (PM ruling 2026-10-28, round 3). The drain report and pulse response count `claimed`, `succeeded`, `retried`, `dead`, `lost`, and `unrecorded`, with `claimed = succeeded + retried + dead + lost + unrecorded`. A lapsed running row abandoned with no attempts left counts as claimed and dead, and toward the 200-job budget.
