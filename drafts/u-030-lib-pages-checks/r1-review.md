PASS

## review-agent: U-030 "page modules move to src/lib/pages and a lint zone keeps shared modules off them" (head 4ebf014)

### Blocking
None.

### Non-blocking
- Moves: `git diff -M` and `git log --follow` show renames. Each moved file's content diff is import specifiers only (sibling imports to `../`; the page-module tests re-point their own `./experiencePage*` and `./browse` lines). Some import lines reflowed; prettier wrapped `seed.db.test.ts`. No logic change.
- Zone, checked with a scratch ESLint run over 16 synthetic files. The existing layers zones are intact (`eslint --print-config src/lib/catalog.ts` shows them, with the new zone second). `tests/lint-boundaries.test.ts` and `tests/lint-pages-zone.test.ts` pass.
  - Flagged as intended: root `.ts`, `.tsx`, `.stories.tsx`, `index.ts`, nested depth 3, `src/lib/email/` by relative path, `export ... from`, dynamic `import()`; alias and relative forms.
  - Not flagged as intended: `pages/` (and `pages/sub/`), `seed/` (and `seed/fixtures/`), `*.test.ts`, server, components, app.
  - Gap, matters little: `src/lib/*.test.tsx` is exempt (none exist; the brief exempts tests). `.mts` and `.js` are not targeted (none in `src/lib`).
  - Gap by design: `import type` of a page module from a shared lib module is allowed (`withTypeImportsAllowed`); the zone stops runtime coupling only.
  - Only the first folder level is exempted for `pages|seed`; deeper folders of those names are still checked (the safe direction).
- H-85 and H-86 match the brief: `ExperienceRef` deleted, `experiencePath`, `guidePath` and `experienceCardPath` use `ExperienceAddress`; the `paths` describe deleted, its four assertions already rows of `literal addresses`; no row added or reordered; no `managePath` lines touched.
- Stale references: none in src, tests, docs (outside docs/plan and .claude), scripts, e2e or config. Both runbooks updated; `docs/runbooks/experience.md` cites `src/server/experiencePage.ts`, correct.
- Duplication: none; the routes change removes a duplicate type.
- Owner suggestion: `.claude/standards/architecture.md:80` still cites the old paths (owner-only file).
- Full gates not run by this check (focused files only: 110 tests passed).

### Unconfirmed
- Whether import/order reordered lines beyond the visible wraps.

### Mutation
In a scratch worktree, deleting the new zone made `tests/lint-pages-zone.test.ts` fail 3 of 9 (the three refusals); the six allow cases passed.
