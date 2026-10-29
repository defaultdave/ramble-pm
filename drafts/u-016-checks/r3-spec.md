PASS

## spec-compliance: U-016 round 3 (head 9c13d24)

Blocking: none; round 2 holds.
- Merge lost nothing: U-054's `0014_host_notification_email` in the journal, `0014_snapshot.json` byte-identical to integration; `privacy.ts` differs from fbcd5c8 only by `hosts.notification_email`; U-016 ledger files unchanged apart from migration numbers, the 0016 header and the new test.
- PR diff `3aab384...9c13d24` is U-016's 17 files.
- `0015_ledger.sql` equals the old `0014_ledger.sql` (empty diff); `0016_ledger_guards.sql` differs only in line 2's header.
- Journal ends 0013_holds, 0014_host_notification_email, 0015_ledger, 0016_ledger_guards; chain 0014 c91009ec (prev 3f20a1f2), 0015 d70509cb, 0016 45aafded.
- New test "is exactly the postings table of design doc 4.2.3": length 25 and sorted equality; every triple matches.
Unconfirmed: read only, not run.
