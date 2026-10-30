PASS

## architecture-audit: U-041 "Booking bar, sheet, and panel" (head ddb7c43)

### Blocking
None. The round 1 B17 item is fixed: `childAgeRange` deleted; `allowedChildAges` beside `childAgeAllowed` in `src/lib/checkout.ts`, called by `ageRequirements` (0 to 17 fallback kept) and the booking basics; `childAgeAllowed` no longer exported.

B2 decisions outside `src/lib` in the whole-unit diff: none. `useBookingDraft` dispatches into `bookingReducer`, builds requests with `reserveInput`, maps answers with `effectOf`, and passes the submit origin through (`afterReserve` decides whether the sheet opens). The `BookingPanelIsland` `querySelector` focus effect is a DOM side effect. `DatePicker`'s controlled `focusedValue` holds paging state anchored to lib's `visibleDate`. `experience.ts` only chooses whether to call `allowedChildAges` and passes `holdLimits.deviceSeatLimit` to the offer.

B7 pass (every new export has a non-test importer); B8 pass (`'use client'` only on the three islands and the allowlisted `DatePicker`); B17 pass.

### Non-blocking
- `BookingChoices.tsx` static copy ("Adults" versus "Guests", headings); advisory.
- Audit item BC-36: `src/server/db/schema/orders.ts:58` repeats the age-array idiom (predates the diff).
