PASS

## review-agent: U-019 "Guests, consents, and privacy" (head 42831b8)

### Blocking
None.

### Non-blocking
- Round 1 audit items stand: no trigger makes `consents` append-only (`legal_acceptances` has guard triggers in migration 0007); `privacy_requests` sits in `operations.ts` rather than `people.ts`.
- `jobs.payload` classified as a link on the PM ruling (ids only); any job kind storing an address or name must add an anonymize step, and the entry says so.
- The name-based suspect regex is gone; the all-columns exact-once check covers the same ground.
- `messages.idempotency_key` and `messages.failure_reason` defer their deletion paths to the privacy-requests work, stated.

### Unconfirmed
- The first `pnpm test:db` run in a scratch copy of 42831b8 had 2 failures of 880 (one was "does not run a job that finished while it waited for the lock"); a rerun passed 880 of 880; treated as load-sensitive flakes. e2e and build not run.

### Verified
- Round 2 delta (`2eba439..7aeee88`) touches only `src/lib/privacy.ts` and `tests/pii-inventory.test.ts`: `rate_limits.key` added with its deletion path; the other newly personal columns classified; `messages.subject` and `messages.template` given a non-personal reason; the test requires every column of every table exactly once and reports unclassified, duplicate and stale entries. The round 1 spec blocker and the `messages.subject` note resolved.
- Merge `42831b8` clean; three-dot diff against `7bff49b` is 18 files in the manifest, migration 0010 newest.
- Scratch: `tsc --noEmit` clean; privacy, guests, pii-inventory 94 of 94; lint clean; test:db 880 of 880 on rerun.
- The five defect classes still clean; only TODO(U-xxx) ticket mentions.
