PASS

## architecture-audit: U-023 "layout tokens" (head 63d0b3f)

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project; B1 to B17 applied, B16 tokens and B17 reuse checked)

Files audited: `tokens/figma-variables.json`, `docs/design/figma-library.json`, `src/styles/tokens.css` (generated), and the 13 changed `*.module.css` files in the diff against `origin/main`.

### Blocking
- None.

Checked and clean:
- B16 (tokens): no `style={}` added. In the added CSS lines, the only literals are the two token definitions in the generated `tokens.css` and `inline-size: 17rem` in `src/components/FilterBar/FilterBar.stories.module.css:10` (see Non-blocking). Every swapped gutter and the field height now read `var(--size-gutter)` or `var(--size-field-height)`.
- Generator: `pnpm tokens:build` (scripts/tokens/build.ts) was re-run in the worktree and produced a byte-identical `src/styles/tokens.css`. The file header says "Do not edit", and the two new lines (`--size-field-height: 52px`, `--size-gutter: 24px`) match `size/field-height` 52 and `size/gutter` 24 in `tokens/figma-variables.json`.
- Naming (ADR 0005 contract): `size/field-height` becomes `--size-field-height` and `size/gutter` becomes `--size-gutter`, which is the `/` to `-` rule with the `--` prefix. Both sit in the `Space` collection beside `size/touch-target` and `size/content-max`, the existing size tokens, so scope matches.
- B2, B1, B3, B4, B5 to B15: no TS, data-layer, route, or import changes in this diff, so they are N/A.

### Non-blocking
- `src/components/FilterBar/FilterBar.stories.module.css:10`: `inline-size: 17rem` is a new literal derived from the gutter (320 px phone minus 2 x 24 px). The comment explains it, but the number now goes stale if `--size-gutter` changes. Suggested form: `inline-size: calc(20rem - 2 * var(--size-gutter));`. This is a story fixture, so it is advisory only.
- Audit item (B17, duplication that predates this diff, logged for the lib-refactor lane): the one-column content grid is written three times, in `src/components/PageHeading.module.css` `.page` (lines 1 to 12), `src/components/ExperiencePage/ExperienceError.module.css` `.page`, and `src/components/ExperiencePage/ExperiencePage.module.css` `.page`. Before this diff all three already shared the same max-width and `margin-inline: auto` shape (checked against `origin/main`), so this diff did not create the duplication. It did rewrite the three copies in place to the same grid, which is the moment a shared class or `composes` would have been cheap, so it is the right thing to fold in. Route: `ExperienceError` is one of the two components that Components-4 (`PageError`, H-61) replaces, so that refactor absorbs its copy. `PageHeading` is a primitive and is not in Components-4's list. Components-4 or a follow-up should decide whether `PageHeading` and `PageError` share one class. `ExperiencePage` differs (padding-inline only, no gap), so it is not a copy to fold yet.
- Audit item (B17, home): `src/components/HomeStates/HomeStates.module.css` `.page` and `src/components/HomeModules/HomeModules.module.css` `.section` use the gutter padding but not the grid shape, so they are not copies of the three above. They belong to Components-6 (H-77, H-78) and the skeleton-composes work, not to this diff. This diff did not add a home grid and did not change home's own shape beyond the token swap.

### Unconfirmed
- The Figma `WEB` code syntax for the two new variables (`VariableID:199:3`, `VariableID:199:4` in `docs/design/figma-library.json`) was not checked against the live Figma file, so the contract's "Dev Mode shows the same name" half is not verified here. The JSON and the generated names agree with each other.
- `AGENTS.md` is untracked in the worktree (mtime Oct 29 14:35). `scripts/tokens/build.ts` writes only `src/styles/tokens.css`, so this audit did not create it. Its origin was not traced and it is not part of the diff.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=APPROVE
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
