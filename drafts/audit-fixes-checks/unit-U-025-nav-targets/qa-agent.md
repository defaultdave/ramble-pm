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
