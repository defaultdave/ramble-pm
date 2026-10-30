PASS

## qa-agent: U-047b round 3 (head 435d30b)

Scratch copy, fresh seeded Postgres, `next build` + `next start`, Playwright. Blocking: none.
Desktop toggle fixed: at 768, 1024, 1280 with JS on and off the toggle is `display: none`, out of the tab order (Tab goes from the logo to Email), no button exposed, one h2 with the title, panel visible (flex, 178 px) with title, meta, total; at 320, 390, 767 the toggle is a button `aria-expanded="false"`, at 390 a click opens and a second collapses; no sideways scroll at any width.
Log fixed: eight `/checkout/<id>` requests with a device cookie returned 200 with only start-up lines in the server log, including after every refusal below; the real checkout renders.
Re-hold refusals from S6 at 390, each with its cause and no "Hold my spaces again" afterwards: sold out (S7 with three dates and "See all dates"); lapse block, paused, seat limit each say the earlier hold has ended with a "Choose another date" link to the experience; a reload then shows not-found, as the copy says. Successful re-hold: `/checkout/<newId>?rehold=1`, focus on the h1.
Merge and scope: migrations match 98096b2; 70 files under `src`, `e2e`, `tests`, `.storybook`.
Non-blocking: after the lapse-block, paused and seat-limit refusals focus drops to BODY (announced through `role=alert`; focusing the alert would match S7); with JS off at 390 the summary cannot be opened (unchanged from round 2); the sold-out panel still shows the earlier "Your hold has expired." live-region line (cosmetic).
Evidence: `evidence/pr/unit-U-047b-qa-agent/summary-*-r3.png`, `s6-*-r3.png`.
