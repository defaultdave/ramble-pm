PASS

## review-agent: U-031 "experienceCards.ts and ExperienceCardItem" (head fe08eb9)

Run: `tsc --noEmit`, eslint on src/lib, src/components and src/server, knip, and vitest on src/lib and the affected component folders (74 files, 2476 tests pass). Not run: `test:db`, Storybook.

### Blocking
None.

### Non-blocking
- Scope: all 33 entries are in the manifest or the PM additions (BookingPanel story, story CSS frame); aliasing `maxCoverLookups` and `maxCardIds` accepted; no module-level alias exports.
- Output identity: `toExperienceCard` is the old `toHomeCard` unchanged, using `experienceCardPath` and `durationLabel`. `ExperienceCardItem` is `HomeCardItem` with `headingLevel` as a prop. `BrowseResults` passes `layout="vertical"` and `headingLevel={2}` (same `cardPhotoSizes.vertical`); home passes h3 in `PicksSection` and `ThisWeekSection`. Browse still sorts prices lowest first in `withPriceOptions`.
- H-45: `fromPriceLabel(0)` and `perPersonAmount(0)` return "Free" (`src/lib/pricing.ts:185-193`). A card with a free space-taking option beside paid ones reads "Free", never "From Free" or "From $0"; a free option that takes no space is still ignored. BookingPanel reads "Free" with "per person". Covered by `pricing.test.ts:365,373,407` and the `it.each` at `experienceCards.test.ts:106-113`. BookingBar's "Free" with "per person · next ..." under it reads fine. No BookingBar test with a zero price, but it makes the same call `pricing.test.ts:407` covers.
- Import cycle: `experienceCards.ts:4` uses a declaration-level `import type { PhotoView }`; its runtime imports (`catalog`, `duration`, `pricing`, `routes`) never reach `photos` or `photoViews`; it imports neither `home.ts` nor `browse.ts`; `photos.ts` imports only `cardLookupLimit`. No runtime cycle.
- Dropping `kind`: `db/home.ts` stops selecting it (Zod would strip it anyway; schema test "drops a field a card does not read"); `db/browse.ts` never read it; `tests/db/home.db.test.ts:167-173` updated; no `.kind` read of a price option remains in src/server or src/lib.
- Deleted tests: `toHomeCard`, `cardsInOrder` and `withPriceOptions` blocks moved to `experienceCards.test.ts`; the "From $0" assertions in `browse.test.ts` and `pricing.test.ts` now assert "Free"; the cross-builder agree block has no equivalent because there is one builder; `ExperienceCardItem.test.tsx` covers the component; BookingPanel test and story cover the free case.
- Duplication sweep: no new duplicate; money, duration, route, card price and card building each have one definition. `perPersonAmount` replaces the inline Free rule in `priceLines`, and BookingPanel no longer calls `formatPrice` directly.
- Runbooks updated; no `console` calls or ticket-naming comments added.

### Unconfirmed
- `pnpm test:db` (`tests/db/home.db.test.ts`) not run; the edit drops `kind` mechanically.
- Evidence PNGs not checked here (qa-agent's check).
