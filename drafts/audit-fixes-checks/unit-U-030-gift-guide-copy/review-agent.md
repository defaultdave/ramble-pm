PASS

## review-agent: U-030 "Gift guide copy from its collection" (head a2739e0)

### Blocking
None.

### Non-blocking
- docs/runbooks/home.md:14: the gift_guide row still says "Copy comes from: The module's heading and body" and "Hidden when: Gifts are switched off in settings". After this diff the copy falls back to the collection's title and summary, and the module is also hidden when it has no heading and no matching published guide. Update the row (out of the manifest's IN SCOPE list, so the PM may fold it into a docs pass).
- src/lib/home.ts viewOf gift_guide: a published guide whose visible items are all filtered out still renders the module. Matches the owner decision (no count shown on this module) and the design doc; noted only.
- The new test "does not change the count the Picks link shows" sits under the gift guide describe; it is a Picks regression guard, harmless.

### Checks
- Picks unchanged: `collectionModuleCopy` returns `module.heading ?? collection.title` and `collection.summary`, the exact expressions it replaced. Existing picks tests untouched and green; the extra test pins "See all 5 picks".
- Dropped gift guide module: viewOf returns null when `module.heading === null` and no guide whose id equals `module.collectionId`. Consistent with H-68 (fallback needs a collection, no fixed copy) and with docs/runbooks/home.md ("A module with nothing to show is hidden whole, never drawn empty"), same as Picks with a missing collection. Tested: it.each in src/lib/home.test.ts for no collection and for a module naming another collection; plus own heading kept when no guide is published, and gifts-off still hides it. The seed module (src/lib/seed/fixtures/editorial.ts:161) has heading null and collection `gift-guide`, so the seeded home still shows the guide with Figma's title and summary.
- Added read: `getHomeContent` is inside `"use cache"` with `cacheTag(tags.home, tags.catalog)` (src/server/home.ts:39). `tagsFor` for a `giftGuide` change returns `[tags.giftGuide, tags.home]` (src/lib/cacheTags.ts:66), so editing the guide invalidates home. One extra bounded query (readCollections has `.limit(editorialLimits.listed)`), run in the existing Promise.all.
- Failure path: the read is inside the same `readOrRefuse('Home', ...)` callback as the others; a failure refuses, no fail-open. A guide read error is not swallowed.
- U-036 TODO removal: right. The function now has a caller (getHomeContent). U-036 ("Picks and gift guide pages", depends on U-031) still expected to use it for the /gifts page (units.yaml line 894); that is a second caller, no TODO needed.
- Scope: 5 files, all in scope or PM-ruled forced (src/server/home.ts, editorial.ts TODO). No CSS, no schema, no seed, no GiftGuideSection change (it takes props, no hard-coded copy).
- Duplication: `collectionModuleCopy` is the shared rule for both modules; no other copy-fallback helper found. Comments are non-obvious-why only; no ticket numbers added.
- Sweep (unbounded, DB vs Zod, fail-open, logs): no instances in this diff.
- `pnpm test` in worktree: 170 files, 3750 tests passed.

### Unconfirmed
- None. (db, e2e, build, gitleaks taken from the PM's run, not rerun.)
