PASS

## spec-compliance: U-050 "Confirmation page" (head 43f4d0b)

Both round 1 blocking items are fixed: `src/server/tokens.ts` no longer carries `TODO(U-050)`; `DemoConfirmation.tsx:8` and `page.tsx:32` read `TODO(U-041)`. A grep of `src/` and `tests/` finds no `TODO(U-050)`, no `TODO(U-047b)` on these files, and no `mapsSearchUrl`. The poller comment (`src/lib/orderStatus.ts:85`) says about three minutes (171 s), matching the delay table. Round 2's other claims hold: `OrderStatusPoller.tsx:26-33` moves focus to the `role="status"` region after "Check again", tested at `OrderStatusPoller.test.tsx:120`; `useOrderStatus.ts:45-48` announces `settledMessage(result)` before `router.refresh()`; a rejected `check` goes through `pollStep` (`useOrderStatus.ts:36-38`, `orderStatus.ts:58`).

Non-blocking, unchanged from round 1: the cookie is `Secure` only in production (`src/proxy.ts:31`, `src/lib/orderAccess.ts:55`); the `download` prop on `ButtonLink` is logged. The 303 and cookie in a browser remain qa-agent's check.
