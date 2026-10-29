FAIL

## a11y-audit: U-023 "line heights" (head 66039cb)

### Blocking
- `src/components/BookingPanel/BookingPanel.module.css:102-109` (`.privateLink` margin-block): the calc reads `var(--font-size-label)`, a px token that a text-only zoom does not scale. Firefox "Zoom text only" scales the computed font-size of every text element, so at 200 percent the link's line box is 14 x 2 x 1.4286 = 40 px while the margin still assumes 20 px. The margin comes out at -12 px instead of -2 px, so the 44 px link box reserves 20 px less than its text needs and the text overlaps the content above and below it. The PM measurement doubles every font-size token, which keeps the calc consistent, so it cannot show this. Fix: compute from the element's own line box, `margin-block: calc((1lh - var(--size-touch-target)) / 2);` (the rule already sets `line-height: var(--font-line-height-label)` on the same element). Verify once in Firefox with Zoom Text Only at 200 percent. Static finding from the CSS arithmetic; not rendered in a browser.

### Non-blocking
- Audit item (pre-existing, not in this diff): `src/components/Logo/Logo.module.css:6` sets `line-height: var(--space-8)`, a fixed px line height that is not a token and does not scale with text zoom. The box has no fixed height, so text overflows visibly rather than clipping. Log in `audits/`.
- `src/components/ExperiencePage/ExperiencePage.module.css:193` and `:292` (`.avatar`, fixed 52 px and 64 px squares): initials in a `aria-hidden` span. A 1.5 line-height override on the 40 px initials gives a 60 px line, which is taller than the 52 px box. No `overflow: hidden`, so it overflows visibly and is not clipped. Prefer `min-height` if the box must grow with text.
- `src/components/Header/Header.module.css:154` (`.menu :is(button, a)`, fixed 44 px) wraps a caller-supplied control. The sweep found no text inside it in this diff, so it is a pointer target only. Confirm the caller's markup stays icon-only.
- `src/components/HomeStates/HomeStates.module.css` (the six calc bars at 112, 126, 136, 141, 146, 194) and the `HomeSkeleton.tsx` bands: `aria-hidden="true"` on each band and bar (`HomeSkeleton.tsx:20, 51, 61`), so no screen reader or focus impact. Under Firefox text-only zoom the bars keep their unzoomed heights; cosmetic only.
- Test gap: `tests/tokens.test.ts` checks token format only. No test covers the seven calc sites or the zoom behaviour above.

### Unconfirmed
- `src/components/Dialog/Dialog.module.css:10` (`block-size: var(--visual-viewport-height)`) is a fixed-height container. Its inner scroll and overflow behaviour was not swept, so text clipping under a 1.5 override was not checked.

### Checked and passing
- 1.4.4 and 1.4.12 for the hero select: `.selectControl` composes `Input.module.css`, which uses `min-height: var(--size-field-height)` (line 30). No fixed `height`, so the select grows to 74 px at 200 percent as the PM measured. Passes.
- Every fixed-height text container swept (`height:` on a selector with text, minus `min-height`, `block-size` and `line-height` lines in `src/components` and `src/app` CSS modules). Icon-only, `aria-hidden`, or visually hidden text in: SiteMenu `.summary` (44 px, text is `visuallyHidden`), Stepper `.button` (44 px, `aria-label` and icon), Header `.searchGo` (aria-hidden icon), Checkbox `.input`, Chip, Badge, FilterBar, Button `.icon svg`, Skeleton bars. The Button root has no fixed height.
- Unitless tokens: every `--font-line-height-*` in `src/styles/tokens.css` is now a ratio, and the `line-height` consumers of tokens (about 120 declarations across `src/components` and `src/app`) inherit a user line-height override in proportion to font size. Passes for the token system.
- Seven calc replacements: six in `HomeStates.module.css` and one in `BookingPanel.module.css`. The `HomeStates` bars are `aria-hidden` (confirmed above). The privateLink calc is the blocking finding; its value at 100 percent is correct (14 x 1.4286 = 20, margin -12).

Files relied on: `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/measurements.md` (PM Playwright numbers, token-doubling method).

---
<sub>a11y-audit | haiku | read-only</sub>
