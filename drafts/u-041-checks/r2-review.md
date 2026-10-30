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
