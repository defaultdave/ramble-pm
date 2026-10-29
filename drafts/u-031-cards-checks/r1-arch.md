PASS

## architecture-audit: U-031 "experienceCards.ts and ExperienceCardItem" (head fe08eb9)

Rules: `.claude/standards/architecture.md` (project), `eslint.config.boundaries.mjs`, wave3-review-rules.md. Read-only; no mutation tests. Full-repo eslint printed only certificate noise, so imports were checked by reading.

### Blocking
None.

### Rule by rule
- B1 pass. No fetch, Drizzle or SDK call added in lib, components or app; `experienceCards.ts` is pure.
- B2 pass. Nine decisions in the diff, all in `src/lib` with tests: (1) Free rule `perPersonAmount` (`pricing.ts:186`); (2) a lowest price of 0 reads "Free", `fromPriceLabel` (`pricing.ts:191`); (3) single price vs range wording, `cardPriceLabel` (`pricing.ts:173`); (4) card-or-null rules in `toExperienceCard` (`experienceCards.ts:69`); (5) meta string from neighborhood and duration; (6) ordering and limit, `cardsInOrder` (`experienceCards.ts:97`); (7) lowest-first sort and per-experience filter, `withPriceOptions`; (8) `priceLines` Free line via `perPersonAmount` (`experiencePage.ts:155`); (9) `maxCoverLookups` and `maxCardIds` derived from `cardLookupLimit`. BookingPanel and BookingBar only call lib functions; `ExperienceCardItem` only switches on `card.kind`; `server/db/browse.ts` and `home.ts` keep only SQL and Zod parsing.
- B3 pass. B4 pass: `experienceCards.ts` imports `zod`, `./catalog`, `./duration`, `./pricing`, `./routes` and a type from `./photoViews`; not `home.ts` or `browse.ts`; dependency direction correct.
- B5 pass. `CardExperienceSchema` and `CardPriceOptionSchema` parsed at the `server/db` boundary; `db/home.ts` drops the unused `kind` column.
- B6 n/a (guest-visible reads). B7 pass. B8 pass (no `'use client'` added). B9 n/a. B10 n/a. B11 pass. B12 pass (integer minor units). B13 pass (a card that cannot be shown returns null, not repaired). B14 n/a. B15 n/a. B16 pass (only a 3-line story CSS file).
- B17 pass. One card builder (`toExperienceCard`, `cardsInOrder`), one card component (`ExperienceCardItem`), one card schema set; `CardPriceOptionSchema` is a deliberate subset of `catalog.PriceOptionSchema` with a `satisfies z.ZodType<CardPriceOption>` check and no use of the private `MinorUnitsSchema`; the Free rule and "From" wording live once, in `pricing.ts`.

### Intent and risks
- Photos cycle safe: declaration-level `import type` at `experienceCards.ts:4`; runtime graph `photos -> experienceCards -> catalog, duration, pricing, routes`.
- `cardLookupLimit` stays 240.
- Held branch `unit/U-014a`: its pricing.ts hunks (two TODO docstring lines near 66 and 94) do not overlap C's (lines 1 to 5 and the tail from 180).
- `ExperienceCardItem` is a synchronous server component with no hooks or state; not a client island. It lives in its own `components/ExperienceCard/` folder with an index, story and test.

### Non-blocking
- `pricing.ts` is not purely append-only: it drops the `fromPriceLabel` import from `./booking` (line 2) and `cardPriceLabel`'s tail now calls `perPersonAmount` (line 182). Both are needed (the plan's call-site list names them) and do not touch U-014a's lines.
- `priceLines` now returns "Free" through `perPersonAmount`; same result as before, and the Free rule is now single.

### Unconfirmed
- Unit tests and eslint not run to a result here (certificate noise); conclusions from reading imports.
