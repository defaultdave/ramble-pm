## a11y-audit: NEW-2 PASS

Scope: ops admin UI kit (DataTable, Select, Textarea, SearchField, StatusBadge and StatusFilterBar, ConfirmDestructive, Flash) plus the shared lib helpers (tableQuery, statusBadge, flash, fieldIds).
Head: `cb9f0901d2963548f8d9f21dd02bececab54ae89`. Diff: `git diff origin/main...HEAD` (44 files, all additions, all frontend).
Method: static reading of the TSX and CSS modules in the diff, plus the shared components they compose (Alert, Dialog, Input, Button, ButtonLink, Chip, ChipLink, Badge) and the tokens. Contrast ratios computed from the token hex values. No browser or axe run.

### Blocking

None.

### Non-blocking

1. Sort header focus ring is clipped at the top (and the left edge of the first column). `.scroll` sets `overflow-x: auto`, which also makes the box `overflow-y: auto`, so it clips box-shadow outside its padding box. `.sort:focus-visible` draws its ring with box-shadow (2px canvas, 4px sky-700), and each sort link is 44px tall and sits flush with the top of the table, so the top side of the ring falls outside the clip. Left, right, and bottom edges still show. Fix: add inset padding to `.scroll` or draw the ring inset. Confirm visually before fixing.
2. Selected filter chip is marked by fill only. `StatusFilterBar` selected chips get an inverse background and `aria-current="true"`. The screen reader gets the state, but sighted users get no non-color cue (no check mark, no weight or underline change). Low risk under 1.4.1 because the fill and text colors both flip, but a check icon would make it unambiguous.
3. Caption and region share one label. `DataTable` sets `<caption>` and `aria-label` on the scroll region to the same string, so a screen reader may announce the name twice. Cosmetic.
4. Empty and error text is not live. The DataTable empty state after a search, and Select, Textarea, and Input field errors, render without a live region. A GET search is a full page load, so this is acceptable; field errors arrive with the page render. Advisory only.
5. Sort icon contrast. The unsorted sort icon uses `--color-text-secondary` (ink-600 on ink-100, 6.53:1 light; ink-300 on ink-950, 10.10:1 dark). Both pass 3:1 for non-text UI, so this is a note only.
6. Flash is not announced on page load (known, decided, note only). The role mapping itself is correct: success and info use `role="status"`, warning and danger use `role="alert"`, via the Alert component. A server-rendered status element present at load is not announced. Left as decided.

### Unconfirmed (needs a runtime or browser check)

- Dialog heading level. ConfirmDestructive renders its title through react-aria `Heading slot="title"` with no explicit level. If the default is h3 and the page has no h2 before the dialog, the outline skips a level. Check in the browser's heading tree.
- Focus return after a confirmed destructive action. The dialog closes in a `finally` after the action. If the trigger button is removed by the action (for example a deleted row), react-aria cannot restore focus to it and focus falls to the body. Verify with a row-level trigger.
- Pending confirm state. The loading confirm button sets `aria-busy` and `aria-disabled`, but the pending state is not announced. Verify whether a screen reader needs a status message.
- Forced-colors focus. `styles/forced-colors.css` maps all `:focus-visible` to a CanvasText outline, and the forced-colors browser test covers Chip. The DataTable sort link and SearchField are covered by the same global rule, but no test exercises them.

### Checked and passing

- Sort headers: sortable columns are a `<Link>` inside `<th scope="col">`. `aria-sort` is `ascending` or `descending` for the active column and `none` for other sortable columns. Non-sortable headers get no `aria-sort`. Sort links are 44px tall (`min-block-size: var(--size-touch-target)`).
- Scroll region: the wrapper is `role="region"`, has `aria-label` and `tabIndex={0}`, and has a visible focus ring. A keyboard can reach the overflow.
- Labels, hint, error: Input, Select, and Textarea use `htmlFor` with a `useId` fallback. `fieldIds` puts hint and error ids in `aria-describedby` only when they render. `aria-invalid` is set when there is error text. SearchField labels its input "Search" and wraps the form in `role="search"`.
- Color not the only signal: StatusBadge pairs each tone with an icon and a text label (the icon is aria-hidden, the word is read). Errors pair an icon with text. Sort direction is an icon plus `aria-sort`.
- Target size: fields are 52px (`--size-field-height`). Chips are 44px min. Button and ButtonLink (pagination, retry, clear) are 44px min. Dialog close is 44px. The select chevron is `pointer-events: none`.
- Focus visibility: Input, Select, Textarea, Chip, Button, ButtonLink, Dialog close, and sort links all have a `:focus-visible` ring (box-shadow with a 2px sky-700 or sky-300 outer ring). Forced-colors fallback is global.
- Contrast (computed): light focus ring sky-700 on canvas 5.92:1; light input border ink-500 on white 4.09:1; light danger confirm white on berry-700 7.67:1; light hint ink-600 on white 7.79:1. Dark focus sky-300 on canvas 9.15:1; dark input border ink-400 on surface 5.09:1; dark danger confirm ink-800 on berry-200 9.79:1; dark hint ink-300 on ink-950 10.10:1. All meet AA, including 3:1 for non-text UI.
- Dialog: built on react-aria `ModalOverlay` and `Dialog`. Escape closes (isDismissable, default keyboard dismiss on). Focus is trapped, and react-aria restores focus to the trigger on close. Cancel has `autoFocus`, and a unit test asserts it has focus. The close button has an "aria-label" of "Close".
- Alert and error: DataTable's error state uses `Alert tone="danger"`, which is `role="alert"`, and offers a "Try again" link. The empty state is plain text with an optional link back to page one.
- Link text: "Try again", "First page", "Next page", "Clear search", and "Back to the first page" are specific enough in context. The pagination nav is labelled `"<caption> pages"`.
- Not applicable to this diff: alt text, images, `<html lang>`, heading order at page level.

### Summary

0 blocking, 6 non-blocking, 4 unconfirmed. Verdict PASS for WCAG 2.2 AA.
