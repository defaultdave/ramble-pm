PASS

## architecture-audit: U-015 round 2 (head 1d6f86c)

### Round 1 blocking items
- B7 resolved: the `orders.ts` wrappers removed; `orderAmountDueMinor` carries TODO(U-047a); `commissionMinor` in `src/lib/pricing.ts` carries `TODO(U-047a): first caller`; `canOrderTransition` carries TODO(U-049).
- B2 resolved: `bumpTokenVersion` calls `manageHashAfterBump(hadManageHash, rebuiltHash)` in `src/lib/capabilityTokens.ts` (tested); the data layer passes inputs and writes the result.

### Blocking
None.

### B2 decisions
- `bumpTokenVersion`: `manageHashAfterBump` and `nextTokenVersion` in lib.
- `rehashTokens`: `storesHash`, `rehashLimits`, `maxRehashBatches` from lib; the short-page stop and the `maxBatches` throw are loop control (optional move to lib).
- `resolveToken`'s `secureEqual(capabilityToken(...), token) ? row : null`: non-blocking (needs `node:crypto` and the secret), as round 1.
- `orderTokens.ts` WHERE clauses exempt; `hasManageHash: row.hash !== null` reports state.
- `src/lib/payments.ts`, `src/lib/text.ts`: size, exponent and walk decisions in lib with tests; no `.filter`, `.sort`, `.reduce` or money arithmetic added to server code.

### B17 (all non-blocking)
- One `notBlank` pattern: `notBlankPattern` in `src/lib/text.ts`, the SQL `notBlank` in `shared.ts` built from it, used by `catalog.ts` and `policies.ts`; the `[^[:space:]]` copies removed.
- The port's vocabulary copies deleted; the port and `fake.ts` import from `@/lib/payments` and `@/lib/orders`.
- `taxMinor` and `commissionMinor` from `pricing.ts`; `lines()` uses `taxMinor`.
- `checkExperienceRules` uses `addRuleIssues`.
- Still logged: the 43-character token constant vs `formGuard.ts` `TOKEN_PATTERN`; `pickCapabilityTokenSecret` vs `pickFormGuardSecret`; `jsonByteLength` vs `jobs.ts`. `transitions.ts` and `rules.ts` duplicate nothing.

### Other rules at head
B4 (the port imports `src/lib`, the allowed direction; no lib file imports server, components or app); B3 (`server-only`; no stray `process.env`); B7 (TODO markers on the shipped-ahead exports); B12 (no `Date.now`, no float money); B13 (the only catch rethrows with the cause); B9 (one transaction per re-hash batch; `bumpTokenVersion` joins the caller's and locks); B1, B5, B8, B10, B11, B14, B15, B16 clean.

### Unconfirmed
- B6: `bumpTokenVersion` and `rehashTokens` write order rows without `requireRole`; signatures kept by PM ruling; callers U-077 and U-099.
