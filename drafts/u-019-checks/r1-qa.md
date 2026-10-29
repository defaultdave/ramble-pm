PASS

## qa-agent: U-019 "Guests, consents, and privacy" (head 2eba439)

Scratch copy from `git archive 2eba439`; nothing written in the repo or any worktree.

### Blocking
None.

### Gates (scratch copy)
- format:check pass; lint exit 0 (`--max-warnings 0`); typecheck exit 0; test 3943 of 3943; knip exit 0; build with DATABASE_URL unset exit 0.
- test:db, run once: 15 files, 880 of 880 passed (including the two load-sensitive webhook and job-drain tests).
- db:check "Everything's fine"; db:generate "No schema changes" (12 migration entries before and after).
- e2e not run (data unit, no UI).

### Database refusals (probe file against the real Postgres)
Every bad guest email was rejected by Zod and refused by a raw INSERT: uppercase, trailing and leading newline, empty local part, no TLD, double dot, label starting with a hyphen, two @, a space, non-ASCII, display-name form, 255 characters, empty. 254 characters accepted by both, so the boundary matches. Also refused: `created_at` infinity, -infinity, year 999; `anonymized_at` on a non-tombstone address; a tombstone without `anonymized_at`; a tombstone not matching the row id; consent source/status mismatches (checkout withdrawn, unsubscribe granted, erasure granted); unknown consent kind; consent `recorded_at` infinity; consent for a missing guest; completed request without `resolved_at`; open request with `resolved_at`; unknown request kind; a second open request of one kind; deleting a guest with a request (FK).

### Concurrency (real database)
- 50 parallel `findOrCreateGuest` with mixed-case spellings: one guest.
- 20 parallel `anonymizeGuest`: 1 anonymized, 19 already_anonymized.
- 10 rounds of anonymize, find-or-create, consent and request at once: no deadlock, one anonymization, the old row tombstoned, every latest consent withdrawn, one live guest for the freed address, at most one open request.

### Mutation checks (scratch only)
1. `.for('update')` removed from `lockGuestRow`: 7 tests failed. Caught.
2. `guests_anonymized_email_from_id` CHECK dropped: 2 tests failed. Caught.

### Non-blocking
None.

### Unconfirmed
None.
