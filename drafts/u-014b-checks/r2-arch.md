PASS

## architecture-audit: U-014b round 2 (head 27d326b)

Static audit. Round 1 fixed: B7 `lapsedDeadline` private, tested through `blockRefusal` (two newer lapses so `until` is the candidate's deadline + 15 min); B2 `releaseLapsedHolds` calls `holdsToRelease(locked, at)` and only runs the updates; `cleanupReason` private; `holdsToRelease` unit tests (table, mixed set order and uniqueness, empty).
Final head: every new export has a non-test importer (B7 clean); no new decision `.filter(`/`.sort(`/`.reduce(` in `src/server/db/holds.ts`. Merges: `holdsToSupersede` uses U-047a's `isHoldOfDevice` (no duplicate, B17); one `locks.ts` header device, `lockClientAddress`, session, hold, order `lockOrderRow`, gift, `lockAttemptRow` alone (B10); no new layer violations, no `Date.now()` or argument-less `new Date()` (B12), no empty catch (B13); `getSpacesLeft` validates input before the cache key, uses `readRemoteOrFallback`, tags `tags.session(id)` (B14).
Carried non-blocking: supersede order and the address lock recorded in the delta log; `readSessionSpacesLeft` `flatMap` shape narrowing; `updateTagsForChanges` reachability (BC-16).
Not checked (outside architecture): merge losses, forced test changes, 0018 SQL.
