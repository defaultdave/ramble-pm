PASS

## spec-compliance: U-048 round 3 (head 70caceb)

Static read. `git merge-tree --write-tree 6de1064 16231c0` gives fc128ae, differing from the head only in `locks.ts` (conflict markers). `git diff 16231c0 70caceb` lists 20 files, all U-048's (no hold, migration, `holdFixtures`, session, pulse or `spacesLeft` file), so `0018_hold_limit_indexes`, `clearHolds` and the supersede change match 16231c0. PR diff the same 20 files (3429 insertions, 10 deletions). `locks.ts` keeps every function, one header (0 events, 1 device then `lockClientAddress`, 2 session, 3 hold, 4 order `lockOrderRow`/`lockOrderById`, 5 attempt, 6 gift), no body changed. `lockClientAddress` at `holds.ts:247` right after `lockDevice` (`:246`); the provider path never takes the device or address lock. Round 2 holds.
