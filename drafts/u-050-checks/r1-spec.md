FAIL

## spec-compliance: U-050 "Confirmation page" (head 6c137fe)

### Blocking
- src/server/tokens.ts:68: `// TODO(U-050): first caller, the confirmation page.` is stale and names this unit's own ticket; the first caller now exists (src/server/orderConfirmation.ts:23). Delete it.
- src/app/(checkout)/(site)/orders/[reference]/DemoConfirmation.tsx:8 and page.tsx:32: `TODO(U-047b)`; U-047b is merged and U-041 retires the demo (src/lib/demoCheckout.ts:9 already says U-041). Change both to `TODO(U-041)`.

### Non-blocking
- src/proxy.ts:31 with src/lib/orderAccess.ts:55: the cookie is `Secure` only in production; consider always Secure (browsers accept it on localhost). Tests cover both.
- src/lib/orderStatus.ts:57: the comment says "About two minutes"; the 12 delays total 171 s. Correct the comment or the number.
- The manage capability renders in the Manage booking href, as the spec intends; the order token itself never renders.
- src/components/Button/ButtonLink.tsx:15, 38, 58: a `download` prop added to a shared component, needed for the .ics file; log it.

### Items
Every units.yaml clause PASS: refresh-safe handoff; token recomputed from `capabilityToken` kind order; seller-of-record wording exactly as ruled (src/lib/orderReceipt.ts:61); `getOrderStatus` polling for S9; calendar, .ics, Maps, manage link only once confirmed; mobile and desktop; noindex and no Open Graph. Cookie HttpOnly, Lax, path per order, Max-Age 7200 PASS. Constant-time compare PASS. Same answer for every bad token PASS. Forged cookie opens nothing PASS. Poller bounded PASS. A story per state PASS. Demo stub reachable PASS. Out of scope PASS (30 files, all within the unit).

### Unconfirmed
- Browser behaviour of the 303 and cookie, and Secure on a production response: qa-agent's check.
