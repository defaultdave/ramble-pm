PR G of the `src/lib` layout refactor (H-18), the last of A to G. The four page modules move into `src/lib/pages/`, and a lint zone stops shared `src/lib` modules from importing them, so a general helper can no longer quietly live in a page module and be reached from shared code. Plan: `drafts/lib-layout-refactor.md` in ramble-pm, section "PR G"; the call-site list was recut from `main` at `b620f7e` (`drafts/u-030-lib-pages-checks/brief-r1.md`). Carrier unit U-030 (PM ruling, DECISIONS 2026-10-29).

No behaviour change and nothing visible, so no evidence images.

## What changed
- **Moves (`git mv`, 8 renames, R094 to R099):** `home.ts`, `browse.ts`, `siteNav.ts` and their tests go to `src/lib/pages/`; `experiencePage.ts`, its test and its fixtures become `pages/experience.ts`, `experience.test.ts` and `experience.fixtures.ts`. Only import specifiers change inside the moved files.
- **Importers:** 36 files in `src/app`, `src/server`, `src/components`, `src/lib` tests, the seed and `tests/db` now import `@/lib/pages/...`. Runbooks `home.md` and `browse.md` cite the new paths.
- **The zone:** one new entry in the existing `ramble/boundaries/layers` zones array in `eslint.config.boundaries.mjs` (not a separate config object, which would replace the existing zones). Target: `src/lib` files outside `pages/` and `seed/`, test files excluded; from: `src/lib/pages`.
- **`tests/lint-pages-zone.test.ts` (new, 9 cases):** a shared module, a subfolder module and a relative import are refused; the seed, a lib test, a page module, server, components and app are allowed.
- **H-85:** `routes.ts` drops the private `ExperienceRef`; `experiencePath`, `guidePath` and `experienceCardPath` take the exported `ExperienceAddress`.
- **H-86:** `routes.test.ts` drops the `paths` describe; its four assertions are already rows of the `literal addresses` table.

## Decisions
- **H-96 (PM ruling):** the seed stays exempt from the zone. `seed/coverage.ts` probes what home and browse will show, so it reads their own constants (`homeLimits`, `browseWindowDays`) rather than copies.
- Test files in `src/lib` are exempt; moving `id`/`idWithLetters` out of the experience fixtures is a follow-up.
- Type-only imports stay allowed, as for the other zones (`withTypeImportsAllowed`).
- H-85 and H-86 keep clear of the `managePath` lines `integration` adds to the same two files, so the next sync merges cleanly.

## Gates (head `4ebf014`, `main` at `b620f7e`)
- **Builder:** `format:check`, `lint`, `typecheck`, `knip` pass; `test` 3947 pass; `test:db` 755 pass; `db:check` clean; `env -u DATABASE_URL pnpm build` passes. `storybook:test` and e2e were refused by the local sandbox (browser launch); CI runs both.
- **PM:** gitleaks over the range, no leaks; every changed file is in the manifest.

## Checks (round 1, all PASS)
- **review-agent:** renames hold, moved files change only imports; zone probed over 16 synthetic files (alias, relative, `export from`, dynamic `import()`, nested folders, `.tsx`, stories); deleting the zone fails 3 of 9 zone tests.
- **architecture-audit:** existing layer zones intact; no shared module imports a page module; H-96 consistent with the standard; one address type left.
- **spec-compliance:** every criterion passes; 49 files, all in the manifest.
- **qa-agent:** export surface of all five modules byte-identical on `main` and head; tests 3939 to 3947 (+9 zone cases, -1 H-86); each zone mutation behaves as designed and the existing layers guard still fires; build route lists identical.

## Audit items
- Close when this PR merges: H-85, H-86, H-96, and H-18 and H-42 (the layout and its lint zone), all in `audits/home-2026-10-28.md`.
- For the owner (`.claude/` is yours): `.claude/standards/architecture.md:80` (B17) still cites `src/lib/home.ts`, `browse.ts`, `experiencePage.ts`; it should read `src/lib/pages/`. The standard could also name the new zone beside ARCH-7.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
