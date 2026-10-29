PASS

## qa-agent: U-014b "Hold rules and upkeep" (head 5494e6f)

Gates rerun: unit plus components 4740 (200 files); db 1277 (21 files) with `--maxWorkers=2`, no 53300; e2e 160 with the lock and sandbox off (`CachedReadError` lines come from the outage specs); typecheck, lint, knip, format, db:check pass.
Probes (scratch only, removed): supersede x3 leaves one open hold, `superseded_by` chains 1 to 2 to 3, `updateTag` thrice; a refused `device_limit` reserve leaves the earlier hold; an exact fit (4 + 2 on the address) held; three devices on one address refused the 7th seat across two sessions; a rotated address (same cookie, new IP) still limited; block `until` = third deadline + 15 min, retry before blocked, at `until` held, `blockRefusal` at `until - 1 ms` blocks and at `until` returns null; pulse released 232 lapsed holds across batches (`holdsReleased: 232`, `revalidateTag(session:<id>, 'max')`), block still counts after release, after aging 31 days all scrubbed, second pulse 0, device held again after scrub, 29 d 23 h kept its hashes.
Address lock mutation: removing `lockClientAddress` fails only "takes the address lock before the session row"; the builder's twelve-devices test reserves one session, so the session lock alone passes it. QA's cross-session probe (12 devices, one address, 12 sessions at once) held 10 seats without the lock, worst of 8 rounds 6 with it.
Non-blocking: add a cross-session race test so the behaviour itself guards the address lock; migration 0014 renumber pending.
Not covered: `updateSessionAllocation` tag probe; `getSpacesLeft` under a real Next runtime cache (tag calls asserted through the mock).
