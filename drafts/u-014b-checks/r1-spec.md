PASS

## spec-compliance: U-014b "Hold rules and upkeep" (head 5494e6f)

Static read of the diff, units.yaml and the U-014a pattern note. Blocking: none.
- Supersede: `readSupersedeCandidates`, `holdsToSupersede`, update in `reserveSpaces`; only the device's open `active` holds on the session, `superseded_by` set; `paying` and other devices never superseded; after block, limit and spaces checks so a refusal writes nothing; superseded seats free for the new party.
- Device limit 6: `holdLimits.deviceSeatLimit`, `seatLimitRefusal` (`blocked`/`device_limit`); `sameClient` counts device or address (amendment 4, PM ruling); `lockClientAddress` after the device lock, header updated.
- 15-minute block: `lapsedDeadline`, `blockRefusal` count by deadline; 3 in 15 minutes, `until` third most recent deadline + 15 min; `guest_left` only at or after deadline; superseded, session_cancelled, sold_out_after_lapse, converted excluded; scan bounded at 100.
- Cleanup: `releaseLapsedHolds` locks each session and re-judges at database time; `scrubReleasedHolds` after 30 days; pulse after drain and purge in capped batches; pulse response fields; runbook; privacy deletion paths describe the scrub; `0014_hold_limit_indexes` three indexes.
- Cached spaces left: `getSpacesLeft` `'use cache: remote'`, `cacheLife('spacesLeft')` (`cacheProfiles.ts:27`), `cacheTag(tags.session(id))`, through `readRemoteOrFallback`.
- Invalidation: `updateTagsForChanges` in `reserveSpaces`, `releaseHold`, `updateSessionAllocation`; `revalidateTagsForChanges` from cleanup; `spaces` maps to `tags.session(id)`; U-014b TODOs removed.
- Scope bounds kept; `TODO(U-106)`, `TODO(U-040): first caller`.
Non-blocking: tests exist per item; quality not audited.
