PASS

## qa-agent: U-031 "routes.ts: one home for every guest address" (head 2c83761)

### Blocking
None.

### Non-blocking
- This check covered behaviour only; no repository-wide duplication sweep.

### Unconfirmed
- Storybook and e2e not run here (they need ports); the CI jobs run them. This branch changes no rendered output.
- The two runbook edits and the component diffs were read only as far as the hrefs and `pnpm test` exercise them.

### How it was checked
Scratch worktrees at HEAD and at origin/main (17b8fc4), removed afterwards; the builder's worktree was not touched.

1. **Href snapshot, base vs HEAD.** A throwaway vitest file dumped every href to JSON at both commits; the two files are byte-identical (diff exit 0). Covered: `toHomeCard` and `toBrowseCard` for a live and a `guide_only` experience (`/experiences/thing-1-<uuid>`, `/guide/thing-2-<uuid>`); the home category rail (`/new-york/browse?category=cooking`, `?category=wine-and-cocktails`); picks `seeAll` (`/picks/pick-1`) and the picks anchor on the first picks module (`picks`); the gift guide action (`/gifts`); siteNav main and footer links (`/new-york/browse`, `/#picks`, `/gifts`, `/help`, `/contact`, `/accessibility`, `/legal/terms`, `/legal/privacy`); the experience breadcrumb (`/new-york/neighborhoods/tribeca`, `/new-york/things-to-do/outdoors`), `giftHref` (`/gifts/checkout/<id>`), `privateSessionHref` (`/contact`); nine `parseExperienceAddress` inputs (uppercase uuid lowercased, one-character slug, no hyphen before the id, empty slug, bad slug, 400-character input, hyphenated slug, valid lowercase, missing separator); `browsePath`, `giftGuidePath`.
2. **`pnpm test` at HEAD:** 162 files, 3617 tests pass.
3. **Mutation check of routes.ts** (scratch worktree, each reverted): `experiencePath` to `/experience/...` (5 failures in 3 files); `legalPath` fixed to `/legal/terms` (2); `guidePath` to `/guides/...` (4 in 3 files); `homePicksHref` to `/picks` (1); `parseExperienceAddress` hyphen check removed (1); `experienceCardPath` status test broken (3 in 3 files). Every mutation caught.
4. **tsc and eslint** on `src/lib`, `HomeModules`, `GuestShell`: no type or lint findings (output was machine certificate noise only).

### Evidence
None expected: no visible change is intended. The proof is the identical base and HEAD href snapshot above.
