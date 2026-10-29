PASS

## qa-agent: U-030 "the category rail renders the shared ChipLink" (head 32a4bd0)

### Blocking
None.

### Non-blocking
- The before and after PNGs are byte-identical at both widths (same shasum); the old `.pill` already matched `.chip` on border, radius, padding, height, type, colour and surface.
- No seeded label wraps at 320 px: the rail scrolls sideways and each `li` is `flex: none`, so a long label widens its chip. Dropping `white-space: nowrap` changes nothing here.
- Scope: two files as the manifest says; `src/components/Chip/**` untouched.

### Unconfirmed (CSS evidence only, no browser)
- Hover: `.chip:hover` uses `--color-bg-sunken`, as `.pill:hover` did.
- Focus ring: `.chip:focus-visible` has the same transparent outline and two-ring shadow the shared rule had.
- `cursor: pointer` and the body font-family are the shared chip's gains; no visible difference at rest.
- Prefetch off (`ChipLink`), the accepted ruling; not observed at runtime.

### Checks run (scratch worktree at the head, removed)
- `vitest run src/components/HomeModules src/components/Chip`: 34 passed, including a temporary test that rendered the rail fixture and asserted all 8 hrefs (`/new-york/browse?category=<slug>`) and no `aria-current` (deleted afterwards).

Evidence:
- `category-rail-320-light-before.png`: rail on main at 320 px, light and dark; labels on one line; the rail scrolls past the edge.
- `category-rail-320-light-after.png`: the same at the head; byte-identical.
- `category-rail-1280-light-before.png`: all 8 chips wrap onto 3 rows at 1280 px, light and dark, none clipped.
- `category-rail-1280-light-after.png`: the same at the head; byte-identical.
