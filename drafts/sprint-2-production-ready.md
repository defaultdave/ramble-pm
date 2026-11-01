# Sprint 2: production ready

Dave, 2026-11-01. Sprint 2 stops adding features and tightens what exists. The feature units on the board for S2 (rest of money, gifts, host and ops shells) move back one sprint.

Numbers are from `main` on 2026-11-01. Test and source line counts came from a checkout 8 commits behind it. The text count is a floor, from a rough pattern search.

## Exit from Sprint 1 first

| Item | State | Action |
|---|---|---|
| Open audit rows | about 158 open, 27 decided, 3 assigned | `audit-fixes` lane |
| Prototype feedback | PF-7 open, PF-9b accepted, `browse-perf` JS audit done (`audits/js-weight-2026-11-01.md`) | Schedule PF-7; act on the audit |
| U-035 Category and neighborhood pages | Todo, real work | Build; the home chips and browse depend on the targets |
| U-020 Audit log | Todo | Build, critical tier |
| U-004a Sign-in links, roles, sessions | Todo | Not needed by a guest; move to the feature sprint |
| U-005, U-102 | In Progress | Close what is finished; U-005's pulse landed in PR 290 |
| U-003, U-116 | Board says Todo, but the work is merged | Check, then set Done; that closes the issues, so say so in chat |
| BC-48 | Waits on the seed rerun | Dave |

## Tracks

Run in this order. The later tracks touch nearly every file, so each directory is worked by one builder at a time and no feature unit runs beside them.

1. **Test audit.** 3,798 test cases in 71,209 lines against 44,190 lines of source (1.6 to 1).
   - Remove tests that repeat each other, restate the implementation, or pin copy and markup.
   - Keep money, holds, webhook, race and authorization tests unless a stronger one covers the same case.
   - Measure coverage and a mutation sample before and after. A cut that loses a caught mutation is reverted.
   - Target: fewer lines and a faster suite, no loss of caught mutations. Set the number after a pass over the largest files (`tests/db/editorial.db.test.ts` is 2,617 lines).
2. **Comment cleanup.** 523 line comments and 1,128 JSDoc blocks in `src`, 100 `TODO`s.
   - Apply the repo rule: a comment states a non-obvious why, never what the next line does.
   - Each `TODO` must name a live ticket; closed ones are done or deleted.
3. **Dictionary.** At least 370 hard-coded strings, none centralised.
   - One locale, typed, no library: the PRD has no translation requirement, so nothing should ship to the browser beyond the strings a client island uses.
   - Needs a short design first: file layout, how server components and client islands read it, interpolation, plurals, money and dates, emails, and how tests assert without pinning copy.
   - Check bundle weight before and after. Home's skeleton is fitted to its copy (N1101-2), so that goes with this track.
4. **Tighten.** The PM's additions, for Dave to strike:
   - Architecture drift: `.claude/standards/architecture.md` against the client islands that grew off its allowlist (N1030-8).
   - Dead code and unused dependencies.
   - Performance budgets in CI: U-095 and the JS audit's cuts.
   - Booking-path smoke and nightly suite: U-105.
   - Accessibility live sweep: H-23 gaps, plus forced colors.
   - Checkout failure states: U-051, since the Figma failure flows show the gaps.
   - Next.js unredacted stderr (decided 2026-11-01), `sslmode=verify-full`, `.env.example` drift.
   - Backups and restore rehearsal: U-098. Runbooks for the production flow.
   - Dave's items that make it production ready: Sentry, BotID, firewall rule, private vulnerability reporting.

## Tracking

No new units or issues. Tracks ride carrier units as the refactor PRs did, and each item gets a row in a new `audits/production-ready.md`. Lane: `production-ready`.

## What it costs

The S2 feature units slip by one sprint, about two weeks in the forecast's slow case. The forecast has not been rerun for this. Agent actuals have run at 4 to 42 percent of estimate, so the real cost may be smaller.
