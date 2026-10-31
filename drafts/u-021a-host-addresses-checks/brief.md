UNIT: U-021a (carrier: the seed's unit, standard tier). BRANCH: `unit/U-021a-host-addresses`. BASE: `origin/main`. PR title (the PM opens it): `U-021a: seeded hosts get a notification address`.

Closes audit item BC-48. Rules for every builder: `/Users/davidfleming/Workspace/ramble-pm/drafts/wave3-builder-rules.md`, read in full. The worktree's Setup step applies.

**The gap.** `hosts.notification_email` is nullable and the seed never writes it, so every booking of a seeded host fails its `host-booking-notice` job (`BookingEmailError`, seen on production order `RMB-QVCS9Y`). The job retries with backoff up to 8 attempts, then goes dead and raises a `job-dead` alert.

**PM calls.**
1. The job does not change. Bounded retries ending in a dead job and an alert are the right outcome for a real host with no address: a host must hear about a booking, and someone should be told when it cannot. `tests/db/bookingEmails.db.test.ts` keeps its refusal test. This fixes the data.
2. Every host the seed writes gets an address by construction, not one literal per fixture: `hostRow` in `src/lib/seed/rows.ts` derives it from the slug, `bookings@<slug>.example`, through a plain exported function with a unit test. `.example` is reserved, so nothing can be delivered even if email goes live. Covers the curated set and the scale fixture.
3. The seed's upsert on `hosts` also sets `notification_email`, the same way its sibling columns use `excluded(...)`, so a rerun fills existing rows.
4. No migration. Production's rows are filled by rerunning the documented `production-demo` seed, which is Dave's. No new env var.

SCOPE MANIFEST
IN SCOPE: `src/lib/seed/rows.ts` and its test; `src/server/db/seed/run.ts` (the `hosts` upsert); the seed's db test, proving a seeded host has the address and a rerun over a row with a null address fills it; a line in `docs/runbooks/seed.md` under "Seeding the production demo" saying what seeded hosts get and that a rerun fills them.
OUT OF SCOPE: `src/server/jobs/`, the `hosts` schema, any migration, `HostFixture`'s shape unless the derivation cannot avoid it, email adapters, `.github/`, `docs/plan/`, `docs/adr/`, `.claude/`, `scripts/merge-desk/`.

**Check and report:** the derived address passes `EmailAddressSchema` and the `hosts_notification_email_shape` CHECK for the longest seeded slug, including the scale fixture's; `src/lib/privacy.ts` needs no change; seed rerun stays idempotent; the coverage check passes.

Time box: 45 minutes. No UI change, so no Evidence section. Anything else you notice goes in Suggestions.
