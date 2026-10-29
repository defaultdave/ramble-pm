FAIL

## architecture-audit: U-014b "Hold rules and upkeep" (head 5494e6f)

Static audit.
### Blocking
- B7, `src/lib/holds.ts` `lapsedDeadline`: exported, imported only by `holds.test.ts` and `blockRefusal` in the same file, no first-caller TODO. Fix: un-export, test through `blockRefusal`. (Every other new export has a non-test importer.)
- B2, `src/server/db/holds.ts` `releaseLapsedHolds`: `locked.filter((hold) => cleanupReason(hold, at) === reason)` in a loop over `['expired', 'payment_abandoned']` splits holds by reason in the data layer. Fix: `holdsToRelease(locked, at)` in lib returning `{ expired: string[]; payment_abandoned: string[] }`, with a unit test.
### Non-blocking
- B10 vs design doc 4.2.3: the doc orders supersede, then limits, then spaces left; the builder reads candidates, checks, inserts, then writes the supersede (same result: refusal writes nothing, superseded seats excluded). The doc's lock order (device, session, hold, order, gift) has no address lock; `lockClientAddress` is always right after `lockDevice`, documented in `locks.ts`, no deadlock seen. Record both in the delta log (plan files are frozen).
- B2 borderline: `readSessionSpacesLeft` `rows.flatMap(...)` drops null-padded join rows (shape narrowing); `.limit(deviceSeatLimit + superseded.length)` is bound arithmetic.
- B5, B6, B9, B12, B13, B14, B17 clean.
Unconfirmed: whether `updateTagsForChanges` in `reserveSpaces`, `releaseHold`, `updateSessionAllocation` is only reached from Server Actions.
