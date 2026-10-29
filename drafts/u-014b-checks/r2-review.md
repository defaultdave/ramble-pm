PASS

## review-agent: U-014b round 2 (head 27d326b)

Blocking: none.
Round 1: runbook stale window fixed (60 s, display never a decision). Round 2 refactor: `lapsedDeadline`, `cleanupReason` private; `holdsToRelease` exported, `releaseLapsedHolds` only runs updates; case tables kept plus mixed and empty `holdsToRelease` tests. Cross-session test: with `lockClientAddress` removed (scratch) two tests fail, the new 12-on-12 and "takes the address lock before the session row".
Merges: parents f35ae94 (6ebcb19, 99d4c8f) and 27d326b (f35ae94, 3287b4e); overlapping files (holds.ts, holds.test.ts, privacy.ts, db/holds.ts, locks.ts, _journal.json, checkout-races.db.test.ts) read against 3287b4e; PR diff exactly the 27 U-014b files; one lock header; `isHoldOfDevice` reused; `0018` byte-identical to old 0014, journal ends 0017, 0018, prevId chained.
Forced tests: `clearHolds` deletes in passes; `next/cache` mocks stub only `updateTag` and `revalidateTag`; `holds.db` gains an assertion that a capacity edit invalidates the session tag; U-047a's 20-round race keeps the same four racers and the zero-rejections assertion, only the payer is fresh per round. Paying holds count toward the 6-seat limit (`isOpenHold` counts paying before `paying_until`; supersede touches only active) as designed.
Non-blocking: `readDatabaseTime` takes a structural executor (small widening).
Ran (scratch): tsc clean; unit holds, pulse, spacesLeft 214 pass; db holds-races, checkout-races, hold-rules, holds, pulse 174 pass with `--maxWorkers=2`.
