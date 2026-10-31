PASS
## architecture-audit: U-021a "Seeded hosts get a notification address" (head 196b3b9)

Rules: `.claude/standards/architecture.md` (project, read at head 196b3b94759c1ae0bb180dc974fa1156b46983b9)
Files audited: `docs/runbooks/seed.md`, `src/lib/seed/rows.ts`, `src/lib/seed/rows.test.ts`, `src/server/db/seed/run.ts`, `tests/db/seed.db.test.ts`. Diff `5cb9e87...196b3b9` (5 files, 220 lines). Static review only; no tests run.

### Blocking Issues
None.

Checked against the blocking rules:
- B1, B3, B4: `src/lib/seed/rows.ts` imports only `@/lib/email/address`, and that module imports only `zod`. Nothing server-only, no SDK, no `process.env`. `src/server/db/seed/run.ts` keeps its `import 'server-only'` on line 1. The `eslint.config.boundaries.mjs` zones are not crossed. `src/lib/seed` sits outside the `sharedLibGlobs` page-module zone, and lib-to-lib is allowed.
- B2: the derived-address rule (`bookings@<slug>.example` plus the schema refusal) is in `src/lib/seed/rows.ts` with unit tests. The only change in `run.ts` is a column mapping (`notificationEmail: excluded('notification_email')`), not a decision.
- B5: `hostRow` returns a plain row object. No DTO or raw provider type crosses a boundary.
- B7: `hostNotificationEmail` is called by `hostRow`, which is on the production write path. It is not a test-only export.
- B9: the probe in `tests/db/seed.db.test.ts` runs inside `client.db.transaction` and always rolls back (`rejects.toBe(rolledBack)`), so it leaves no row. Test code, so B9 does not apply to it.
- B12: no `Date.now()`, no argument-less `new Date()`, no money arithmetic.
- B13: no empty or swallowing `catch`. The refusal throws `SeedStepError`, which is already imported in `rows.ts`.
- B17: no duplicate. `EmailAddressSchema` is reused from `src/lib/email/address.ts`. No other address builder exists in `src/`.

Other requested checks:
- Every host write goes through `hostRow`. `run.ts` has one `insert(hosts)` in `src/` (line 184, `.values(batch.map(hostRow))`), and `writeHostsAndExperiences(catalog, refs)` is called once (line 329) for the catalog that holds both curated and scale hosts. The other `insert(hosts)` calls are in `tests/db/*` fixtures and are exempt.
- The upsert line is what the test guards. Removing `notificationEmail: excluded('notification_email')` would leave the rerun test failing, because a null address would stay null.
- The runbook line is accurate for the code. The conflict clause sets the column from the excluded row on every rerun, so a hand-set address is overwritten. This matches the PM ruling, which is not blocking.

### Advisory
- `src/lib/seed/rows.test.ts` and `tests/db/seed.db.test.ts` import `generateScaleFixtures` and `maxScaleExperiences` to find the longest slug. This runs the scale generator in the unit test. It is test-only cost, not a layer violation.
- The runbook's claim that a seeded host's booking does not leave a `host-booking-notice` job failing is a runtime claim. It is for the qa-agent's end-to-end run to confirm, not this static audit.

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
