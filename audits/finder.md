# Bug finder runs (ADR 0012)

| Date | Run | Area | Result | Turns | Cost | Note |
|---|---|---|---|---|---|---|
| 2026-11-21 | 44921974659 | checkout | failed at Install Claude Code | 0 | $0 | `CLAUDE_CODE_VERSION` and secrets unset; site start passed |
| 2026-11-21 | 44922924694 | checkout | none filed | 9 | $0.13 | pipeline works end to end (3 min); investigator shallow: no Playwright, did not read CheckoutForm, FakePaymentForm or the actions; verify skipped as designed |
