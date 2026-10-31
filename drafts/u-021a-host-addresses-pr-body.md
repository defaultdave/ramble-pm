Unit U-021a (carrier, DECISIONS 2026-10-30). Standard tier, into `main`. Closes audit item BC-48: every booking of a seeded host failed its `host-booking-notice` job, because the seed never wrote `hosts.notification_email`. Seen on production order `RMB-QVCS9Y`.

SCOPE MANIFEST
IN SCOPE: `src/lib/seed/rows.ts` and its test; the `hosts` upsert in `src/server/db/seed/run.ts`; the seed's db test; a line in `docs/runbooks/seed.md`.
OUT OF SCOPE: `src/server/jobs/`, the `hosts` schema, any migration, `HostFixture`'s shape, email adapters, `.github/`, `docs/plan/`, `docs/adr/`, `.claude/`, `scripts/merge-desk/`.

## What was built
- **Address:** `hostRow` derives `bookings@<slug>.example` through `hostNotificationEmail`, so the curated set and the scale fixture both get one by construction. `.example` is reserved, so nothing can be delivered. An address the schema refuses stops the seed; it is never repaired.
- **Upsert:** the `hosts` upsert also sets the address, so a rerun fills existing rows.
- **Job unchanged:** a host with no address keeps its bounded retries, dead job and alert. This PR fixes the data.

## Gates
format:check, lint, typecheck, knip; test 6,463; test:db 1,602; build without `DATABASE_URL`; db:check, `db:generate` with no changes; gitleaks clean. e2e not run: no route or UI change.

All four checks passed at `196b3b9`. QA booked a seeded session on a production build: `host-booking-notice` succeeded on attempt 1, captured by the sink. Deleting the upsert line fails the rerun test.

## Not done
- Production's rows stay empty until the `production-demo` seed is rerun from this code. That run is Dave's.
- A rerun overwrites a hand-set address. Harmless while only seeded hosts exist; logged in the audit.

Verdicts: `drafts/u-021a-host-addresses-checks/` in `ramble-pm`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
