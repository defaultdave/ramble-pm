PASS

## qa-agent: U-014b round 2 (head 27d326b)

Scratch export, removed. Round 1 items: the cross-session test (12 devices, one address, 12 sessions, 5 rounds, 6 held) passed 4 runs; with `lockClientAddress` commented out (`src/server/db/holds.ts:247`) it fails ("expected length 6 but got 12") and so does "takes the address lock before the session row"; restored. `0018_hold_limit_indexes.sql` byte-identical to the old 0014; journal ends idx 17, 18; 19 sql files. Runbook stale-window lines added.
Db suite: 29 files, 1473 pass with `--maxWorkers=2`, no 53300, each file migrating all 19 from zero; `src/lib/holds.test.ts` and `src/server/pulse.test.ts` 204 pass.
Pulse probe: pulse 1 released 232 lapsed active plus 1 abandoned paying (`holdsReleased: 233`, three `revalidateTag(session:<id>, 'max')` calls), abandoned reason `payment_abandoned`, live paying and active untouched; pulse 2 after aging 100 to 31 d and 132 to 29 d 23 h scrubbed exactly the 100; pulse 3 0 and 0; a fresh device then held.
Merge fidelity: PR diff exactly the 27 files; the 7 files also changed on integration read, nothing lost; `clearHolds` and the `checkout-races` changes weaken nothing; paying holds count toward the limit (`src/lib/holds.ts:206`). Scope clean.
