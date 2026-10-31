UNIT: U-030 (carrier: GuestShell's unit, standard tier). BRANCH: `unit/U-030-order-frame`. BASE: `origin/main`. PR title (the PM opens it): `U-030: order, manage and gift pages use the guest frame`.

Closes audit item BC-1 for the `(checkout)/(site)` routes. Rules for every builder: `/Users/davidfleming/Workspace/ramble-pm/drafts/wave3-builder-rules.md`, read in full. The worktree's Setup step applies.

**The gap.** `src/app/(checkout)/(site)/layout.tsx` renders `SiteShell`, an unstyled stand-in, so `/orders/<ref>` opens with a raw blue "Skip to main content" and "Ramble" link and has no footer. Seen on production at 375 and 1024 px (`/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-045b-fake-delivery-production/orders-confirmed-375-dark.png`). Figma `06 Confirmation` (49:1548) and `D06 Confirmation` (66:914) show the full guest header and the footer on this page.

**PM call.** The `(site)` layout renders `GuestShell` from `@/components/GuestShell`, with no banner. No new component. `GuestBanner`, `VercelMeasurement` and `SentryBrowserScript` stay out: this group carries no third-party tags (ADR 0007, ADR 0003) and `tests/checkout-no-sentry.test.ts` must pass unchanged. The checkout page keeps `CheckoutFrame`.

SCOPE MANIFEST
IN SCOPE: `src/app/(checkout)/(site)/layout.tsx`; a test that a page in the group renders the styled skip link, header and footer, if a test at this level fits the existing ones; any existing test or e2e assertion that pinned the old frame.
OUT OF SCOPE: `src/components/SiteShell.tsx` and its host and ops users; `(checkout)/error.tsx`, `(checkout)/not-found.tsx`; `CheckoutFrame`; the order page's own content or the Figma differences inside it (the "More near" module, the hero); `GuestShell`, `Header`, `Footer`; anything in `.github/`, `docs/plan/`, `docs/adr/`, `.claude/`, `scripts/merge-desk/`.
REFERENCE CODE: `src/app/(guest)/layout.tsx` for how `GuestShell` is used.

**Check and report:** the header's links and search work from `/orders/<ref>` under the group's nonce CSP (no console CSP error); `pnpm build` output for checkout still has no Sentry chunk; no sideways scroll at 320 px.

**Evidence:** before and after PNGs of `/orders/<ref>` at 375 and 1280, dark and light if the scheme follows the system, per the rules' Evidence section, into `evidence/pr/unit-U-030-order-frame/`. Reaching a confirmed order needs a seeded local build; use the order's "not found" state or a Storybook story only if a real order would cost more than 15 minutes, and say which you used.

Time box: 60 minutes. A one-file change: do not grow it. Anything else you notice goes in Suggestions.
