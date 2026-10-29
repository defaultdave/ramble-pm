PASS

## a11y-audit: U-045b "Fake payment UI and event simulator" (head 6d0cb7d)

### Blocking
- None.

Round 1 focus findings at head:
- Fail verification (`FakePaymentForm.tsx:300-307`) passes `loading`, so `Button` sets `aria-disabled`, blocks activation in its handler, and keeps focus; tested ("locks Fail verification with aria-disabled, not disabled, while sending"; "the notice takes it").
- A declined or refused challenge returns to `entering` with a notice; `focusTarget` (`src/lib/fakePaymentFlow.ts:108-117`) focuses the notice wrapper (`tabIndex={-1}`, visible ring), or Pay without a notice.
- Wallet Cancel (`FakePaymentForm.tsx:334-343`) returns to `entering` with the cancelled notice focused; tested.
- The `autoComplete="off"` item is ruled (DECISIONS 2026-10-29), not re-raised.

Round 2 item 4: the `role="status"` region is always present and empty, and reads "Confirming payment" only while locked; visually hidden with a real clip; tested. Sheet headings keep a visible focus ring; the wallet buttons' transparent outline pairs with a box-shadow ring, visible in forced colors.

### Non-blocking
- `FakePaymentForm.tsx:341-352` (`lost` view): when the connection drops while focus is on Pay or a sheet button, the control unmounts and `focusTarget` returns null for `lost`, so focus falls to body; the replacement button is native `disabled`. Round 1 non-blocking, outside round 2. Fix: focus the connection-lost notice, with a test.
- Audit item: `.visuallyHidden` defined in each component CSS module (pre-existing duplication).

### Unconfirmed
- Escape: no keydown or Escape handler in the component, its stories, or `fakePaymentFlow.ts`; the sheet is an inline section, not a dialog; the close QA saw must come from outside the component.
- Dark-mode focus rings on the sheets and notice not rendered.

### Evidence
- `challenge-failed-focus-390-light-after.png`: the "We couldn't verify it's you" notice holds focus with the ring after Fail verification.
- `wallet-cancelled-focus-390-light-after.png`: the "Apple Pay was cancelled" notice holds focus after Cancel.
