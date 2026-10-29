FAIL

## spec-compliance: U-030 "hero search keeps the neighborhood label whole at every width" (head 99ac78f)

### Acceptance criteria

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | "Anywhere in New York" shows in full at 320 to 1440 px (688 to 767 and 1152 to 1247 bands removed) | PASS (by arithmetic; not re-measured in a browser) | `src/components/HomeModules/HomeHero.module.css:136-141` threshold 736px. Field needs 172 + 16 + 40 + 2 = 230px (`Input.module.css:31` padding `space-4`, `HomeHero.module.css:86` padding-right `space-10`). Row needs 2 x 230 + 218 button + 2 x 12 gaps + 34 box = 736px. Copy column is the container (`HomeHero.module.css:22`), so below 736px the row stacks and the label gets full width; from 736px it fits. Browser measurement is the PM's, in the evidence folder. |
| 2 | Container-query threshold derived from CSS widths, stated in a comment; 52px field height and label alignment unchanged | PASS | Derivation comment `HomeHero.module.css:134-137`. The diff touches only the `@container` line and its comment, so `Input.module.css:30` (min-height 52px) and the label rules are unchanged. |
| 3 | Home skeleton's matching container query moves to the same threshold | PASS | `HomeStates.module.css:335` `@container (min-width: 736px)`, was 640px. |
| 4 | Tokens only, mobile first, min-width queries only | PASS | Only new literal is the `736px` the container query needs (`HomeHero.module.css:138`), same pattern as the 640px it replaces. Query is `min-width`. No new raw values in declarations. |
| 5 | Only `HomeHero.module.css` and the HomeStates CSS module change; no TSX | PASS | `git diff origin/main...HEAD --name-only` lists exactly `src/components/HomeModules/HomeHero.module.css` and `src/components/HomeStates/HomeStates.module.css`. |
| 6 | Before and after at the bug widths, plus a phone width and dark | FAIL | Folder `evidence/pr/unit-U-030-hero-select/` has before/after pairs at 720 (`hero-search-720-light-before.png`, `-after.png`), 1200 (`hero-search-1200-light-before.png`, `-after.png`), 1247 (`hero-search-1247-light-before.png`, `-after.png`). Missing: before at 1180 (light and dark), and the audit's bug width 1180 has only an after shot (`hero-search-1180-dark-after.png`). No before shot in dark at any width. Phone after exists (`hero-search-390-light-after.png`). The folder has no 1180 light after either. |

### Blocking Issues
- **AC #6 (before and after evidence):** `evidence/pr/unit-U-030-hero-select/` lacks the before shot at 1180 (light and dark) and a dark before shot at any bug width. Add `hero-search-1180-light-before.png`, `hero-search-1180-dark-before.png` (taken on the pre-fix head, e.g. `origin/main`), and `hero-search-1180-light-after.png` so the 1180 pair matches the audit's evidence width. Or record in the PR why 1180 is not shown.

### Non-blocking
- `HomeStates.module.css` `.submitBar` is fixed at `space-16 * 3 + space-8` = 224px (`HomeStates.module.css:~347`). The live button width is intrinsic and the hero comment says 218px, which I could not confirm from CSS. Measure in the browser; if the skeleton and live button differ, the skeleton shifts 6px at 736 to 740px.
- The 218px button, 172px label width, and 34px box are measured figures from the PM, not computed in CSS. The arithmetic checks out against the tokens (`tokens.css:52-60`), but a future font or button change will break the comment silently.
- The 1152 to 1247px band now stacks (it used to fit clipped). This is a layout change, not a clip; confirm it is the intended look in the 1180 after shot.

### Unconfirmed
- Pixel-level clipping at each width was not re-measured here; AC 1 rests on the arithmetic and the PM's measurements.

### Evidence
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/` (9 files listed above; file contents not opened).
