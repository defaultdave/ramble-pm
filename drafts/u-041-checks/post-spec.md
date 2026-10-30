PASS

## spec-compliance: U-041 "Booking bar, sheet, and panel" (head e2619c6)

### Blocking
None.

### Per item
Every units.yaml clause PASS: `useBookingDraft` (one module store per experience, `useSyncExternalStore`); date, time, party with 21+ rules (`childAgeAllowed`, the function `attendeeIssues` enforces); book or gift switch (gift shows "Gifts aren't open yet", `canContinue` requires book); `reserveSpaces` with `reserveInput`; S4 and S5 (`blockedEffect`, `soldOutEffect`); bar on phones, panel from 768 px; `unavailable` outcomes (paused, cancelled, past, gift not valid) on bar, sheet and panel; bookings paused on all three. PM rulings PASS: 60 days and 60 sessions with `requireBoundedRead`; the demo click-through removed (no `bookHref`, `demoCheckout`, `isDemoHold`, `isDemoOrder`, `DemoPage`, `DemoCheckout` left); `'use client'` only on the three islands; the one `TODO(U-041)` on `releaseHold` as ruled. Builder's calls PASS: `bookHref` removed; open date rows link to `?date=` and preselect; the hold call sends what was chosen with no retry; double submit makes one hold (`BookingFlow.test.tsx:152`); limits from `src/lib/holds.ts`; no domain decisions outside `src/lib`.

### Non-blocking
- src/lib/bookingOutcome.ts:89: the device-limit copy uses `maxSeats` but the rule that fires is `holdLimits.deviceSeatLimit` (both 6 today); use `deviceSeatLimit`.
- Every notice sets `sheetOpen: true` (src/lib/bookingDraft.ts:364) at every width; the Dialog portals, so on desktop S4 or S5 pops a modal over the panel. PM to confirm against "panel on desktop".
- src/lib/pages/experience.ts:130-143 repeats the age range in src/lib/checkout.ts:205-216.
- docs/runbooks/experience.md:3 edited as a consequence of removing the TODO.
- BookingContent.tsx:9-13 says the list and the choices share "one cached read"; they are two reads (6 rows and 60 sessions).

### Unconfirmed
- `fitParty` (src/lib/bookingDraft.ts:295, :393) lowers the party without a message when a time has fewer spaces; PM to decide.
- Sheet focus and Escape (react-aria Dialog), 320 px and 44 px at runtime: a11y and QA.

Round 2 (`ddb7c43`) changed only the fixes listed in `brief-r2.md`; covered by the round 2 review, architecture, a11y and QA checks.
