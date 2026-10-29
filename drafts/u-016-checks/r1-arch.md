FAIL

## architecture-audit: U-016 "Ledger and its views" (head 1d6ed20)

### Blocking
- B2, `src/server/db/ledger.ts` (~137, `readOrderFlows`): `if (rows.length > ledgerLimits.maxReadGroups) throw new RangeError(...)` is a threshold decision in the data layer. Fix: a tested `src/lib/ledger.ts` function (for example `assertWithinReadCap(groupCount)`).
- B7, `src/server/db/ledger.ts:40` `postEntries`: a non-type export imported only by tests, without `TODO(U-xxx): first caller` (the `read*` exports carry it). Fix: the TODO naming U-049.
- B7, `src/lib/ledger.ts` (68, 138, 179): `isCashPosting`, `LedgerEntrySchema`, `LedgerEventSchema` exported and imported from outside only by tests, no TODO. Fix: un-export and test through `parseLedgerEvent`, or add a first-caller TODO.

### Non-blocking
- SQL on the write path mirrors lib rules (`accounts_differ`, `names_a_subject` with the payout exemption, `provider_id_on_cash`, the partial unique index; the guard trigger refuses unconditionally).
- SQL aggregates on the read path are reductions; decisions stay in lib.
- Known gap, entry type to account pairing: enforced only by the builders; `postEntries` accepts any `LedgerEntryInput`, so `charge_tax` could debit `host_payable`. A real hole: a table of allowed pairs in `LedgerEntrySchema` would close it.
- B6: `postEntries` takes no `Caller` (PM ruling 3); B6 has no system-path exemption; record it.
- B17 audit items: `requireMinor` nearly repeats `requireInt` (`pricing.ts:44`) and other private integer guards; `jobs.ts:45` and `sessions.ts:30` keep their own readable-date windows beside the new `isReadableInstant`.

### Passed
B3, B12, B1, B4, B5, B9, B10, B13.
