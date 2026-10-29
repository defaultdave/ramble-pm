PASS

## spec-compliance: U-019 "Guests, consents, and privacy" (head 42831b8)

### Blocking
- None.

### Non-blocking
- Round 1 items 1 to 5 still pass; round 2 changed only `src/lib/privacy.ts` and `tests/pii-inventory.test.ts`; the head diff against `7bff49b` is exactly the 18 unit files.
- Round 2 item 1: `rate_limits.key` in `piiColumns`. The key is `surface:<sha256 hex>` (migration 0003 CHECK); `purgeExpiredRateLimits` (`src/server/db/rateLimits.ts:57-64`) deletes expired rows, called from `src/server/pulse.ts:15`. Wording point: the inventory says windows are at most an hour, true of every surface's window today, but the schema cap `maxWindowSeconds` is 24 h (`src/lib/rateLimits.ts:78`). Not an AC failure.
- Round 2 item 2: `tests/pii-inventory.test.ts` enumerates every `PgTable` in `@/server/db/schema` and fails on unclassified, duplicate or not-in-schema entries; the seven newly personal columns are in `piiColumns`; `messages.subject` and `messages.template` in `nonPiiColumns` with reasons; PM rulings applied (`hosts.name`, `hosts.description` non-personal; `jobs.payload` a link with the add-a-step rule).
- Scope line clauses all present (guests, consents with time and source, privacy requests, PII inventory, anonymize with `requireStaff`, vendors, retention schedule pending counsel).
- First-caller TODOs present (U-047a on `findOrCreateGuest`, `recordConsent`; U-085 on the request and anonymize entry points). The only new migration is `0010_guests_consents_privacy.sql`, the newest.

### Unconfirmed
- Ran `tests/pii-inventory.test.ts`, `src/lib/privacy.test.ts`, `src/lib/guests.test.ts` in a scratch copy of 42831b8 (94 tests pass); full test:db and e2e not rerun.
