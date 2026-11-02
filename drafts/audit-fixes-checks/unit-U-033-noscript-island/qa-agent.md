PASS

# QA, U-033 noscript island (PF-7, #487), head 35488dfb11abaf1dccfe272b944631335800aea1

Screenshots: `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-033-noscript-island/qa/` (prefixes c1 to c6 match the check numbers, `cold-` is the cold-start JS-off run).
I wrote my own scripts in the session scratchpad and did not use the builder's.

## Setup

- Production build of the worktree at the head commit (`next build`), `next start` on 3187. For comparison only, a production build of the merged-in main (`35488df^2` = f196dbb, no U-033 commits), `next start` on 3188.
- Docker was not reachable from the sandbox, so I used the Postgres already listening on 5432 (the repo's compose credentials), created my own uniquely named databases `ramble_qa_u033_*` with `pnpm db:migrate`, then `SEED_TARGET=local pnpm db:seed --scale` (400 experiences, 5120 sessions).
- `pnpm db:http` on 4611 with `NEON_HTTP_ENDPOINT=http://127.0.0.1:4611/sql`.
- Chromium via Playwright 1.64.1 with `--single-process --no-zygote`, sandbox on, one browser per width and scheme. Single-process Chromium crashes if a context is closed and a new one opened, so I kept one context per browser and opened a fresh page per load.
- Fixture note, important: the first seed (STORAGE_PROVIDER=fake) writes no photos. On that fixture the base build does NOT show the defect (12 of 12 visible), so it cannot discriminate. The vercel-blob seed path needs real blob uploads and failed, so I seeded a second database with the same command and then inserted one `photos` row per experience by SQL (image host `qa-store.public.blob.vercel-storage.com`, which returns 400 from `/_next/image`, as expected). All the evidence below that matters (check 1 cold runs, 2, 4, 5) is on the photo-bearing database. Check 3 contrast/screenshots were re-run on it; the 5-load scheme runs were on the first database.
- The defect also depends on a cold server: on the photo fixture the base showed 4 of 12 on the first load after `next start` and 12 of 12 on warm repeat loads. So I restarted `next start` before every one of the 5 runs.
- Teardown: stopped the shim and both servers by PID (my own, 84771, 84773, 84775; earlier PIDs 82674, 82986, 83973), confirmed ports 4611, 3187, 3188, 3189, 3190 are clear, dropped both databases (no `ramble_qa%` databases remain). Worktree `git status` is clean. I changed no code, pushed nothing, posted no checks.

## 1. JS off, 5 fresh first loads (server restarted per run)

Cards visible / sent in HTML, Show more visible, cards stranded in a `div[hidden][id^="S:"]` that is still `display:none`:

| Build | Page | Width | Visible / sent | Show more visible | Results left in bare hidden S: div |
|---|---|---|---|---|---|
| head | `/new-york/browse` | 1280 | 12 / 12 on 5 of 5 | 5 of 5 | 0 |
| head | `/new-york/browse` | 320 | 12 / 12 on 5 of 5 | 5 of 5 | 0 |
| head | `/new-york/things-to-do/cooking` | 1280 | 12 / 12 on 5 of 5 | 5 of 5 | 0 |
| head | `/new-york/things-to-do/cooking` | 320 | 12 / 12 on 5 of 5 | 5 of 5 | 0 |
| base (contrast) | `/new-york/browse` | 1280 | 4 / 12 on 5 of 5 | 0 of 5 | 8 cards in 10 hidden S: divs |
| base (contrast) | landing | 1280 | 12 / 12 | 5 of 5 | 0 |

No horizontal scroll at either width. The base reproduces the builder's defect on browse only (the landing page was not affected on base here either, matching the builder's note), and the head fixes it. Also checked 5 warm loads per page at 320, 390 and 1280 on the head: all 12 of 12, Show more visible.
Screenshots: `cold-head-browse-jsoff-light-1280-run1.png`, `cold-head-browse-jsoff-light-320-run1.png`, `cold-base-browse-jsoff-light-1280-run1.png` (the broken base), `cold-head-landing-*`, `c1-*`.

