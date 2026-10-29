PASS

## qa-agent: U-048 round 3 (head 70caceb)

Blocking: none. `git merge-tree --write-tree 6de1064 16231c0` conflicts only in `locks.ts`; its tree (6ecc90d) differs from the head only there, by the 4 resolved marker lines; parents 6de1064 and 16231c0. `diff 6de1064 70caceb` lists 27 files (26 U-014b, none differing from 16231c0, plus `locks.ts`); PR diff the same 20 files (3429/10). `locks.ts` keeps every export (`lockFor`, `lockDevice`, `lockClientAddress`, `lockSessionRow`, `lockHoldRow`, `lockOrderRow`, `lockOrderById`, `lockOrderEvents`, `lockAttemptRow`), no body changed, one header 0 to 6. `lockClientAddress` only at `holds.ts:247` between `lockDevice` and `lockSessionRow`; the events path never takes device or address; checkout takes session, hold, order, attempt: no cycle.
Gates (scratch, frozen lockfile): full db suite 30 files 1506 pass with `--maxWorkers=2` (includes provider-events, holds-races, checkout-races); unit on touched areas 476 (8 files); tsc clean.
Signed success through the real route and drain: bad signature 400; success 200, one row; drain claims 1 succeeds 1; attempt `succeeded`, order `pending_payment`, hold `paying`; event `attempts` 1, `last_error` "Order confirmation is not available yet"; jobs `...:0` succeeded and `...:1` pending about 26 s ahead; second drain claims 0; redelivery 200 with two job rows.
Non-blocking: 19 migrations, not 20 (brief miscount); round 2 notes stand.
