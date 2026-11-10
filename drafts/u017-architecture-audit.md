PASS

## architecture-audit: U-017 "Gift tables and state machine" (head 440e33e)

Rules: `.claude/standards/architecture.md` (project). Diff: `git diff origin/main...HEAD` in worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a19f367b5e5fafa05`. In scope: `src/lib/{capabilityTokens,giftInDate,transitions,privacy}.ts`, `src/server/tokens.ts`, `src/server/db/giftTokens.ts`, `src/server/db/schema/{gifts,orders,ledger,index}.ts`. Read-only; no GitHub calls.

### Blocking
- None.

### Non-blocking
- `src/lib/giftInDate.ts:17,22,30` (`giftInDate`, `giftSendAtWithinHorizon`, `giftValidUntil`) and `src/lib/transitions.ts:41` (`requireGiftTransition`, with `giftTransitions`) have no non-test caller and no `TODO(U-xxx): first caller` marker. B7 literally covers component and data-layer files, not `src/lib`, so this is not blocking. Add `TODO(U-064a): first caller` (and U-066a for the expiry path) to match the convention in `src/lib/ledger.ts`.
- `src/lib/giftInDate.ts:12-14` says redemption and the redemption page "both call it". True once U-064a lands, not in this diff. Reword as future tense or leave for U-064a.
- `src/server/db/giftTokens.ts:23,36` (`lockGiftTokenVersion`, `writeGiftTokenVersion`) and `readGiftByTokenHash` take unparsed `giftId` and `tokenHash`. This matches the sibling `src/server/db/orderTokens.ts`, and `bumpTokenVersion` parses the id with `WriteIdSchema` before the call (`src/server/tokens.ts:128-129`), so B5 is satisfied in practice. Note for consistency only.
- `src/server/db/schema/orders.ts:39` imports `gifts` and `src/server/db/schema/gifts.ts:26` imports `orders`, a schema-level cycle. Both references are lazy arrow functions, so it evaluates, but a future eager reference would break it. Non-architectural; flag for the data-model owner.
- `src/server/tokens.ts:101-103`: the `resolveToken` gift branch returns the row without checking status or `valid_until`. Correct for IN-LITE (redemption is U-064a), but U-064a must add the in-date check through `giftInDate`, not inline.
- `src/server/tokens.ts:91` `resolveToken` doc comment has one line over 100 columns (the sentence beginning "order's reference"). Formatting only.
- `src/server/tokens.ts:134-141` gift branch of `bumpTokenVersion` writes a gift row without a `Caller`, the same shape as the existing order branch. Its only planned callers (U-077, U-113) own the subject check. Recheck at first caller.

### Unconfirmed
- B2 versus B6 conflict, `src/server/tokens.ts:101-103`: `secureEqual(capabilityToken(...), token) ? row : null` is a comparison that yields a domain result (token valid or not) inside a data-layer module. B2 says decisions live in `src/lib/`. B6 and the header of `giftTokens.ts` say the derivation and every comparison live in `tokens.ts`. The shape is pre-existing for `manage` and `order`; the gift branch reuses it. Not blocking pending Dave's ruling on which rule governs token comparison. Flag to PM.
- Typecheck (`tsc --noEmit`) was not run in this audit; vitest for the four affected unit files passed (100 tests).

### B2 enumeration (data layer and route handlers, one pass)
- `src/server/tokens.ts:91` `isCapabilityTokenShape(token)` returns null: delegated to `src/lib/capabilityTokens.ts`. OK.
- `src/server/tokens.ts:96-97` `reference === undefined || !isOrderReference(reference)`: the predicate is in lib; the undefined test is overload narrowing, pre-existing. OK.
- `src/server/tokens.ts:101-103` `secureEqual(...) ? row : null`: see Unconfirmed above.
- `src/server/tokens.ts:134` `current === null`: existence check, not a domain result. OK.
- `src/server/tokens.ts:138` `nextTokenVersion(current)`: lib. OK.
- `src/server/db/giftTokens.ts`: `row ?? null` only. OK.
- `src/server/db/schema/gifts.ts` CHECK constraints (`gifts_sent_at_matches_status`, `gifts_redeemed_matches_status`, `gifts_send_at_within_horizon`, `gifts_valid_until_after_send_at`): integrity constraints that mirror `giftLimits` and `giftStatuses` in lib, not decisions. The status-to-timestamp rule has no lib function; acceptable as a database guard (defect class 2).

### Rule-by-rule
- B1 OK (no fetch or SDK call outside data layer). B3 OK (`server-only` on `giftTokens.ts` and `tokens.ts`; schema exempt; no `process.env`). B4 OK (imports one way; schema cycle noted above). B5 see Non-blocking. B6 OK (`readGiftByTokenHash` is a token route resolved by hash and checked in `resolveToken`; the gift write path is a system write with a planned caller). B7 see Non-blocking (not blocking under the lib scope). B8 OK (no `'use client'`). B9 OK (gift row write joins caller's `tx`; no jobs or providers). B10 OK (gift lock taken alone, last in the lock order). B11 OK. B12 OK (integer minor units; `giftValidUntil` takes `sendAt` and `now` as arguments; `timestamptz` columns). B13 OK (no empty catch; out-of-range input throws `RangeError`). B14 OK (no `'use cache'`). B15 OK (no route handler). B16 N/A. B17 OK (month arithmetic in `giftValidUntil` has no existing equivalent in `src/lib`).

Rules: `.claude/standards/architecture.md` (project)

---
<sub>architecture-audit | haiku | read-only</sub>
