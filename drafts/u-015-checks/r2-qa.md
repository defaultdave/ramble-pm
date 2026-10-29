PASS

## qa-agent: U-015 round 2 (head 1d6f86c)

Scratch copy of 1d6f86c (`git archive`, `pnpm install --frozen-lockfile`); nothing written to the repo or any worktree.

### Blocking
None.

### Gates
format:check, lint, typecheck, knip pass; unit 4514 in 193 files; build pass with DATABASE_URL unset; test:db once 1117 in 18 files; db:check "Everything's fine"; db:generate "No schema changes"; `0012_blank_text_checks.sql` the only migration after 0011.

### Migration 0012 on seeded data
Applied 0000 to 0011 to a scratch database, ran `SEED_TARGET=local pnpm db:seed` (14 experiences, 240 sessions, 5 collections, 29 coverage probes, no gaps), applied 0012 in one transaction: clean, data intact; re-running the seed idempotent with no gaps. Every statement is `DROP CONSTRAINT` or `ADD CONSTRAINT ... CHECK` (31 re-added CHECKs).

### Raw inserts against real Postgres (32 of 32 probes as expected)
- `orders.lead_guest_name` and `provider_events.provider_event_id` refuse U+00A0, U+FEFF, U+2028, U+2029, U+3000, U+1680, U+2003, U+202F, U+205F, VT, FF, three U+00A0, U+FEFF with U+00A0; accept U+200B, U+0085, U+180E, "a", U+00A0 around a letter (not JS `\s`).
- Round 1 inserts repeated: total off by one refused; EUR refused; array payload and over-32 KB payload refused.
- Builder's `orders.db.test.ts` and `blank-text.db.test.ts` pass.

### Mutation check
Replaced the class in all 34 occurrences in `0012_blank_text_checks.sql` with `[^[:space:]]`: 7 tests failed (orders lead guest name U+00A0, U+FEFF, mix; provider event id U+00A0, U+FEFF; collections title U+00A0, U+FEFF). Scratch only.

### Environment notes
- The shared Postgres hit "too many clients" (max 100) when other agents ran db tests at once, causing spurious mass failures in two runs; once connections fell, the full test:db passed first time.
- One earlier run used a scratch directory another agent had also used (stale probe files); discarded and redone in a clean copy.

### Non-blocking
- Terminal-status changes are not guarded in the database (ruled for U-047a and U-049).
