# U-129 image underlay: measurement

Branch `unit/U-129-image-underlay` in ramble. Spike on the experience page's lead photo: draw the same photo again under it with the card's `sizes`, so that after a card click the lead first shows the card's already-cached image and the full-width one fades in over it.

## Recommendation: ship, lead only, after one check on real photographs

- **Warm arrival from a card, desktop (the case the idea is for).** The first sharp frame of the lead came at 27 ms instead of 510 ms (client-side click, 1.6 Mbps throttle), with the card's 1080w file served from the page's memory cache with no request. The 1920w main photo is unchanged (509 ms vs 510 ms) and fades in over it. Unthrottled the gap is 27 ms vs 29 ms on loopback, so it only shows where the large image takes real time.
- **Phone: no change, no cost.** Card and lead both resolve to the 1440w file, so the underlay is the same URL as the main image: one request, same bytes, same times. The extra layer is pure DOM.
- **Cold desktop landing costs one extra request and about 28% more image bytes** (66,918 vs 52,214 here, the 1080w file at 14.7 KB beside the 1920w at 23 KB). It did not slow the main image (1142 ms vs 1141 ms, throttled) and it made the first sharp frame and the LCP earlier (937 ms vs 1141 ms; LCP 968 ms vs 1184 ms). The seeded photos are tiny gradients, so this is the one thing to re-check with real photographs on a preview deployment: a photographic 1080w is a few hundred KB, and on a thin link it competes with the 1920w.
- No change to the approach is needed. Do not extend to the side photos or the guide cover on this evidence: they are lazy and below the lead, so there is no cold-vs-warm gain to buy.

## Answers to the audit's open questions

**1. Cold landing.** On a phone the underlay and the main image are the same URL and the browser makes one request: no cost at all (bytes 55,788 both, first sharp 1007 vs 1018 ms, inside noise). On desktop the underlay is a second request (1080w beside 1920w). Throttled, the small one arrives first, so the first sharp frame comes at 937 ms against 1141 ms for the main image alone, and the main image itself is not delayed (1142 vs 1141 ms). The cost is bytes: +14.7 KB (+28%) on this seed. Unmeasured: real photographs, where the same ratio is larger in absolute terms.

**2. LCP accounting.** Observed, not inferred:
- On desktop the underlay is recorded as the LCP element. Throttled cold landing: candidates were the blur placeholder (804 ms), then the 1080w image (984 ms, 792x440); the 1920w image arriving later at the same size was not a new candidate. So LCP followed the underlay: 968 ms vs 1184 ms without it (warm hard load: 208 vs 672 ms).
- Chrome's low-entropy rule did not exclude the stretched 1080w image: 14,704 bytes over 792x440 CSS px is about 0.34 bits per pixel, well above the 0.05 floor. The blur placeholder (a data URI SVG) was counted as a candidate on the phone (frame 390x292) and is the phone's LCP in every cold run, with or without the underlay, so phone LCP does not move (748 vs 788 ms cold, throttled; the 40 ms difference is outside the 5-run range and unexplained, but a different run of the same URL).
- Client-side navigation (a card click) produces no LCP entry at all in Chrome, so LCP says nothing about the click path; the first-sharp-frame time is the measure there.

**3. Crop.** The two layers are identical frames: same box (792x440 on desktop, 390x292.5 on phone), `object-fit: cover`, `object-position: 50% 50%`, and sources of the same ratio (3:2, 384x256 and 792x528 intrinsic CSS px), so the swap from underlay to main image does not shift anything. What does shift is card to lead: the card shows the whole 3:2 frame (382x255) and the 1.8:1 desktop lead crops about 17% off the top and bottom. That is the page's frame, not the underlay, and it is the same with or without it.

## One behaviour to know about

The browser does not always pick the card's candidate for the underlay. In unthrottled warm hard loads on desktop the underlay's `currentSrc` was the 1920w file from its first frame (same as the main image, one request, no 1080w fetched, and no earlier sharp frame since the 1920w was already there). Under throttle, and on client-side clicks, it was the 1080w file. Chromium appears to prefer a candidate already loaded for the lead's preload; the cause was not isolated. The outcome is benign (no wasted request) but it means "same URL as the card" holds when the lead's preload is still in flight.

## Method

