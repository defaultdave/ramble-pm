PASS

## qa-agent: U-030 "checkout audit fixes" (head 89e6ece)

Base 053bd1a. Rows: BC-58, BC-29, BC-35, BC-39 in `audits/booking-checkout.md`.

Tested in a production build of 89e6ece (scratch worktree, seeded local database with a unique name, app on port 3611, Neon HTTP shim on 4731, both matching `NEON_HTTP_ENDPOINT`). Chromium was launched from a script with `--single-process --no-zygote`, sandbox on, one browser per width and scheme. The same flows were run against a production build of 053bd1a to get "before" values. Evidence files are in `evidence/pr/unit-U-030-checkout-audit-fixes/`, suffix `-qa`.

### Blocking
None.

### Non-blocking
- BC-58, partly open (needs a PM decision): an error thrown in `src/app/(checkout)/(site)/layout.tsx` is still caught by `(checkout)/error.tsx` and still renders the plain unstyled shell: a bare underlined "Skip to main content" link, a bare "Ramble" link, no footer, no header styling. Forced with a temporary throw in a separate scratch worktree, 390 and 1280 px, light and dark; Try again works and recovers the page. Ticket #351 names this case in its first sentence ("and an error thrown in `(site)/layout.tsx`"). U-030 fixes only the checkout page's own error state (`checkout/error.tsx`), which is what the brief asked me to check and which passes. If #351 is meant to cover the layout case, this is an open gap; otherwise log it as an audit item. Evidence: `checkout-group-layout-error-390-light-after-qa.png`.
- After an in-page "Hold my spaces again", Next keeps the previous page's `header` and `main` in the DOM, hidden with `display: none`, so the DOM holds two `main#main` and two site headers (the visible page shows one frame, see the screenshot). It is pre-existing: 053bd1a also hides a second footer and a second skip link, which 89e6ece no longer does. Audit item only. Evidence: `checkout-after-rehold-390-light-after-qa.png`.
- The bare `Composites/BookingSheet` Storybook story (not the shipped sheet) still renders 38.8 px day cells at 320 px, same as base. The shipped sheet (`Experience/BookingChoices` story and the running app) is 44 px. Audit item only.
- Past days keep their old look: dimmed, not struck through, 4.09:1 in light and 5.09:1 in dark, identical to base. Disabled controls are exempt from the 4.5:1 rule, so this is an observation.

### Unconfirmed
- Past days in the running app: today in the seeded app is Nov 1, the first cell of the month, so no past day is visible, and neither a client clock shift nor a shifted database clock moved the calendar's "today". Checked instead in the `Experience/BookingChoices` sheet stories (today fixed at Oct 18): Oct 1 to Oct 17 are `aria-disabled`, not struck, and match base at 320, 360 and 390 px, light and dark. In the running app the Previous arrow is disabled and today's cell is disabled.
- Local runs cannot reach api.vercel.com, so BotID's browser challenge scripts return 500 and hang every guarded form. I answered those two script requests with empty stand-ins through Playwright routing; the server-side check is off outside Vercel. Nothing under test depends on it.
- The checkout error state was produced with a temporary throw (a flag-file check) in a scratch worktree at 89e6ece, built separately; it was not committed or pushed. Every other check ran on the clean 89e6ece build.

### What I checked and saw

BC-58, frames and error state (390 and 1280 px)
- A real checkout page (a hold made through the booking sheet): one skip link ("Skip to main content", first Tab stop), one site header with the logo, one `main`, the "Spaces held for 9:58" timer, one footer with 8 links. Same at 390 and 1280.
- Checkout not-found (`/checkout/<unknown id>` and `/checkout/nonsense`), plus `/orders/RMB-NOPE00` and `/gift`: each shows one site header, one `main`, one footer, one skip link, h1 "We can't find that page". Styled, not the raw links.
- Checkout error state (forced throw): logo header, h1 "Something went wrong on our side", the notice "This page did not load. Try again in a moment.", a Try again button, and the styled footer (8 links). No raw error text or digest on screen. Light and dark, 390 and 1280.
- Try again: with the throw removed, one click on Try again re-rendered the real checkout page (h1 "Checkout", timer, form, same single frame) in all four width and scheme combinations.

BC-35, booking sheet at 320, 360 and 390 px, light and dark (6 separate browsers)
- Day cells: 44 px wide and 44 px tall for every visible day, in November and in December after Next. Base at 320 px: 38.8 px wide.
- No sideways scroll: document and dialog `scrollWidth` equal `clientWidth` at every width. No visible cell lies outside the dialog.
- Month heading ("November 2026") and both arrows (44 by 44 px) sit fully inside the dialog and viewport, heading not truncated.
- Unavailable days are struck through (`line-through`) and measure 7.79:1 in light (text rgb 92,80,72 on white) and 8.83:1 in dark (rgb 199,186,171 on rgb 35,28,23). Base was 4.09:1 and 5.09:1 with no strike.
- Available days are unchanged (17.16:1 light, 15.62:1 dark).
- Past days: see Unconfirmed.

