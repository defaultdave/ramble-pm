PASS

## qa-agent: U-045b "Fake payment UI and event simulator" (head a1af608)

### Blocking
None.

### Non-blocking
- Escape on the 3-D Secure sheet closes it and returns to the form with no message (neither pass nor fail, nothing charged); confirm the intended dismissal.
- In the Confirming story in dark, the card field's divider lines are not visible while disabled; cosmetic.
- The confirm action has no rate limit (PM-accepted; log for U-047b).

### Unconfirmed
- Double tap: the mock's call count was not readable in the browser; behaviour correct (double-click Pay with the 3-D Secure card opened one sheet; triple-click with the decline card gave one alert; double-click Complete verification gave one "Payment received"; no console errors). The server-side guarantee rests on the unit tests, which passed.

### Gates (scratch copy of a1af608)
format:check, lint, typecheck, knip exit 0; test 4008 in 177 files; build exit 0; storybook:test 200 in 34 files; e2e 160 passed (a logged "site banner could not be read" CachedReadError did not fail a test).

### Browser pass (Storybook, every story, light and dark at 390 px)
- Test cards: 4242 paid and onSucceeded fires; 4000000000000002 announced decline; ...9995 insufficient funds, ...0069 expired, ...0127 wrong security code; ...3220 opens 3-D Secure; 4111 (not a test card) inline announced error, no submit.
- 3-D Secure: Complete gives "Payment received"; Fail gives the announced "We couldn't verify it's you"; a retry with the good card succeeds.
- Wallets: Apple Pay and Google Pay open demo sheets; Pay succeeds; Cancel returns with "Google Pay was cancelled, nothing was charged".
- Keyboard: Tab order Apple Pay, Google Pay, number, expiry, CVC, ZIP, Demo test cards, Pay; visible 2 px outline at every stop; Enter submits; focus lands on the sheet heading; Escape dismisses.
- 320 px: no sideways scroll in any of 13 stories. Targets 48 px or taller (Pay 52 px). No console errors.

### Evidence
Builder's: `empty-390-light-before.png`, `empty-1280-light-before.png`, `empty-390-light-after.png`, `empty-390-dark-after.png`, `empty-1280-light-after.png`, `empty-1280-dark-after.png`, `declined-390-light-after.png`, `challenge-390-light-after.png`, `wallet-sheet-390-light-after.png`, `three-d-secure-390-after.gif`.
Added by QA: `three-d-secure-failed-390-light-after.png` (failed 3-D Secure, light and dark), `wallet-cancelled-390-light-after.png`, `paid-390-light-after.png`, `confirming-390-light-after.png`, `declined-320-light-after.png` (light and dark at 320), `challenge-320-light-after.png`, `challenge-keyboard-390-light-after.png` (focus on Fail verification).
