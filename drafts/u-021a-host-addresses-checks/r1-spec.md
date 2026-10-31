PASS

## spec-compliance: U-021a "Seeded hosts get a notification address" (head 196b3b9)

Scope of this check: PM calls and IN SCOPE / OUT OF SCOPE items from brief.md, and the check list in checks.md. Read-only. Diff range 5cb9e87...196b3b9, five files changed.

### PM calls (brief.md)
1. Job does not change: PASS. No file under src/server/jobs/ in the diff. tests/db/bookingEmails.db.test.ts not in the diff.
2. Every seeded host gets an address via hostRow from the slug, through a plain exported function with a unit test: PASS. src/lib/seed/rows.ts:43-60; src/lib/seed/rows.test.ts:70-103; writes through `.values(batch.map(hostRow))` at src/server/db/seed/run.ts:185.
3. Upsert on hosts also sets notification_email via excluded(): PASS. src/server/db/seed/run.ts:192.
4. No migration, no new env var: PASS.

### IN SCOPE (brief.md)
a. src/lib/seed/rows.ts and its test: PASS.
b. src/server/db/seed/run.ts hosts upsert: PASS.
c. Seed db test: seeded host has the address, and a rerun over a null address fills it: PASS.
d. Runbook line under "Seeding the production demo": PASS.

### OUT OF SCOPE (brief.md)
- src/server/jobs/, schema, migrations, HostFixture shape, email adapters, .github/, docs/plan/, docs/adr/, .claude/, scripts/merge-desk/: PASS, none in the changed-file list.
- src/lib/privacy.ts needs no change: PASS.

### Checks named in checks.md
- hostNotificationEmail refuses rather than repairs: PASS.
- Every host the seed writes, curated and scale, goes through hostRow: PASS.
- A test fails if the upsert line is removed: PASS by reading, not mutation-tested.
- The probe leaves no row: PASS.
- src/lib/seed/rows.ts stays usable for the seed preload: PASS. src/lib/email/address.ts imports only zod.
- Runbook line reads true: PASS.
- Derived address passes EmailAddressSchema and the CHECK for the longest seeded slug, including scale: PASS on the schema side; the CHECK side is covered by the probe, whose run this check did not verify.
- Seed rerun stays idempotent: PASS by reading.
- Coverage check passes: Unverified, a builder gate this check did not run.

### Blocking
None.

### Non-blocking
None from the spec side.

SPEC_COMPLIANCE_VERDICT=APPROVE
SPEC_COMPLIANCE_FAILED_ACS=0
