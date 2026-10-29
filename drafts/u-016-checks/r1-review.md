FAIL

## review-agent: U-016 "Ledger and its views" (head 1d6ed20)

### Blocking
- `src/lib/ledger.ts` (`entryRuleIssues`, ~100-130) and `0014_ledger.sql`: nothing pairs an entry type with its accounts; the design doc's postings table fixes them, but only the builders follow it. `postEntries` accepts any `LedgerEntryInput`: `charge_commission` debiting `ramble_payouts` and crediting `platform_cash` passes Zod and every CHECK. The finance export and host statement compute gross, commission and refunded from `entryType` while balances come from the accounts, so the views would disagree; the table is append-only, so such a row can only be offset. Every later money unit posts through this entry point. Fix: a map in `src/lib/ledger.ts` from entry type to its allowed `(debit, credit)` pairs (including the multi-leg `refund_reversal`, `gift_reinstated`, `gift_to_*`, `dispute_to_host`, `dispute_loss`), enforced in `entryRuleIssues` and by a matching CHECK in `0014`, with a table-driven Zod test and a database refusal test.

### Non-blocking
- `0015_ledger_guards.sql:1` header comment says "apart from 0013"; after the renumber the schema migration is 0014.
- Non-cash events are not idempotent at the database (a replayed `refundRequested`, `refundFailed`, `giftRedeemed` double-posts); only the caller's locked state check prevents it, as the note accepted; each caller unit needs a retry-posts-once test.
- Statement and export rows are per `occurred_at` window, so a booking straddling a boundary shows partial rows in each; consistent, but U-080 and U-071 should know.

### Verified
Scope (17 files in the manifest); unit tests 275 and ledger db tests 60 pass in a clean scratch copy; every builder's accounts and amounts match the postings table; the trigger covers update, delete, truncate and binds the owner; `ledger_writer` INSERT and SELECT only; cash idempotency (unique index, `postOutcome`, savepoint; 12-way race tested); access (`requireRole(HostOwner, { hostId })` with a uniform refusal for six callers; staff views via `requireStaff`); reads bounded; Zod rules matched by CHECKs; nothing logged; no duplicates.
