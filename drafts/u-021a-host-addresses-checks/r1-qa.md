PASS

## qa-agent: U-021a "Seeded hosts get a notification address" (head 196b3b9)

### Blocking
None.

### Non-blocking
- Hand-set addresses are overwritten on a rerun: PM ruling, disclosed in the runbook.
- The new runbook line holds for every seed target, not only the production demo; accurate where it is.
- Chromium was driven through the repo's `@playwright/test` from a script; no video was recorded.

### Unconfirmed
None. The browser booking was used; the job-driving fallback was not needed.

### What ran
1. Fresh database, migrate, `SEED_TARGET=local pnpm db:seed`: 11 hosts, all `bookings@<slug>.example`.
2. Null one address and rerun: refilled; 11 hosts, 14 experiences, 240 sessions, 4 legal documents before and after.
3. `--scale=1000`: 386 hosts, all with the address; longest slug 24 characters, longest address 41; the CHECK accepted them.
4. Seeded production build: "Hand-rolled pasta in Carroll Gardens", 2 guests, $170, fake Pay with the success card, order `RMB-MMC27X` confirmed. `process-provider-event`, `guest-confirmation` and `host-booking-notice` all succeeded on attempt 1 in the confirm drain, with no pulse. Sink: `host-booking-notice` to `bookings@salt-and-semolina.example`, captured.
5. Deleting the upsert line fails 1 of 28 in `tests/db/seed.db.test.ts`. The probe leaves no row. `src/lib/seed` 458 tests, `tests/db/seed.db.test.ts` 28 of 28.

QA_VERDICT=PASS
