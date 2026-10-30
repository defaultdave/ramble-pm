Unit U-047b, issue #55. Standard tier, into `integration` (PM ruling, DECISIONS 2026-10-29: `startPayment` lives there). Three rounds plus three merges of `integration`; all five checks (review, qa, spec-compliance, architecture-audit, a11y-audit) passed round 3. Squashed to one commit because CI's gitleaks scans every PR commit and an early commit carried a false positive.

SCOPE MANIFEST
IN SCOPE: Screen 05 and D05: contact, unticked opt-in, attendee age and guardian fields from `ageRule.requirements`, waiver and terms, validation display, hold timer, order summary, express pay area and the provider card island wired to the fake gateway, demo no-payment notice, checkout maintenance state; on success, to `/orders/[reference]` with the order token.
OUT OF SCOPE: `startPayment` logic (U-047a), the booking bar (U-041), webhooks and `confirmOrder` (U-048, U-049), the confirmation page (U-050), gift checkout, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: design doc 4.2.3 (the `startPayment` contract and outcomes), 5.2 (S6, S7, S9); ADR 0007; Figma 05 Checkout (the only frame; no D05 or state frames yet).

## What was built
- **`/checkout/[holdId]`** (`src/app/(checkout)/checkout/[holdId]/page.tsx`) reads the view for the calling device (`readCheckoutView`; another device's, missing, gift, converted or released holds read as not found; missing terms or a required waiver throw) and renders one client island, `CheckoutPage`: contact, the opt-in unticked, the age and guardian fields from `ageRequirements`, waiver and terms, validation with a summary and focus on the first error (the server's schema runs in the browser first, so a bad form never spends one of the hold's 5 tries), the hold timer from the database clock, the order summary, and the fake card island.
- **Pay in two taps**: "Continue to payment" calls `startPayment` (never on load, refresh or re-render; a test mounts the page five times), then the fake form's own Pay with the wallets above it; success goes to `/orders/<ref>?t=<token>`.
- **States**: S6 (hold ended, with "Hold my spaces again"), S7 (sold out, with other dates), S9 (lost answer), too many tries, maintenance, all taking focus on change.
- **Re-hold** (`src/server/actions/rehold.ts`, `src/server/db/rehold.ts`): only the caller's own lapsed hold, released under the session and hold locks, then `reserveSpaces` for the same party read from the server; a live, paying or another device's hold is refused uniformly; a refusal after the release says the hold has ended and links back to the experience.
- **`OrderSummary`** gains an opt-in `openFrom="tablet"`: open with a plain heading from 768 px, toggle below.
- **`rethrowOrLog`** no longer logs Next's prerender-end signal when the Neon driver wraps it (`isPrerenderEnd`), so a normal render logs nothing.
- Route groups: `(checkout)` is a bare document for the island's header; the stub frame moved to `(site)` (gift, gifts, manage, orders). The demo click-through stays until U-041 (`TODO(U-041)`).

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): two-tap pay (a recorded design departure); the full-pay e2e waits for a seeded e2e mode (BC-19, needs `.github`); the re-hold runs in two transactions and loses the guest nothing (BC-24); re-hold skips BotID because ADR 0007 keeps it out of checkout, bounded by the `reserve` rate limit and the device's own lapsed hold.
- Figma has only the lo-fi 05 frame; eight differences beyond the two-tap departure are listed for the owner (BC-22).

## Gates (on this head)
format:check, lint, typecheck, knip; test 6,030; test:db 1,547 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 163; storybook:test 227 (axe); gitleaks over the branch range (no leaks). QA on a seeded production build at 320 to 1280 px, light and dark: no sideways scroll with a 59:59 timer; twelve replays of the re-hold on a live hold make none and on one lapsed hold make exactly one; reloads never call `startPayment`; the pay flow lands on the order page.

## Not done
- The real confirmation page is U-050; the booking bar that creates real holds is U-041.
- Audit items BC-19 to BC-24 and BC-29 in `ramble-pm` `audits/booking-checkout.md`.

## Evidence
`evidence/pr/unit-U-047b/` in `ramble-pm` (before and after at 390 and 1280, light and dark; S6, S7, S9; the header at 320 and 390; a full pay GIF from Storybook) and `evidence/pr/unit-U-047b-qa-agent/` (QA's production-build screenshots).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
