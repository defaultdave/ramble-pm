PASS

## review-agent: U-030 "Picks rail card sizing on phones" (head b54a97d)

### Blocking
None.

### Non-blocking
- HomeModules.module.css:115 calc derivation checks out against the rail CSS. The rail is column W plus a 24 px gutter of bleed each side (margin -gutter, padding gutter, lines 94-103). The percentage resolves against the rail content box, which is W. The first card starts one gutter in, so card = W + gutter - gap(space-4) - peek(space-2) leaves exactly the peek past the right-hand gutter. At the 24 px gutter it equals W (240 at 320, 310 at 390 in the story frame, matching the PM measurements; 342 at 390 on the page, as Figma draws it). scroll-padding-inline keeps the snapped card on the gutter. Only tokens are used (--size-gutter, --space-4, --space-2); no raw px.
- The 384 px cap (line 108, calc(space-16*6)) is kept. Between 384 and 767 px columns it caps the card, so the peek grows past 8 (about 335 px of empty rail at a 767 viewport). I found no Figma frame for that range; the 390 px frame is the only drawn size. Acceptable and non-blocking; if a tablet-portrait design later wants a different rule, drop the cap there. At 768 the grid override (line 288+) sets max-width none and grid columns, and flex-basis does not apply to grid items, so desktop is unaffected.
- Pills: split removed flex from the shared rule, and .pills > li keeps flex: none and max-width: none (lines 121-124), so pill sizing is unchanged.
- Skeleton: HomeStates .cards 85% to 100% (line 225) with the same 384 cap. The skeleton shows one card at the column width W; the loaded card is also W (cap equal), so no layout shift. Only the first skeleton card shows (.cards > :not(:first-child) hidden); the loaded next-card peek is off-screen content, not a shift.
- Comment at line 111 states a non-obvious why and names no ticket: compliant.
- Scope: only the two CSS files in the manifest changed. No TSX, desktop, gutter token, or card internals. Duplication: no new helper or constant; nothing to reuse.

### Unconfirmed
- I did not rerun the gates or the story; I relied on the PM's measurements file and the gate results in the brief.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-030-picks-rail/measurements.md: card width and peek before and after at 320 and 390 (after: card equals column, 8 px peek).
