PASS

## review-agent: U-030 "Order, manage and gift pages use the guest frame" (head ecf88eb)

### Blocking
None. The round 1 finding is fixed: with `SiteShell` put back, `layout.test.tsx` fails 2 of 3; on the committed layout all 3 pass, and `tests/checkout-no-sentry.test.ts` passes.

### Non-blocking
- Scope: the diff is `layout.tsx` and `layout.test.tsx`.
- No third-party tag reaches the browser from `GuestShell`'s import chain; the menu is a native `<details>` and the only browser code added is `next/link`.
- The header adds no inline script and its prefetches stay inside `connect-src 'self'`.
- Order token (BC-20): no new exposure on `/orders/<ref>`.
- `/manage/<token>` carries its token in the path and sets no `referrer` metadata, so its header links now send a same-origin `Referer` with that path. Nothing leaves the origin. Audit item for the manage page's unit.
- `(checkout)/not-found.tsx` and `error.tsx` keep `SiteShell`: PM-ruled later audit item.
