PASS

## review-agent: U-023 "Unitless line heights from Figma px pairs" (head 66039cb)

### Blocking
None.

### Non-blocking
- Scope: all five changed files (build.ts, tokens.css, tests/tokens.test.ts, BookingPanel.module.css, HomeStates.module.css) are inside IN SCOPE. No Figma JSON, font-size, or other-token change.
- Sweep of the whole repo (CSS modules, stories CSS, TS/TSX, MDX, .storybook, e2e, scripts) for `--font-line-height-*` used as a length. Only 7 sites: BookingPanel.module.css:103 (margin-block calc), HomeStates.module.css:111 (headingLines grid-auto-rows), :125 (bodyLines), :136 (railHeadingBar), :141 (picksHeadingBar), :146 (summaryBar), :194 (labelBar). All 7 are fixed to `font-size * ratio` using the matching size token. None remains wrong. No inline styles, TS, or stories use the token as a length.
- All other uses are 112 `line-height: var(--font-line-height-X)` declarations. A script checked that each sits in the same rule as `font-size: var(--font-size-X)` of the same name, so the ratio multiplies the size it was derived from. No mismatches (a mismatched pair would silently change the px line box). HomeHero.module.css:52 `line-height: inherit` is fine. Logo.module.css:6 uses `--space-8`, not a line-height token. Email templates (DevCheck.tsx, EmailLayout.tsx) use literal px lineHeight, not the tokens, so they are out of scope and unaffected.
- Reproducibility: ran `pnpm tokens:build` in a scratch detached worktree at HEAD; `git status` showed no change to tokens.css (only the symlinked node_modules untracked). Scratch worktree removed.
- Rounding: error is at most 5e-5 of the ratio, so at most 0.05 px per 1000 px of font size. Worst cases: heading-s mobile 24/17 = 1.41176 -> 1.4118 (0.035 px per 1000 px font), desktop 26/18 (0.044), body-l 28/18 (0.044). The calc sites multiply by font sizes of 12 to 64 px, so error is under 0.003 px. Not visible, even at doubled sizes.
- Desktop overrides: the `@media (min-width: 768px)` block holds exactly display-l, display-m, heading-l, heading-m, heading-s, the five styles whose ratio differs between modes. body-l, body-m, body-s, label, caption have equal ratios and appear only in the base block. This matches the Figma px pairs (body-l is 28/18 in both modes). Test at tests/tokens.test.ts asserts the desktop override and that all values are unitless.
- Tests: ratio table (including 4-decimal rounding), refusal of zero, negative, and NaN, and a check over the committed CSS that every line-height token is unitless. Missing pair and non-numeric font size throw in `pairedFontSize` (build.ts), fail closed. Gap (minor): the missing-pair throw has no test.
- Docs-currency: no user-facing surface change; none needed.
- Duplication: no new helper duplicates an existing one; `lineHeightRatio` is the single place for the rule and is exported for the test.
- Comments: one doc comment on `lineHeightRatio` states the why; no ticket numbers.

### Unconfirmed
- I did not rerun the 3763 unit, 195 storybook, 161 e2e gates, or reproduce the PM measurements (52 px at 100 percent; 74 and 76 px with doubled sizes). I relied on the brief for those. The CSS is consistent with them, since the 100 percent heights are unchanged by construction.

Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/measurements.md: PM before/after heights of hero select and date field at 100 percent and doubled font sizes (relied on, not re-measured).
