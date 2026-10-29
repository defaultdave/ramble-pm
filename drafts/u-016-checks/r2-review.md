PASS

## review-agent: U-016 round 2 (head fbcd5c8)

Blocking: none.
Round 1 fixed: pairing (`ledgerPostings` for all 23 types; `entryRuleIssues` refuses others through `isAllowedPosting`; CHECK `ledger_entries_entry_type_accounts` generated from the map; db tests insert around Zod: mispaired cash row and wrong-type refund leg refused with the constraint named, all multi-leg legs accepted); 0015 header says 0014.
Verified: every pair against design doc 4.2.3 (lines 574-594) by hand (`gift_to_tax` credits `host_payable`; `dispute_fee` processing_fees to platform_cash; both legs of `refund_reversal` and `gift_reinstated`; `dispute_to_host`, `dispute_loss` into `dispute_hold`); the 25 CHECK triples and the 25 map triples identical by sorted diff; journal 0013 (unchanged), 0014_ledger, 0015_ledger_guards, ids chain 3f20a1f2 to 364d3a24; integration's 0013 files byte-identical; read cap in lib; B7 exports and TODOs; scratch run: `src/lib/ledger*` 301 pass, `tests/db/ledger*` 66 pass with `--maxWorkers=2`, tsc and knip clean; scope 17 files as in round 1.
Non-blocking: the table-driven test derives expected pairs from `ledgerPostings`, so a later wrong edit to the map would pass it; a literal table from the doc would catch that (not needed now). Round 1 caller-unit notes stand (BC-12, BC-13).
