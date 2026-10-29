PASS

## spec-compliance: U-054 round 2 (head d0695c0)

- Round 1 non-blocking items: the `bookingBody.ts` test gap closed by `src/lib/email/bookingBody.test.ts` (each body function). Sink-mode raw-token location is a PM ruling.
- Merge integrity: `0013_holds.sql` and `meta/0013_snapshot.json` byte-identical to integration 8b89ea7; journal 0000 to 0013 then 0014; `0014_host_notification_email.sql` byte-identical to the old 0013 SQL; 0014 snapshot `prevId` is integration's 0013 id. Deleted lines against integration only the intended `templates.ts` restructure (`dev-check` still registered), the `registry.ts` TODO removal, message test and types edits. `privacy.ts` keeps holds rows and adds `hosts.notification_email`; `catalog.ts` has the matching CHECK.
- Round 2 changes: `basicUtc` whole seconds; greeting `Hi <name>. <reason>`; `BookingEmailError`, `liveManageToken` unexported.
- AC mapping unchanged and PASS for all ACs.
- Scope: 43-file branch diff within the manifest.
- Not checked: test execution.
