PASS

## spec-compliance: U-030 "page modules move to src/lib/pages and a lint zone keeps shared modules off them" (head 4ebf014)

### Blocking
- None.

### Non-blocking
- `.claude/standards/architecture.md:80` (B17) still cites the old paths; out of scope (owner's file).
- `docs/plan/**` still cites the old paths; frozen, untouched.
- `tests/db/seed.db.test.ts` imports `@/lib/pages/browse` at line 8 (brief said :4); import reflow only.
- The zone `target` is two globs; probed semantics match the ruling.

### Unconfirmed
- None.

### Per-criterion
| Criterion | Status | Evidence |
|---|---|---|
| Scope: IN SCOPE only | PASS | 49 entries in `git diff -M --name-status`, all in the manifest; one added file, `tests/lint-pages-zone.test.ts`. |
| Scope: OUT OF SCOPE untouched | PASS | No change to `.claude/**`, `docs/plan/**`, `tests/lint-boundaries.test.ts`, `src/lib/errorDigest.ts`, `src/server/actions/browse.test.ts`, or any `unit/U-005` file; fixture `id`/`idWithLetters` stay; no seed constant moved. |
| Moves: renames | PASS | 8 renames (R094 to R099), none delete-plus-add. |
| Moves: imports only | PASS | Stripping imports and diffing the 8 pairs gives 0 non-import lines; every `../` import resolves. |
| Call sites | PASS | Re-grep returns only page-module siblings inside `pages/` and `src/server` siblings; all 36 listed importers use `@/lib/pages/...` or `./pages/...`. |
| `experienceCards.test.ts`, `photoViews.test.ts`, `routes.test.ts` | PASS | `./pages/home` (:11), `./pages/experience.fixtures` (:2, :2). |
| `seed/coverage.ts` | PASS | `@/lib/pages/browse` (:1), `@/lib/pages/home` (:3); import-only. |
| Runbooks | PASS | `home.md:7,50`, `browse.md:33,37,55` cite `src/lib/pages/...`. |
| Zone placement | PASS | `eslint.config.boundaries.mjs:91-95`, inside the `layers` zones array; `--print-config` shows the original zones plus the new one. |
| Zone semantics (ESLint API probe) | PASS | Refused: `src/lib/bad.ts`, `src/lib/richText/x.ts`, `src/lib/x.tsx`, `src/lib/a/pages/x.ts`. Allowed: seed (two depths), `src/lib/richText/x.test.ts`, `src/lib/pages/x.ts`, `src/server/x.ts`. |
| Zone test | PASS | Cases match the brief; 75 passed with `lint-boundaries`. |
| H-85 | PASS | `routes.ts:11,16,22` use `ExperienceAddress` (exported `:35`); no `ExperienceRef` left. |
| H-86 | PASS | Only the `paths` describe removed; its four assertions are table rows (:99, :100-104, :105, :113); no row added or reordered. |
| Clear of `managePath` | PASS | Edits at `routes.ts:7-22`, `routes.test.ts:2` and the deleted block. |
| PM rulings (zone, H-96, tests exempt) | PASS | As above. |
| Risks: renames, ordering | PASS | As above. |
| Risks: gates | not run | Outside this check. |
