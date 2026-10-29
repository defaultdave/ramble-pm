PASS

## qa-agent: U-031 "experienceCards.ts and ExperienceCardItem" (head fe08eb9)

### Blocking
None.

### Non-blocking
- Consistent with the "Free everywhere" ruling though not in the spec's list: BookingBar's free price now reads "Free per person" (was "From $0 per person"). An improvement; confirm the owner wants it.
- A free card renders "Free per person" (the Card component adds "per person"); the string the builder produces is exactly "Free", as the spec says.
- No card has a rating field on main or HEAD, so the "with and without a rating" case does not apply.

### Unconfirmed
- `pnpm test:db`, `pnpm storybook:test` and e2e not run (Postgres, ports, browser); CI runs them.
- Format, lint, typecheck, knip, build and gitleaks not run by this check (only `pnpm test` was asked).
- Evidence PNGs listed, not opened.

### Behaviour proof
13 fixed experiences at origin/main (652fafd) and HEAD. Live: one price, several prices, paid plus a non-space option, only a non-space option, a 0 option alone, 0 beside a paid option, a non-space 0 beside a paid option, two 0 options, no duration, no prices. Guide-only: no prices, with a 0 price, no link out. Main used `toHomeCard` and `toBrowseCard`; HEAD `toExperienceCard`. Every card field dumped as JSON; `HomeModules` (Picks, This week) and `BrowseResults` rendered with Testing Library (covers on alternate cards); BookingPanel and BookingBar price text and the price helpers for 0, 1, 8500, 100000 dumped.

The two 347-line dumps differ only in:
- Card price strings: "$0" became "Free" (zero alone, two zeros, both builders); "From $0" became "Free" (0 beside a paid option, both builders).
- Rendered pages: "$0 per person" and "From $0 per person" became "Free per person" for those cards.
- BookingPanel: "$0 per person" became "Free per person"; paid unchanged.
- BookingBar: "From $0 per person" became "Free per person"; paid unchanged.
- Helpers at 0: `fromPriceLabel(0)` "From $0" to "Free"; `cardPriceLabel` single 0 "$0" to "Free", 0 beside paid "From $0" to "Free".
- `perPersonAmount` is new: "Free", "$0.01", "$85", "$1,000" for 0, 1, 8500, 100000.

Everything else identical: ids, titles, meta, hrefs, `kind`, `hostHref`, null for the no-link guide and the no-prices live experience, images, link lists, heading levels (Picks and This week h3, browse h2).

### `pnpm test` at HEAD
168 files, 3688 tests pass.

### Mutation checks (each reverted)
All six caught: `perPersonAmount` without the Free rule (5 failures); `toExperienceCard` href fixed (2); price fixed (5); `ExperienceCardItem` heading forced to 2 (4); browse `headingLevel` 2 to 3 (1); `fromPriceLabel(0)` back to "From $0" (3).

### Evidence
Folder `evidence/pr/unit-U-031-cards/` in ramble-pm: free card vertical and horizontal at 375 px, BookingPanel at 375 and 1280 px, before and after. Expected visual: the price line reads "Free per person" where it read "$0 per person"; nothing else moves.

PM note (not part of the verdict): the files were renamed after this check to drop "-light" (each frame shows light and dark), and a 1280 px free-card pair was added for spec-compliance.
