PASS

## architecture-audit: U-050 "Confirmation page" (head 43f4d0b)

### Blocking
None.

Round 1 blocking items, all fixed: `isDemoOrder(reference)` in `src/lib/demoCheckout.ts`, called at `page.tsx:33`; `orderStatusResult(status: OrderStatus | null)` in `src/lib/orderStatus.ts`, called by `src/server/actions/orders.ts:20` and `src/server/orderConfirmation.ts:37-38`, `unknownOrderStatus` no longer exported; `mapsSearchUrl` deleted, `orderReceipt.ts:153` and `pages/experience.ts:362` both call `mapsHref` from `src/lib/maps.ts` (the experience call site unchanged); `TODO(U-050)` gone, demo TODOs say `TODO(U-041)`; a rejected `check` reaches `pollStep` (`useOrderStatus.ts:51-53`).

B2 sites outside `src/lib` in the whole-unit diff, re-listed, none blocking: `proxy.ts:23-39` dispatches on lib's `orderAccessHandoff`; `useOrderStatus.ts:46-49` branches on lib's `pollStep`; `OrderStatusPoller.tsx:34-56` conditional rendering with a fixed fallback string; `OrderConfirmation.tsx` switches on `view.kind` from lib's `orderPageView`; `orderConfirmation.ts:20`, `:24` and `db/orderStatus.ts:18` null guards; `page.tsx:39-40` null guard and `notFound()`, token selection via lib's `pickOrderToken`.

No new duplication; scope inside round 2's list; B1, B3 to B8, B13, B15 clean; `OrderStatusPoller` on the islands allowlist.

### Non-blocking
- `getOrderStatus` has no rate-limit key (carried from round 1; B15 covers Route Handlers only).
