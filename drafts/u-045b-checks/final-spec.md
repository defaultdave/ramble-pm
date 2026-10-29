PASS

## spec-compliance: U-045b "Fake payment UI and event simulator" (head 6d0cb7d)

### Blocking
None.

### Non-blocking
- Round 2 item 1: `visibleErrors` (`src/lib/fakeCard.ts:172`) returns the ordered list; `firstErrorField` is `visibleErrors(errors)[0]?.field` (`:183`); `FieldErrors` maps it (`FakePaymentForm.tsx:409-416`); table-tested. PASS.
- Item 2: "Fail verification" uses `loading={locked}` (`aria-disabled`, `Button.tsx:61`); `onSheet` and `focusTarget` in `src/lib/fakePaymentFlow.ts:96-117` with table tests; the effect at `FakePaymentForm.tsx:92-103` focuses the sheet heading on open, the notice wrapper (`tabIndex={-1}`, visible ring) on return, or Pay. PASS.
- Item 3: wallet Cancel returns to `entering` with a notice, focused; a test asserts `toHaveFocus`. PASS.
- Item 4: visually hidden `<p role="status">` reads "Confirming payment" while locked (`FakePaymentForm.tsx:174-176`); tested. PASS.
- Escape: the form has no Escape handler; the sheets are inline sections, not the `Dialog` component (which closes on Escape). Nothing in this diff closes a sheet on Escape.
- `focusTarget` returns `null` for the `lost` step, so a connection loss from a sheet drops focus to body; a recorded lib decision outside round 2's wording. Non-blocking.
- `TODO(U-047b): first caller` on the action stands (B7).

### Unconfirmed
- The Escape close and its focus landing (qa-agent's question).

Every clause of the scope line is present at head; round 2 touched only in-scope files; out-of-scope paths untouched.
