Unit U-030 (carrier, DECISIONS 2026-10-30). Standard tier, into `main`. Closes audit item BC-1 for the `(checkout)/(site)` routes: `/orders/<ref>`, the last page of the booking flow, opened with raw blue links and no footer. Figma `06 Confirmation` and `D06 Confirmation` show the full guest header and footer.

SCOPE MANIFEST
IN SCOPE: `src/app/(checkout)/(site)/layout.tsx`; a test that a page in the group gets the guest frame.
OUT OF SCOPE: `SiteShell` and its host and ops users; `(checkout)/error.tsx`, `(checkout)/not-found.tsx`; `CheckoutFrame`; the order page's own content; `GuestShell`, `Header`, `Footer`; `.github/`, `docs/plan/`, `docs/adr/`, `.claude/`, `scripts/merge-desk/`.

## What was built
- The `(site)` layout renders `GuestShell` with no banner. No `GuestBanner`, `VercelMeasurement` or `SentryBrowserScript`: this group carries no third-party tags (ADR 0007, ADR 0003).
- `layout.test.tsx` asserts what only the guest frame renders. With `SiteShell` put back it fails 2 of 3.

## Gates
format:check, lint, typecheck, knip; test 6,459; build without `DATABASE_URL`; e2e 161; `checkout-no-sentry` unchanged and passing; gitleaks clean. Full suite and e2e ran at `4e778f0`. At `ecf88eb`, where only the test file changed: format:check, lint, typecheck, `layout.test.tsx` and `checkout-no-sentry`.

All four checks passed. Round 1: review and spec failed because the layout test passed on the old frame. QA ran at `4e778f0`; `layout.tsx` is identical at `ecf88eb`.

## Not done
- Not-found and error states in the checkout group still show `SiteShell`, including a mistyped order link. Logged in the audit.
- Production keeps the old frame until the next deploy, which is Dave's.

## Evidence
![Before: raw links and no footer, 375 dark](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/orders-confirmed-375-dark-before.png)
![After: guest header and footer, 375 dark](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/orders-confirmed-375-dark-after.png)
![Before: raw links and no footer, 1280 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/orders-confirmed-1280-light-before.png)
![After: guest header and footer, 1280 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/orders-confirmed-1280-light-after.png)
![After: a real order after fake Pay, 375, full page](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/qa-orders-confirmed-375-after-full.png)
![After: skip link on first Tab, 375](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/qa-orders-skip-link-375.png)
![Unchanged: checkout keeps its own frame, 1280](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-order-frame/qa-checkout-unchanged-1280.png)

Verdicts: `drafts/u-030-order-frame-checks/` in `ramble-pm`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
