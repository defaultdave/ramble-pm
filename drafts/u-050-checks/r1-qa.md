PASS

## qa-agent: U-050 "Confirmation page" (head 6c137fe)

### Blocking
None.

### Non-blocking
- Method limit: the fake gateway's webhook secret is random per process and the booking sheet is U-041's, so orders were built with the db-test fixtures' shape on a fresh seeded Postgres and confirmed with the real `confirmOrder` (what the webhook job calls). The signed-webhook route was not driven over HTTP.
- Gift confirmed (06b) not driven live (`confirmOrder` refuses gift purchases until U-062a); the builder's `after-confirmed-gift-*` files cover it.
- The order token is in the pending (S9) page body for the poller; never in the confirmed page, the URL, `document.cookie` or history.
- After the S9 to confirmed flip, focus stays on BODY (a11y-audit's call).
- The site header and footer render unstyled on every `/orders/<ref>` state, 320 to 1280; the builder's `before-demo-stub-*` shows the same, so it predates this unit. Audit item.
- A seeded confirmed order's "What happens next" says "The cancellation terms are on your booking page" (likely the seed's default tier); not investigated.
- `getOrderStatus` not probed with wrong or other-order tokens directly; parity covered by unit tests.

### Driven (seeded production build, own database, dropped afterwards)
- 303 handoff: `/orders/<ref>?t=<token>` to `/orders/<ref>`, cookie `ramble_order_access` with `Path=/orders/<ref>`, `Max-Age=7200`, `Secure`, `HttpOnly`, `SameSite=Lax`; `x-robots-tag: noindex, nofollow, noarchive`, `cache-control: no-store`.
- Token-free address in Chromium; refresh keeps the order open; the confirmed HTML holds the token 0 times.
- Refusals: no cookie, tampered cookie, another order's token (cookie and `?t=`), malformed `?t=`, unknown and malformed reference all show the same not-found screen, near-identical sizes.
- Metadata: noindex, `referrer: no-referrer`, no `og:*` or `twitter:*`.
- S9 flips to "You're booked" without a reload about 0.2 s after confirmation.
- Poller: POSTs at 2, 5, 10, 18, 31, 51, 71, 91, 111, 131, 151 s, then "Check again"; none once confirmed.
- Seller-of-record line exactly as ruled. Google Calendar dates and the `.ics` VEVENT match the session; Maps search on the meeting point; Manage link `/manage/<43-character token>`, server-built; buttons 44 px or taller; external links `noopener noreferrer`; no links while pending.
- Pending, confirmed, payment failed, refunded after lapse, closed and not found at 320, 390, 768, 1280, light and dark, no overflow at 320. Demo stub `/orders/RMB-DEMO01` still works.

Evidence (`evidence/pr/unit-U-050-qa-agent/`):
- `qa-flip-1-pending-390-light.png`: S9 pending after the 303, token-free URL.
- `qa-flip-2-confirmed-390-light.png`: same page after confirmation, no reload.
- `qa-poll-cap-reached-390-light.png`: poller cap, "Check again".
- `qa-no-cookie-second-browser-390-light.png`, `qa-tampered-cookie-390-light.png`: refusals.
- `qa-{confirmed,pending-s9,payment-failed,refunded-after-lapse,void,not-found}-{320,390,768,1280}-{light,dark}.png`: every state.
