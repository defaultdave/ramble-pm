Posted on head 488d885. This verdict is on round 1 (66039cb). Round 2 changed one rule after it: the BookingPanel private link's margin now reads 1lh. The a11y re-check covered that rule and passed. The PM reran every gate on this head.

PASS

## spec-compliance: U-023 "Line heights scale with the text" (head 66039cb)

### Blocking
- None.

### Non-blocking
- scripts/tokens/build.ts:110-121 and tokens.css:81-90: the 200 percent check (AC 5) is a PM Playwright run that doubles the `--font-size-*` tokens in Storybook, not a real browser text-only zoom. Acceptable as evidence; a real zoom run would be stronger.
- evidence/pr/unit-U-023-line-heights/measurements.md: the "after" numbers were taken on f6edbb5, and the branch head is 66039cb (a merge of main). The branch diff against origin/main touches only the five files listed under AC 6, so the measured result should still hold, but the PM should re-measure if the merge brought in CSS changes.
- evidence/pr/unit-U-023-line-heights/measurements.md: at 200 percent the select is 74 px and the date field 76 px, so they grow together but do not match exactly. The AC says "grow together", which this meets.

### Unconfirmed
- None.

### Criteria
1. PASS. Ratio is computed from Figma's px pair in the same mode: scripts/tokens/build.ts:110-121 (lineHeightRatio), 123-133 (pairedFontSize, which looks up `font/size/<style>` in the same mode), 167-180 (per-mode emit). Tests: tests/tokens.test.ts:94-115 (ratio table and refusal of non-positive input), 84 (desktop heading-l = 1.1875). Vitest run on tests/tokens.test.ts: 22 passed.
2. PASS. src/styles/tokens.css:81-90 (base) and 188-192 (desktop) are unitless. The header says "Generated ... Do not edit", and tests/tokens.test.ts ("matches what the build produces from the committed source") passes, so the file equals generator output. The "emits every line height as a unitless ratio" test also passes (tests/tokens.test.ts:116-125).
3. PASS. `git diff origin/main -- tokens/` is empty. tokens/figma-variables.json is not in the diff.
4. PASS. Only two CSS modules use a line-height token as a length, and both are fixed: src/components/BookingPanel/BookingPanel.module.css:102-110 (margin-block calc now multiplies font size by line-height) and src/components/HomeStates/HomeStates.module.css:111-113, 125-127, 135-147, 193-195 (grid-auto-rows and height calcs). Every other use is a `line-height:` declaration, which accepts a unitless value. Scan of all 112 `line-height: var(--font-line-height-*)` rules in src/**/*.css: each has a `font-size` token of the same name in the same rule, so each unitless ratio resolves to the same px at 100 percent (for example body-m 1.5 x 16 = 24, caption 1.3333 x 12 = 15.9996).
5. PASS. The measurements table (evidence/pr/unit-U-023-line-heights/measurements.md) shows nothing moves at 100 percent (select 52, date 52 before and after, both widths) and at 200 percent both fields grow (select 52 to 74, date 62 to 76). Pictures viewed: hero-390-text200-light-before.png shows the select text clipped at the top and the button label overflowing; hero-390-text200-light-after.png shows the select, date field and button all taller and the text whole. The other five pictures were not viewed by me.
6. PASS. The diff changes exactly five files: scripts/tokens/build.ts, tests/tokens.test.ts, src/styles/tokens.css, src/components/BookingPanel/BookingPanel.module.css, src/components/HomeStates/HomeStates.module.css. No other file changes.

Evidence:
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/measurements.md: before and after heights for select and date field at 390 and 1280 px, 100 and 200 percent; select line box 24 px to 48 px at 200 percent.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text200-light-before.png: at 200 percent the select text is cut off and the button label overflows.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/hero-390-text200-light-after.png: at 200 percent the select, date field and button all grow with the text.
