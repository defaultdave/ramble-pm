FAIL

## architecture-audit: U-031 "browse focus and announcements, BE-14" (head fe8c745)

Rules: `.claude/standards/architecture.md` (project, B1 to B17), with the PM rulings of 2026-10-29 (a) to (c) applied.

### Round-1 blockers
- B8 islands: resolved under ruling (a). `ResultsHeading` is gone; `WhenDetails.tsx` is the one remaining `'use client'` file and counts as part of the date picker and calendar island. It is a leaf (details plus summary, content as children). Dave can overrule.
- B2 focus rule: resolved. The only logic left is `previous.current === date` (WhenDetails.tsx:31), a bare equality; nothing there belongs in src/lib. The module-level `let arrived` is gone with ResultsHeading.
- B2 page.tsx: resolved. page.tsx has no lookup and no branch; `browseTitle` (src/lib/browse.ts) builds the lookups from option arrays and is pure; the fallback moved to src/server/browse.ts.

### Blocking
- B17, `src/server/browse.ts:93-96`: the digest expression `error instanceof Error && 'digest' in error ? String(error.digest) : undefined` is written inline again, although `errorDigest()` in `src/lib/errorDigest.ts` (on main since U-030, used by HomeContent, GuestBanner, and the experience page) does exactly this. Fix: `digest: errorDigest(error)`. The same inline copy in `BrowseContent.tsx:53-56` predates this diff; since this diff touches that file, switch it too (otherwise log it as an audit item).
- B13, `src/server/browse.ts:98`: the catch in `getFilterOptionsOrEmpty` returns `{ categories: [], neighborhoods: [] }` in `server/**`. B13 bans a catch that returns `[]` or `{}` there, and its only sanctioned exception is the `'use cache: remote'` read wrapper, which this is not. It logs the digest and rethrows prerender errors, and the loss (names missing from a title) is benign, but the rule is literal and fixed by the rule, not the round. Either the PM/Dave add an exemption to architecture.md for "title-only reads that degrade after logging", or let the read fail (generateMetadata throwing reaches the error boundary, as BrowseContent's options read does). The PM ruling (c) chose the degrade; it did not address B13, so this needs a Dave decision, not a builder guess.

### Non-blocking
- B4/B6 for `getFilterOptionsOrEmpty`: clear. src/app imports src/server and src/lib (allowed); it takes no caller and returns catalog rows only (guest-visible exemption); it calls the `'use cache'` `getFilterOptions`, which is tagged `tags.catalog` and reads no caller (B14 holds). `unstable_rethrow` is called before the log. The logger gets only a message and a digest, never the error or its params.
- Module state: none left. `titleList` in lib/browse.ts is an immutable module constant (`Intl.ListFormat`), safe.
- B2: `browseHeading` and `browseTitle` are pure lib functions with unit tests. `FilterBar.tsx` `'Pick a date'` / `dateChipLabel` choice is a display string built in a component (unchanged logic, only moved into the `summary` prop); pre-existing, audit item.
- B2, `BrowseContent.tsx` computes `view` once and shares it between the live region and `BrowseResults`; no new decision.
- B17 placement (audit item, forward-looking): `titleList` is a general conjunction formatter and `dateChipLabel` is already general; both sit in browse.ts. Tell the lib-layout PR F builder.
- Round-1 note still open (audit item): body copy in `BrowseResults` empty/outdated branches is still decided in the component while headings moved to `browseHeading`.

### Unconfirmed
- Whether the scope manifest names `WhenDetails`; the diff does not touch scope files.

Files audited: src/components/FilterBar/WhenDetails.tsx, FilterBar.tsx, src/lib/browse.ts, src/lib/errorDigest.ts, src/server/browse.ts, src/app/(guest)/new-york/browse/page.tsx, BrowseContent.tsx, page.module.css, plus tests.

ARCH_VERDICT=REQUEST_CHANGES
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=2
