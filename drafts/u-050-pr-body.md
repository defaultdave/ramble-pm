Unit U-050, issue #60. Critical tier, into `integration` (cut from U-049; DECISIONS 2026-10-29). Two rounds: round 1 QA passed and four checks asked for small changes (a duplicate Maps link builder, three domain decisions outside `src/lib`, stale TODOs, focus lost after "Check again"); round 2 fixed them and all five checks passed (review, qa, spec-compliance, architecture-audit, a11y-audit).

SCOPE MANIFEST
IN SCOPE: refresh-safe confirmation by reference and the order token; receipt with seller-of-record wording; `getOrderStatus` polling for S9; add to calendar, Open in Maps, manage link once confirmed; mobile and desktop (D06); token routes noindex with no Open Graph.
OUT OF SCOPE: manage booking, gift redemption, emails (U-054), checkout (U-047b), the booking bar (U-041), `docs/plan/`, `.github/`, `.claude/`.

## What was built
- **Confirmation page** at `/orders/<reference>`: the receipt (seller-of-record line "{Host} is the seller of this experience. Ramble collected your payment as {Host}'s agent."), Google Calendar and `.ics`, Open in Maps, and the manage link, built on the server and shown only once the order is confirmed. Notice views for payment failed, refunded after the hold lapsed (S10), and closed; one not-found answer for every refusal.
- **Refresh-safe access:** `/orders/<ref>?t=<token>` answers 303 to the token-free path and sets an HttpOnly, Secure, SameSite=Lax cookie scoped to that order's path for 2 hours, so the token leaves the address bar, history and the Referer. The token is recomputed and compared in constant time; a forged or other order's cookie opens nothing.
- **S9 status poller:** a bounded poll (2 s rising to 20 s, 12 tries, about three minutes) that refreshes into the receipt when the payment confirms, announces the outcome, and offers "Check again" with focus kept on the status.
- **Shared Maps link:** `mapsHref` moved from the experience page module to `src/lib/maps.ts`, so the receipt and the experience page search the same place.
- The demo click-through's confirmation still works until U-041 retires it.

## Gates
format:check, lint, typecheck, knip; test 6,199; test:db 1,566 with `--maxWorkers=2`; build without `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 167; storybook:test 244; gitleaks (no leaks). QA on a seeded production build at 320 to 1280 px, light and dark: the 303 and cookie attributes, a token-free URL that survives a refresh, the same not-found for a missing, tampered or other order's token, S9 flipping to confirmed without a reload, the poll stopping at its cap, calendar and `.ics` times matching the session.

## Not done
- The signed webhook was not driven over HTTP in QA (the fake gateway's secret is per process); `confirmOrder` was called directly, as the webhook job does.
- Gift confirmation (06b) waits for U-062a; its state is covered by stories.
- The site header and footer render unstyled on `/orders/<ref>`, as before this unit (audit item).

## Evidence
Before (the demo stub) and after, phone and desktop:

![Before: demo confirmation, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050/before-demo-stub-390-light.png)
![After: confirmed receipt, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050/after-confirmed-390-light.png)
![After: confirmed receipt, 1280 dark](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050/after-confirmed-1280-dark.png)
![QA: S9 pending after the handoff](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050-qa-agent/qa-flip-1-pending-390-light.png)
![QA: the same page after confirmation, no reload](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050-qa-agent/qa-flip-2-confirmed-390-light.png)
![QA: refunded after the hold lapsed (S10), 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-050-qa-agent/qa-refunded-after-lapse-390-light.png)

Every state at four widths and both schemes: `evidence/pr/unit-U-050/` and `evidence/pr/unit-U-050-qa-agent/` in `ramble-pm`. Verdicts: `drafts/u-050-checks/` there.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
