# Audits

An audit pass runs after each section or major feature ships (DECISIONS 2026-10-28). It reports findings only; the owner picks which become work. Every item raised, by an audit or along the way, is tracked in that pass's file until it is closed.

## When a pass runs

After each of these reaches `main`:

| Pass | Covers | Status |
|---|---|---|
| Prototype: home | Home page, the shell it shares, the reads and helpers it shares with browse | Done 2026-10-29: 65 verified findings as H-19 to H-68, 19 for the owner to decide ([home-2026-10-28.md](home-2026-10-28.md)) |
| Prototype: browse and experience page | Browse, the experience page, card photos | Reported 2026-10-28 on `main` at `5121048`: 21 items ([browse-experience-2026-10-28.md](browse-experience-2026-10-28.md)) |
| Booking and checkout | Holds, booking bar, checkout, confirmation, emails | When the money core and checkout pages land; items raised along the way in [booking-checkout.md](booking-checkout.md) |
| Gifting | Gift purchase, delivery, redemption, exchange | When the gifting section lands |
| Host and ops | Host pages, ops admin, editorial tools | When each lands |
| Launch | Everything, with field data | Feeds U-104, launch readiness |
| Nightly | The PRs merged to `main` in the last 24 hours (skipped when there were none) | Scheduled task `ramble-nightly-audit`, about 02:30 New York time; files `nightly-<date>.md`, item IDs `N<MMDD>-k` |
| Agents (nightly self-improvement) | The previous day's Claude Code sessions: tokens, context, model use, polling, review rounds, rulings; follow-up of earlier experiments; at most two tested experiments a night (replayed against recorded check runs where possible), shipped for the owner's approval | Scheduled task `ramble-nightly-agent-review` ("Ramble nightly self-improvement"), about 03:05 New York time; files `agents-<date>.md`, experiment IDs `A<MMDD>-k`, staged patches in `experiments/`; baseline [../drafts/token-review-2026-10-29.md](../drafts/token-review-2026-10-29.md) |
| Nightly 2026-10-29 | PRs 205 to 229 (22 merged), `4959db0` to `5a595f1` | Reported 2026-10-29 on `main` at `5a595f1`: 18 items, N1029-1 to N1029-18, all open ([nightly-2026-10-29.md](nightly-2026-10-29.md)) |
| Nightly 2026-10-30 | PRs 230 to 273 merged in the 24 hours to 06:40 UTC (34), up to `5dd63e2`; architecture, code and DRY, accessibility (code reading) | Reported 2026-10-30 on `main` at `5dd63e2`: 28 items, N1030-1 to N1030-28, all open; visual, axe and performance not run (Docker socket denied in the sandbox) ([nightly-2026-10-30.md](nightly-2026-10-30.md)) |
| Nightly 2026-10-31 | PRs 283 to 293 merged in the 24 hours to 06:33 UTC (11; 8 code, 1 promotion, 1 workflow), up to `93f494a`; architecture, code and DRY, accessibility (code reading) | Reported 2026-10-31 on `main` at `93f494a`: 26 items, N1031-1 to N1031-26, all open; visual, axe and performance not run (Docker socket denied in the sandbox) ([nightly-2026-10-31.md](nightly-2026-10-31.md)) |
| Agents 2026-10-29 | Claude Code sessions of 2026-10-29: $549.80, 15 sessions | Reported 2026-10-30: 1 experiment (A1029-1, read budget for architecture-audit), failed, none shipped ([agents-2026-10-29.md](agents-2026-10-29.md)) |

## Lenses (the same every pass)

1. **Architecture:** layer boundaries and B2 decisions in `.claude/standards/architecture.md`, cache tags and profiles, data-read bounds, error paths.
2. **Code and DRY:** duplicate helpers, components, and rules across pages and shared libraries, each with the one place it should live and who moves it; general areas of improvement.
3. **Accessibility:** WCAG 2.2 AA on every state.
4. **Visual:** Playwright screenshots of every state at 320, 390, 768, 1024, 1280, and 1440 px in light and dark; broken layout (sideways scroll, overlap, clipping, targets under 44 px); side by side with the Figma frames. Screenshots go in `evidence/<pass>/`.
5. **Performance (PRD-68):** Lighthouse mobile on a throttled 4G mid-range profile against a seeded production build; RSC payload, client JS, fonts, CLS from streamed sections, cache headers.

Each finding is checked by an independent verifier before it reaches the report. Known, owner-approved departures from Figma live in [design-departures.md](design-departures.md); the visual lens does not raise them again.

## How a pass runs (lessons from the home pass, 2026-10-28)
- **No barrier between lenses:** each lens's findings go to verification as soon as that lens returns. In the home pass, 70-odd findings from the fast lenses waited about 35 minutes on the performance lens.
- **Performance is split:** one agent per page and per variant (baseline, each alternative), in parallel, each with its own port and database, time-boxed (15 minutes for a nightly pass). Never one agent running a long matrix in sequence: the home pass's single performance agent ran 48 Lighthouse passes back to back.
- **Seeded production builds need a database the production driver can read:** production reads go through Neon's HTTP driver, which a local Postgres does not speak, so agents had to build a stand-in. A shared local stand-in (or a Neon branch per audit) belongs in the tooling.

## How an item is tracked

Each pass file has one table. An item keeps its ID for life (`H-12` is item 12 of the home pass). Status is one of: **open** (raised, not yet decided), **fix** (the owner chose to fix it; names the unit or PR), **later** (deferred, with where it lands), **won't** (decided against, with the reason), **closed** (fixed and verified, with the PR).

Items raised outside a pass (in review rounds, by the owner on the live site, by the PM) go into the next pass's file for the area, marked with where they came from.
