PASS

## review-agent: U-009 "Small fixes (H-73, H-35, H-55, H-56)" (head f6c447d)

### Blocking
None.

### Non-blocking
- Scope: the diff touches exactly the three layout files (one `base.css` import each) and `src/lib/cacheProfiles.ts` (comments and one TODO line). No profile values, renames, or other files. In scope.
- H-73 import order: each layout puts `@/styles/base.css` before `@/styles/tokens.css`, the same order as `(guest)/layout.tsx`. base.css only reads tokens through `var()`, so load order is not load-bearing in any case. `global-error.tsx` imports it too.
- H-73 what base.css changes on those pages (the whole file, four rules):
  1. `:root { color-scheme: light }` and, under `prefers-color-scheme: dark`, `dark`. Intended; native controls and scrollbars follow the theme. Cannot break a page.
  2. `body { display:flex; flex-direction:column; min-height:100dvh; margin:0; background:var(--color-bg-canvas); color:var(--color-text-primary); font-family:var(--font-family-body) }`. Removes the UA 8px body margin and sets canvas, text colour and body face. The checkout, host and ops layouts render only `SiteShell` (skip link, header, main, footer) as direct children of body, so the flex column is safe. The one extra child, `RenderPerRequest`, is checked: it is a sibling of the shell inside body. Unthemed inline content now inherits the dark text-on-canvas pair, which is the fix; a page hard-coding a light background would need its own text colour, and none of the three groups do so.
  3. `body > main { flex: 1 }`. `SiteShell` renders `<main id="main">` directly under body, so the footer sits at the bottom on short pages. No effect on content.
  No element selectors beyond `body` and `body > main`; no resets for headings, links, buttons or inputs. Nothing could break a checkout, host or ops page.
- H-35 comment accuracy: checked `node_modules/next/dist/server/lib/cache-handlers/default.js`. It states in-memory caches should not use stale-while-revalidate, and `get` treats an entry as expired when its age passes `entry.revalidate` (`maxAgeSeconds = entry.revalidate` outside the dev server, lines 67-79). So in production the entry is dropped at `revalidate`, which is what the new comment says. It is a non-obvious why and worth keeping. Nit: the dev server uses `entry.expire` instead (same lines), so locally an entry is served stale until `expire`. The comment says nothing about dev; add "in production" if the owner wants it exact. The `expire` line below ("dropped and the next request waits") is now nearly the same wording as `revalidate`; harmless.
- H-55: `browse` callers are `src/server/browse.ts:41,58` and `src/server/home.ts:67` ("On this week"). The new comment "Short-lived schedule reads: browse results for one filter combination, and home's 'On this week'" matches all three.
- H-56: `TODO(U-040): first caller` is the right unit. `docs/plan/units.yaml` has U-040 "Upcoming dates and spaces left" (scope: "runtime-cached spaces left"), U-041 is the booking bar (depends on U-040). `spacesLeft` has no caller in `src` apart from the unrelated `spacesLeft` prop on `TimeSlot`, so the TODO is true, and it names a later unit as the B7 amendment requires. Placement above the JSDoc leaves the doc comment attached to the property.
- `pnpm test` in the worktree: 166 files, 3679 tests, all passed.

### Unconfirmed
- Whether the platform (Vercel) handler serves entries stale; H-35 defers that to a later decision and this diff does not claim it.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-before-with-pr240.png: ops mailbox at 390 wide, dark scheme, before; light heading text on a white canvas (per the PM; the unreadable case).
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-after.png: same page after; viewed it: dark canvas, light heading and body text, readable, no margin gap. (Footer text "Ramble" is partly hidden behind the Next dev badge; a dev overlay, not the page.)
