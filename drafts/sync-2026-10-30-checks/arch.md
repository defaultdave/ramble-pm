PASS

## architecture-audit: sync 2026-10-30 (head 49afa4e)

### Blocking
None.

### Non-blocking
- `src/app/(guest)/experiences/[slugAndId]/page.tsx` imports are the union of both sides (integration's `Suspense`, `BookingPanelSkeleton`, `BookingSlots`, `UpcomingSessionsSkeleton`, `BookingContent`, `UpcomingSessionsContent`; main's `PageError`); no new layer edge.
- The error state matches main: `PageError` with the same title and alert text and `retryHref={experiencePath(address)}`; against `ec8a8ed` the file changes only the `ExperienceError` to `PageError` swap.
- Nothing lost beyond `ExperienceError`: integration's dates and booking slots, `bookingsPaused` and `searchParams` kept; `index.ts` still exports `BookingSlots` and `BookingSlotsProps`; the booking stories and tests kept; the `ExperienceError` stories, tests and stale comment line removed.
- No code beyond the resolution (`git show --cc` shows only the conflicted hunks); no remaining reference to `ExperienceError` or `HomeError`.

### Unconfirmed
- Gates taken from the resolver's and the PM's runs.
