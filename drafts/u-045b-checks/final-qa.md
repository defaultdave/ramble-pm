PASS

## qa-agent: U-045b "Fake payment UI and event simulator" (head 6d0cb7d)

### Blocking
None.

### Non-blocking
- Escape: nothing in the browser, Storybook or the component closes the 3-D Secure or wallet sheet; with focus on the sheet heading or on Fail verification, Escape leaves the sheet open and focus in place. Round 1's "closes silently" does not reproduce; focus never drops to body.
- After "Payment received" focus ends on body because the form is replaced by the announced success message (terminal; U-047b navigates away); unchanged from round 1.
- The live "Confirming payment" status and Fail's aria-disabled while confirming could not be caught in the browser (the Storybook mock answers instantly); the Confirming story shows the status and unit tests cover both.
- No rate limit on the confirm action (PM-accepted, for U-047b).

### Gates (scratch copy of 6d0cb7d)
format:check, lint, typecheck, knip exit 0; unit 4103 in 182 files; build exit 0; storybook:test 204 in 35 files with axe; e2e 160 through the lock.

### Browser pass (Storybook, keyboard, 390 px)
- Fail verification by keyboard: focus lands on the "We couldn't verify it's you" notice (tabIndex -1, visible ring) and stays at 50, 300, 1200, 2500 ms; a retry with the good card gives "Payment received".
- Wallet Cancel (Google Pay, Apple Pay): focus on the "... was cancelled / Nothing was charged" notice; next Tab goes to Apple Pay.
- Opening either sheet focuses its heading. The Confirming story has a visually hidden role="status" reading "Confirming payment".
- Test cards by Enter on Pay: 4242 paid; 0002 declined with focus back on Pay; 9995, 0069, 0127 the matching declines with focus on Pay; 3220 opens 3-D Secure with focus on the heading; 4111 (not a test card) inline error, focus on the card field, nothing submitted. Complete verification and wallet Pay give "Payment received". No console errors.

### Evidence
![focus after Fail verification](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b/qa-final-failed-focus-390-light-after.png)
![focus after wallet Cancel](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b/qa-final-wallet-cancelled-focus-390-light-after.png)
![3-D Secure sheet open, Escape leaves it open](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b/qa-final-sheet-escape-open-390-light-after.png)
Builder's: `challenge-failed-focus-390-light-after.png`, `wallet-cancelled-focus-390-light-after.png` (QA's run matches).
