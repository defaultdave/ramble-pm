Posted on head c4d2f79 (4866b2d with main merged; the PM reran every gate on the merge commit). Code unchanged since this verdict.

PASS

## qa-agent: U-025 "Nav and footer touch targets" (head 4866b2d)

I did not run a browser. I relied on the PM's dev-server run (measured target heights at 8 widths) and on the PM's pictures, which I opened and looked at one by one. I did not check keyboard focus on a nav link or a footer link; that is not verified by me.

### Blocking
None.

### Non-blocking
- The two header pairs are byte-identical files (same checksum, before and after, at 390 and 1280). They show the header did not grow, which is what we want, but they cannot show the logo (32 to 44 px) or nav (36 to 44 px) change, because that change is invisible inside an unchanged-height header. The 44 px figures rest on the PM's measurements, not on a picture. Consider a picture with the target boxes outlined.
- Your brief mentions "Host with Ramble" at 800 px. No picture shows a footer link of that name; the Explore column holds Gift guide, Ramble Picks, Things to do. If "Host with Ramble" exists on real pages it was not in the 404 footer I was shown, so I could not confirm it on one line at 800.
- The "after" pictures at 800 and 1280 show the Next.js dev badge ("1 Issue", red) over the copyright line, and in "before" it is a small round "N". The overlay is the dev tool, not the product, and it hides part of "(c) 2026 Ramble". The "1 Issue" is unexplained; someone should open it in dev to see whether the branch causes a console or hydration error.

### Unconfirmed
- Keyboard focus ring on a nav link and a footer link (not run).
- Sideways scroll at each width and the 44 px values themselves (PM measurements only).

### What each picture shows
- header-page-390 before and after: logo "ramble" left, Gift icon with "Gifts", hamburger right; 60 px tall; identical in both.
- header-page-1280 before and after: logo, "Things to do", "Ramble Picks", "Gift guide", and the "Anywhere . Day" search pill; 78 px tall; identical in both. Nothing clipped.
- footer-page-390 before: 364 px tall. Two columns (Explore, Help), then Ramble (Terms, Privacy); link rows 28 px apart. After: 452 px tall; rows 44 px apart; same layout, nothing clipped or wrapped.
- footer-page-800 before: 312 px tall. "Ramble Picks" and "Things to do" each wrap onto two lines in a narrow Explore column (H-64, H-83). After: 324 px tall; Explore column wider; "Gift guide", "Ramble Picks", "Things to do" each on one line, 44 px apart. Nothing clipped; the three link columns still fit the 800 px width.
- footer-page-1280 before: 272 px tall; links 28 px apart, single lines. After: 324 px tall; links 44 px apart, single lines; tagline and columns unchanged in position horizontally.

### Evidence
Folder: /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-025-nav-targets/
- header-page-390-light-before.png: header at 390, before; same as after.
- header-page-390-light-after.png: header at 390, after; same height (60 px).
- header-page-1280-light-before.png: header at 1280, before.
- header-page-1280-light-after.png: header at 1280, after; same height (78 px), nothing clipped.
- footer-page-390-light-before.png: footer at 390, 28 px link rows, 364 px tall.
- footer-page-390-light-after.png: footer at 390, 44 px rows, 452 px tall.
- footer-page-800-light-before.png: footer at 800, two Explore links wrap.
- footer-page-800-light-after.png: footer at 800, all links on one line, 44 px rows.
- footer-page-1280-light-before.png: footer at 1280, 28 px rows.
- footer-page-1280-light-after.png: footer at 1280, 44 px rows.
- Also: /Users/davidfleming/Workspace/ramble-pm/drafts/wave3-review-rules.md (verdict format and evidence rule), and the PM's measurements as quoted in the brief.

---

a11y-audit (carried here; a11y is not a separate required check):

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
