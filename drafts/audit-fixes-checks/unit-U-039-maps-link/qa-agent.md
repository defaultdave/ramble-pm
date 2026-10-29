PASS

## qa-agent: U-039 "Maps link ends at the first real sentence end" (head 2a85b1e)

### Blocking
None.

### Non-blocking
- Fixture "Little Bakers Co. storefront, Park Slope." changed from the old query "Little Bakers Co, New York" (main cut at "Co. ") to "Little Bakers Co. storefront, Park Slope, New York". That is the intended fix (BE-8), not a regression.
- Only 11 of the 12 meetingPoint entries in the seed fixtures are strings; one is null and renders no link, as before.

### Unconfirmed
- No browser or live Google Maps check (sandbox, no ports). The link text and query were checked as strings, not by clicking.

### What I checked
1. Render path: src/components/ExperiencePage/ExperiencePage.tsx:158-168 renders `<ButtonLink href={view.meeting.mapsHref} external ...>Open in Maps</ButtonLink>` only when mapsHref is non-null; `view.meeting.mapsHref` is set from `mapsHref(meetingText)` at src/lib/experiencePage.ts:449. ExperiencePage.tsx is unchanged from main. ButtonLink with `external` sets `rel="noopener noreferrer"` (src/components/Button/ButtonLink.tsx:59), same as before.
2. `pnpm exec vitest run src/lib/experiencePage.test.ts src/components/ExperiencePage`: 2 files, 125 tests, all passed.
3. All 11 string meeting points in src/lib/seed/fixtures/experiences.ts, query on head vs main (bun script importing the function from both trees): 10 identical, 1 better (Little Bakers Co. above), 0 worse.
   - Pier 26 boathouse, Tribeca. The exact door... -> "Pier 26 boathouse, Tribeca, New York" (both)
   - Salt & Semolina, Carroll Gardens. Ring the bell... -> "Salt & Semolina, Carroll Gardens, New York" (both)
   - Wheelhouse Kids Studio, ground floor, Williamsburg. / Orchard Street Wine Room, Lower East Side. / Steam & Fold, Eighth Avenue, Sunset Park. / Kiln & Clay, second floor, Williamsburg. / The corner of Greenwich and Harrison Streets, Tribeca. / Low Tide Studio, Sunset Park. / Bean Counter Coffee Lab, Williamsburg. / Rise Bakery, Park Slope.: same on both, each ends with ", New York".
4. Decoded queries (decodeURIComponent of the `query=` value) for Pier 26, Salt & Semolina (the `&` encoded as %26, so it does not split the URL), and Little Bakers Co. decode to the intended text plus ", New York", with no newline and no double space. Example href: https://www.google.com/maps/search/?api=1&query=Pier%2026%20boathouse%2C%20Tribeca%2C%20New%20York

### Evidence
- src/components/ExperiencePage/ExperiencePage.tsx:158-168: the Open in Maps link uses mapsHref output directly, external, unchanged.
- src/components/Button/ButtonLink.tsx:59: rel="noopener noreferrer" on external links.
- vitest run output (125 passed): proves the unit and component tests pass on this head.
- Bun one-off comparison script at $TMPDIR/q.ts (scratch, outside repo): head vs main query for each of the 11 fixture meeting points, output above.
- No screenshots; the change is a link's address.

QA_VERDICT=PASS
