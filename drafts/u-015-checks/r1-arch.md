FAIL

## architecture-audit: U-015 "Orders, attempts, events, refunds, transfers schema" (head 37bb8ea)

### Blocking
- B7, `src/lib/orders.ts:139` (`orderCommissionMinor`) and `:147` (`orderAmountDueMinor`): non-type exports whose only importer is `orders.test.ts`, with no `TODO(U-xxx): first caller` (every other shipped-ahead export in the file has one). Fix: add the TODO naming the calling unit, or remove them.
- B2, `src/server/tokens.ts:124` (`bumpTokenVersion`): `state.hasManageHash ? hashToken(capabilityToken('manage', ...)) : null` is a domain rule in the data layer (a not-yet-confirmed order gets a version but no hash); `src/server/db/orderTokens.ts:47` derives its input. Fix: a tested `src/lib/capabilityTokens.ts` function deciding whether the bumped order stores a hash; the data layer only calls it.

### B2 decisions listed
- `tokens.ts:124` (blocking, above).
- `tokens.ts:93` `secureEqual(capabilityToken(...), token) ? row : null`: non-blocking (needs `node:crypto` and the secret, as `src/server/formGuard.ts`); could be a lib predicate given the expected token.
- `tokens.ts:89`, `:138`, `:141` call lib (`isOrderReference`, `storesHash`, `maxRehashBatches`): fine.
- `orderTokens.ts:102-103` re-hash `WHERE` (`manage_token_version = v.version`, `manage_token_hash IS NOT NULL`): exempt, tested; batching and cap untested.
- `orderTokens.ts:74` `isNotNull(manageTokenHash)`: exempt.
- No `.filter`, `.sort`, `.reduce` or money arithmetic in the data layer.

### Non-blocking
- B17, `src/lib/orders.ts:130` `orderTaxMinor` wraps `roundHalfUpPpm`; `pricing.lines()` already computes the same tax, so two entry points to one rule; expose the tax step from `src/lib/pricing.ts`.
- B17, `src/lib/capabilityTokens.ts`: `capabilityTokenLength = 43` and the base64url regex repeat `TOKEN_PATTERN` in `src/lib/formGuard.ts`; consider a shared constant. `pickCapabilityTokenSecret` differs from `pickFormGuardSecret` (no development stand-in), justified.
- B17: `transitions.ts` and `rules.ts` duplicate nothing.
- B7: the exported transition tables are used in their files and their `can*Transition` functions carry the TODO; low risk.

### Rules that pass
B3 (`server-only`; the secret via `env` only), B12 (integer money, no `Date.now`, `clock_timestamp()` defaults), B6 (`resolveToken` capability route), B1, B4, B5, B8 to B11, B13 to B16.

### Unconfirmed
- B6: `bumpTokenVersion` and `rehashTokens` write order rows without `requireRole` (runbook or caller-checked paths for U-077 and U-099); a PM and owner call before those units land.
- The re-hash batching and 2000-batch cap are not exercised by a test; the loop has a cap and throws.
