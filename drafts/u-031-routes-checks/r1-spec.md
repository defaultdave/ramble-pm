PASS

## spec-compliance: U-031 "routes.ts: one home for every guest address" (head 2c83761)

Diff `origin/main...HEAD` (19 files) checked against the "PR A: routes.ts" section of `drafts/lib-layout-refactor.md` in ramble-pm: every Moves row, every call-site bullet, every PM ruling, and the scope manifest.

### Blocking
None.

### Non-blocking
- src/lib/routes.ts:1 imports `EntityIdSchema` and `isSlug` from `./catalog` as runtime values. The plan's "Risks and checks" section asks for a dependency-free, type-only `routes.ts`; that section was not among the criteria given, so this is logged, not blocking. Effect is small: `home.ts` and `filters.ts` already imported catalog at runtime, so the components that now import routes.ts gain no new heavy dependency. Worth a look at the storybook job.
- src/lib/routes.ts:37 exports `type ExperienceAddress`; nothing outside routes.ts imports it. knip may report an unused export type (unconfirmed; knip not run by this check).
- src/app/(guest)/experiences/[slugAndId]/page.tsx:52-61: the JSX in the catch block reflowed to one line; the only behavioural change is the `retryHref` argument (`experiencePath(address)`, status dropped), the call-site bullet. Not PR E work.

### Unconfirmed
- knip and the storybook job (HomeModules stories render HomeHero, which now imports filters.ts) were not run by this check.

PM note (not part of the verdict): the PM ran knip on this head and it passes; the storybook job runs in CI before auto-merge; the catalog import is a PM ruling of 2026-10-29.

### Per-criterion results
Moves table: browsePath (two copies) PASS; browseHref and BrowseTarget deleted, rail via hrefForFilters PASS; hero parameter names via `browseParamNames` PASS; experiencePath and experienceAddress unified, `guidePath`, `experienceCardPath`, page.tsx without the invented status PASS; parseExperienceAddress with maxAddressLength beside experiencePath, runbook updated PASS; picksPath, giftGuidePath, picksAnchor, homePicksHref PASS; categoryPath, neighborhoodPath, giftCheckoutPath, contactPath, helpPath, accessibilityPath, legalPath, privateSessionPath alias PASS.

Call sites: home.ts, home.test.ts, browse.ts, browse.test.ts, experiencePage.ts, experiencePage.test.ts, siteNav.ts, filters.ts, filters.test.ts, HomeHero, HomeEmpty, GuestShell, FilterBar, BrowseResults, page.tsx, both runbooks, routes.test.ts fixtures from `./experiencePage.fixtures`, literal `/contact` contract checks left alone: all PASS.

Scope manifest: 19 of 19 changed files in IN SCOPE; nothing from PR B to G, the H-26 choice, e2e/routes.ts, the U-014a files (import only) or U-005: all PASS.

PM rulings: `/picks/[slug]`; `homePicksHref` `/#picks` and `picksAnchor` `picks`; both category targets kept; the named route helpers with `privateSessionPath` as an alias; parseExperienceAddress beside experiencePath: all PASS.

Stale-reference sweep: no imports of removed names remain; the only `browseHref` left is filters.ts's own, which the plan keeps.
