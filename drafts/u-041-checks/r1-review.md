FAIL

## review: U-041 "Booking bar, sheet, and panel" (head e2619c6)

### Blocking
- src/lib/bookingDraft.ts (`afterReserve`, `case 'notice'`, `sheetOpen: true`) with src/components/BookingSheet/BookingSheetIsland.tsx and src/app/(guest)/experiences/[slugAndId]/BookingContent.tsx: every refusal (S4 device limit, S5 sold out, cancelled, past, invalid, something went wrong) opens the phone sheet whatever device sent the request. `BookingSheetIsland` is always mounted, the shared `useBookingDraft` store drives it through `sheetOpen`, and the react-aria `ModalOverlay` portals to `document.body`, so the CSS that hides `.bar` from 768 px does not hide it. A desktop guest refused from the panel gets a modal sheet repeating the notice, making the page inert and trapping focus. Fix: a refusal from the panel must not set `sheetOpen` (set it in the bar's handler, gate the sheet island on a viewport query, or keep `sheetOpen` out of the shared state); add a test where the panel's Continue is refused and the sheet stays closed. Found from the code path; qa-agent to confirm at 1280 px.

### Non-blocking
- src/components/BookingChoices/useBookingDraft.ts (`dispatch`, `subscribeTo`): `dispatch` writes `states` with no island subscribed; if the guest leaves before the action answers, `pending` stays true for that experience until a full reload. Fix: write only while `listeners.has(key)`.
- useBookingDraft.ts: if `router.push` to checkout fails, `pending` stays true with no way out (low probability).
- src/lib/upcomingSessions.ts: the 60-session cap in start order hides later dates for busy experiences; ruled, cost in BC-33.
- src/lib/bookingDraft.ts (`fitParty`): a time with fewer spaces silently shrinks the party, children first; the steppers show it; a note would be kinder.
- Duplication sweep: no blocking duplicates found by this check.

### Checked and clean
Double submit makes one hold; `reserveInput` repairs nothing; a thrown action becomes a "nothing was held" notice; `describeReserve` exhaustive (sold-out alternatives, device limit, too-many-holds with retry time, paused, cancelled, past, gift); paused on bar, sheet and panel; no domain decision outside src/lib; `requireBoundedRead` at server and db layers with tests; no demo references left; only the ruled `TODO(U-041)` on `releaseHold`; nothing in `docs/plan`, `.github`, `.claude`.

### Unconfirmed
- Focus return after the sheet closes, 320 px, 44 px: browser pass.
