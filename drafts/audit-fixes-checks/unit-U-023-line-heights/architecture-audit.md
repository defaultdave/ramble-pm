PASS

## architecture-audit: U-023 "line heights as unitless ratios" (head 66039ca)

Rules: /Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md (project)

### Blocking
None.

### Non-blocking
- B16: clean. The only literals added are in the generated tokens.css; the seven CSS changes (BookingPanel.module.css:103-108, HomeStates.module.css:111, 125, 136, 141, 146, 194) use only `var(--font-size-X) * var(--font-line-height-X)`, which is token arithmetic. No literal colour, spacing, radius, or size.
- ADR 0005 token contract: names are unchanged (`--font-line-height-*` still equals `font/line-height/*` with `/` to `-`), so the naming rule and the WEB code syntax still resolve. The VALUE meaning changed: the Figma variables (tokens/figma-variables.json:502-592) stay in px (44, 68, ...) while the CSS now holds a ratio (1.1, 1.0625). Dev Mode shows `44` next to `var(--font-line-height-display-l)` that is 1.1. The ADR does not say line heights are lengths, so the contract is not broken, but the owner should note it: add one line to the ADR 0005 token contract ("line-height tokens are emitted as unitless ratios of the paired font size; Figma stays in px") so a later Figma/Code Connect reader is not surprised. Not a code defect; ADR is frozen/owner-edited, so the PM logs it.
- Generator reproducible: reran `pnpm tokens:build` in the worktree; `git status --short` was empty afterwards (tokens.css byte-identical to the committed file). Ratios are rounded to 4 decimals (e.g. 1.4286, 1.5556), so line boxes can differ from the Figma px by a fraction of a pixel on a 40px+ line (max about 0.003 x size, under 0.2px); acceptable, and the test pins the rounding.
- B17, line-box product repeated: the product `font-size * line-height` now appears in 2 modules (BookingPanel once, HomeStates six times, five distinct styles). That is below the point where a shared token pays for itself, but HomeStates alone repeats the pattern six times. Audit item (log in ramble-pm audits/): add derived tokens `--line-box-<style>` (calc of the pair) emitted by build.ts or a small shared rule, and use them in these seven places, before a third module needs a line box as a length. Not blocking now.
- B17, `lineHeightRatio` export: it has a real caller inside build.ts (line 170) and is also imported by tests/tokens.test.ts:6, so it is not exported only for its test. `pnpm knip` on the head printed no findings (only unrelated certificate noise on stderr; exit code not captured because of a pipe, so treat as "no findings seen"). No existing helper in src/lib, src/server, or src/components does this job; no duplicate.
- Mode handling checked: the desktop block emits a line-height only when its ratio differs from the base (build.ts:176), same idea as the existing size override; desktop heading-s etc. all appear in tokens.css 185-192.

### Unconfirmed
- Visual effect of ratio line heights on elements that set their own font-size inside a parent (a ratio is recomputed per element, a px length was inherited as a fixed length). Every `line-height: var(--font-line-height-X)` use in src sits beside its own `font-size: var(--font-size-X)` per the grep I read, but I did not check each pair; a mismatched pair (a line-height-body-m paired with a different size) would change its line box. Worth a Storybook or e2e screenshot pass by the QA check.
