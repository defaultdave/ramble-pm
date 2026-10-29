FAIL

## spec-compliance: U-025 "nav targets" (head 4866b2d)

### Blocking
- evidence/pr/unit-U-025-nav-targets/ (AC 6): the folder holds only PNG pictures and no measured heights. Expected: a measurement record (text or table in the folder, or the PR body) giving before and after heights for the header logo link (32 before, 44 after), desktop nav links (36 before, 44 after) and footer links (24 before, 44 after) at 390, 800 and 1280. Add it, then re-run this check.
- evidence/pr/unit-U-025-nav-targets/header-page-390-light-before.png and header-page-390-light-after.png (AC 6): the two files are byte-identical (same MD5 8355731c1e05359adc1b32b040b591a5). The same holds for the 1280 pair (MD5 55312630d25483df7aea63c6ac33ea97). Layout is unchanged, so identical pixels are expected, but the pictures cannot show the 44 px target. The measured heights above are the only proof for the header.

### Non-blocking
- Footer.module.css:62 removes the 4 px row gap. Rows now touch at 44 px pitch with no overlap, which doubles the footer's link rows as the owner's recommendation accepted. No change requested.

### Unconfirmed
- AC 1 and 2 heights (44 px) are established by CSS arithmetic, not by rendering: Header.module.css:27-29 and 61-63; Footer.module.css:68-71. The 32 px wordmark height is taken from the PM's before measurement; Logo's own CSS was not read. A `li` line box could add height above the 44 px anchor; not measured.
- AC 3 (no sideways scroll from 320): static reading only. `white-space: nowrap` (Footer.module.css:71) plus the grid minimum of 144 px (Footer.module.css:39-42) and the flex row at 768 px and up (Footer.module.css:116-119) show no obvious overflow. No 320 picture or scroll measurement exists in the evidence folder. A headless Chromium run was attempted and blocked by the sandbox (mach port permission), so no runtime measurement was taken.
- AC 3 (one line at 768 to 850): nowrap guarantees one line per link by construction; not rendered.

### Acceptance criteria
| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Logo link and desktop nav links 44 px via padding plus negative margin, layout unchanged | PASS | Header.module.css:27-29 (logo: padding-block 6 px, margin-block -6 px); :61-63 (nav: padding 12 px each side on a 20 px line = 44; margin -4 px each side keeps 36 px) |
| 2 | Every footer link 44 px via row padding; no overlap | PASS | Footer.module.css:68-71 (padding 12 px, 44 px with 20 px line); Footer.tsx:38-42 (all groups use styles.link); no row gap, Footer.module.css:59-65 |
| 3 | Explore links one line 768 to 850; no sideways scroll from 320 | PASS (static) | Footer.module.css:71 (nowrap on all links); see Unconfirmed for runtime |
| 4 | Tokens only; mobile first; min-width only | PASS | Header.module.css:28-29, 62-63 use --size-touch-target, --space-8, --space-1, --space-3; only media queries are pre-existing min-width at Header.module.css:194 and Footer.module.css:96 |
| 5 | Only Header.module.css and Footer.module.css change; no TSX | PASS | git diff origin/main...HEAD --stat: 2 files, both .module.css |
| 6 | Before and after pictures plus measured heights (header 390/1280, footer 390/800/1280) | FAIL | Pictures present for all seven viewports (see Evidence). No measured heights in the folder (see Blocking) |

### Evidence
- evidence/pr/unit-U-025-nav-targets/footer-page-390-light-before.png: exists; MD5 6d13c84d0c4b5d3e56f96becd24c1914 (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/footer-page-390-light-after.png: exists; MD5 9848a3c1aa939fed0512430f45b14ef1, differs from before (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/footer-page-800-light-before.png: exists; MD5 b8bd5ca8786b21daeacdc3b7f21af241 (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/footer-page-800-light-after.png: exists; MD5 207dfdc70ed887cbc77ae62933a9862a, differs from before (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/footer-page-1280-light-before.png: exists; MD5 d17feae4ec41859e012582cce5a549e7 (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/footer-page-1280-light-after.png: exists; MD5 0c76b7f3a4267764174af8af0a309341, differs from before (not visually inspected)
- evidence/pr/unit-U-025-nav-targets/header-page-390-light-before.png and -after.png: byte-identical (MD5 8355731c1e05359adc1b32b040b591a5); shows no target size
- evidence/pr/unit-U-025-nav-targets/header-page-1280-light-before.png and -after.png: byte-identical (MD5 55312630d25483df7aea63c6ac33ea97); shows no target size

---
<sub>spec-compliance | haiku | read-only</sub>

SPEC_COMPLIANCE_VERDICT=REQUEST_CHANGES
SPEC_COMPLIANCE_FAILED_ACS=1
