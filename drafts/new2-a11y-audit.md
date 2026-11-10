## a11y-audit: NEW-2 PASS

Scope: ops admin UI kit (DataTable, Select, Textarea, SearchField, StatusBadge and StatusFilterBar, ConfirmDestructive, Flash), the shared Field frame, and the lib helpers (tableQuery, statusBadge, flash, fieldIds).
Head: `923b503c63ba997453443fbb5a592427390405a6`. Round 2 diff: `git diff cb9f090 HEAD` (25 files, all frontend, all inside the round-1 scope plus `src/components/Field/`).
Method: static reading of the round-2 diff against cb9f090, with Input rendered markup compared before and after, plus the shared components and tokens from round 1. No browser or axe run.

### Round 2 focus

- Input rendered markup is unchanged. Before and after, the DOM is `div.field > label.label[htmlFor=id] (+ span.optional), input#id.input[aria-invalid][aria-describedby], p.hint#id-hint, p.error#id-error (+ svg aria-hidden)`. Same order, same ids, same classes, same `aria-invalid` rule. `fieldIds` builds `describedBy` from hint id, then error id, then the caller's `describedBy`, and returns undefined when empty. That matches the old `.filter(Boolean).join(' ') || undefined`. Input.module.css is untouched, and Field.module.css only `composes` from it, so the styles resolve to the same classes.
- Label and description wiring for Select and Textarea is unchanged. They already used `fieldIds`, and the frame is the same.
- DataTable region is now named `Scrollable <caption>`, so it no longer repeats the caption text verbatim. Round-1 advisory 3 is resolved. Name still non-empty and unique, and `tabIndex={0}` is kept.
- Textarea gains a `div.control` wrapper (`display: flex`). Markup change only, no ARIA or label change. See the non-blocking note on width.
- Story renames (`Error` to `LoadFailed`, `WithError`) carry no a11y change. No test or file in the diff references the old names.
- Flash: `readFlash` is added and `parseFlash` keeps its contract. The role mapping through Alert is unchanged.

### Blocking

None.

### Non-blocking

1. Sort header focus ring is clipped at the top (and the left edge of the first column). Unchanged from round 1 because `DataTable.module.css` is not in this diff. `.scroll` sets `overflow-x: auto`, which also clips box-shadow outside its padding box. Fix: add inset padding to `.scroll` or draw the ring inset. Confirm visually before fixing.
2. Selected filter chip is marked by fill only. `StatusFilterBar` sets `aria-current` for screen readers, but sighted users get no non-color cue. Low risk under 1.4.1. A check icon would make it unambiguous.
3. Empty and error text is not live. The DataTable empty state after a search, and the Select, Textarea, and Input field errors, render without a live region. A GET search is a full page load, so this is acceptable. Advisory only.
4. Sort icon contrast. The unsorted icon uses `--color-text-secondary`, which passes 3:1 for non-text UI. Note only.
5. Flash is not announced on page load. The role mapping is correct (success and info use `role="status"`, warning and danger use `role="alert"`). A server-rendered status element present at load is not announced. Left as decided.
6. Not an a11y finding, for the visual pass: the Textarea `div.control` is `display: flex`, so the textarea (a flex item with `display: block`) may stop filling the field width. Check in Storybook. Also, `Input.module.css` `.field:has(.input:disabled) .label` does not reach the Select and Textarea controls, so their disabled label does not dim. Disabled state is still exposed natively to assistive tech.

### Unconfirmed (needs a runtime or browser check)

- Dialog heading level. ConfirmDestructive renders its title through react-aria `Heading slot="title"` with no explicit level. If the default is h3 and the page has no h2 before the dialog, the outline skips a level. Check in the browser's heading tree.
- Focus return after a confirmed destructive action. If the action removes the trigger (for example a deleted row), focus falls to the body. Verify with a row-level trigger.
- Pending confirm state. The loading confirm button sets `aria-busy` and `aria-disabled`, but the pending state is not announced. Verify whether a status message is needed.
- Forced-colors focus. The global `:focus-visible` rule covers DataTable sort links and SearchField, but no test exercises them.
- Stories under axe. No axe harness appears in the diff, so the stories were not checked statically. Confirm the axe run on the renamed stories passes.

### Checked and passing

- Sort headers: a `<Link>` inside `<th scope="col">`. `aria-sort` is `ascending` or `descending` for the active column, `none` for other sortable columns, and absent on non-sortable headers. Sort links are 44px tall.
- Scroll region: `role="region"`, named `Scrollable <caption>`, `tabIndex={0}`, with a visible focus ring.
- Labels, hint, error: Input, Select, and Textarea use `htmlFor` with a `useId` fallback through the shared Field. `aria-describedby` lists hint and error only when they render. `aria-invalid` is set when there is error text. The Field test asserts the description string `"Hint Error"` and the frame order (label, control, hint, error).
- Error icons are `aria-hidden` and paired with text. StatusBadge pairs its tone with an icon and a label.
- Target size: fields 52px, chips and buttons 44px min, dialog close 44px.
- Focus visibility: all controls keep their `:focus-visible` ring. Round 2 did not change any focus style.
- Contrast: token values unchanged from round 1, so the computed ratios still hold (light focus sky-700 on canvas 5.92:1, light input border ink-500 on white 4.09:1, dark focus sky-300 on canvas 9.15:1, dark input border ink-400 on surface 5.09:1).
- Dialog: react-aria `ModalOverlay` and `Dialog`. Escape dismisses, focus is trapped and restored, Cancel has initial focus, close has `aria-label="Close"`.
- Link text: "Try again", "First page", "Next page", "Clear search", and "Back to the first page" are specific in context. Pagination nav is labelled `"<caption> pages"`.
- Not applicable to this diff: alt text, images, `<html lang>`, page-level heading order.

### Summary

0 blocking, 6 non-blocking (5 carried from round 1, round-1 item 3 resolved, plus 1 new visual-only note), 5 unconfirmed. Verdict PASS for WCAG 2.2 AA.
