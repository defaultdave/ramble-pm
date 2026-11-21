# Bug finder runs (ADR 0012)

| Date | Run | Area | Result | Turns | Cost | Note |
|---|---|---|---|---|---|---|
| 2026-11-21 | 44921974659 | checkout | failed at Install Claude Code | 0 | $0 | `CLAUDE_CODE_VERSION` and secrets unset; site start passed |
| 2026-11-21 | 44922924694 | checkout | none filed | 9 | $0.13 | pipeline works end to end (3 min); investigator shallow: no Playwright, did not read CheckoutForm, FakePaymentForm or the actions; verify skipped as designed |
| 2026-11-21 | 44927399230 | checkout | none, INCOMPLETE | 32 | $0.35 | after the floor (PR 1052): Playwright walk at Pixel 7, double submit on Continue and Pay gave one order, 320 to 1440 px light and dark, 470 tests; quit with 28 turns left (did not know its budget) |
| 2026-11-21 | 44932982530 | checkout | none, floor met | 41 | $0.48 | after the turn budget (PR 1053): 7 files and 3 actions read, Playwright at Pixel 7 and 1280, double submits, axe at 320 light and dark and 1440 light (0 violations), 127 tests; 1440 dark skipped because its own holds used up the seeded seats; noted back-after-pay shows checkout with a live timer and judged it harmless. No known bug in checkout, so recall is unmeasured: owner asked whether it should find something; planted-bug canary proposed |
