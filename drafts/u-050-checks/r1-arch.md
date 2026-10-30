FAIL

## architecture-audit: U-050 "Confirmation page and order status" (head 6c137fe)

### Blocking
B2 decisions outside `src/lib` (every one found):
- `src/app/(checkout)/(site)/orders/[reference]/page.tsx:33`: `orderPath(reference) === demoOrderPath` is a domain comparison in an async shell. Fix: a tested `isDemoOrder(reference)` in `src/lib/demoCheckout.ts` (leaves with the demo at U-041).
- `src/server/actions/orders.ts:20` and `:22`: the action folds "parse failed" and "state is null" into `unknownOrderStatus`. Fix: one lib function, for example `orderStatusResult(state: OrderStatusState | null): OrderStatusResult` in `src/lib/orderStatus.ts`, with unit tests; the parse failure goes through it too.
- `src/server/orderConfirmation.ts:39`: `status === null ? null : orderStatusState(status)` is a mapping in the data layer. Fix: the same lib function, or `orderStatusState` accepts null.

Acceptable: `proxy.ts:23-39` dispatches on lib's `orderAccessHandoff`; `useOrderStatus.ts` delegates to `pollDelayMs` and `pollStep`; `OrderConfirmation.tsx` switches on `view.kind`; `orderConfirmation.ts:20-28` null guards.

B17 duplication:
- `src/lib/orderReceipt.ts:73-80` (`mapsSearchUrl`) builds the same Google Maps search URL as `mapsHref` at `src/lib/pages/experience.ts:261` (itself misplaced in a page module). Fix: a shared `src/lib/maps.ts`, called from both.

TODO hygiene (CLAUDE.md, B7):
- `src/server/tokens.ts:68`: `// TODO(U-050): first caller, the confirmation page.` remains; this unit is that caller. Delete it.
- `page.tsx:32` and `DemoConfirmation.tsx:8` say `TODO(U-047b)`; every other demo TODO names U-041. Change both to `TODO(U-041)`.

### Non-blocking
- `useOrderStatus.ts:46-48`: a rejected `check` is swallowed and counted as an attempt; `pollStep('error')` in `src/lib/orderStatus.ts:49-53` is never called in production. Route the rejection through it or drop the branch. Audit item.
- `proxy.ts:33`: the cookie `secure` flag derives from `env.NODE_ENV` in the proxy; a lib helper or a passed flag would keep it testable.
- `src/server/db/orderStatus.ts`: a new status-only read on `orders`; acceptable as a light poll read; the Reuse section should say it was checked.
- `getOrderStatus` has no rate-limit key (B15 covers Route Handlers only); HMAC token, no guessing risk; PM call.
- Audit item (pre-existing): `mapsHref` in the page module `src/lib/pages/experience.ts`.

### Confirmed clean
B1, B3, B4, B5, B6 (constant-time `resolveToken`, every refusal alike), B7, B8 (`OrderStatusPoller` allowlisted), B13; manage link built on the server only for a confirmed order; cookie HttpOnly, Lax, Secure in production, path per order, 2 hours; noindex, no Open Graph or Twitter, `X-Robots-Tag` and `no-store`.
