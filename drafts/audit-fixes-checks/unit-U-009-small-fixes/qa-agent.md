PASS

## qa-agent: U-009 "small fixes" (head f6c447d)

I did not run a browser. My sandbox refuses ports and Chromium, so I relied on the PM's two captures plus static reading of the worktree. I did not repeat the dark-mode capture on a checkout page.

### Captures (PM, /ops/mailbox at 390 px, dark colour scheme)
- Before (main + PR 240): the canvas is white. The "Dev mailbox" heading is cream and almost invisible on white. The body text is a faint tan and barely readable. The header, skip link and footer text are plain black on white. The page is broken in dark mode.
- After (this branch): the canvas is dark brown. The heading is light and clear, and the body text is readable. The footer "Ramble" sits at the bottom of the window, so the flex column from base.css is working. Skip link and "Ramble" link keep the browser default link colour, and the header is unstyled. That was also true before and is outside this unit.

### Static route check (all four layouts import `@/styles/base.css`, confirmed at line 4 of each layout)
Routes that render a PageHeading, NotFoundNotice or ErrorNotice, or a native control:
- (ops): ops/mailbox/page.tsx and ops/mailbox/[id]/page.tsx render PageHeading. Covered by (ops)/layout.tsx.
- (ops), (host), (checkout): each has error.tsx (ErrorNotice) and not-found.tsx (NotFoundNotice). Each is covered by its own layout.
- Every `[...unknown]` catch-all and the other checkout routes (checkout, checkout/[holdId], gift, gift/[token], gifts/checkout, manage, orders) render RoutePlaceholder or call notFoundPerRequest(), which resolves to the group's not-found. So they show a NotFoundNotice through the layout.
- host/page.tsx, ops/page.tsx and the checkout placeholders render RoutePlaceholder. They have no native control in the route files.
- No route file under these three groups renders an input, select, textarea or date field. No native control is exposed today. The colour-scheme rule is only a safeguard for later pages.
- global-error.tsx also imports base.css and tokens.css. That is in the diff and sensible, since it replaces the root layout. It is not in the unit description.

### base.css element rules that could shift layout
- `:root` color-scheme (light, dark under prefers-color-scheme): affects colours of native controls and scrollbars only.
- `body`: display flex, column direction, min-height 100dvh, margin 0, canvas background, text colour, body font. The margin reset removes the default 8 px body margin on these pages. The captures show the "after" page flush to the edge, with the skip link and header at x=0 and the PageHeading's own padding keeping content inset. Layout shifts left by 8 px versus before, as intended.
- `body > main { flex: 1 }`: main fills the remaining height and pushes the footer down. The after capture confirms this.
- Because body is a flex column, direct children (skip link, header, main, footer, RenderPerRequest output) stretch to full width. The skip link, an inline anchor, becomes a block-level flex item. It is still visible as plain text in the capture. If a skip link is ever hidden off-screen, that needs checking.

### Blocking
None.

### Non-blocking
- Header, skip link and footer have no styling or dark-mode colours (default blue and purple links). Not part of H-73. Log as an audit item if the PM wants it.
- No checkout page capture. One checkout route would give the same result, since the layout and the css are identical in structure to ops.

### Unconfirmed
- Not run in a browser by me: checkout and host dark-mode rendering. Inferred from the identical layout change.

**Evidence**
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-before-with-pr240.png: white canvas, near-invisible styled heading in dark mode.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-after.png: dark canvas, readable heading and text, footer at the bottom.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a8d7382b1561b11f5/src/styles/base.css: the element rules listed above.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a8d7382b1561b11f5/src/app/(checkout)/layout.tsx, (host)/layout.tsx, (ops)/layout.tsx, global-error.tsx: base.css imports.
- Route files under src/app/(checkout), (host), (ops): route inventory above.
- /Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a8d7382b1561b11f5/src/components/SiteShell.tsx and PageHeading.module.css: structure inside the body flex column.
