PASS

## review-agent: U-015 round 2 (head 1d6f86c)

Scratch copy of 1d6f86c: typecheck and lint clean; `pnpm test` 4521 of 4521; db:generate "No schema changes"; db:check clean; test:db once 1123 of 1124 (the known load-sensitive `tests/db/email.db.test.ts` webhook test timed out; it failed one standalone rerun and passed 79 of 79 on the next; flaky under load, not U-015).

### Round 1 finding (duplication)
Resolved: the port imports `paymentProviders`, `paymentMethods`, `attemptStatuses` (as `PaymentStatus`), `providerEventTypes`, `orderCurrency` from lib; its copies deleted; `fake.ts` imports from lib; no remaining copies.

### Blocking
None.

### Round 2 items
1. Blank text done: `whitespaceClass` and `notBlankPattern`; one `notBlank` in `shared.ts`; no `[[:space:]]` left. Migration check: a scratch database at 0011 had 202 CHECK definitions; after 0012 exactly 31 changed, each only in the character class. Migrated to 0011, ran `db:seed` (14 experiences, 240 sessions, 5 collections, 4 legal documents), applied 0012 without error. BMP comparison test passes. Refusal tests pass (`collections.title` and `provider_event_id` lack a U+2028 case; covered by the shared class and the BMP test; not blocking).
2. Payload size done: `hasPlainNumbers` refuses any number whose `String` form contains `e`; worst-case expansion without exponents is 1.5x, under the 2x stored cap; tests cover the cases and the raw 23514 backstop.
3. Iterative `everyJsonNode` done; refinements guarded by `fits`; 500,000 and 130,000 cases tested.
4. Port imports from lib done.
5. `manageHashAfterBump` done and tested.
6. TODOs done.
7. `taxMinor`, `commissionMinor` in `pricing.ts` done; `roundHalfUpPpm` private; wrappers removed.
8. `rehashTokens` limits done (short-page stop, `rehashLimits` validated before any row, db tests across pages of 2, small `maxBatches` throws, tokens resolve, invalid limits throw).
9. `checkExperienceRules` uses `addRuleIssues`.
No changes outside these nine items; journal and 0012 snapshot consistent.

### Non-blocking
- `src/server/db/schema/catalog.ts` near line 70: an orphaned comment ("A row the Zod schema ... must refuse whatever that schema refuses") above a blank line where `notBlank` was; move or delete.
- Logged: `jsonByteLength` vs `payloadBytes` in `jobs.ts`; `pickCapabilityTokenSecret` vs `pickFormGuardSecret`.
