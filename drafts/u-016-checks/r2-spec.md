PASS

## spec-compliance: U-016 round 2 (head fbcd5c8)

Blocking: none.
Round 1 items: dispute builders `TODO(U-081)` (`src/lib/ledger.ts:737,767,790`), `rambleSelfPayout` keeps `TODO(U-079b)` (`:718`); `ledgerPostings` (`:80`) with `entryRuleIssues` refusing other pairs; CHECK `ledger_entries_entry_type_accounts` from the same map in the schema (`schema/ledger.ts:102`) and `0014_ledger.sql:24`.
`ledgerPostings` vs design doc 4.2.3: all 23 types, 25 pairs match (read against the table and the worked example, platform_cash 125.93, host_payable 110.50): charge_host_share, charge_tax platform_cash to host_payable; charge_commission platform_cash to ramble_commission; processing_fee, dispute_fee processing_fees to platform_cash; transfer_to_host host_payable to platform_cash; transfer_reversal platform_cash to host_payable; refund_host_share, refund_tax host_payable to refunds_pending; commission_returned ramble_commission to refunds_pending; refund_cash_out refunds_pending to platform_cash; refund_reversal refunds_pending to host_payable and to ramble_commission; gift_liability_in platform_cash to gift_liability; gift_to_host_share, gift_to_tax gift_liability to host_payable; gift_to_commission gift_liability to ramble_commission; gift_refund gift_liability to refunds_pending; gift_reinstated host_payable and ramble_commission to gift_liability; ramble_payout ramble_payouts to platform_cash; dispute_withdrawal dispute_hold to platform_cash; dispute_reinstated platform_cash to dispute_hold; dispute_to_host host_payable to dispute_hold; dispute_loss dispute_losses to dispute_hold.
CHECK lists the same 25 tuples in map order; built from the map; in the 0014 snapshot.
Migrations: journal 14 `0014_ledger`, 15 `0015_ledger_guards` after integration's `0013_holds`; 0014 `prevId` 3f20a1f2 (integration 0013), 0015 `prevId` 364d3a24 (0014); 0015 header says 0014.
Other: `assertWithinReadCap` (`src/lib/ledger.ts:261`) called by `readOrderFlows` (`src/server/db/ledger.ts:140`); `postEntries` `TODO(U-049)` (`:32`); exports removed.
Scope: 17 files in ledger, privacy, time, db tests. Unconfirmed: tests read, not run.