## 2. JS off: Show more, back link, keyboard (browse and landing, 320 and 1280)

- Mouse: Show more goes to `?after=<id>` (page 2, 12 different cards, first card differs from page 1). "Back to the first results" returns to page 1 (same first card, 12 cards).
- Keyboard only: Tab reached Show more (52 to 54 tabs on browse, 28 to 30 on landing, many filter chips come first), the focus ring is visible (2px blue ring with 2px cream gap, `:focus-visible` true; see `c2-*-keyboard-focus-closeup-*.png`), Enter loaded page 2, Tab reached the back link, its focus ring is visible (`c2-*-backlink-focus-*.png`), Enter returned to page 1.
- On the landing page, Show more leaves the landing page and goes to `/new-york/browse?category=cooking&after=...`, and the back link returns to `/new-york/browse?category=cooking` (browse, not the landing page). Same URLs on the base.

## 3. Light and dark, JS off, 390

Computed contrast, both pages, light and dark: card title 17.16 / 15.62, meta 7.79 / 8.83, price 17.16 / 15.62, "Showing 12 experiences" 15.95 / 17.14, Show more label 17.16 / 15.62. The Show more border against the page is 3.80 (light) and 5.59 (dark), which clears the 3:1 non-text bar. No horizontal scroll, results stay in a single column, the skeleton ("Loading experiences") is not visible in either scheme. Screenshots: `c3-*-jsoff-{light,dark}-390-{cards,bottom}.png`, `c1-*-dark-390-*`. Dark mode was checked on page 1 only (not page 2).

## 4. JS on (390 and 1280, browse and landing)

