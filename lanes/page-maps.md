# Lane: page-maps

- **2026-11-15, closed.** Owner asked to save the experience page map (built 2026-11-14 as a claude.ai artifact, its source only in a scratch folder) and build the rest. Nine render-tree maps now in `maps/`, read from ramble `origin/main` at `2db68ea`, with `maps/index.html` linking them (GitHub Pages: https://defaultdave.github.io/ramble-pm/maps/). Built by nine Sonnet `general-purpose` agents in parallel, read-only on ramble; the experience map was rechecked by diff from `7a26999` (one drift: U-129's cached-photo underlay in `ExperienceGallery`). Not opened in a browser.
- **Findings worth a look (not yet audit items; the lead decides):**
  - No `src/app/layout.tsx`: each route group's layout owns `<html>`.
  - Per-request catch-alls (`/host/*`, `/ops/*`, the checkout group) answer 200, not 404, and their not-found view needs script. Documented trade-off in `src/app/renderPerRequest.tsx` (CSP nonce); the guest catch-all uses plain `notFound()`.
  - Host role gate is repeated on each of the 7 host pages; only 3 share `loadForHostArea`.
  - Cache clearing gaps: an ops host edit clears no tag (host name lags until `catalog` expires; a host's own edit does clear); a host capacity edit clears `session:<id>` only; host staff changes clear nothing; ops cancels use `revalidateTag(..., 'max')` (one stale response possible) where edits use `updateTag`.
  - Session: `HeaderAccount` reads `readSession` only, so it neither checks the 8-hour ceiling nor extends idle; the checkout-group `GuestShell` has no account slot, so orders and manage always show "Sign in".
  - Order token: moved to an HttpOnly cookie by a 303, yet the raw token still reaches the client poller as a prop; each manage view spends a rate-limit try.
  - `CheckoutPage` is one client island, so `Header` and `OrderSummary` ship as client code.
  - Home streams its whole body behind `HomeSkeleton` (`connection()` first), cached editorial included; category and neighborhood renames wait out a 1 hour revalidate.
  - Landing pages' "Show more" posts to browse, not the landing page.
  - Audit rows: reading the audit log, the ops home and a blank new-host form write rows; the test console's demo-data reset writes none.
  - Gifting routes other than `/gifts` are `RoutePlaceholder` stubs (parked).
