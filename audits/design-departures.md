# Design departures from Figma

Where the built site knowingly differs from the Figma file `Ramble Core Flow Wireframes` (`tGNKJSWGHyx4UVmpnd5LUp`), with the reason and who decided. Audit passes compare screenshots against Figma; a row here stops a known departure from being raised again. Add a row when the owner records a departure; remove it when the build or the Figma frame is changed to match.

| Date | Where | Departure | Why | Decided by |
|---|---|---|---|---|
| 2026-10-18 | Brand assets | Stand-in wordmark and illustrations instead of final brand assets | Tone checklist B3 waiver at the P3 gate | Owner |
| 2026-10-18 | Photography | Placeholder photos until the seed photos (U-021b) | Tone checklist B4, deferred | Owner |
| 2026-10-28 | Browse results | "Show more" replaces the grid rather than appending | U-031 round 3 made the FilterBar a server component; appending needs client state | PM, logged in DECISIONS |
| 2026-10-29 | Display type | Self-hosted Fraunces carries the weight axis only, no optical size, so display headings set slightly wider than Figma and the desktop h1 wraps one word earlier | The opsz subset adds about 84 KB in front of the LCP heading (H-28) | Owner |
| 2026-10-29 | Home sections | 32 px between sections on phones and 48 px on desktop, about 16 px more than the Figma frames at each boundary | Figma is inconsistent between frames; the chosen values keep the rail padding that gives the focus ring room (H-66) | Owner |

- **Checkout pays in two taps** (U-047b, 2026-10-29, PM): "Continue to payment" starts the payment, then the fake card form's own Pay button (with the express wallets above it) completes it; Figma 05 and D05 show one Pay button with the express area on top. The fake card form needs the client secret first. Revisit with the Stripe adapter (U-046).
| 2026-10-31 | Browse filters | Phone row scrolls inside its box; no Price, Good for, Setting yet; "Show results" has no number; When has no Today, Tomorrow or weekend chips | One row asked for by the owner; extra filters need data; no new count read | PM, `audits/prototype-feedback-2026-10-31.md` |
