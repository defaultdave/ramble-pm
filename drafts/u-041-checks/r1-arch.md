FAIL

## architecture-audit: U-041 "Booking bar, sheet, and panel" (head e2619c6)

### Blocking
- B17 (duplication), `src/lib/pages/experience.ts:130-143` (`childAgeRange`) rebuilds the allowed-child-ages calculation in `ageRequirements` at `src/lib/checkout.ts:198-217` (both filter `0..orderLimits.maxChildAge` with `childAgeAllowed` and take the first and last age), and puts a general age-rule helper in a page module. Fix: one shared function beside `childAgeAllowed` in `src/lib/checkout.ts` returning `{min, max}` or null, called by `ageRequirements` and the booking basics, test moved there.

### B2 decisions outside `src/lib`
None found. Components and islands only render views from `barView`, `choicesView`, `canContinue` (`src/lib/bookingDraft.ts`); `useBookingDraft` dispatches into `bookingReducer`, builds requests with `reserveInput`, maps answers with `effectOf` (its `pending` guard is also in the reducer); data layer bound via `requireBoundedRead`; routes call `buildBookingOffer`; `holds.ts` lost only a TODO.

### B7, B8, B13
Pass. Every non-type export has a non-test importer. `'use client'` only on the three `*Island` files (ruled); `useBookingDraft` on the hooks allowlist; no page or layout marked. No catch in `lib/**` or `server/**`; `BookingContent.tsx` uses `rethrowOrLog` and an error state.

### Non-blocking
- `BookingChoices.tsx` holds the 'Adults' versus 'Guests' label and section headings (static copy; advisory).
- Audit item: `src/server/db/schema/orders.ts:58` repeats the same `maxChildAge` age-array idiom (predates the diff).
