PASS

Round 2, e4ea57c, src/components/HomeStates/HomeStates.module.css only. In scope; no out-of-scope files.

- 768px and up: every phone property is reset. display grid, margin-inline 0, padding 0, overflow visible, and the per-card max-width none. The shorthand padding: 0 also clears the phone padding-block. The base flex: 0 0 <basis> on children is ignored by grid items, so it needs no reset. The media block sits after the base rule, so the cascade is right. The old width and max-width on .cards are gone, and the per-card max-width now mirrors the loaded rail.
- overflow: hidden: the skeleton cards are decorative and not focusable. The padding-block of --space-1 keeps vertical room, and the inline clip at the bleed edge is the intended peek. Nothing interactive is clipped. Desktop uses overflow: visible.
- Duplication (B17): the basis expression repeats the rail's in HomeModules.module.css. A shared token is not warranted. It would mean a custom property scoped to two sibling modules for one line, and a calc over --size-gutter does not belong in the global token set. Acceptable. Optional nit: the comment could name .rail so a future edit changes both. Not blocking.
- Tokens (B16): all values are var(--space-*) or var(--size-gutter) in calc. No literals.
- Comments: a single comment, which states the why (match the rail's card size, show --space-2 of the next). No ticket number. Compliant.

No blocking items.
