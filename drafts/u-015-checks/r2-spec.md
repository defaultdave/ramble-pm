FAIL

## spec-compliance: U-015 round 2 (head 1d6f86c)

Scratch copy of 1d6f86c; no write in the builder worktree.

### Round 1 probes at head
- Blank text against the real database: U+00A0, U+FEFF, U+2028 in `orders.lead_guest_name` and `provider_events.provider_event_id` refused (`orders_lead_guest_name_text`, `provider_events_event_id_text`); Zod's `requiredText` refuses the same. Clean.
- 1000 x `1e-300`: Zod refuses ("a number that needs an exponent"); a raw insert still gets 23514 from `provider_events_payload_object` (backstop). Clean.
- 130,000-element array: `ProviderEventSchema.safeParse` fails without throwing; 500,000 passes too. Clean.

### Round 2 items
1. PASS: `whitespaceClass` and `notBlankPattern` in `src/lib/text.ts`; `shared.ts` `notBlank` used by `catalog.ts` and `policies.ts`; no `[^[:space:]]` left; `0012_blank_text_checks.sql` drops and re-adds 31 CHECKs; the BMP comparison test; no seed or schema file contains those characters, so the re-add cannot fail on existing data.
2. PASS: `src/lib/payments.ts:211-235` refuses exponent numbers; `fits` runs before the walks; tests for 1000 x 1e-300, nested 1e21, the separator body; db backstop tests.
3. PASS: iterative `everyJsonNode`; 500,000 and 130,000 cases tested.
4. PASS: the port imports providers, methods, `attemptStatuses`, `providerEventTypes`, `orderCurrency` from lib; `fake.ts` too; no copies; no port test changed.
5. PASS: `manageHashAfterBump` tested; `tokens.ts:124` calls it.
6. PASS: TODO(U-049) on `isTerminal`; TODO(U-047a) on `orderAmountDueMinor`.
7. PASS: `taxMinor` (used by `lines()`) and `commissionMinor` (TODO(U-047a)) exported from `pricing.ts`; `roundHalfUpPpm` private; wrappers gone.
8. FAIL (blocking, below).
9. PASS: `checkExperienceRules` calls `addRuleIssues`.

Gates: unit 4514; db tokens, blank-text, orders 237; db:check clean; db:generate no changes.

### Blocking
- `src/server/tokens.ts:139-160` (`rehashTokens`): a full final page still counts against `maxBatches`, and the empty read that confirms the end needs one more batch. Two hashed orders with `rehashTokens('manage', { batchSize: 1, maxBatches: 2 })` rewrite both rows and then throw "The re-hash did not finish within its batch limit" (probe `tests/db/r2boundary.db.test.ts` in the scratch copy). Any row count that is an exact multiple of `batchSize` fails the same way, including 1,000,000 orders at the defaults. The new test passes only because its hashed count is odd. Fix: do not count the terminating empty read against the cap (check the cap only when another non-empty page is read, or allow `maxBatches + 1` reads); add a test with an even count and `maxBatches` equal to the exact page count; keep the "small maxBatches throws" case.

### Non-blocking
- `bumpTokenVersion` now computes the HMAC on every bump, so bumping an order with no manage hash needs the secret; fails closed.
- `rehashTokens`: `storesHash` returns before `rehashLimits`, so invalid limits for kind `order` pass silently (no row touched).
- The "largest separator body" test uses 8,187 elements; the largest accepted is 8,188.
