PASS

## review-agent: U-021a "Seeded hosts get a notification address" (head 196b3b9)

### Blocking
None.

### Non-blocking
- `hostNotificationEmail` refuses rather than repairs; the unit test covers an upper-case slug, a space, an empty slug and a 250-character slug.
- The only host insert in the seed is `src/server/db/seed/run.ts:184-185`, through `hostRow`, curated and scale alike.
- `src/lib/seed/rows.ts` stays usable under the seed preload: `@/lib/email/address` imports only `zod`.
- The runbook line reads true. It sits under "Seeding the production demo" but holds for every seed target, which is harmless.
- The seed's db test covers the curated set; the scale fixture is covered by the unit test and the CHECK probe.
- Overwrite of a hand-set address on rerun: PM ruling, not blocking, disclosed in the runbook.

Verified: `src/lib/seed` unit run 12 files, 458 tests; `tests/db/seed.db.test.ts` and `tests/db/bookingEmails.db.test.ts` 56 tests with `--maxWorkers=2`; deleting the upsert line fails the rerun test; the probe leaves no row.

### Unconfirmed
None. The builder's full suite totals were not rerun.

### Run
Fresh database: 11 of 11 hosts carry the derived address; a nulled address refills on rerun with row counts identical across all 35 tables. Seeded production build, booking through the fake Pay: order RMB-ZHM98T, `host-booking-notice` succeeded on attempt 1, message captured by the sink to `bookings@salt-and-semolina.example`.
