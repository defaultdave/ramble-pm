FAIL

## qa-agent: U-041 "Booking bar, sheet, and panel" (head e2619c6)

### Blocking
- A refusal from the 1280 px desktop panel opens the phone booking sheet as a modal over the page (confirms the review). With `?date=2026-11-03` loaded and that session sold out in the database, Continue in the panel opens a 400 px sheet with the "Those spaces just sold out" notice, a calendar and its own Continue, while the panel shows the same notice: the refusal appears twice. Every page region goes `inert`; ten Tabs stay in the dialog. The sheet's calendar shows October while the panel shows November. Escape closes it but focus lands on BODY, not the panel's Continue. Fix: the panel shows its refusal inline and never opens the sheet.

### Non-blocking
- Phone sheet focus correct at 390 (light, dark) and 320: focus on the dialog, Escape returns to "Choose date", also after an S5 refusal.
- Date cells 39 x 44 px at 320 (BC-35). At 390 a 16 x 6 "Next" control looks visually hidden.
- Bookings paused works on the bar and the panel; the sheet cannot open while paused. The date rows still link with `?date=` while paused.
- The experience page keeps the old paused state until the cache refreshes (duration not measured).
- An experience-level `paused` status (`winter-paddle-series`) answers 404; not compared with intent.
- A hold-rate refusal shows honestly in the panel with the retry time.

### What worked
`?date=` preselects on the bar and panel; the bar's Continue reaches a real `/checkout/<holdId>` with the hold countdown; the sheet's date, time and stepper (stops at 6 on a 10-space session); the panel's date, time and party (3 guests, $255.00) reach a real checkout; a double click on the panel makes exactly one hold (0 before, 1 after); S4 refused with the device-limit copy and the input kept; S5 on the phone with alternatives and choices unchanged; 21+ and kids rules; no sideways scroll at 320, 390, 768; stepper labels "Decrease Guests" and so on.

### Not completed
- The fake-gateway payment was not completed (the QA environment lacked `CAPABILITY_TOKEN_SECRET`; a rerun did not finish). S5 was set up by editing the database. S4 driven on the phone only. 768 and 320 not driven through a full booking; dark mode partial; no Figma comparison.
- `phone-paused-bar-390-light-after.png` in the builder's folder is a pre-pause capture; `phone-bar-paused-390-light-after.png` is the real one.

Evidence (`evidence/pr/unit-U-041-qa-agent/`):
- `desktop-s5-continue-1280-light-after.png`: the phone sheet modal over the desktop page after a refusal.
- `desktop-s5-after-escape-1280-light-after.png`: after Escape, the refusal in the panel.
- `desktop-panel-chosen-1280-light-after.png`, `desktop-checkout-1280-light-after.png`: the panel with 3 guests and the real checkout it reaches.
- `desktop-panel-paused-1280-light-after.png`, `phone-bar-paused-390-light-after.png`: paused.
- `phone-bar-continue-to-checkout-390-light-after.png`: the checkout reached from the bar.
- `phone-s4-refusal-390-light-after.png`, `phone-s5-sold-out-390-light-after.png`: S4 and S5 on the phone.
- `phone-sheet-21plus-chosen-390-light-after.png`, `phone-sheet-kids-party-390-light-after.png`: age rules.
- `phone-sheet-open-{390-light,390-dark,320-light}-after.png`, `phone-bar-320-light-after.png`, `phone-bar-768-light-after.png`: widths.
