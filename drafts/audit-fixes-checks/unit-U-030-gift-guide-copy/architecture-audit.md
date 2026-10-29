## Architecture Audit — APPROVE

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project, B1 to B17)
Unit U-030, branch `unit/U-030-gift-guide-copy`, head a2739e04f1b74f109a9807057b551e13d130c260
Files audited: src/lib/home.ts, src/lib/home.test.ts, src/server/home.ts, src/server/home.test.ts, src/server/db/editorial.ts

### Blocking Issues
None.

- B2 pass: the fallback (module heading, else collection title; summary; gift guide with no matching guide) is decided in `collectionModuleCopy` and `viewOf` in src/lib/home.ts (lines ~206-219, ~305-325), with unit tests. src/server/home.ts only fetches (`getPublishedGiftGuide()`) and passes `giftGuide` through.
- B6/B7 pass: the removed `TODO(U-036): first caller` sat on `getPublishedGiftGuide` (editorial.ts); that function now has a real caller (`getHomeContent`), so the B7 exemption is no longer needed. The sibling `TODO(U-036): first caller` on `getPublishedPick` (editorial.ts:113) is untouched and still correct. U-036 ("Ramble Picks and gift guide pages", docs/plan/units.yaml:894) is still planned and still owns the pages; removing the TODO loses no link, because the U-036 scope names the gift guide page and the function has a caller. `getPublishedGiftGuide` reads published rows only, so no requireRole is needed (guest-visible read exemption).
- Caching (B14) pass: the read is inside the cached `getHomeContent` (`'use cache'`, tags `tags.home` and `tags.catalog`). src/lib/cacheTags.ts `giftGuide` change returns `[tags.giftGuide, tags.home]`, so a gift guide publish invalidates home. No caller, cookie, or header read added.
- Round trip pass: `getPublishedGiftGuide()` joins the existing `Promise.all` with modules, picks, categories, neighborhoods. It adds a query to stage 1, not a new sequential stage; H-37's four-stage shape is unchanged (not worsened).
- B17 pass: no existing duplicate found. The only other `heading ?? title` rule was the Picks builder's own inline one in home.ts, which this change replaces with a call to `collectionModuleCopy` (two uses, one rule). src/lib/editorial.ts holds only write-side schemas and limits, and src/lib/browse.ts:155 returns a view summary, so neither has an equivalent.

### Advisory
- src/lib/home.ts:206 (B17, forward-looking): `collectionModuleCopy` is a collection-copy rule, not a home rule. U-036 (Picks and gift guide pages on the browse template) will face the same "heading wins, else collection title" decision. Placing it in a page module is what B17 warns against, but today home is its only caller and drafts/lib-layout-refactor.md (PRs A to G) names no editorial helper module, so it is not blocking. Suggest logging an audit item or a follow-up: when U-036 needs it, move it to a shared module named for what it does (for example `src/lib/collectionCopy.ts`, or into `editorial.ts` if that file's scope is widened) with its tests. Moving it before PR G, or placing it in the new module from the start, avoids adding another symbol to the home.ts call-site list that PR G regenerates.
- src/lib/home.ts:~306: the gift guide module with `module.heading === null` and no matching guide returns null, and with a heading but no guide shows an empty summary. This is correct behavior, but the `giftGuide?.id === module.collectionId` match is a second decision point beside `pickModuleIds`; fine for now.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
