PASS

## spec-compliance: U-030 "hero search keeps the neighborhood label whole at every width" (head 957737c)

### Acceptance criteria (round 2)

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | "Anywhere in New York" shows in full at 320 to 1440 px | PASS (unchanged from round 1; PM measurements now show whole label at 720, 1180, 1200, 1247, 390) | `HomeHero.module.css` threshold 736px; PM evidence below |
| 2 | Container-query threshold derived and commented; 52px field height and label alignment unchanged | PASS (unchanged) | `HomeHero.module.css:134-137` |
| 3 | Home skeleton container query moves to the same threshold | PASS (unchanged) | `HomeStates.module.css:335` `@container (min-width: 736px)` |
| 4 | Tokens only, mobile first, min-width queries only | PASS (unchanged) | `HomeHero.module.css:138` |
| 5 | Only the two CSS modules change; no TSX | PASS | `git diff origin/main...HEAD --name-only` at 957737c lists exactly `src/components/HomeModules/HomeHero.module.css` and `src/components/HomeStates/HomeStates.module.css` |
| 6 | Before and after at the bug widths, plus a phone width and dark | PASS | Pairs present and names match content (see Evidence). Bug is visible in every before shot at 720, 1200 (light and dark), 1247; the after shots show the label whole with the stacked layout. Phone pair at 390 present. |

### Blocking
- None.

### Non-blocking
- `hero-search-1180-light-before.png` and `hero-search-1180-dark-before.png` are byte-identical to their `-after` files (same md5, `2dfc5829...` and `68e526a0...`). The before shot at 1180 shows the stacked, whole label, so it does not show the clip. That matches the PM's measurement (before 544, after 544), but it contradicts the AC 1 band claim that 1152 to 1247 clipped before the fix. Either the audit's 1180 bug width is wrong, or the 1180 "before" was captured from a build that already had the fix. Re-capture the 1180 before from `origin/main` (or drop 1180 from the bug list) before the PR body cites it as a before state.
- The 390 phone pair is also byte-identical (`1a26fc54...`). That is expected (the fix does not change phone layout, 218 before and after), so it shows no regression, not a before state.
- The 1152 to 1247 band now stacks instead of fitting clipped. Confirm this is the intended look; the 1200 and 1247 after shots show a stacked, whole label.

### Unconfirmed
- Pixel-level label widths were not re-measured here; the file-level check relies on the PM's measurements and on the images as shown.

### Evidence
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-720-light-before.png`: light, 720px, select row with "Anywhere in ..." cut off.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-720-light-after.png`: light, 720px, stacked layout, "Anywhere in New York" whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1200-light-before.png`: light, 1200px, label cut to "Anywhere in N...".
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1200-light-after.png`: light, 1200px, stacked, label whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1200-dark-before.png`: dark, 1200px, label cut.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1200-dark-after.png`: dark, 1200px, stacked, label whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1247-light-before.png`: light, 1247px, label cut.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1247-light-after.png`: light, 1247px, stacked, label whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1180-light-before.png`: light, 1180px, stacked, label whole (identical to after; see Non-blocking).
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1180-light-after.png`: light, 1180px, stacked, label whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1180-dark-before.png`: dark, 1180px, stacked, label whole (identical to after; see Non-blocking).
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-1180-dark-after.png`: dark, 1180px, stacked, label whole.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-390-light-before.png`: light, 390px phone, stacked, label whole (identical to after).
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-hero-select/hero-search-390-light-after.png`: light, 390px phone, stacked, label whole.
