FAIL

## review-agent: U-015 "Orders, attempts, events, refunds, transfers schema" (head 37bb8ea)

Scratch copy of 37bb8ea: typecheck and lint clean; the 10 touched unit test files 437 pass; test:db once 1101 of 1101 in 17 files.

### Blocking
- `src/lib/payments.ts:11-22, 129-143, 174-189` (duplication): re-declares vocabulary `src/server/ports/payments/index.ts` already exports: `paymentProviders`, `paymentMethods` (port line 35), the six attempt statuses (the port's `PaymentStatus`), the 12 `providerEventTypes` (port lines 169-182) and the `'USD'` currency (port line 7, vs `orderCurrency` at `src/lib/orders.ts:40`). The port is `server-only`, so the fix runs the other way: the port imports these tuples and the currency from `@/lib/payments` and `@/lib/orders` and deletes its copies. Otherwise the pg enums (`provider_event_type`, `payment_method`, `attempt_status`) and the port's Zod enums drift apart, and intake could accept an event the `type` column refuses.

### Non-blocking
- Security clean: the secret fails closed outside test; the HMAC is over `kind:id:version`; `resolveToken` checks shape before any query, compares with `secureEqual`, returns null for every refusal; `bumpTokenVersion` locks the order row and writes version and hash in one UPDATE, with locked re-check and concurrent-bump tests; no secret in error messages.
- Design doc match: the ruled derived constraints do not contradict 4.2.3; transition tables, row checks, partial unique indexes, unique `manage_token_hash`, uuid-without-FK columns with TODOs all match.
- `rehashTokens` is capped but the cap and paging past the first batch are untested; a scratch test with 1100 orders resolved every token after rotation. Add a test with an injectable batch size so a paging regression is caught.
- `src/lib/payments.ts:195-207`: `ProviderEventPayloadSchema` walks and stringifies the whole payload before the size refinement can fail it; intake caps bodies at 64 KB, so low risk; a cheap pre-bound would be better.
- Audit items: `payloadBytes` in `src/lib/jobs.ts:55` duplicates the inline byte count (extract a shared `jsonByteLength`); `pickCapabilityTokenSecret` copies `pickFormGuardSecret`'s shape (policies differ).
- `orders.contact_email` is `text` with a lowercase CHECK where the design says `citext`; no citext in the repo, consistent.

### Unconfirmed
- None.
