PASS

## architecture-audit: U-047a round 2 (head eb30c2b)

Read the delta 81240e4..eb30c2b (no run).
Round 1 findings fixed: B2 `providerPayment` (action parses, `getDevice()`, calls `startCheckoutPayment`; verdict `lookupVerdict(step, found)` in `src/lib/checkout.ts`; `src/server/checkout.ts` runs the port calls and throws on `'refuse'`); B2 sequencing and store-or-not (one call; `storesPayment(step)` in lib); B2 `attemptNo` ternary (`startPaymentDecision` returns `attemptNo` on `create` too; `Decision` built from `StartDecision`); B2 verdict comparisons (`storeProviderPayment` returns `{ write, stored }`); B10 attempt lock (`lockAttemptRow` in `locks.ts` with a header line).
Blocking: none.
Checks on the move: B3 `server-only`; B4 imports only lib, db, device, monitoring, payments and rate-limit ports; B5/B6 parse in action, device passed through; B7 every new export has a non-test caller; B9/B10 limit, tx 1, provider, tx 2, device before any lock, same idempotency key, secret returned after failed tx 2; B12 no `Date.now()`; B17 one character-class constant in `src/lib/orders.ts`.
Advisory: nested ternary in `src/server/checkout.ts` `providerPayment` dispatching on `step.step` (a lib `lookupArgs(step)` would remove it); `found !== null && verdict === 'use'` is type narrowing only; B13 `rememberPayment` catch kept by PM ruling, still flagged for Dave against the one-catch-exception rule.
