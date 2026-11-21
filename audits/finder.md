# Bug finder runs (ADR 0012)

| Date | Run | Area | Result | Turns | Cost | Note |
|---|---|---|---|---|---|---|
| 2026-11-21 | 44921974659 | checkout | failed at Install Claude Code | 0 | $0 | `CLAUDE_CODE_VERSION` and secrets unset; site start passed |
| 2026-11-21 | 44922924694 | checkout | none filed | 9 | $0.13 | pipeline works end to end (3 min); investigator shallow: no Playwright, did not read CheckoutForm, FakePaymentForm or the actions; verify skipped as designed |
| 2026-11-21 | 44927399230 | checkout | none, INCOMPLETE | 32 | $0.35 | after the floor (PR 1052): Playwright walk at Pixel 7, double submit on Continue and Pay gave one order, 320 to 1440 px light and dark, 470 tests; quit with 28 turns left (did not know its budget) |
