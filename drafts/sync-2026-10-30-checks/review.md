PASS

## review: sync 2026-10-30 (head 49afa4e)

### Blocking
None.

### Non-blocking
- Nothing lost: `page.tsx` keeps `Suspense`, `BookingPanelSkeleton`, `BookingSlots`, `UpcomingSessionsSkeleton`, `UpcomingSessionsContent`, `BookingContent`, `searchParams`, `bookingsPaused`, and the `dates` and `booking` props; the booking stories and slot tests are intact. Against `origin/main` the only lines gone from the stories are `args: { view: sunsetKayak }` (merged into integration's `args` with `dates`) and an old comment line; against `ec8a8ed` the only removals are `ExperienceError` (component, CSS, exports, stories, tests, a comment line).
- The error state matches main (the `PageError` branch does not appear in the diff against `origin/main`).
- No new code beyond the resolution; no new layer imports. No `ExperienceError` or `HomeError` left in `src`, `docs`, `.storybook` or `e2e`.
- `ExperiencePage` stories and tests now cover the page's own states; `PageError` states are covered by `PageError.stories.tsx` and `PageError.test.tsx` from main.

### Unconfirmed
- Gates taken from the resolver's and the PM's runs.
