PASS

## qa-agent: U-030 "Order, manage and gift pages use the guest frame" (run at head 4e778f0)

Posted at `ecf88eb`: the PM carries this run forward because the only change since `4e778f0` is `layout.test.tsx`; `layout.tsx` is identical.

### Blocking
None.

### Non-blocking
- The phone menu does not close on Escape or an outside click and focus stays on the Menu button. The existing Header does the same on `/gifts`. Audit item.
- Not-found states in the checkout group still render `SiteShell` (`/gift`, `/orders/RMB-NOPE00`): PM-ruled later audit item, and the likeliest thing a guest with a mistyped link sees.
- `/manage/<token>` is a placeholder whose long token overflows sideways at 375 px (scrollWidth 445). Audit item for the manage unit.
- `/manage` and `/gift/<token>` report a second `<header>` inside the page content.

### What ran
Seeded production build on a fresh database. Booking at 375: order `RMB-6GNRAQ`, "You're booked, Quinn", $65.33. Full guest header and footer at 375 and 1280; one `main`, one `#main`, one skip link. Skip link shows on the first Tab and jumps to `#main`. All header links navigate. No CSP or page errors under the enforced nonce policy. No Sentry markup or third-party request on order, manage, gift or checkout pages. The order token appears only in the first request and redirects away; prefetches carry no token. Checkout still uses `CheckoutFrame`. No sideways scroll at 320, 375 or 1280 on the order page. Manage and gift render in the frame.
