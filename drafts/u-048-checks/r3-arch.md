PASS

## architecture-audit: U-048 round 3 (head 70caceb)

Static read. `git merge-tree --write-tree 6de1064 16231c0` differs from the head's tree only in `src/server/db/locks.ts` (4 lines: conflict markers and a duplicate device-lock header line); the single header is correct. The head differs from 16231c0 in exactly the 20 U-048 files; no U-014b file differs. `locks.ts` against 16231c0 only adds `lockOrderEvents`, `lockOrderById` and the `orderEventsLockKey` import; `lockClientAddress` untouched; only 3 header-comment lines removed; one header 0 to 6; no body changed. `lockClientAddress` is called only at `src/server/db/holds.ts:247` (reserve path, after the device lock, before the session row); the provider path (`db/providerEvents.ts:288`) takes `lockOrderEvents` first and never the device or address lock: no cycle. Round 2 holds.
