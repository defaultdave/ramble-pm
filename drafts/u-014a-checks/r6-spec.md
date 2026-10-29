PASS

## spec-compliance: U-014a round 6 (head 26a0737)

### Blocking
- None.

### Non-blocking
- Integration (db8695b) carried six TODO comments naming U-014a; the merge removed them, each resolved by head code or moved to a named open unit: the two `pricing.ts` "first caller, the held total" TODOs (now called from `src/server/db/holds.ts:161-164`); `sessions.ts` "count the open holds" (now `readOpenHeldSeats`, `src/server/db/sessions.ts:31,216,250`); `settings.ts:17` rewritten to name U-047a and U-064a; `rate-limit/bot-check.ts` and `rate-limit/index.ts` (the BotID and `reserve` wiring in place; U-004a, U-038, U-043, U-047a, U-055 follow-ups still named). No integration line lost beyond these comments.

### Unconfirmed
- Tests read, not run (race and gates are qa-agent's and the builder's). Round 3 spec present at head (`spendsReserveTry` at `src/lib/holds.ts:361`; the action call at `src/server/actions/holds.ts:31`; `releaseHold` writes `updatedAt: at` at `src/server/db/holds.ts:293`).

### Checks
- `014c352` touches only `tests/db/holdFixtures.ts` and `tests/db/holds-races.db.test.ts`; the fixture stamps `now()` only when no `createdAt` is given; `describeFailure` reports `cause.code` and `cause.message`.
- No holds, lock, transaction, settings, time, sessions or action file differs between `70e4f6c` and head.
- `0013_holds.sql` byte-identical to `70e4f6c`'s `0011_holds.sql` (sha256 6d12f98a...); the journal ends 0011, 0012, 0013; snapshot chain correct (0013.prevId = integration's 0012 id f891272c).
- `Transaction` from `./client` in `db/holds.ts`, `locks.ts`, `settings.ts`, `time.ts`.
- `src/lib/privacy.ts` holds entries present with no deletions against either side.
- `schema/holds.ts` imports only `isReadableDate` from `./shared`; no holds column depends on `notBlank`.
