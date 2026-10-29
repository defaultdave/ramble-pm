PASS

## qa-agent: U-015 "Orders, attempts, events, refunds, transfers schema" (head 37bb8ea)

Scratch copy of 37bb8ea (`git archive`, `pnpm install --frozen-lockfile`); no writes to the repo or any worktree; no UI.

### Blocking
None.

### Gates
format:check, lint, typecheck, knip pass; test 4485 in 192 files; build pass with DATABASE_URL unset; test:db once 1101 in 17 files; db:check "Everything's fine"; db:generate "No schema changes"; `0011_orders_and_payments.sql` the only migration after 0010.

### Raw inserts against real Postgres (a throwaway schema from the migrations)
Refused: total off by one, amount due off by one, tax off by one, commission off by one, order currency EUR, attempt currency EUR, a second live order on one hold (with the key index dropped to isolate `orders_one_live_per_hold`; accepted after the first is void), a second live attempt (accepted after the first succeeded), a malformed attempt `provider_key`, a duplicate provider event, an array payload and a payload over 32 KB, a refund amount not ticket plus tax, `refunded_ticket_minor` above the subtotal.

### Token flow
`tests/db/tokens.db.test.ts` passes: manage and order tokens make and resolve; wrong, unknown or other-kind tokens resolve to nothing; after a bump old tokens die and rebuilt ones resolve; a rotation kills old-secret tokens and the re-hash makes new-secret tokens resolve, rewriting only hashed orders.

### Mutation checks (both caught)
1. Dropped `orders_total_is_subtotal_plus_tax` and the `payment_attempts_one_live_per_order` index: 5 tests failed.
2. Removed `.for('update')` from `lockOrderTokenState`: 2 tests failed (concurrent bumps; waiting for the holder's commit).
Both restored; 221 of 221 pass.

### Non-blocking
- The database does not refuse a terminal-status change (raw SQL moved a `cancelled` order back to `pending_payment` and a `succeeded` attempt back to `processing`); terminal states are enforced by the `src/lib` transition functions, which the writer units (U-047a, U-048, U-049 and others) must route every status write through. A trigger would be the stronger guard.
- Re-hash batching and the cap untested; bounded and throws at the cap.
- `CAPABILITY_TOKEN_SECRET` fails closed outside test.
