PASS

## spec-compliance: U-017 Gift tables and state machine, PASS

Checked commit 440e33ea116119ebce5c7bd6ece27c4a32c5390a (`git diff origin/main...HEAD`, worktree agent-a19f367b5e5fafa05) against the eight criteria of issue #23 as amended by the 2026-11-10 re-plan. All eight are PASS. No blocking issues.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | gifts and gift_items tables, gift state machine, no refund_pending/refunded/expired_refunded | PASS | `src/server/db/schema/gifts.ts:41` (gifts), `:126` (gift_items), `:31` (gift_status enum); `src/server/db/migrations/0025_gifts.sql:1-51`; state machine `src/lib/transitions.ts:21-45` (pending_payment, scheduled, delivered, redeemed only). Refund states absent from enum and table; a negative test asserting refund states are rejected is in `tests/db/gifts-constraints.db.test.ts` (it.each over refund_pending, refunded, expired_refunded). |
| 2 | gifts.token_version int, default 1 | PASS | `src/server/db/schema/gifts.ts:61` (`integer().notNull().default(1)`); `src/server/db/migrations/0025_gifts.sql:31`; CHECK `gifts_token_version_positive` at `gifts.ts:98`. |
| 3 | `gift` kind in resolveToken and bumpTokenVersion; token stored only as gifts.token_hash; no re-hash path for gifts | PASS | resolve: `src/server/tokens.ts:94-95` (readGiftByTokenHash), compare at `:101`. bump: `src/server/tokens.ts:132-142` (lockGiftTokenVersion, writeGiftTokenVersion with the rebuilt hash). Storage: only `tokenHash` column, `gifts.ts:60`; no token column. Re-hash excluded: `src/lib/capabilityTokens.ts:12` (`rehashKinds = ['manage']`) and `:15-17` (canRehash), `src/server/tokens.ts:172` (rehashTokens reads manage pages only). |
| 4 | DB test: after a bump the old token resolves to nothing | PASS | `tests/db/gift-tokens.db.test.ts:94-106` ("voids the old token, and the rebuilt one opens the gift"); also `:178-181` (rolled-back bump leaves old token working). |
| 5 | Validity from send_at and settings; send_at column | PASS | Column `src/server/db/schema/gifts.ts:58` (send_at, not null); valid_until derived by `src/lib/giftInDate.ts:30-51` (`giftValidUntil(sendAt, validityMonths)`, bounds from `settingsBounds.giftValidityMonths`, `src/lib/settings.ts:11`). Settings column exists pre-diff: `src/server/db/schema/policies.ts:149` (default 12). DB CHECK `gifts.ts:104-107` (valid_until > send_at). |
| 6 | FK from orders.gift_id to gifts | PASS | `src/server/db/schema/orders.ts:86-88` (`references((): AnyPgColumn => gifts.id, { onDelete: 'restrict' })`); migration `0025_gifts.sql:64`. |
| 7 | One shared giftInDate predicate with tests | PASS | Predicate `src/lib/giftInDate.ts:17-19`; tests `src/lib/giftInDate.test.ts:17-26` (before, at, and after valid_until). |
| 8 | Nothing from purchaseGift/redeemGift/delivery/pages/emails/holds.gift_id | PASS | Changed file list is limited to `src/lib/*`, `src/server/db/*`, `tests/db/*`. No purchaseGift, redeemGift, delivery, page, email, or holds change in the diff; grep of added lines finds no `holds` gift column. |

### Blocking
None.

### Non-blocking
- `src/lib/giftInDate.ts:13-16` says redemption and the redemption page both call giftInDate. Neither exists yet, so the predicate has no non-test caller in this diff. Expected for U-017; wiring belongs to U-064 and the redemption page unit.
- `src/lib/giftInDate.ts:30` takes `validityMonths` as an argument; nothing in this diff reads `settings.giftValidityMonths`. The purchase unit must pass the settings value.
- `src/lib/capabilityTokens.ts:10` and `src/server/tokens.ts:155` carry TODO(U-099) notes for a future gift rehash. They are correct for now (gifts are excluded) but should be revisited when U-099 lands.
- `src/lib/privacy.ts` (about lines 199-228 and 609-639) adds gifts and gift_items catalog entries. Not named in AC 8, and required by the privacy inventory for new columns, so it reads as necessary support. Flagged for visibility only.
- The ledger_entries.gift_id FK (`src/server/db/schema/ledger.ts:71`) and the orders.gift_id FK were both TODO(U-017) in the pre-diff code, so they are in scope.

### Unconfirmed
- Test suite was not run (read-only, diff-only review). PASS verdicts rest on reading the code and tests, not on execution.
- Nothing was checked against the live issue body (no GitHub calls). Criteria were taken from the task brief as given.
