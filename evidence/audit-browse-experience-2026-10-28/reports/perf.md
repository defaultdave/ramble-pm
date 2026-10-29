# Performance lens report (`5121048`), partial and unverified

No Lighthouse numbers: the home pass's Lighthouse held the machine for the whole wait, and the lens stopped before its first run. Its script, a Neon HTTP shim, and a Lighthouse install were left in `/tmp/claude-501/audit-be-perf/` (`runlh.sh`, `neon-shim.cjs`).

Environment notes: the sandbox blocks localhost, so build, start, migrate, seed, and Lighthouse need the sandbox off. Browse and experience reads go through `dbRead`, the Neon HTTP driver (`src/server/db/client.ts:38-40`), which cannot talk to plain local Postgres; a local production server shows the browse error state unless a `--require` shim answers `/sql` from local pg. Seed: 14 experiences, fake storage, no images.

| # | Title | Sev | Where | Evidence | Fix |
|---|---|---|---|---|---|
| P1 | Browse key carries the current minute, so stale-while-revalidate never applies; the first guest each minute per filter combination blocks on a full read (page, prices, then covers in series, plus two day queries: 5 to 8 Neon HTTP round trips, three serial). `connection()` makes the content per request. Local timings under 30 ms, so production miss cost unknown. | medium | `src/lib/browse.ts:43-46`, `src/server/browse.ts:45-75`, `BrowseContent.tsx:31-41` | Code reading. Overlaps BE-3. | Coarser key window or SWR; fetch covers with the page. |
| P2 | Browse ships the calendar library (react-aria, @internationalized/date) on first load though the calendar sits in a closed `<details>`: chunk `2r70c22batzpp.js`, 118 KB raw, about 38 KB gzip. Browse JS about 189 KB gzip vs about 150 KB on the experience page. Hydration cost on TBT unmeasured. | medium | `src/components/DatePicker/DatePicker.tsx`, `FilterBar.tsx:4,80` | Build output and network. | Load the picker when the details opens. |
| P3 | About 85 KB of variable woff2 (Fraunces 36.6 KB, Inter 48.3 KB, `wght 100 900`, latin) preloaded in the `Link` header on every guest page; the site uses 400 to 700. Swap fallbacks are size-adjusted, so CLS is covered. | low | `src/app/fonts.ts` | Headers and file sizes. | Drop Fraunces preload where first paint does not use it, or subset the axis. |

Production sampling (6 GETs per URL, read only): TTFB 80 to 300 ms; HTML `public, max-age=0, must-revalidate` with `x-vercel-cache` HIT or STALE. One 2.0 s sample on `?category=cooking`, not reproduced.

Checked and fine (lens agent): static assets immutable for a year; HTML about 14 to 15 KB gzip; inline RSC about 45 to 53 KB raw per page; the experience page has no client component of its own; cover and experience reads cached with tags; filter chips are plain links.
