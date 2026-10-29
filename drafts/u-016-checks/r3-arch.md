PASS

## architecture-audit: U-016 round 3 (head 9c13d24)

Static diff check. Round 2 PASS holds. Blocking 0.
- PR diff `3aab384...9c13d24` is exactly U-016's 17 files.
- Byte-identical to fbcd5c8: `src/lib/ledger.ts`, `ledger.property.test.ts`, `src/server/db/ledger.ts`, `schema/ledger.ts`, `schema/index.ts`, `src/lib/time.ts`, `tests/db/ledger.db.test.ts`, `ledger-read-cap.db.test.ts`, `ledgerParents.ts`.
- `0014_ledger.sql` renamed to `0015_ledger.sql`, 0 changed lines; `0016_ledger_guards.sql` differs only in the header; integration's `0014_host_notification_email.sql` and `0014_snapshot.json` identical; chain 3f20a1f2 (0013), c91009ec (0014), d70509cb (0015), 45aafded (0016); journal ends 0013_holds, 0014_host_notification_email, 0015_ledger, 0016_ledger_guards.
- `privacy.ts` union: against integration only U-016's 38 lines added; against fbcd5c8 only `hosts.notification_email`.
- New 36-line test: 25 hand-typed triples vs `ledgerPostings`, sorted both sides; each checked against design doc 4.2.3 lines 574-594.
Advisory unchanged: BC-15 (B6), BC-14 (B17).