- **Baseline:** production https://ramble-sand.vercel.app, hand-rolled pasta page (`/experiences/hand-rolled-pasta-in-carroll-gardens-92a3453c-2e3d-4a22-876f-5533364aea59`), from this machine's own connection.
- **Changed build:** a local `next build` + `next start` of the branch, and a control build of the same harness with `Photo.tsx`, `Photo.module.css` and `ExperienceGallery.tsx` (and the tests and stories that use them) put back to origin/main, so the production-vs-local gap (network, edge cache, optimiser host) is separate from the underlay's effect. The prod-vs-local-main rows are close on the throttled runs; compare local-main with local-underlay for the effect.
- **Photos without secrets:** photos cannot display under the local fake storage, and Next's optimiser resolves a remote host's DNS itself (not possible from the agent sandbox), so `harness/` serves production's seeded source JPEGs (public Blob objects, fetched with plain `curl`, `harness/fetch-photos.py`) from `public/measure/` in the local checkout. `next/image` then optimises them at the app's own widths, quality and webp format. `harness/install.sh` adds, to the local checkout only and never committed, a route group `src/app/(measure)/` with `/measure` (the real `ExperienceCardItem`, vertical layout) and `/measure/exp/<n>` (the real `ExperiencePage` with its gallery fed the same photos; no database, auth or guest shell). `harness/build-variant.sh` builds each variant. Nothing in `src/` of the branch was changed for this, no `next.config` change, no token, no `.env`.
- **Driver:** `harness/measure.mjs`, Playwright's headless Chromium (the project's pinned version), a fresh browser context per run so the cache is empty each time. Phone 390x844 at DPR 3 (mobile emulation, touch), desktop 1440x900 at DPR 2. Five runs per cell after one discarded warm-up pass (so the server's own image cache is warm), median with (min-max).
- **Flows:** `cold` is a direct hit on the experience page. `warm-hard` loads the home page, waits for the card image, then does a full navigation to the experience page (this is the only warm flow that yields an LCP). `warm-click` is the same but clicks the card, the real client-side navigation.
- **Measures:** "first sharp" is the first animation frame in which any layer of the lead is a loaded image, from navigation start (hard) or from the click (click); "main complete" is the same for the top layer; LCP is the last `largest-contentful-paint` entry. Cache hit and bytes come from the Chrome DevTools protocol (`fromDiskCache`, `requestServedFromCache`, `encodedDataLength`); "memory, no request" means the page's memory cache served a URL it already held from the card, with no request event at all. "Image bytes on the wire" is every image request of the measured navigation (the other gallery photos load lazily on desktop).
- **Throttling:** the second table applies 1.6 Mbps down and 150 ms added latency (CDP `Network.emulateNetworkConditions`) to the navigation under test only, since on loopback and a fast link everything is over in 30 ms and shows nothing.
- **Caveats:** the seeded photos are tiny (an 84 KB source gradient, 15-23 KB as served), so absolute times and bytes are small and the real-photo cost is extrapolated, not measured. Headless Chromium, one machine, n=5. The browser and local server for the production and local runs ran outside the agent sandbox (the sandbox blocks headless Chromium and the optimiser's DNS lookup); only localhost and ramble-sand.vercel.app were contacted.
- **Screenshots:** `desktop-before-midload.png`, `desktop-after-midload.png`, `desktop-before-loaded.png`, `desktop-after-loaded.png` and the four `phone-*` equivalents: the lead 120 ms after the card click (mid-load) and 1.5 s after the main image completed (loaded), throttled, local control build ("before") vs the branch ("after"). Desktop mid-load: before shows only the blur; after shows the sharp 1080w. Phone shows no difference, as the numbers say. The other raw shots (cold, warm-hard, production; 20 MB) were left out of this repo.

## Results

Each cell: median (min-max) of 5 runs. Times in ms.

### No throttling (this machine, as is)

| Target | Device | Flow | Lead layers (URL width, cache) | First sharp, ms | Main complete, ms | LCP, ms | LCP element | Image bytes on the wire | n |
|---|---|---|---|---|---|---|---|---|---|
| production (baseline) | phone | cold | lead 1440w network | 202 (189-403) | 202 (189-403) | 216 (184-428) | blur (data URI) | 79020 | 5 |
| production (baseline) | phone | warm-hard | lead 1440w hit: memory | 60 (50-68) | 60 (50-68) | 84 (76-92) | photo 1440w | 61202 | 5 |
| production (baseline) | phone | warm-click | lead 1440w hit: memory, no request | 27 (25-30) | 27 (25-30) | n/a | not reported (client-side navigation) | 61207 | 5 |
| production (baseline) | desktop | cold | lead 1920w network | 169 (162-194) | 169 (162-194) | 200 (184-228) | photo 1920w | 50510 | 5 |
| production (baseline) | desktop | warm-hard | lead 1920w network | 107 (73-257) | 107 (73-257) | 128 (100-280) | photo 1920w | 50345 | 5 |
| production (baseline) | desktop | warm-click | lead 1920w network | 59 (43-128) | 59 (43-128) | n/a | not reported (client-side navigation) | 50351 | 5 |
| local build, main | phone | cold | lead 1440w network | 28 (27-29) | 28 (27-29) | 52 (52-52) | blur (data URI) | 81520 | 5 |
| local build, main | phone | warm-hard | lead 1440w hit: memory | 9 (6-10) | 9 (6-10) | 32 (24-36) | photo 1440w | 63074 | 5 |
| local build, main | phone | warm-click | lead 1440w hit: memory, no request | 27 (25-29) | 27 (25-29) | n/a | not reported (client-side navigation) | 63074 | 5 |
| local build, main | desktop | cold | lead 1920w network | 28 (27-28) | 28 (27-28) | 60 (60-60) | photo 1920w | 52214 | 5 |
| local build, main | desktop | warm-hard | lead 1920w network | 10 (7-10) | 10 (7-10) | 40 (40-44) | photo 1920w | 52214 | 5 |
| local build, main | desktop | warm-click | lead 1920w network | 29 (27-30) | 29 (27-30) | n/a | not reported (client-side navigation) | 52214 | 5 |
| local build, underlay | phone | cold | under 1440w network; main 1440w network | 27 (25-28) | 27 (25-28) | 52 (52-52) | blur (data URI) | 81520 | 5 |
| local build, underlay | phone | warm-hard | under 1440w hit: memory; main 1440w hit: memory | 8 (6-9) | 8 (6-9) | 28 (24-36) | photo 1440w | 63074 | 5 |
| local build, underlay | phone | warm-click | under 1440w hit: memory, no request; main 1440w hit: memory, no request | 28 (26-29) | 28 (26-29) | n/a | not reported (client-side navigation) | 63074 | 5 |
| local build, underlay | desktop | cold | under 1080w network; main 1920w network | 28 (27-28) | 28 (27-28) | 60 (60-60) | photo 1080w | 66918 | 5 |
| local build, underlay | desktop | warm-hard | under 1920w network; main 1920w network | 9 (9-10) | 9 (9-10) | 40 (40-44) | photo 1920w | 52214 | 5 |
| local build, underlay | desktop | warm-click | under 1080w hit: memory, no request; main 1920w network | 27 (25-27) | 27 (25-27) | n/a | not reported (client-side navigation) | 52214 | 5 |

### Throttled: 1.6 Mbps down, 150 ms added latency, applied to the navigation under test only

| Target | Device | Flow | Lead layers (URL width, cache) | First sharp, ms | Main complete, ms | LCP, ms | LCP element | Image bytes on the wire | n |
|---|---|---|---|---|---|---|---|---|---|
| production (baseline) | phone | cold | lead 1440w network | 1436 (1396-1465) | 1436 (1396-1465) | 1208 (1172-1236) | blur (data URI) | 53942 | 5 |
| production (baseline) | phone | warm-hard | lead 1440w hit: memory | 185 (183-195) | 185 (183-195) | 196 (196-204) | photo 1440w | 36139 | 5 |
| production (baseline) | phone | warm-click | lead 1440w hit: memory, no request | 27 (26-30) | 27 (26-30) | n/a | not reported (client-side navigation) | 61202 | 5 |
| production (baseline) | desktop | cold | lead 1920w network | 1650 (1618-1699) | 1650 (1618-1699) | 1688 (1644-1748) | photo 1920w | 50505 | 5 |
| production (baseline) | desktop | warm-hard | lead 1920w network | 676 (657-684) | 676 (657-684) | 684 (664-708) | photo 1920w | 50360 | 5 |
| production (baseline) | desktop | warm-click | lead 1920w network | 576 (510-590) | 576 (510-590) | n/a | not reported (client-side navigation) | 50357 | 5 |
| local build, main | phone | cold | lead 1440w network | 1007 (994-1023) | 1007 (994-1023) | 748 (740-756) | blur (data URI) | 55788 | 5 |
| local build, main | phone | warm-hard | lead 1440w hit: memory | 194 (186-196) | 194 (186-196) | 200 (192-204) | photo 1440w | 37342 | 5 |
| local build, main | phone | warm-click | lead 1440w hit: memory, no request | 29 (28-29) | 29 (28-29) | n/a | not reported (client-side navigation) | 63074 | 5 |
| local build, main | desktop | cold | lead 1920w network | 1141 (855-1167) | 1141 (855-1167) | 1184 (888-1220) | photo 1920w | 52214 | 5 |
| local build, main | desktop | warm-hard | lead 1920w network | 658 (655-667) | 658 (655-667) | 672 (664-712) | photo 1920w | 52214 | 5 |
| local build, main | desktop | warm-click | lead 1920w network | 510 (475-512) | 510 (475-512) | n/a | not reported (client-side navigation) | 52214 | 5 |
| local build, underlay | phone | cold | under 1440w network; main 1440w network | 1018 (1009-1038) | 1018 (1009-1038) | 788 (764-796) | blur (data URI) | 55788 | 5 |
| local build, underlay | phone | warm-hard | under 1440w hit: memory; main 1440w hit: memory | 193 (176-206) | 193 (176-206) | 204 (200-220) | photo 1440w | 37342 | 5 |
| local build, underlay | phone | warm-click | under 1440w hit: memory, no request; main 1440w hit: memory, no request | 27 (25-28) | 27 (25-28) | n/a | not reported (client-side navigation) | 63074 | 5 |
| local build, underlay | desktop | cold | under 1080w network; main 1920w network | 937 (924-941) | 1142 (1137-1155) | 968 (964-984) | photo 1080w | 66918 | 5 |
| local build, underlay | desktop | warm-hard | under 1080w hit: memory; main 1920w network | 186 (185-193) | 668 (655-669) | 208 (200-212) | photo 1080w | 52214 | 5 |
| local build, underlay | desktop | warm-click | under 1080w hit: memory, no request; main 1920w network | 27 (26-28) | 509 (477-512) | n/a | not reported (client-side navigation) | 52214 | 5 |

## Round 2, 2026-11-14: no client JS

Branch head 9b14ecd22e4caa1b4685dc0ab48d646a2b69dcdb (`unit/U-129-image-underlay`). `PhotoWithUnderlay.tsx` and its load state are gone. The underlay is a decorative `next/image` (`alt=""`, `aria-hidden`, eager, the card's `sizes`, blur placeholder) rendered on the server inside `Photo`; the main image sits over it in the same box with no placeholder and no opacity rule, so it is transparent until its own pixels paint. Server HTML confirmed: underlay carries the blur background, main carries none, `fetchPriority="high"` on main only.

Method as above (local `next build` + `next start` of the branch with the harness, desktop 1440x900 at DPR 2, 1.6 Mbps / 150 ms applied to the navigation under test, one discarded warm-up pass, n=5, median with (min-max), ms). Only desktop cold and desktop warm-click were run. "First sharp" is the first frame in which any lead layer is a loaded image, so with no fade it is the underlay showing through. The experience was `/measure/exp/0` (the earlier rounds' experience path is not recorded, so absolute bytes match round 1 but the photo may differ).

| Target | Device | Flow | Lead layers (URL width, cache) | First sharp, ms | Main complete, ms | LCP, ms | Image bytes on the wire | n |
|---|---|---|---|---|---|---|---|---|
| local build, underlay (server-rendered) | desktop | cold | under 1080w network; main 1920w network | 940 (928-950) | 1145 (1131-1150) | 980 (972-992) | 66918 | 5 |
| local build, underlay (server-rendered) | desktop | warm-click | under 1080w hit: memory, no request; main 1920w network | 27 (21-29) | 493 (471-510) | n/a | 52214 | 5 |

Compared with round 1 (cold 937 / 1142; warm-click 27 / 509): the same. The desktop warm card click still gives a sharp first frame at about 27 ms, from the card's 1080w file served from the memory cache with no request, while the 1920w main arrives at about 493 ms. Cold shows the 1080w underlay at about 940 ms and main at about 1145 ms. Every run's first sharp layer was the underlay at 1080w. Main-complete and opaque are now the same moment because there is no fade.

### Failed main load over the underlay

Desktop (1440x900 at DPR 2, Chromium via Playwright), main layer's `w=1920` request aborted, underlay allowed. Screenshots of the lead frame: `/private/tmp/claude-501/-Users-davidfleming-Workspace-ramble--claude-worktrees-ramble-status-c5d9be/2cbd7721-327d-4aeb-a742-b1364e63bb5d/scratchpad/fail-warm-click.png` and `fail-cold.png` (scratch, not copied into the repo).

- The underlay stays visible and sharp in both flows; there is no blank frame.
- The broken main `<img>` still paints Chromium's broken-image icon in the top-left corner of the frame, over the underlay.
- After a card click (warm) the alt text also renders, in the page's body font and colour, over the top-left of the photo, wrapping across the full frame width ("Generated test image 1 of 4 for ...", two lines). On the cold load only the broken icon showed and no alt text; I did not establish why (timing of the error against the screenshot is the likely difference).
- So a failed main load shows the photo and, over it, a broken icon and, at least sometimes, the full alt text. It is not hidden. Not built: the owner did not ask for a fix; `next/image` already sets `color: transparent` inline on both layers and the alt text still showed dark, so that is not a fix; an `onError` handler would need client JS.
