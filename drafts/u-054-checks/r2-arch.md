PASS

## architecture-audit: U-054 round 2 (head d0695c0)

Static reading of git objects at d0695c0 against `.claude/standards/architecture.md`.

Round 1 findings: B7 `BookingEmailError` fixed (no longer exported, `src/server/jobs/bookingEmails.ts:34`; db test asserts the message). B7 `liveManageToken` fixed (`:56`). Remaining exports are the job contract (`BookingEmailPayloadSchema`, `BookingEmailPayload`, `sendGuestConfirmation`, `sendHostBookingNotice`). Advisory `maxMoneyLines` fixed: `MAX_LINES` in `src/lib/pricing.ts:9` imported by `orderSummary.ts`, `bookingTemplates.ts`, `src/server/db/bookingEmails.ts` (and integration's `holds.ts`).

Merge integrity: `0013_holds.sql` byte-identical to integration's at 8b89ea7, its snapshot present; journal ends 0011, 0012, 0013_holds, 0014_host_notification_email; 0014 SQL is the `notification_email` column plus its CHECK on `hosts`; 0014 snapshot `prevId` is integration's 0013 snapshot id; `src/lib/privacy.ts` adds only the `notification_email` entry (union).

Round 2 delta: B2 (greeting and second truncation in `src/lib/` with tests), B12 (no `Date.now()` or argument-less `new Date()`), B17 (shared constant, no new duplication), scope (13 files, fixes, tests, migration). No new advisories.
