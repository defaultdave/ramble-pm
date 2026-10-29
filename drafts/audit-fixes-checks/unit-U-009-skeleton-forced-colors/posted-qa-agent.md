Posted on head ab09c4c; the PM ran every gate on it.

PASS

## QA: the PM's Playwright measurement

Chromium at 390 px, on Storybook Home/HomeStates LoadingMobile and Composites/BrowseSkeleton Loading, before (main b01cdf8) and after. In light mode the bar fill is unchanged: rgb(243, 234, 219). In dark mode it goes from rgb(18, 14, 11) to rgb(61, 51, 43) on a canvas of rgb(24, 19, 15), which is 1.04:1 before and 1.50:1 after. Under emulated forced colors the shapes vanish before; after, they have a 1 px inset GrayText outline. Layout is unchanged. Shots and the table are in ramble-pm evidence/pr/unit-U-009-skeleton-forced-colors/.

---
## a11y-audit

PASS

Scope: branch unit/U-009-skeleton-forced-colors, head ab09c4c (worktree HEAD ab09c4cd7abac7fa88a5c552ca8a747ff544e477). Files: Skeleton.module.css, HomeStates.module.css, DatePicker.module.css and Dialog.module.css (comments only). Audit rows H-71, H-72, H-81.

## Blocking

None.

## Non-blocking

1. GrayText vs CanvasText (H-81). GrayText is a valid system color for a decorative skeleton outline, and the skeleton is aria-hidden, so no 1.4.11 ratio applies. CanvasText is the safer choice because GrayText can be dim in some Windows contrast themes. Optional change. The PM's forced shot (browse-forced-390-after.png) renders the outlines with a reddish tint, which looks like Chromium's emulated palette. Confirm in a real contrast theme that the outline stays neutral and visible.
2. Pre-existing forced-colors state loss, not introduced here. Chip pressed and unpressed look the same under forced colors: both lose their background, and both border colors are forced to CanvasText. The selected DatePicker day loses its fill (background), so it looks like an unselected day. aria-pressed and aria-selected still reach assistive tech. Static reading of the cascade only, not measured. Suggest a new audit item with a forced-colors rule, for example a 2px border or outline on [aria-pressed='true'] and [data-selected].
3. Card edge (H-71 sweep). Card.module.css:5 uses --color-border-default. Light 1.43:1 and dark 1.50:1. The card is a link region whose title text identifies it, so this is advisory, not a 1.4.11 failure.
4. Day-cell hover (H-71 sweep). The hover fill (--color-bg-sunken) is 1.14:1 against the surface in dark mode. Transient pointer state, and the day's text identifies the control, so advisory.

## Checked and passing

- aria-hidden: Skeleton.tsx sets aria-hidden="true" after the spread, so the prop cannot be overridden. HomeSkeleton puts every bar inside an aria-hidden band; its role="status" wrapper holds only visually hidden text. BrowseSkeleton's skeletons are all Skeleton instances, and its role="status" wrapper holds only visually hidden text.
- Outline survives forced colors: outline is kept under forced colors, and outline-offset -1px keeps the shape inside its box, so parent overflow does not clip it. Every filled skeleton shape is covered: Skeleton `.image .tag .title .meta .price .line` (grouped selector at line 14) and HomeStates `.bar` and `.art`.
- Fill change: contrast recomputed from tokens. Dark bar vs canvas 1.04 to 1.50, vs surface 1.14 to 1.37. Light unchanged. Matches the PM's measurements.
- H-72, Card: `.titleLink:focus-visible { outline: none }` is paired with `.card:has(.titleLink:focus-visible)` (outline 2px solid transparent plus box-shadow). The outline survives forced colors, so the ring is kept there.
- H-72, DatePicker: react-aria-components 1.22.1 (node_modules) renders the className and data-focus-visible on the same inner div inside the td. `.cell[data-focus-visible]` therefore draws the ring. The diff only adds a comment; the rule is unchanged.
- H-72, Dialog: react-aria's useDialog (react-aria 3.53.1) focuses the dialog element itself (tabIndex -1) on mount. It is not a tab stop. `.close:focus-visible` provides the ring. The "not a defect" call holds. The diff adds only a comment.
- No other outline:none or outline:0 sites in src (grep: Card:25, DatePicker:94, Dialog:39). Button, Chip and Dialog close use the transparent-outline pattern.
- H-71 sweep on control boundaries: Chip (border-strong, 5.09:1 dark, hover keeps the border), Input, Stepper, Checkbox, Button, TimeSlot, HomeModules and SimilarLink use --color-border-strong. Remaining border-default uses are containers, dividers, or disabled states (exempt). Selected chip border is ink-50 and selected day fill is 7.28:1 in dark mode.
- No focus indicator or real control lost visibility as a result of this diff. The diff removes no rules; it only changes skeleton fill and adds forced-colors outlines to skeleton shapes.
