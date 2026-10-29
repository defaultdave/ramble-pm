PASS

## spec-compliance: U-014a round 5 (head 70e4f6c)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- Round 3's spec re-checked by a three-way comparison against round 3 (6502a1d), its base (4714de3) and integration (527b494): every file whose head differs from the naive merge of both sides is a named resolution (`db/holds.ts`, `db/settings.ts`, `db/time.ts`, `db/locks.ts`: the `Transaction` import and type move only, the lock-order comment and lockers unchanged; `db/schema/index.ts` adds `./people` and `./jobs` beside `./holds`; the holds migration, journal and snapshot; `lib/privacy.ts`). No round 3 line lost. `lib/rateLimits.ts` holds both sides' lines; `lib/catalog.ts` and `lib/editorial.ts` carry the same `WriteIdSchema` hunk from both sides.
- Migrations: `0011_holds.sql` byte-identical to round 3's `0009_holds.sql` (sha256 6d12f98a...); the old `0009_holds.sql` and `0010_holds.sql` gone; the journal equals integration's plus idx 11 `0011_holds`; `0011_snapshot.json` `prevId` is integration's `0010` id; db:generate "No schema changes", db:check clean.
- PII inventory: `holds.device_key`, `holds.ip_hash` personal identifiers; the other 12 `holds` and 5 `hold_items` columns non-personal; `tests/pii-inventory.test.ts` passes.
- `tsc --noEmit` exit 0; targeted unit tests 475 pass. Full gates, e2e and test:db not run; the holds race question is qa-agent's (a 40P01 or wrong count would block).
