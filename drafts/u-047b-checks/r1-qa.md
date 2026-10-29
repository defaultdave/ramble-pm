FAIL

## qa-agent: U-047b "Checkout page" (head 60bb5a1)

Scratch copy, fresh seeded Postgres, `next build` + `next start`, Playwright at 320, 390, 768, 1280 light and dark; suites not run.
### Blocking
- Header timer pill overflows at 320 px (CheckoutPage header slot, shared `Header.module.css`): logo 94 px plus a nowrap, non-shrinking pill; "Spaces held for 9:43" ends at x=318 (6 px past the container); "10:03"/"14:44" ends at x=325 and the page scrolls sideways (`scrollWidth` 325). After Continue a hold is `paying` with 15 minutes, so every reload during payment overflows; S9 too (321-324). Any `holdMinutes` of 10 or more overflows. Fix: shrink, wrap, shorten ("Held 14:44") below about 360 px, or give the timer its own row.
- `reholdSpaces` mints a new hold on every call, even for a live hold: 12 replays against one active 1-seat hold gave 11 `held` with new ids (12 active holds) until sold out; only the `reserve` limit (30 per 10 minutes per device) throttles it and BotID is absent. Fix: refuse unless lapsed by database time; db test that a live hold is refused.
### Non-blocking
- Re-hold ownership works: another device's cookie gets `invalid` with `fieldErrors.sessionId`, no cookie 404, no hold created; party and session from the server. Refusal answers `invalid`, not `unavailable`; align.
- Reloads: zero POSTs over four loads; the only POST on "Continue to payment"; reloading a `paying` hold shows a blank form (by design).
- Summary toggle: SSR `aria-expanded="false"`, after hydration false at 320/390, true at 768/1280, always matches the panel, no hydration warnings; at 768+ the panel opens after hydration (layout shift); with JS off on desktop it stays collapsed with no way to expand.
- Validation: empty submit gives `role=alert` "Check your details / There are 5 things to fix", inline errors, `aria-invalid`, focus to email; summary has no links to fields; tab order sensible; pill not focusable.
- S6: focus stays on BODY; re-hold from S6 works. S7: alternatives link with `?date=`, 69 px rows. S9 offline: focus stays on Continue, alert shows. Maintenance: "Checkout is paused", no form, no POSTs (BC-21).
- Targets: only the shared footer "Terms" link is under 44 px (41x44).
- Pay flow with 4242 lands on `/orders/RMB-…?t=<token>`; the order page stub shows fixture content (U-050).
- ADR 0007 exemption narrow; a separate assertion advisable.
- Figma: only the lo-fi `05 Checkout` desktop wireframe (3:253) exists; no D05, S6, S7, S9 frames ("error states still to design"). Differences from 05: no express area on first view (recorded two-tap departure); timer as a header pill, not a summary "Spots held" banner; no "Back to cart"; "Secure checkout" only on desktop; full site footer instead of the mini footer; no inline card step or "Pay $X" on the first form; no sign-in nudge; no dietary or swim question; no service-fee line; tax only for tax-added experiences; single lead name; new spec-driven opt-in, age, waiver, terms, guardian fields; different copy under the button. Only the two-tap departure is recorded.
### Evidence
`evidence/pr/unit-U-047b-qa-agent/`: `header-320-{light,dark}-default-hold.png`, `header-320-{light,dark}-14min-hold.png`, `paying-hold-reload-320-light.png`, `kayak-*` and `kids-*` at four widths both schemes, `errors-*`, `pay-step-320-light.png`, `pay-step-390-light.png`, `s6-lapsed-*`, `s7-sold-out-1280-dark.png`, `s9-offline-320-light.png`, `maintenance-*`.
Unconfirmed: S7 at 320; S6, S9 at 390 and 768; timer announcements; suites.
