# PR G brief, round 1: `src/lib/pages/` plus the pages lint zone

UNIT: U-030 (carrier unit, PM ruling 2026-10-29). Branch: `unit/U-030-lib-pages`. BASE: `main`, cut at `b620f7e` (`git rev-parse origin/main` at brief time). PR title and commits: `U-030: page modules move to src/lib/pages and a lint zone keeps shared modules off them`.

Source plan: `drafts/lib-layout-refactor.md`, section "PR G" (moves table, risks, PM rulings). This brief replaces that section's manifest and call-site list, which were cut at `5a595f1`; the lists below are recut from `main` at `b620f7e`, after PRs A to F and D merged.

## Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new (git mv, so blame survives)
    src/lib/pages/home.ts                 from src/lib/home.ts
    src/lib/pages/home.test.ts            from src/lib/home.test.ts
    src/lib/pages/browse.ts               from src/lib/browse.ts
    src/lib/pages/browse.test.ts          from src/lib/browse.test.ts
    src/lib/pages/experience.ts           from src/lib/experiencePage.ts
    src/lib/pages/experience.test.ts      from src/lib/experiencePage.test.ts
    src/lib/pages/experience.fixtures.ts  from src/lib/experiencePage.fixtures.ts
    src/lib/pages/siteNav.ts              from src/lib/siteNav.ts
    tests/lint-pages-zone.test.ts
  edited: the zone
    eslint.config.boundaries.mjs
  edited: import paths only
    src/app/(guest)/HomeContent.tsx
    src/app/(guest)/new-york/browse/BrowseContent.tsx
    src/app/(guest)/experiences/[slugAndId]/page.tsx
    src/app/(guest)/experiences/[slugAndId]/page.test.tsx
    src/server/home.ts
    src/server/home.test.ts
    src/server/browse.ts
    src/server/browse.test.ts
    src/server/experiencePage.ts
    src/server/experiencePage.test.ts
    src/server/coverPhotos.test.ts
    src/server/db/home.ts
    src/server/db/browse.ts
    src/components/FilterBar/FilterBar.tsx
    src/components/GuestShell/GuestShell.tsx
    src/components/GuestShell/SiteMenu.tsx
    src/components/BrowseResults/BrowseResults.tsx
    src/components/BrowseResults/BrowseResults.stories.tsx
    src/components/ExperiencePage/ExperiencePage.tsx
    src/components/ExperiencePage/ExperiencePage.fixtures.ts
    src/components/ExperienceGallery/ExperienceGallery.tsx
    src/components/ExperienceGallery/ExperienceGallery.stories.tsx
    src/components/ExperienceGallery/ExperienceGallery.test.tsx
    src/components/HomeModules/HomeModules.tsx
    src/components/HomeModules/HomeModules.fixtures.tsx
    src/components/HomeModules/HomeModules.test.tsx
    src/components/HomeModules/HomeModules.stories.tsx
    src/components/HomeModules/CategoryRail.tsx
    src/components/HomeModules/ReassuranceSection.tsx
    src/lib/experienceCards.test.ts
    src/lib/photoViews.test.ts
    src/lib/seed/coverage.ts
    tests/db/home.db.test.ts
    tests/db/browse.db.test.ts
    tests/db/seed.db.test.ts
    docs/runbooks/home.md      (:7, :50 cite src/lib/home.ts)
    docs/runbooks/browse.md    (:33, :37, :55 cite src/lib/browse.ts)
  edited: folded audit items
    src/lib/routes.ts          (H-85: delete the private ExperienceRef type; use the exported
                                ExperienceAddress in experiencePath, guidePath and experienceCardPath)
    src/lib/routes.test.ts     (fixture import path to ./pages/experience.fixtures; H-86: delete the
                                `paths` describe, its four assertions are already rows of the
                                `literal addresses` table; do not add or reorder table rows)
