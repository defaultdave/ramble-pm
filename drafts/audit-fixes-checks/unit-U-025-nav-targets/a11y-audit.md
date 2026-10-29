PASS

## a11y-audit: U-025 "nav targets" (head 4866b2d)

Files audited: `src/components/Header/Header.module.css`, `src/components/Footer/Footer.module.css`, `src/styles/tokens.css` (token values), `src/components/Footer/Footer.stories.tsx` (link labels), `docs/design/tone-checklist.md` (C3).

### Blocking
- None.

### Non-blocking
- `src/components/Footer/Footer.module.css` `.link`: rows touch (gap removed), so each row's 4px focus ring sits over the next row's padding. The ring is drawn outside the element and the neighbour's background is transparent, so the ring stays visible (2.4.11 met). Hit areas do not overlap. No change needed.
- Project rule: C3 in `docs/design/tone-checklist.md` says "at least 44 px tall". It sets no width minimum, and 2.5.8 needs 24 px wide. The shortest footer labels ("Terms", "About") are about 35 to 40 px wide at body-s, so both the project rule and 2.5.8 are met without a width change. The 2.5.8 spacing exception is not needed.
- 1.4.10 at 320: no sideways scroll is shown in the evidence. The PM folder has only 390, 800, and 1280 shots. From the CSS: footer content width at 320 is 288 px (16 px padding each side). The grid is `minmax(144px, 1fr)` with a 24 px gap, so two columns need 312 px and the footer stays one column. The longest label ("Ramble Picks") is well under 288 px. The nowrap change does not cause overflow at 320. Ask the PM to add a 320 shot to the evidence folder so this is measured, not inferred.
- 1.4.12: `nowrap` stops lines wrapping when spacing is increased. Estimated width of "Ramble Picks" at 14 px with letter spacing 0.12em and word spacing 0.16em is about 115 px, under the 144 px minimum column, and the 24 px gap absorbs any overflow. No overlap. Recheck in a browser if longer labels are added.
- Focus indicators use `outline: 2px solid transparent` plus a `box-shadow` ring. That is a replacement, so it is not the BLOCKING "outline: none" case. In Windows forced-colors mode `box-shadow` is dropped, so verify the transparent outline is repainted with a system colour. Advisory only.
- Evidence gap: the folder has no focused-state screenshot. The focus ring was judged from CSS, not seen on the page. Ask the PM for one focus shot each for the header nav link and a footer link.

### Unconfirmed
- Forced-colors repaint of the transparent outline (see Non-blocking). Not run in a browser.
- The 44 px and no-overflow results rely on the PM's measurements; I did not re-run them.

### Evidence
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-025-nav-targets/header-page-1280-light-after.png`: header at 1280 after the change; logo and three nav links on one line, no wrap or clipping.
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-025-nav-targets/footer-page-390-light-after.png`: footer at 390 after the change; rows about 44 px apart, no wrapped labels, no clipping.

---
<sub>a11y-audit | haiku | read-only</sub>
