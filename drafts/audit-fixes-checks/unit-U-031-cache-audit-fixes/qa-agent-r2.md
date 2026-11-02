PASS

## qa-agent round 2: U-031 "cache audit fixes" (head dae03b8)

Round 1 (head 9d4b9f7) passed every functional check and failed only on the evidence rule, because Chromium would not launch. This round supplies the screenshots. The tag, budget and mutation work from round 1 was not repeated. The delta since 9d4b9f7 is docs and one comment, and the screenshots show no visible change, as intended.

### Blocking
- None.

### Non-blocking
- Both builds show "Photos are on their way" and grey placeholder boxes where photos would be, because the seed runs with `STORAGE_PROVIDER=fake`, which cannot give `next/image` an address. This is the seed's documented behavior and is the same on base and head. It is not a defect in the unit.
- In the full-page screenshots of the experience page at 390 px, the sticky "From $60 / Choose date" bar sits over the "Upcoming dates" heading. It is a full-page capture artifact of a fixed bar and is byte-identical on base, so it is not caused by this unit.
- Browser console: no page errors or console errors on any of the 12 loads. Server log: no error lines in the head run.

### Unconfirmed
- Photo rendering with real stored images (needs `vercel-blob`, not available locally).
- Widths other than 390 and 1280, and 320 px. Not asked for in this round.

### What I did
- Own scratch worktree at dae03b8, a uniquely named seeded local database (`qa_u031_r2_1793580734`, migrated, curated seed plus `--scale`: 400 experiences, 5,120 sessions), `pnpm db:http` on port 4691, production build (exit 0) and `pnpm start` on port 3731.
- Headless Chromium (Playwright 1.64.1, chromium_headless_shell-1248) launched with `--single-process --no-zygote` from a script, sandbox on. With that flag a browser dies when its context closes, so the script launches one browser per width and scheme.
- Loaded home, `/new-york/browse` and an experience page ("Architecture walk at Atlas Cellar", the first link on browse) at 390 and 1280 px, in light and dark (`prefers-color-scheme`). Each load waited for network idle plus 500 ms, then a full-page screenshot.
- For each of the 12 loads I recorded the HTTP status, `scrollWidth` against `clientWidth` (sideways scroll), the h1, the count of experience links, the body background, console and page errors, and any visible "undefined", "NaN", "[object", "Something went wrong", "Application error", "Internal Server Error", "404" or "not found".
- First two attempts were my own setup mistakes, not the unit: the db shim was started on a port that did not match `NEON_HTTP_ENDPOINT`, then on 4583, which a leftover round 1 shim still holds. Both gave the pages' error state (visible as "could not be read" server errors and no experience links). The third run used a free port and the results below come from it only.
- Base comparison (quick, done): a second scratch worktree at 053bd1a, same database, built and served on port 3732, same script.

### Results (head dae03b8)
All 12 loads returned 200, no sideways scroll (`scrollWidth` equals `clientWidth` in every case: 390 of 390, 1280 of 1280), no error text, no console errors.

| Page | h1 | Experience links |
| --- | --- | --- |
| home | "Something good to do this weekend" | 7 |
| browse | "Browse experiences" (shows 12 of the catalog, "Show more" present) | 11 |
| experience | "Architecture walk at Atlas Cellar" | 6 |

Light body background is rgb(251, 246, 238) and dark is rgb(24, 19, 15) on every page, so dark mode applies on all three. I read the home 390 light, browse 1280 dark and experience 390 dark images by eye: header, hero, category chips, cards, prices, dates list, host, cancellation text and footer all render and nothing overlaps except the sticky-bar artifact above.

Base against head: for all 12 combinations, status, h1, link count, sideways-scroll result and error text match, and the base and after PNG files are byte-for-byte identical (`cmp`). No visible change, as the unit intends.

### Evidence
Folder: `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-031-cache-audit-fixes/`. File names read `<build>-<page>-<width>-<scheme>.png`. After files are head dae03b8, full page.
- `after-home-390-light.png`: home, 390 px, light
- `after-home-390-dark.png`: home, 390 px, dark
- `after-home-1280-light.png`: home, 1280 px, light
- `after-home-1280-dark.png`: home, 1280 px, dark
- `after-browse-390-light.png`: `/new-york/browse`, 390 px, light
- `after-browse-390-dark.png`: `/new-york/browse`, 390 px, dark
- `after-browse-1280-light.png`: `/new-york/browse`, 1280 px, light
- `after-browse-1280-dark.png`: `/new-york/browse`, 1280 px, dark
- `after-experience-390-light.png`: experience page (Architecture walk at Atlas Cellar), 390 px, light
- `after-experience-390-dark.png`: experience page, 390 px, dark
- `after-experience-1280-light.png`: experience page, 1280 px, light
- `after-experience-1280-dark.png`: experience page, 1280 px, dark
- `base-<page>-<width>-<scheme>.png`: the same 12 views at base 053bd1a (home, browse, experience; 390 and 1280; light and dark). Each is byte-identical to its `after-` twin, which shows the unit changes nothing visible.

### Cleanup
- Both scratch worktrees removed (`git worktree list` shows none), database `qa_u031_r2_1793580734` dropped. All my servers (db shim on 4691 and 4692, app on 3731 and 3732) were started and stopped by PID inside single commands; nothing of mine is listening.
- Left running, not mine, from round 1 (a later command cannot kill them): next-server pids 7104 (port 3583), 8217 (3584), 9069 (3585) and the db shim pid 6395 (127.0.0.1:4583). Stop with `kill 7104 8217 9069 6395`.

QA_VERDICT=PASS
