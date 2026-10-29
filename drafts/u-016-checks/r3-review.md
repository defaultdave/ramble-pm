PASS

## review-agent: U-016 round 3 (head 9c13d24)

Blocking: none. Non-blocking: none new; the literal-table gap from round 2 is closed by the new test.
Verified: merge commit parents fbcd5c8 and 3aab384; PR diff the 17 U-016 files. U-054's `0014_host_notification_email.sql` and `0014_snapshot.json` byte-identical to 3aab384; `privacy.ts` vs fbcd5c8 only U-054's 9 lines, `ledger_entries` entries kept. Ledger source and db tests no diff against fbcd5c8; `ledger.test.ts` only the new test. `0015_ledger.sql` byte-identical to the old 0014; `0016_ledger_guards.sql` header only. Snapshots chain 3f20a1f2, c91009ec, d70509cb, 45aafded; 0015 adds only `public.ledger_entries` beyond 0014; 0016 equals 0015 apart from ids (parsed JSON). Journal idx 14, 15, 16 as expected. New test: 25 triples plus `toHaveLength(25)`, each checked against design doc 4.2.3 lines 574-594; sorted comparison, so an edit to the map alone now fails it. Scratch run: `src/lib/ledger`, `privacy`, `time` 374 pass; `tests/db/ledger` 66 pass with `--maxWorkers=2`; tsc, knip clean; no `console.` in ledger sources.
