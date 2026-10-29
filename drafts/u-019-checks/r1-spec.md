FAIL

## spec-compliance: U-019 "Guests, consents, and privacy" (head 2eba439)

### Blocking
- `src/lib/privacy.ts` (`piiColumns`) and `tests/pii-inventory.test.ts`: IN SCOPE 4 requires every personal-data column in the inventory with a test that proves it. `rate_limits.key` (`src/server/db/schema/operations.ts:25`) holds personal data: `src/lib/rateLimits.ts:32` and `:46` say the `sign_in_link` subject is an email and the `forms` subject an address plus a form name, and the key is that subject. It is in neither `piiColumns` nor `nonPiiColumns`, and the test misses it because its suspect check matches column names only. Fix: a `piiColumns` row for `rate_limits.key` (kind identifier; the email in sign-in-link and form subjects; location; deletion path: rows die at `expires_at` and the purge removes them, or a stated anonymize step), and make the test fail on such a column: classify every column of every schema table exactly once (today only guests, consents, privacy_requests), or an equivalent check.

### Non-blocking
- Audit item: `messages.subject` and `messages.template` are unclassified; `subject` is free text that could carry a name.
- Audit item: the suspect-column regex is name-based only.

### Unconfirmed
- None. Other items pass on reading: the three tables with CHECKs, unique index, FK, enums matching Zod, each refusal tested; race-safe `findOrCreateGuest` (20 parallel); first-caller TODOs; idempotent extendable `anonymizeGuest` with `requireStaff`; retention schedule pending counsel; one migration 0010; out of scope respected.
