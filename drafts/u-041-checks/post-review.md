PASS

## review: U-041 "Booking bar, sheet, and panel" (head ddb7c43)

### Blocking
None. The round 1 item is fixed: `SubmitOrigin` is carried through `submitDone` (bar and sheet pass `'phone'`, the panel `'panel'`), and `afterReserve` in `src/lib/bookingDraft.ts` opens the sheet on a refusal only for `'phone'`; tests cover panel refused (no dialog, notice in the panel), sheet refused and bar refused. Scope: 22 files, all in `src/`, all within round 2's list.

### Non-blocking
- `useBookingDraft.ts`: `router.push(effect.href)` sits inside the `try`, but `push` does not throw on a navigation failure, so `pending` can still stay true in that rare case (as in round 1).
- `dispatch` now returns early with no subscriber; a late answer cannot leave `pending` for the next visit.
- Device-limit copy reads `deviceSeatLimit` through `BookingOffer`.
- `ageRequirements` keeps the 0 to 17 fallback via `allowedChildAges`; `childAgeAllowed` is still the rule `attendeeIssues` uses; `childAgeRange` deleted.
- `Alert` spreads rest props, so `data-booking-notice` and `tabIndex={-1}` reach the DOM; its role is `alert` for warning and danger tones and `status` for info and success.
- No new B2 outside `src/lib` (`visibleDate` in lib; `DatePicker` holds React state; the focus `querySelector` is scoped to the panel's section).
- Nits: the `querySelector` depends on the literal aria-label "Book this experience" (a ref would be sturdier; the `BookingFlow` tests would catch a rename); `html:has(.page)` is global CSS in a component module; `fitParty` and the 60-session cap stay as ruled (BC-33, BC-34).

### Unconfirmed
- Browser behaviour: qa-agent.

---

PASS

## a11y-audit: U-041 "Booking bar, sheet, and panel" (head ddb7c43)

### Blocking
None.

### Non-blocking
- `ExperiencePage.module.css` (`:global(html):has(.page)`, below 768 px): the scroll padding is a fixed sum matching the bar's nominal height (12 px top padding, 44 px button, 24 px bottom padding, 1 px border, safe area); a wrapped summary at 320 px could make the bar taller, so at most partial overlap; 2.4.11 still passes. Measuring the bar would remove the risk.
- The panel notice (`Alert`, `tabIndex={-1}`) has no visible focus indicator on programmatic focus; polish, not a failure.

### Unconfirmed (correct on reading; not run in a browser)
- Focus to the panel's notice: the effect fires only when a new notice is set; the scoped selector `section[aria-label="Book this experience"] [data-booking-notice]` exists in `BookingPanel.tsx`; role `status` for info and `alert` for warning or danger, focus moved either way.
- Time slots in `role="group"` labelled by the `h3` id from `useId`.
- Scroll padding applies at the root (the bar is sticky in the root scroller; no overflow ancestor).
- Calendar month: controlled `focusedValue` re-anchored from `visibleDate`, with `onFocusChange` keeping the guest's paging.
- Phone sheet focus and Escape: `BookingSheetIsland.tsx` changes only `submit()` to `submit('phone')`; the dialog wiring is untouched.

Round 1: `drafts/u-041-checks/r1-review.md` (FAIL), `r1-a11y.md` (PASS) in ramble-pm.
