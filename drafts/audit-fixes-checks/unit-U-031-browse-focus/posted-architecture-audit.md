Posted on head 823bbac (round 5: rounds 2 to 5 plus main merged; the PM reran every gate there: 3726 unit, 195 storybook incl. the focus story, 161 e2e, build, gitleaks).

PASS

## architecture-audit: U-031 "Browse focus" (head 823bbac)

### Blocking
None.

### Non-blocking
- B17 (round-2 blocker) resolved: the diff adds no inline digest. The two catches (src/app/(guest)/new-york/browse/BrowseContent.tsx, src/server/browse.ts getBrowseTitle) both call rethrowOrLog from src/server/monitoring/rethrowOrLog.ts. No new `digest` text appears in non-test source added by the diff. Only Intl.ListFormat use in src is browseTitle (no duplicate); dateChipLabel is reused.
- B13 under the PM ruling: the code matches it exactly. getBrowseTitle (src/server/browse.ts, end of file) catches, calls rethrowOrLog (so Next prerender errors are rethrown, others logged by kind and digest only), and returns browseTitle(filters, empty options), a title string, not data. The page's own reads still surface the error state (BrowseContent catch renders errorView). Nothing else in the diff returns [] or {} from a catch (grep of added lines: none). BrowseContent's catch returns the error view, same as before plus the empty live region. The empty option lists passed to browseTitle are an input to a pure function, not a catch return. If Dave overrules the ruling, getBrowseTitle's catch is the single B13 site.
- Client islands: WhenDetails.tsx is the only new 'use client' file in the diff; the other client files in src predate it. FilterBar.tsx stays a server component.
- Layering: browseHeading and browseTitle are pure and tested in src/lib/browse.ts; server/browse.ts calls lib and reads through getFilterOptions (readOrRefuse); components import no server code. B1 to B17: nothing else new found.

### Unconfirmed
- Gates (3726 unit, 195 storybook, 161 e2e, build, gitleaks) taken from the PM; I did not rerun them.
