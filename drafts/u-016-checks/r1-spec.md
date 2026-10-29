PASS

## spec-compliance: U-016 "Ledger and its views" (head 1d6ed20)

### Blocking
None.

Every item of the pattern note and every clause of the scope line is implemented: the 15 builders cover all 23 entry types and all 15 rows of the postings table with the right accounts; the CHECKs, the partial unique index, the append-only trigger, the `ledger_writer` role, `postEntries` (savepoint, `already_posted`, half-posted throw), and the views with their `requireRole` and `requireStaff` gates are present.

### Non-blocking
- The dispute builders' TODO names U-079b, but units.yaml gives disputes to U-081 ("Dispute record"); the TODO should name U-081.
- Entry type to account pairing is enforced only by the builders; worth a pairing table or CHECK.
- The amount cap is `orderLimits.maxMinor` (`src/lib/orders.ts`, 2,000,000,000), used by Zod and the CHECK; the note said "derived from `pricing.ts`"; no new magic number, passes.
- `src/lib/privacy.ts` classifications follow from PM ruling 2; in scope.

### Unconfirmed
- Tests read, not run.
