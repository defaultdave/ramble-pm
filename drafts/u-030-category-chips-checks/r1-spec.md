PASS

## spec-compliance: U-030 "the category rail renders the shared ChipLink" (head 32a4bd0)

### Blocking
- None.

### Non-blocking
- The visible gains (body font-family, `cursor: pointer`, the chip's focus ring and hover rule) are the expected H-58 changes per the PM ruling.
- The second `.pills` block in `HomeModules.module.css` predates this diff (PM note: an intentional override of the shared `.rail, .pills` rule).

### Unconfirmed
- The 320 px wrap check needs the PM's capture (PM: the 320 px before and after captures are byte-identical; nothing wraps).

### Per-criterion
| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | ChipLink in each `<li>` | PASS | `CategoryRail.tsx:23` |
| 2 | `next/link` and `styles.pill` gone | PASS | `CategoryRail.tsx:1-2` |
| 3 | `.pill` and `.pill:hover` deleted | PASS | no `.pill` selector left |
| 4 | Shared focus list keeps `.link`, `.action` | PASS | `HomeModules.module.css:83-84` |
| 5 | `.pills`, `.pills > li` stay | PASS | `:94-107`, `:118-124` |
| 6 | Tests and stories unchanged unless they named the old markup | PASS | none did |
| 7 | OUT OF SCOPE untouched | PASS | diff is two files; Chip unchanged |
| 8 | Prefetch ruling | PASS | `ChipLink.tsx:28` |
| 9 | No nowrap workaround | PASS | none in diff |
| 10 | Seed names at 320 px | PASS (PM capture) | longest "Ceramics and crafts", "Wine and cocktails" |
| 11 | Story ids | PASS | `home-homemodules--category-rail-mobile` |
