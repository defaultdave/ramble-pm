PASS

## spec-compliance: U-031 "experienceCards.ts and ExperienceCardItem" (head fe08eb9)

Checked against the "PR C" section of `drafts/lib-layout-refactor.md` in ramble-pm. The first pass failed only criterion 38 (no H-45 evidence yet); a recheck after the phone captures failed it for a missing desktop card pair; this third pass, with that pair added, passes it. The head did not change between passes.

### Blocking
None.

### Non-blocking
- A stray empty `.claude/` directory appeared in the evidence folder (removed by the PM before publishing).
- `experienceCards.ts:9-11`: the `cardLookupLimit` comment hard-codes "12 Picks candidates"; `experienceCards.test.ts:235` catches drift. Cosmetic.
- The desktop card pair is vertical only; the horizontal card has phone evidence only. One card pair per width meets "a free card at a phone and a desktop width".

### Unconfirmed
- Gates not run by this check (`test:db`, `storybook:test`, knip, lint, typecheck, build).
- PR title convention and the merge of main before push, not visible from the worktree.
- The temporary capture story lives in the PM's scratch trees, not the diff; method taken from the PM's description and the rendered text.
- `home.ts:372` doc-comment update named in Call sites: not confirmed either way.

### Per-criterion
Moves table (1-12) PASS: card schemas merged with `kind` dropped (`experienceCards.ts:15-29`); `PriceRow` and `withPriceOptions` moved (`:33,38`; callers `server/db/browse.ts:20,32,153`); one option schema `satisfies z.ZodType<CardPriceOption>`, no `MinorUnitsSchema`; `toExperienceCard` and `cardsInOrder` (`:69,97`); `ExperienceCardItem` replaces `HomeCardItem` and `ResultCard` (browse `layout="vertical" headingLevel={2}`); `perPersonAmount` (`pricing.ts:186-188`) used by `cardPriceLabel`, `priceLines`, BookingPanel; `fromPriceLabel` moved to `pricing.ts:191-193`, no booking import; `cardLookupLimit` 240 with `maxCardIds` and `maxCoverLookups` aliased.

Call sites (13-30) PASS: home.ts, home.test.ts (cross-builder block deleted), browse.ts, browse.test.ts ("From $0" now "Free"), pricing.ts and tests, booking.ts and test, experiencePage.ts, photos.ts (photoViews unchanged), server/db/home.ts (no `kind` column), server/db/browse.ts, server/home.ts, tests/db/home.db.test.ts, HomeCardItem deleted with Picks (vertical h3) and This week (horizontal), fixtures, BrowseResults and stories and test, BookingPanel and test, BookingBar, runbooks, barrels.

PM rulings (31-34) PASS, including "Free" everywhere, confirmed by the images.

Risks (35-41) PASS: U-014a's pricing lines untouched; type-only photos import; no home or browse import; H-45 evidence at phone and desktop; heading levels; no alias exports; stories exist. 42 (merge main and rerun gates) UNCONFIRMED here.

Scope (43-45) PASS: every one of the 33 entries in IN SCOPE or the two PM additions; conditional files untouched; nothing OUT OF SCOPE.

### Evidence
In `evidence/pr/unit-U-031-cards/`: `free-card-vertical-375-{before,after}.png` and `free-card-horizontal-375-{before,after}.png` (phone: "$0 per person" to "Free per person"); `free-card-vertical-1280-{before,after}.png` (desktop, light left and dark right); `booking-panel-free-375-{before,after}.png` and `booking-panel-free-1280-{before,after}.png` (panel "$0 per person" to "Free per person").
