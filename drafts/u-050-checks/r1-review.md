FAIL

## review: U-050 "Confirmation page" (head 6c137fe)

### Blocking
- src/lib/orderReceipt.ts:70-79 (`mapsSearchUrl`) duplicates `mapsHref` in src/lib/pages/experience.ts (exported, about line 222; the code that builds the URL is at 261). Both build the Google Maps search link for an experience's meeting point (PRD-09), and the existing one is the tested rule. It takes only the first sentence of the meeting point, so a note like "The exact door is in your confirmation." is not searched. It also appends the venue city and rejects an over-long query. The new copy uses the whole text clipped to 300 characters with no city. A meeting point such as "Pier 26 boathouse. The exact door is in your confirmation." opens a Maps search for the whole note on the receipt, and a correct place on the experience page. Fix: move `mapsHref` and its helpers from the page module into a shared module such as `src/lib/maps.ts`, call it from both places, and delete `mapsSearchUrl` and its tests. A shared module cannot import from `src/lib/pages` because of the lint zone, so the move is needed.

### Non-blocking
- src/server/tokens.ts:68: the `// TODO(U-050): first caller, the confirmation page.` comment is stale, because this unit adds that caller. Remove it.
- src/app/(checkout)/(site)/orders/[reference]/page.tsx and DemoConfirmation.tsx: `TODO(U-047b)` names a unit already merged into this branch. U-041 retires the demo stub, so the TODO should name U-041.
- src/server/orderConfirmation.ts and src/server/actions/orders.ts: an unknown reference and a wrong token differ in timing, because only a known reference reaches the HMAC compare. The token is a 256-bit HMAC and the compare is constant-time, so nothing usable leaks.
- Reuse section: not found in the evidence folder; the `mapsHref` duplicate shows it was not checked.

### Verified, no defect
- Cookie: HttpOnly, SameSite=Lax, Secure in production, Path `/orders/<ref>`, Max-Age 7200 (src/lib/orderAccess.ts:50-60). The proxy hands off only a token of valid shape for a valid reference. The 303 target has no query. `Cache-Control: no-store` and `X-Robots-Tag: noindex` on the redirect and the page.
- Token comparison: `resolveToken('order', ...)` recomputes the token for the order's current version and compares with `secureEqual` (`timingSafeEqual`). Missing, malformed, wrong, other-order, or stale-version tokens all return null and the page calls `notFound()`. `getOrderStatus` parses with a strict Zod schema and returns `{state:'unknown'}` for every refusal.
- Poller: delays 2 s to 20 s, capped at 12 attempts (about 2 minutes); a non-pending answer refreshes the page; the poller renders only for a pending order; errors retry within the cap, then "Check again"; the effect cleans up its timer.
- Metadata: `openGraph: null`, `twitter: null`, `robots` noindex, `referrer: no-referrer`; the e2e spec asserts no `og:` or `twitter:` tags.
- The manage link and the calendar file are built on the server only for a confirmed order. The demo reference still reaches the demo stub.
- No logging, no new tables, the status read is limited to 1 row, receipt inputs clipped with `oneLineClipped`.
