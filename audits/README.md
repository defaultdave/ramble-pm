# Audits

An audit pass runs after each section or major feature ships (DECISIONS 2026-10-28). It reports findings only. Every item raised, by an audit or along the way, is logged in that pass's file and becomes a ticket in the Maintenance sprint on board #19 (DECISIONS 2026-11-01), which is the place to see what is left.

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
| Nightly 2026-11-01 | PRs 292, 294, 295, 296 merged in the 24 hours to 07:32 UTC (4), up to `1cbc6ae`; architecture, code and DRY, accessibility (code reading) | Reported 2026-11-01 on `main` at `1cbc6ae`: 6 items, N1101-1 to N1101-6, all open; visual, axe and performance not run (Docker unavailable in the sandbox) ([nightly-2026-11-01.md](nightly-2026-11-01.md)) |
| Sprint 1 close | Non-blocking items from the check rounds on the Sprint 1 fixes | Reported 2026-11-01: 26 items, SC-1 to SC-26, all open ([sprint1-close-2026-11-01.md](sprint1-close-2026-11-01.md)) |
| Agents 2026-10-29 | Claude Code sessions of 2026-10-29: $549.80, 15 sessions | Reported 2026-10-30: 1 experiment (A1029-1, read budget for architecture-audit), failed, none shipped ([agents-2026-10-29.md](agents-2026-10-29.md)) |
| Agents 2026-10-31 | Claude Code sessions of 2026-10-31: $72.76, 6 sessions | Reported 2026-11-01: 2 experiments (A1030-1 read budget rerun, failed; A1031-1 profiler shows fixed starting context, passed, published) ([agents-2026-10-31.md](agents-2026-10-31.md)) |

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

Each pass file has one table, and it is the record of what was found. An item keeps its ID for life (`H-12` is item 12 of the home pass). The status it was raised with is one of: **open** (raised, not yet decided), **fix** (the owner chose to fix it; names the unit or PR), **later** (deferred, with where it lands), **won't** (decided against, with the reason), **closed** (fixed and verified, with the PR).

Items raised outside a pass (in review rounds, by the owner on the live site, by the PM) go into the next pass's file for the area, marked with where they came from.

## Tickets and the Maintenance sprint

Once an item has a ticket, the ticket holds its status and its row links to it; do not keep both up to date.

- **What gets a ticket:** every item that is `open`, `fix` or `decided`. `later` items are carried by the unit they name, and `closed` and `won't` items are history, so neither gets one. A row whose status names only merged PRs is reported for closing rather than filed.
- **Filing:** `bun tools/audit-tickets.ts` prints what it would file; `--run` files the new items and links their rows. It is safe to rerun. A short title for each new item goes in `ticket-titles.json`; without one the ticket uses the item's first sentence.
- **The sprint:** `Maintenance` is a value of the board's Sprint field with no dates, so it never ends and stays out of the forecast. The `Maintenance` board view shows it by Status.
- **Labels:** `audit`, one `lens: <lens>`, and `needs-owner` where the owner has to decide.
- **Working a ticket:** the lane moves it to In Progress, and the fix PR's body carries `Closes #n`. GitHub honours that only on `main`, so a PR into `integration` says `Refs #n` and the promotion PR's body carries the `Closes`.
- **Closing without a PR:** a ticket that turns out stale or decided against is closed with a one-line reason, and `won't` goes on its row.
