PASS

## review-agent: U-017 "Gift tables and state machine" (head 440e33e)

### Blocking
None.

### Non-blocking
- Scope: every file in the diff is in scope or forced. src/lib/privacy.ts is forced (the pii-inventory test needs every new column classified). src/server/db/giftTokens.ts is forced (tokens.ts may not query the database; it follows the orders token helper). tests/db/giftFixtures.ts is forced by the new orders.gift_id and ledger gift_id foreign keys. The five existing db tests (confirmOrderFixtures, ledger-table, ledger-views, orders-money-status, orders-rows) are forced: each used a random gift id the new FK refuses. The capabilityTokens storesHash to canRehash rename is forced: with the gift re-hash dropped, `gift` must not be a hash-rehash kind, and the old name would have said it was. Nothing for purchaseGift, redeemGift, delivery, pages, emails, or holds.gift_id (holds.ts:54 is still a bare uuid).
- Dropped states: giftStatuses and the enum hold four states, with no refund states; the transition table matches the design doc rows for those four.
- tokens.ts: gift resolve is fail-closed (shape check, hash lookup, then secureEqual against the rebuilt token for the row's current version; an unknown, other-kind, or old-version token gives null). The bump locks the gift row FOR UPDATE and reads the version under the lock, writes version and hash in one UPDATE, and throws RangeError at 2147483647 (the integer column's max) rather than wrapping. Tests cover the lock wait, six concurrent bumps, rollback, and overflow.
- CHECKs match their lib rules: recipient name 120 and message 300 (giftLimits), label 80 (orderLimits.itemLabel), value (orderLimits.maxMinor), item quantity, price, tax (MAX_QUANTITY, MAX_UNIT_PRICE_MINOR, PPM), email (emailAddressPattern, maxEmailAddressLength), token hash (tokenHashPattern), send_at at most 365 days after created_at (giftLimits.sendHorizonDays), readable dates. Each CHECK has a refusal test in gifts-constraints.db.test.ts.
- giftInDate is a pure instant comparison, `at < validUntil`, so no timezone input exists; an invalid Date compares false and fails closed. giftValidUntil uses UTC calendar months with end-of-month clamping and rejects validity outside settingsBounds. Mutation (scratch worktree, removed): `<` to `<=` in giftInDate fails the "at valid_until" test; `<=` to `<` in giftSendAtWithinHorizon fails "exactly the horizon". Both caught.
- Migration 0025 is in sync with the schema: `drizzle-kit generate` in a scratch worktree reports no changes and `drizzle-kit check` passes. The circular orders.gift_id and gifts.purchase_order_id FKs are created after both tables, and the fixture inserts in the order the builder describes.
- Verified: `tsc --noEmit` clean; eslint --max-warnings 0 and prettier clean on the changed files; unit tests for giftInDate, transitions, capabilityTokens, and privacy pass (140 tests).
- Logs: no logger or console call added; giftTokens.ts and tokens.ts log nothing and throw only fixed-text RangeErrors with no token or id content.
- Duplication: no existing month-add or send-horizon helper in src/lib or src/server (searched addMonths, UTCMonth, monthsAfter, horizon); email, text, and date CHECK helpers are reused from existing modules. No new duplicate found.
- Design doc gap, not a defect here: the design doc says `recipient_email` is citext and `message` has "no links"; the table stores lower-case-only text (CHECK refuses upper case) and no CHECK or lib rule refuses links in a message. purchaseGift (out of scope) must normalize the email to lower case and own the link rule; audit item: log it for the unit that builds purchaseGift's Zod schema.
- FYI: U-099's rotation runbook says "run the U-015 and U-017 re-hash"; the gift re-hash is dropped here (IN-LITE), so until U-099's TODO is done a secret rotation leaves gift hashes stale and every gift link unresolvable. The TODO(U-099) in capabilityTokens.ts names the right unit. Not a finding against this PR.
- Size: 7804 inserted lines, but 6448 are the drizzle snapshot; about 1350 hand-written, one logical change.

### Unconfirmed
- The db tests (gift-tokens.db.test.ts, gifts-constraints.db.test.ts, and the five edited db tests) were not run: this sandbox has no DATABASE_URL_UNPOOLED. I read them and checked each constraint name against the migration, but could not execute them. The merge-desk db job is the proof.
