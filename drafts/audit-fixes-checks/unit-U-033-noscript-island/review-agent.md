PASS

## review-agent: U-033 "Browse and landing results survive a JS-off first load" (head 35488df)

Independent review of `git diff origin/main...HEAD` (8 files, all under `src/components/BrowseResults/`). Ran in the worktree: `pnpm exec tsc --noEmit` clean, `pnpm lint` clean (max-warnings 0), `pnpm exec knip` clean, vitest on `src/components/BrowseResults`, `src/app/(guest)/new-york` (browse and landing), `ExperienceCard`, `LandingPage`: 7 files, 56 tests, all pass.

### Blocking
None.

### Checks the brief asked for
- Server-only or secret reaching the client bundle: none. The client graph is `BrowseResultsList` -> `ButtonLink`, `ExperienceCardItem`, `Card` (Badge, lucide, next/link), `Photo` (next/image), `TargetButton` (next/form, `Button`, `classNames`). The imports from `@/lib/pages/browse`, `@/lib/experienceCards` are `import type` and erased. No `server-only`, `src/server`, `process.env` or Zod in the list's imports.
- `ExperienceCard` props: all strings plus `PhotoView` (src, width, height, alt, blurDataUrl: strings and ints), and `FormTarget` is `{action, fields: [string,string][]}`. All serializable, no functions, Dates, Maps or undefined-sensitive fields. Nothing a guest cannot see: id, title, meta, public path, photo, price label, or the host's link-out URL, which the guide-only card already links to in the HTML.
- PF-8 preload: `preloadPhoto={index === 0}` kept at `BrowseResultsList.tsx:36`; `Photo` still sets `preload` and `fetchPriority="high"`. Builder evidence (counts.txt) shows image preload links and first-image priority identical before and after, JS on at four widths.
- Hydration: no dates, locale or number formatting in the list; the price and meta strings are built server-side in `src/lib`. Evidence reports no hydration warning and byte-identical screenshots.
- Error state after the `TargetButton` move: `BrowseResults` still renders `TargetButton` (server render) with `fit`. The old `.error .form { inline-size: auto }` (specificity 0,2,0) became `.fit` after `.form` in the same media block of `TargetButton.module.css` (both 0,1,0, later wins), so the 768px retry width is unchanged by cascade order. `classNames(styles.form, fit && styles.fit)` accepts `false`. Existing error tests (alert, Try again form carrying the same address) pass. No leftover `styles.form`, `.grid`, `.item` or `.more` references in `BrowseResults.tsx`.
- Duplicated CSS: the grid, item and more rules moved verbatim (not copied) from `BrowseResults.module.css` to `BrowseResultsList.module.css`; nothing is left in two places. B17: `classNames`, `ButtonLink`, `ExperienceCardItem` reused; no new helper duplicates one in `src/lib`.
- Comments: the new ones state why (Flight row deferral, retry width). No ticket numbers.
- Test quality: `BrowseResults.test.tsx` "hands the cards and the controls ... as plain data" calls the server component, finds the one `BrowseResultsList` element, and asserts its props deep-equal a JSON round trip of the input (so a function, element or non-plain value in props fails it), and that no `ExperienceCardItem` or `TargetButton` element is in the server tree. That is behaviour, not shape. `BrowseResultsList.test.ts` is shape (see Non-blocking 1).

### Non-blocking
1. `BrowseResultsList.test.ts:10-17` asserts `source.startsWith("'use client';")`. It is a string check, not behaviour; it would fail on a leading comment or a quote-style change while the component stays a client component, and the real regression (cards cut with scripting off) is caught by no automated test. It does guard the one property the plain-data test cannot see. Prefer a JS-off e2e if the repo gets one; botid-client.test.ts already reads source in the same way, so it is not new to the repo.
2. The JS-off result rests on builder and QA measurement (evidence/pr/unit-U-033-noscript-island, counts.txt and round2/counts-round2.txt: 12 of 12 cards, Show more 1 of 1, 0 stranded, 5 runs, paging by hand), not on a committed test. I did not re-run the JS-off browser.
3. Cost: the cards and controls now ship in the client bundle, about +2.4 KB gzip over main on browse (+752 B over round 1) against about 10 KB less RSC payload per request. Accepted by the approved island; noted so it is not a surprise.
4. `fit` is a layout flag on `TargetButton`; a variant would read the same. Cosmetic.
5. Audit items (pre-existing, not introduced here): the `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))` track list appears in both `BrowseResultsList.module.css` and `BrowseSkeleton.module.css` (the skeleton is meant to match, but nothing ties them); the hidden-input loop in `TargetButton.tsx` repeats the filter bar's (already logged as SC-14).
6. Merge order: `BrowseResultsList` carries `'use client'` and is not yet on the allowlist; PR 712 must land first. Not counted as B8 here, per the brief.

### Unconfirmed
- The error state's Try again button at 768px and wider was reasoned from cascade order, not seen: neither the evidence screenshots nor a jsdom test exercise `.fit`. Low risk; confirm in the QA pass if an error can be forced.
- That Flight no longer defers the card rows is shown by the builder's measurements (inline flight chars 72352 to 60556, 0 bare hidden segments), not by a test I could run.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-033-noscript-island/counts.txt: round 1 JS-off card counts and JS cost.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-033-noscript-island/round2/counts-round2.txt: Show more and the way back visible JS off, paging by hand, JS-on rects identical.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-033-noscript-island/round2/after2-paging.json: page 2 has no overlap with page 1, Back returns to the first page.

Carried to head bc3f06b83f49a99dcfe5ecc8c7ea10897e36446c by the PM: that head is 35488df with origin/main merged in (Next 16.4.3 and the allowlist line). No file under src/ differs. QA reran on it.
