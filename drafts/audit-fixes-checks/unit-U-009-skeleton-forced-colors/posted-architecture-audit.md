Posted on head ab09c4c; the PM ran every gate on it.

PASS

# Architecture Audit: unit/U-009-skeleton-forced-colors (head ab09c4c)

Scope: CSS-only diff, 4 files (`Skeleton`, `HomeStates`, `DatePicker`, `Dialog`).

## Layer and abstraction checks

- **Shared component depends on page CSS?** No. `Skeleton.module.css` changes reference only its own classes and `var(--color-bg-disabled)`. Nothing imports from `HomeStates` or from a page. The dependency direction is still page (`HomeStates`) and `BrowseSkeleton` depending on the shared `Skeleton`, with no reverse edge.
- **Duplicated forced-colors rule:** `HomeStates.module.css:257-263` repeats the same outline pattern as `Skeleton.module.css:139-148` for its own `.art` and `.bar`. This is a parallel copy, not a leak. The page does not reach into `Skeleton` classes. Optional cleanup: one shared utility class, but not required for this PR.
- **Token layer:** all fills go through `--color-bg-disabled`. No palette values or hex literals were added in component CSS. `tokens.css` and the generator are untouched.

## Token semantics

- The fill is a skeleton placeholder, but it uses the disabled-state token. The name does not match the use. The value is correct today (light equals sunken, dark is ink-700 for contrast), but the coupling is accidental. This is the naming drift the AC 4 constraint forces. It is not a layer leak, so it is not blocking. Follow-up: add a semantic skeleton token in a separate unit that owns `tokens.css`.
- `GrayText` is a system color keyword, the correct layer for forced colors, and not a token. Acceptable.

## Blocking

None.

## Non-blocking

- Skeleton fill borrows `--color-bg-disabled` (see Token semantics). Follow-up unit for a semantic token.
- Forced-colors outline rule is duplicated between `Skeleton` and `HomeStates`. Optional consolidation later.
