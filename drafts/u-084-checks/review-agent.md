# U-084 review, final round

Head: a0f84569c43b756bf6d9ab9f61e14747accde2c6 (3 commits over origin/main; 29 files, +2216/-131; size is not a failure per Dave's rule)

## Verdict: PASS (APPROVE_WITH_NITS)

Blocking: none. Scope: all changes within U-084. tests/db/authz-matrix.db.test.ts untouched (empty diff vs origin/main). Lib and component unit tests re-run: 5 files, 128 tests pass. DB tests were not run (no DB here); read only.

## Checks
- Restore: statusBeforePause reads the latest experience.paused row by audit id desc (src/server/db/experiencePause.ts), so latest pause wins (test "latest pause, not an earlier one"). Pause from guide_only then unpause returns guide_only (tested). No audit row falls back to live (tested). Link-out removed while paused: restoredStatus downgrades guide_only to live, so experiences_guide_only_has_link (schema/catalog.ts:242) cannot fail the transaction (tested). Editor changes while paused do not affect it: only the from_status and linkOutUrl are consulted, read from the locked row. Unsuspend runs each row through the same moveExperiences, so each experience gets its own status (tested). Audit rows record from/to correctly: pause {from: row.status, to: paused}, unpause {from: paused, to: restored}.
- updateExperience migration: before/after place logic, tags, audit, visibility gating, unchanged/invalid/reference_missing, and not_found (bad id, missing row) all preserved; invalidation still after commit via commitThenInvalidate. The extra host-row re-check in withLockedExperience only matters if hostId is rewritten, which it never is.
- Deadlock: every experience write path that takes the host lock (edit, approve, pause/unpause, suspend) takes host then experience. photos.ts:198 locks the experience only and never a host afterwards; updateHost locks the host only. No experience-then-host path found, so no cycle. Suspension locks its experiences while holding the host lock, so single-experience paths queue behind it.
- Guide_only pause: paused is not in guestVisibleStatuses, so a paused guide entry leaves the public side as intended; the pin test and pausableStatuses = guestVisibleStatuses hold.
- hostSetup.ts conflict resolution: inviteNoticeFor / inviteFailureNotices still imported and used (lines 461, 498) alongside noticeText/parseNotice; hostPageNotice reads host notices first, then pause ones.
- Test coverage: no loss seen; db tests added for guide_only, latest-wins, link removal, no-audit, suspension round trip, concurrency.

## Nits (non-blocking)
1. src/lib/experiencePause.ts notices: `unpaused` says "It is live." and `unsuspended` says "...are live", wrong for a restored guide entry; suspensionUndoText says "live again" likewise. Say "restored" or "back as it was".
2. `not_live` title and the host-page "live" wording (liveCount, suspensionLiveText) count guide entries too; "that guests can see" is accurate, "live" is loose.
3. statusBeforePause takes the latest pause row even when the experience reached paused outside the app after an older unpause; a stale from_status could be restored. Extreme edge, and the link-out guard keeps it safe. Could note it in a comment.
