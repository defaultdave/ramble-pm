PASS

## architecture-audit: U-030 "the category rail renders the shared ChipLink" (head 32a4bd0)

### Blocking
- None.

Checks against the standard:
- Import direction (B4): `CategoryRail.tsx` imports `ChipLink` from `@/components/Chip` (components to components) and `import type` from `@/lib/pages/home`; `next/link` removed; no `'use client'` added (B8).
- Duplication removed (B17, H-58): the hand-built `<Link className={styles.pill}>` is replaced by `<ChipLink label href selected={false} />`; `.pill`, `.pill:hover` and the `.pill:focus-visible` selector are deleted; no `.pill` reference remains in `src/components/HomeModules/`.
- No new duplication: no helper, hook, component, constant or schema added; `ChipLink` reused as it stands.
- Styles (B16): no literals, no inline `style`; `.pills` and `.pills > li` stay as the rail's layout.
- Exports (B7): none added. Data layer: untouched.

### Non-blocking
- `HomeModules.module.css` has a second `.pills` block after the shared `.rail, .pills` rule. PM note: that is an intentional override of the shared rule (gap and item sizing for chips), not duplication; no audit row.
- No other hand-built chip copy remains in `src/components/HomeModules/`; the gift guide `.action` and Picks "See all" `.link` are action links, not chips.

### Unconfirmed
- None.