- No hydration or other console errors. The only console errors are the expected 400s from `/_next/image` (plus, once, Chrome's "preloaded but not used" CSS warning on the landing run). A production build only emits minified React errors, and none appeared. Dev-mode hydration warnings were not checked.
- Show more via keyboard works. On browse it replaces the results with page 2 (12 cards) and focus stays on the Show more button (`BUTTON`, visible).
- Exactly one image `preload` link, its `imagesrcset` equals the first card image's `srcset`, and only that first image has `fetchpriority="high"` (the rest are lazy). Verified by attributes, since the image bytes 400.
- Everything above, including the numbers below, is identical on the base build.

## 5. Error state (read endpoint pointed at a dead port, 4999)

Browse and landing, JS on and off, 390 and 1280: the "We couldn't load experiences" alert and the "Try again" button render, are visible, sit in the page column (390: full width 342px inside 24px gutters; 1280: left-aligned at x=40, below the alert), no horizontal scroll, no results left in hidden S: divs. The base was compared with JS off only (4 of the 8 cases); those rects match the head exactly. Screenshots `c5-head-*`, `c5-base-*`.

## 6. Zero results, JS off

`/new-york/browse?date=2030-01-01` and `?neighborhood=tribeca&category=kids&date=2026-11-02`: 0 cards, "Nothing on <date>" panel with the next-day suggestion or "Any day" button, filter chips and selected-state pills intact, no skeleton, no stranded hidden segment, no horizontal scroll at 390 and 1280; same with JS on. Screenshots `c6-zero-*`. I did not find a zero-result filter that does not involve a date; all neighborhood and category combinations I tried returned cards.

## Non-blocking items

1. Pre-existing, same on base: with JS on, Show more on a landing page navigates to the browse route, focus drops to `<body>`, the page scrolls to the top, and the DOM keeps 24 `article` elements (12 hidden, the retained landing list). On browse to browse, focus stays on Show more. The item "focus is not lost" holds on browse and not on landing; not a regression.
2. Pre-existing, same on base: on page 2 the status line says "Showing 12 experiences" (per page, not cumulative), with JS on and off.
3. In dark mode the footer renders cream on a dark page (and dark in light mode). It looks like a deliberate inversion; I did not compare against the design or the base.
4. JS-off "Try again" is a button inside the error boundary. I did not click it, so I do not know whether it does anything with JS off (same markup on base).
5. The back link is far from the top of a 12-card list, and Show more takes 28 to 54 Tab presses from the top because the filter chips come first; a skip link ("Skip to results") exists only in the noscript markup and lands on the results.

## Unverified

- Dark mode with JS on, and dark mode on page 2.
- Cold-start (restart per run) loads in dark scheme and at 390; cold runs were light only at 320 and 1280.
- Real image delivery (all `/_next/image` calls 400 on this fixture), so first-card LCP behaviour and the preload being consumed were not observed, only the attributes.
- Dev-server hydration warnings.
- Behaviour on any Chromium other than the Playwright 1.64.1 headless shell, and any engine other than Chromium.

## Rerun on bc3f06b

Head bc3f06b83f49a99dcfe5ecc8c7ea10897e36446c (merge of origin/main into 35488df; Next 16.4.3, was 16.4.2). Same worktree, no code changed. Fresh production build, fresh database migrated and seeded with `SEED_TARGET=local pnpm db:seed --scale`, one photo row per experience inserted by SQL as before (image host returns 400 from `/_next/image`, expected), `pnpm db:http` on 4611, `next start` restarted before every JS-off load. Verdict for this head: PASS. No base comparison was needed because nothing failed.

Check 1, JS off, 5 cold runs each (cards visible of 12 sent, Show more visible, cards left in hidden S: divs, horizontal scroll):

| Page | Width | Visible / sent | Show more visible | Cards in hidden S: divs | Horizontal scroll |
|---|---|---|---|---|---|
| `/new-york/browse` | 1280 | 12 / 12 on 5 of 5 | 5 of 5 | 0 | none |
| `/new-york/browse` | 320 | 12 / 12 on 5 of 5 | 5 of 5 | 0 | none |
| `/new-york/things-to-do/cooking` | 1280 | 12 / 12 on 5 of 5 | 5 of 5 | 0 | none |
| `/new-york/things-to-do/cooking` | 320 | 12 / 12 on 5 of 5 | 5 of 5 | 0 | none |

No bare hidden S: div held any content on any run. Screenshots: `cold-bc3-{browse,landing}-jsoff-light-{1280,320}-run1.png`.

Check 2, JS off, browse and landing at 1280 and 320, mouse and keyboard: Show more reaches page 2 (12 cards, first card differs from page 1: "Bagel and lox tasting at Ivy Yard" on browse, "Fresh cheese making at Granite Society" on landing), and "Back to the first results" returns to page 1 (12 cards, original first card). Keyboard path works (Tab to Show more in 52 or 54 tabs on browse and 28 or 30 on landing, focus ring visible, Enter, Tab to back link, Enter). Same URLs as before (landing goes through `/new-york/browse?category=cooking`). Screenshots: `c2-*` (overwritten with this run).

Check 4, JS on, 390 and 1280, browse and landing: Show more works (browse shows page 2 with 12 cards and focus stays on the Show more button; landing navigates to the browse route with focus on body, the pre-existing behaviour noted above). Exactly one image preload link, matching the first card image's srcset, and the first image alone has `fetchpriority="high"` (1 of 12). The only console errors are the 22 to 24 expected 400s from `/_next/image` per page; no other errors or warnings, no hydration errors. Screenshots: `c4p-*`.

Not rerun on this head: checks 3 (dark/light contrast), 5 (error state), 6 (zero results), and cold loads in dark scheme. Unverified items from the first run still apply.

Teardown: shim (86859) and `next start` (86999) stopped by PID (unsandboxed `kill`, own PIDs only), ports 4611 and 3187 to 3190 clear, database `ramble_qa_u033_r2_*` dropped (no `ramble_qa%` databases remain), worktree clean.
