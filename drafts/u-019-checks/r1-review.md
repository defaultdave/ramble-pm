PASS

## review-agent: U-019 "Guests, consents, and privacy" (head 2eba439)

### Blocking
None.

### Non-blocking
- `src/lib/privacy.ts`, `tests/pii-inventory.test.ts`: `messages.subject` is not inventoried; the test matches column names only, so the first template that puts personal data in a subject goes unnoticed. List it with a U-085 deletion path, or require every `messages` column to be classified as for the three new tables. Audit item.
- `src/server/db/schema/people.ts` (consents): documented as append-only, but nothing in the database stops an UPDATE or DELETE; `legal_acceptances` uses guard triggers (migration 0007). Audit item: a trigger would make the consent log tamper-proof, which PRD-15 may want.
- `privacy_requests` sits in `operations.ts` beside `rateLimits` rather than in `people.ts`; placement only.

### Unconfirmed
- None. Ran in a scratch copy of 2eba439: typecheck, lint, db:check clean; guests, privacy, pii-inventory unit tests 111 passed; `guests.db.test.ts` and `editorial-races.db.test.ts` 109 passed. Full test:db and e2e not rerun.

### Clean
- Scope: 18 files match the manifest including the two authorized moves.
- Zod rules matched by the database (email shape, reserved domain both ways, enums and source-allows-status from one table, resolved iff not open, one open per kind, timestamp ranges, restrict FKs), each refusal tested.
- Concurrency: single upsert with 20 parallel calls and an erasure in flight; guest row lock on consents, requests and anonymize with committed-while-waiting tests; anonymize idempotent and rolls back on a failing step.
- Fails closed; `requireStaff` on the staff paths; no unbounded work; nothing logged; no duplication found; only TODO(U-047a) and TODO(U-085) ticket mentions.
