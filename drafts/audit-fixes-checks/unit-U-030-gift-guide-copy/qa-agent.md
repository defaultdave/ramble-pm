PASS

## qa-agent: U-030 "Gift guide copy from its collection" (head a2739e0)

Method: no browser (sandbox). Copy derived from the seed fixtures through the branch's view code, and from the unit tests. The gift guide section has no "See all N" link; it has the action "Shop the gift guide" (unchanged). "See all N picks" belongs to Picks.

### Gift guide, seeded home (module has heading null, body null, collection gift-guide)

| | main | this branch | Figma 01 Home |
|---|---|---|---|
| Eyebrow | Gift guide | Gift guide | Gift guide |
| Heading | Give an experience | Give a Saturday, not a sweater | Give a Saturday, not a sweater |
| Body | none | Experiences to give for every kind of person. They pick the date; you look thoughtful. | Experiences to give for every kind of person. They pick the date; you look thoughtful. |
| Action | Shop the gift guide | Shop the gift guide | Shop the gift guide |
| Sponsor | Presented by our holiday partner | Presented by our holiday partner | Presented by our holiday partner |

The branch matches Figma word for word. Main's heading was the removed fixed string and it showed no body.

### Picks section (must not change)
- The Picks view code is the same rule as before: heading is the module's heading, else the collection title; summary is the collection summary. The diff only moves that rule into the shared `collectionModuleCopy`. The seeded copy is unchanged: "Rainy day, sorted", "Indoor plans that beat staying in, picked by our editors.", link "See all 6 picks" (6 seeded items; the link label is still built from `pick.items.length`). A new test, "does not change the count the Picks link shows", covers it.
- Unchanged and out of scope: Figma shows "Twelve indoor plans that beat staying in, picked by our editors." and "See all 12 picks", while the seed has a shorter summary and 6 items. This differs on main too.

### Edge behaviour (from tests)
Module-authored heading/body win over collection copy; no summary gives no body; no published gift guide with no module heading hides the section; with a module heading and no collection, it keeps its own heading.

### Tests
`pnpm exec vitest run src/lib/home.test.ts src/server/home.test.ts`: 2 files, 85 tests passed.

### Blocking
None.

### Non-blocking
- Seeded Picks copy and count (6) differ from Figma (12); pre-existing, audit item for the seed.

### Unconfirmed
- Rendered pixels: not checked in a browser. The builder has no U-030 gift-guide folder in `evidence/pr/` (only hero, hero-select, shell, states, time), so no builder before/after exists.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/audit-home-2026-10-28/figma-01-home-44-10.png : Figma 01 Home at 390: gift guide heading, body, action, sponsor; Picks copy.
- src/lib/seed/fixtures/editorial.ts (worktree) : gift-guide and rainy-day-sorted collections, home module rows.
- src/lib/home.ts (worktree, commit aa17c67) : the copy rule and removed `giftGuideHeading`.
- src/lib/home.test.ts, src/server/home.test.ts (worktree) : the tests run above.
- src/components/HomeModules/HomeModules.fixtures.tsx (worktree) : gift guide view fixture matching Figma copy.
