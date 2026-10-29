PASS

## qa-agent: U-030 "a failed cover read costs the photos, not the page" (head a8908a4)

I did not run a browser and did not force a cover failure live (no ports, Chromium or Postgres here). This verdict is from reading the code and running the unit tests: `pnpm exec vitest run "src/app/(guest)" src/server/monitoring src/components/Card src/components/ExperienceCard` gave 12 files, 116 tests, all passing.

### Trace of what a guest sees
| Case | Home | Browse |
|---|---|---|
| (a) covers fail | `readGuestCovers` catches, logs `... covers could not be read` once (digest + kind only), returns an empty map; page renders the modules and cards with no image | same; cards and the FilterBar render, live region keeps its heading, no alert |
| (b) content fails | `Promise.all` rejects before the cover read; outer catch logs `... could not be read`, shows `HomeError` | same; shows the error view, live region empty, no cover read |
| (c) both fail | content rejects first, so the cover read never runs; one log line, error view | same (tested: covers mock not called) |
| (d) Next control-flow error from covers | `rethrowOrLog` calls `unstable_rethrow` inside `readGuestCovers`, then the outer catch's `rethrowOrLog` rethrows again; nothing logged, the framework handles it | same |

### Missing-image state
It is the one the design already has. `Card` always renders the `.image` wrapper (sunken background, `aspect-ratio: 3 / 2` when vertical, fixed square when horizontal) and `ExperienceCardItem` passes `image` as null when the card has no cover. The box keeps its size, so there is no layout shift and no `<img>` with an empty src, so no broken-image icon. `ExperienceCardItem.test.tsx` "draws the cover photo, and no image without one" proves no `img` is rendered.

### Blocking
None.

### Non-blocking
- Home has no test that a content failure skips the cover read (browse has one). The code order guarantees it, so this is only a test gap.
- Not confirmed visually: I did not look at the empty-image box in Storybook or a browser, only the CSS and the test.

### Unconfirmed
- Real-database behaviour of a failing cover query (no Postgres); the mocked `getCoverPhotos` rejection stands in for it.

### Evidence
- No builder evidence in `evidence/pr/` for this unit (only other U-030 folders exist, unrelated); I added none because no browser was available.
- `src/app/(guest)/HomeContent.test.tsx`: "logs only the digest and kind of a failed cover read and renders the cards without images" (case a, no alert, no img, cards present, covers message logged)
- `src/app/(guest)/HomeContent.test.tsx`: "rethrows a framework control-flow error from the cover read and logs nothing" (case d)
- `src/app/(guest)/HomeContent.test.tsx`: "logs only the digest and kind of a failed read and renders the error state" (case b)
- `src/app/(guest)/new-york/browse/BrowseContent.test.tsx`: "logs only the digest and kind of a failed cover read and renders the cards without images" (case a, filters still shown)
- `src/app/(guest)/new-york/browse/BrowseContent.test.tsx`: "rethrows a framework control-flow error from the cover read and logs nothing" (case d)
- `src/app/(guest)/new-york/browse/BrowseContent.test.tsx`: "logs only the digest and kind of a failed content read and renders the error state, reading no cover" (cases b and c)
- `src/app/(guest)/new-york/browse/BrowseContent.test.tsx`: "renders the live region empty on the error path, so a recovery updates the same node"
- `src/components/ExperienceCard/ExperienceCardItem.test.tsx`: "draws the cover photo, and no image without one" (missing-image state)
- `src/components/Card/Card.module.css` (`.image`, `.vertical .image`, `.horizontal .image`): reserved box, no layout shift