OUT OF SCOPE:
  any logic change in the moved files; moving id/idWithLetters out of experience.fixtures.ts (follow-up);
  H-89 and src/lib/errorDigest.ts (G does not touch it); H-92, H-93, H-94, H-95;
  tests/lint-boundaries.test.ts (G ships its own test file);
  .claude/** including .claude/standards/architecture.md:80 (cites the old paths; only the owner edits
  .claude/; list it in Suggestions);
  docs/plan/** (frozen); the literal reading "nothing outside pages/ imports from it";
  every file on unit/U-005; the managePath lines integration added to routes.ts and routes.test.ts.
REFERENCE CODE:
  eslint.config.boundaries.mjs 'ramble/boundaries/layers' (the existing import/no-restricted-paths zones
  the new zone joins) and the vendor-SDK configs (the files/ignores pattern);
  tests/lint-boundaries.test.ts (one synthetic-file fixture case per rule, the shape the new test copies);
  node_modules/eslint-plugin-import/docs/rules/no-restricted-paths.md (`target` may be a glob or array of
  globs; `except` is relative to `from`).
```

## Call sites on `main` at `b620f7e` (every importer of the five modules)

```
src/app/(guest)/HomeContent.tsx:5                       @/lib/home
src/app/(guest)/experiences/[slugAndId]/page.test.tsx:10 @/lib/experiencePage.fixtures
src/app/(guest)/experiences/[slugAndId]/page.tsx:8      @/lib/experiencePage
src/app/(guest)/new-york/browse/BrowseContent.tsx:9     @/lib/browse
src/components/BrowseResults/BrowseResults.stories.tsx:4 @/lib/browse
src/components/BrowseResults/BrowseResults.tsx:5        @/lib/browse
src/components/ExperienceGallery/ExperienceGallery.stories.tsx:5 @/lib/experiencePage
src/components/ExperienceGallery/ExperienceGallery.test.tsx:6    @/lib/experiencePage
src/components/ExperienceGallery/ExperienceGallery.tsx:3         @/lib/experiencePage
src/components/ExperiencePage/ExperiencePage.fixtures.ts:2       @/lib/experiencePage
src/components/ExperiencePage/ExperiencePage.tsx:16              @/lib/experiencePage
src/components/FilterBar/FilterBar.tsx:5                @/lib/browse
src/components/GuestShell/GuestShell.tsx:5              @/lib/siteNav
src/components/GuestShell/SiteMenu.tsx:3                @/lib/siteNav
src/components/HomeModules/CategoryRail.tsx:3           @/lib/home
src/components/HomeModules/HomeModules.fixtures.tsx:3   @/lib/home
src/components/HomeModules/HomeModules.stories.tsx:5    @/lib/home
src/components/HomeModules/HomeModules.test.tsx:6       @/lib/home
src/components/HomeModules/HomeModules.tsx:2            @/lib/home
src/components/HomeModules/ReassuranceSection.tsx:2     @/lib/home
src/lib/browse.test.ts:22                               ./browse            (moves with it, text unchanged)
src/lib/experienceCards.test.ts:11                      ./home              -> ./pages/home (test file, exempt)
src/lib/experiencePage.test.ts:21,22                    ./experiencePage, ./experiencePage.fixtures -> ./experience, ./experience.fixtures
src/lib/home.test.ts:18                                 ./home              (moves with it)
src/lib/photoViews.test.ts:2                            ./experiencePage.fixtures -> ./pages/experience.fixtures
src/lib/routes.test.ts:2                                ./experiencePage.fixtures -> ./pages/experience.fixtures
src/lib/seed/coverage.ts:1,3                            @/lib/browse, @/lib/home (seed is exempt from the zone, H-96 ruling below)
src/server/browse.test.ts:3                             @/lib/browse
src/server/browse.ts:8                                  @/lib/browse
src/server/coverPhotos.test.ts:2                        @/lib/experiencePage.fixtures
src/server/db/browse.ts:27                              @/lib/browse
src/server/db/home.ts:12                                @/lib/home
src/server/experiencePage.test.ts:2                     @/lib/experiencePage.fixtures
src/server/experiencePage.ts:5                          @/lib/experiencePage
src/server/home.test.ts:2                               @/lib/home
src/server/home.ts:10                                   @/lib/home
tests/db/browse.db.test.ts:13                           @/lib/browse
tests/db/home.db.test.ts:5                              @/lib/home
tests/db/seed.db.test.ts:4                              @/lib/browse
```

Sibling imports inside each moved module (`./catalog`, `./routes`, `./time`, `./sessionWindow`, and the rest) become `../`. Re-grep after the move: `git grep -nE "(@/lib/|\./)(home|browse|experiencePage|siteNav)['\"]" -- src tests` must return only files inside `src/lib/pages/` (and `src/server/actions/browse.test.ts`, whose `./browse` is the server action, not the page module).

Not changing, confirmed on `main`: `PicksSection.tsx`, `ThisWeekSection.tsx`, `BrowseResults.test.tsx`, `HomeHero.tsx`, `HomeEmpty.tsx`, `GuestBanner.tsx` and `docs/runbooks/experience.md` no longer import or cite these modules; no `vi.mock` names them; `@` resolves to `src` in every config, so no alias change; Storybook globs only `src/components/**`.

## The zone (from the plan, unchanged)

A new zone inside the existing `ramble/boundaries/layers` `zones` array: `target` the globs for `src/lib/**` excluding `src/lib/pages/**`, `src/lib/seed/**` and `src/lib/**/*.test.ts`; `from` `./src/lib/pages`. Not a separate config object: in flat config a later object that supplies `import/no-restricted-paths` options replaces the `layers` zones wholesale, so `src/lib` would silently lose its must-not-import-server/components/app guard. After the edit, `pnpm exec eslint --print-config src/lib/catalog.ts` must show every existing `layers` zone plus the new one, and `tests/lint-boundaries.test.ts` must still pass. The `withTypeImportsAllowed` wrapper applies as before.

`tests/lint-pages-zone.test.ts`: a synthetic `src/lib/bad.ts` importing from `src/lib/pages/home` fails; `src/lib/seed/x.ts`, `src/lib/x.test.ts`, `src/server/x.ts`, `src/components/X.tsx`, `src/app/x.tsx` pass. Copy the fixture shape of `tests/lint-boundaries.test.ts`.

## PM rulings

- Zone semantics: no `src/lib` module outside `src/lib/pages/` imports from `src/lib/pages/`; `src/app`, `src/server`, `src/components` and the seed may.
- **H-96 (lib-refactor lane, 2026-10-29):** the seed stays a page-level mirror and is exempt from the zone, as the plan's zone already says. `src/lib/seed/coverage.ts` probes what the home and browse pages will show, so it reads their own constants (`homeLimits`, `browseWindowDays`) rather than copies; moving those constants to a shared module would put page settings outside the page modules. No constant moves in G.
- Test files under `src/lib/**/*.test.ts` are exempt; moving `id`/`idWithLetters` out of the fixture is a follow-up.
- H-85 and H-86 ride in G because `routes.test.ts` changes anyway. `integration` adds `managePath` to `routes.ts` (after `legalPath`) and a `manage page` row to the `literal addresses` table; keep your edits away from those lines so the next main-to-integration sync merges cleanly.

## Risks and checks

- Rename detection: the reviewer confirms `git diff -M --stat origin/main...HEAD` and `git log --follow` show renames, not delete-plus-add. Keep each moved file's content change to its import lines.
- Import ordering: `import/order` and prettier may reorder lines; mechanical, but say so in the report.
- Gates: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip`, `pnpm test:db`, `env -u DATABASE_URL pnpm build`, gitleaks over the range. `pnpm storybook:test` and e2e need local ports; if the sandbox refuses them, say so in the report (CI runs both before auto-merge).
- No visible change, so no evidence files.
