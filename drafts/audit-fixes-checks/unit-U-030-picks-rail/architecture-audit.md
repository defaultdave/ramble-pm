PASS

## architecture-audit: U-030 "picks rail" (head b54a97d)

Rules: /Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md (project). Files audited: src/components/HomeModules/HomeModules.module.css, src/components/HomeStates/HomeStates.module.css.

### Blocking
None.
- B16: the new flex-basis is `calc(100% + var(--size-gutter) - var(--space-4) - var(--space-2))`. Every operand is a token or the percentage `100%`; no colour, spacing, radius, or font-size literal. `width: 100%` in HomeStates is likewise not a token literal. No inline style.
- B17: no new function, component, or constant. The split of `.rail > li` from `.pills > li` removes a shared flex-basis, not adds a helper.

### Non-blocking
- Audit item (pre-existing, B17): HomeStates `.cards` mirrors the loaded rail by a separate rule (grid, `gap: var(--space-4)`, `max-width: calc(var(--space-16) * 6)`) instead of sharing the rail's. This predates the diff; log under H-78 (Components-6). The diff does not add a new copy.
- Coupling: the calc uses the same tokens the rail rule uses (`--size-gutter` for the bleed at HomeModules.module.css:98-99, `--space-4` for the rail `gap` at :95), plus `--space-2` for the peek. Both are in the same file, so a change to one token propagates. It is not silently tied, though: the rail `gap: var(--space-4)` and the calc's `- var(--space-4)` are two separate mentions of the gap, and changing only the rail gap would desynchronise the peek without any error. Suggest a local custom property on `.rail` (for example `--rail-gap`) used by both `gap` and the calc.
- Skeleton parity: loaded card basis is column + gutter - gap - peek, capped at max-width 6*space-16, while the skeleton `.cards` is 100% of its container (capped the same). Whether the skeleton's container is the column or the bled rail width is not visible in this diff; if it is the column, the skeleton card is narrower than the loaded card by gutter - gap - peek, so the layout shifts on load. Worth a visual check (qa Evidence), not provable from CSS alone.

### Unconfirmed
- Skeleton vs loaded card width at phone widths (see above); needs a render.
