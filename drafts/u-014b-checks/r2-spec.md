PASS

## spec-compliance: U-014b round 2 (head 27d326b)

Static read; the `3287b4e...27d326b` diff is 27 files, all U-014b or named forced test changes.
Round 1 criteria still met: supersede via U-047a's `isHoldOfDevice` (`src/lib/holds.ts:598`); device-or-address limit with `lockClientAddress` after the device lock and in the header; block, cleanup, scrub, cache, invalidation unchanged; nothing out of scope.
Round 2 fixes (5494e6f..6ebcb19): `lapsedDeadline` private, tested through `blockRefusal`; `cleanupReason` private, `holdsToRelease` with single, mixed and empty tests; cross-session race test (12 devices, 12 sessions, 5 rounds, 6 held, 6 blocked, 6 seats); runbook states the 60 s stale window.
Merges: f35ae94 parents 6ebcb19 and 99d4c8f; 27d326b parents f35ae94 and 3287b4e; no U-047a, U-016, U-054 or sync file in the PR diff; `locks.ts` diff is one header line and `lockClientAddress`. Forced tests: `clearHolds` deletes hold_items then unreferenced holds in a loop; `checkout-races.db.test.ts` adds a `next/cache` mock and only changes the actor to a fresh payer per round, same four concurrent calls, no assertion loosened. A paying hold counts toward the device limit, consistent with the rule.
Migration: `0018_hold_limit_indexes.sql` character-for-character the old 0014; journal 19 entries ending 0017, 0018.
Blocking: none. Not checked: gates, live races, merge-tree equivalence beyond parents and file sets.