Desktop booking panel, 1024 and 1280 px, light and dark, against base
- Every calendar cell has the identical position and size, and the panel is the same size.
- Pixel diff: about 2,030 changed pixels per shot, all inside the unavailable-day cells, 0 outside. The only change is the strike and the darker text.
- Desktop refusal (device cap) still moves focus to the notice, same as base.

BC-39, refusal inside the sheet (390 px)
- Forced by selling the session out after the guest picked it. The notice "Those spaces just sold out" appears and the Continue button disables.
- 89e6ece: focus is on the notice (`div role=alert`), and the first Escape closes the sheet.
- 053bd1a: focus is on BODY and the first Escape leaves the sheet open, which reproduces the audit row.
- The device-cap refusal (Continue stays enabled): focus on the notice at 89e6ece, on the Continue button at base; the first Escape closes the sheet in both.

BC-29, after a re-hold (390 px)
- Expired a hold in the database, reloaded, then used the keyboard only (Tab to "Hold my spaces again", Enter). Focus lands on the `Checkout` h1 and `:focus-visible` matches; outline is solid 2 px, offset 2 px, rgb(31,95,173) in light and rgb(140,184,255) in dark. Base: outline `none`.
- With a mouse click the h1 takes focus but no ring shows, as expected for `:focus-visible`.
- No `h2` inside a `span` on the checkout page, the expired page or after re-hold (base has one on each of them).

### Evidence
Files in `evidence/pr/unit-U-030-checkout-audit-fixes/` that I relied on (I also looked at the builder's sheet-320 before and after files):
- `checkout-page-one-frame-390-light-after-qa.png`: real checkout page at 390 px, one frame, header, timer, footer
- `checkout-page-one-frame-1280-light-after-qa.png`: the same at 1280 px
- `checkout-notfound-one-frame-390-light-after-qa.png`: checkout not-found at 390 px, one styled frame
- `checkout-notfound-one-frame-1280-light-after-qa.png`: the same at 1280 px
- `checkout-error-390-dark-after-qa.png`: checkout error state, 390 px dark: logo header, notice, Try again, styled footer
- `checkout-error-1280-dark-after-qa.png`: the same at 1280 px dark
- `checkout-error-retry-recovered-390-light-after-qa.png`: the real checkout page after Try again
- `checkout-group-layout-error-390-light-after-qa.png`: error thrown in the checkout-group site layout, still the unstyled shell (non-blocking item above)
- `sheet-unavailable-days-320-light-after-qa.png`: sheet at 320 px light, 44 px days, struck unavailable days, nothing clipped
- `sheet-unavailable-days-320-dark-after-qa.png`: the same, dark
- `sheet-unavailable-days-360-light-after-qa.png`: sheet at 360 px light
- `sheet-unavailable-days-360-dark-after-qa.png`: sheet at 360 px dark
- `sheet-unavailable-days-390-light-after-qa.png`: sheet at 390 px light
- `sheet-unavailable-days-390-dark-after-qa.png`: sheet at 390 px dark
- `sheet-past-days-320-light-before-qa.png`: BookingChoices story, today Oct 18, base: past days dimmed, 39 px cells
- `sheet-past-days-320-light-after-qa.png`: same story at 89e6ece: past days still dimmed and disabled, 44 px cells
- `sheet-past-days-320-dark-before-qa.png`: the base story, dark
- `sheet-past-days-320-dark-after-qa.png`: the 89e6ece story, dark
- `panel-calendar-1024-light-before-qa.png`: desktop panel at 1024 px, base
- `panel-calendar-1024-light-after-qa.png`: desktop panel at 1024 px, 89e6ece, only the unavailable days differ
- `panel-calendar-1280-light-before-qa.png`: desktop panel at 1280 px, base
- `panel-calendar-1280-light-after-qa.png`: desktop panel at 1280 px, 89e6ece
- `sheet-refusal-soldout-390-light-before-qa.png`: BC-39 at base: refusal notice, Continue disabled, focus on BODY, sheet stays open after one Escape
- `sheet-refusal-soldout-390-light-after-qa.png`: BC-39 at 89e6ece: same notice, focus on the notice, one Escape closes the sheet (focus and Escape results are in the text above; the picture shows the notice and the disabled button)
- `checkout-title-focus-390-light-before-qa.png`: BC-29 at base: h1 focused after re-hold, no ring
- `checkout-title-focus-390-light-after-qa.png`: BC-29 at 89e6ece: h1 focused after re-hold, blue ring
- `checkout-title-focus-390-dark-after-qa.png`: BC-29 at 89e6ece, dark: light blue ring
- `checkout-after-rehold-390-light-after-qa.png`: full page after re-hold, one visible frame

### Cleanup
Servers were started and stopped by PID inside each command. The three scratch worktrees (89e6ece, 053bd1a, and the temporary-throw copy) and the scratch database were removed after the last run. Nothing was committed, pushed or posted.
