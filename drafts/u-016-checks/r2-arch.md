PASS

## architecture-audit: U-016 round 2 (head fbcd5c8)

Read the 12-file delta 1d6ed20..fbcd5c8 and the design doc; no tests run.
Round 1 findings fixed: B2 read cap (`assertWithinReadCap` in `src/lib/ledger.ts`, `readOrderFlows` only calls it); B7 `postEntries` (`TODO(U-049): first caller, confirmOrder`); B7 `isCashPosting`, `LedgerEntrySchema`, `LedgerEventSchema` un-exported; known pairing gap closed (`ledgerPostings` through `isAllowedPosting` in Zod and the CHECK).
Postings table vs `ledgerPostings`: all 23 types and 25 pairs match the design doc row by row (`refund_reversal`: `refunds_pending` to `host_payable` and to `ramble_commission`; `gift_reinstated`: `host_payable` and `ramble_commission` each to `gift_liability`; gift redemption, dispute open and lost, `charge_tax`, `charge_commission` credits `ramble_commission`, `ramble_payout` debits `ramble_payouts`). Worked example's figures use the matching pairs (not run).
CHECK `ledger_entries_entry_type_accounts` in 0014 lists the 25 tuples in map order; the schema builds it from `ledgerPostings`, so they cannot drift.
Migration chain: 0013 (3f20a1f2), 0014, 0015 chain by `prevId`; journal idx 13 `0013_holds` identical to integration, then `0014_ledger`, `0015_ledger_guards`; 0015 header says 0014.
Scope: ledger files, migrations, tests only.
Advisory: B6 no system-path exemption (recorded, BC-15); B17 `requireMinor` vs `requireInt`, readable-date windows (BC-14); 0014 collision not a failure.
