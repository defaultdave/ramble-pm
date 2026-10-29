Follow-up PR Components-1 of the `src/lib` layout refactor (audit H-58, extends H-2). The home category rail built its own copy of the shared chip in `.pill` CSS, and the two had already drifted on the focus ring, font-family, cursor and prefetch. The rail now renders the shared `ChipLink` and `.pill` is gone. Brief: `drafts/u-030-category-chips-checks/brief-r1.md` in ramble-pm. Carrier unit U-030.

## What changed
- `CategoryRail.tsx`: each list item renders `<ChipLink label={name} href={href} selected={false} />`; the `next/link` import and `styles.pill` are gone.
- `HomeModules.module.css`: `.pill` and `.pill:hover` deleted, and `.pill` left the shared `:focus-visible` list (`.link` and `.action` keep it). `.pills` and `.pills > li` stay as the rail's layout.

## What the guest sees
At rest the rail looks the same: the before and after captures are byte-identical at 320 px and 1280 px (the story shows light and dark side by side). What changes is in states a screenshot cannot hold: the shared chip's focus ring and hover, `cursor: pointer`, and the rail's links no longer prefetch (`ChipLink` sets `prefetch={false}`; PM ruling: each chip is its own address, so fetching the rail ahead is waste on a phone). No seeded category name wraps at 320 px.

| | Before | After |
|---|---|---|
| 320 px | ![rail at 320 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-category-chips/category-rail-320-light-before.png) | ![rail at 320 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-category-chips/category-rail-320-light-after.png) |
| 1280 px | ![rail at 1280 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-category-chips/category-rail-1280-light-before.png) | ![rail at 1280 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-category-chips/category-rail-1280-light-after.png) |

Captured by the PM from Storybook builds of `main` and this head (`home-homemodules--category-rail-mobile`); the Vercel preview is not available.

## Gates (head `32a4bd0`, `main` at `aeae5e6`)
- **Builder:** `format:check`, `lint`, `typecheck`, `knip`, `env -u DATABASE_URL pnpm build` pass; `test` 3947 pass. `storybook:test` and e2e need a browser the local sandbox refuses; CI runs both.
- **PM:** gitleaks over the range, no leaks; both changed files are in the manifest.

## Checks (round 1, all PASS)
- **review-agent:** no `.pill` dependents left; the focus list is right; PM rulings followed. Logged a test gap as H-97 (the rail test checks one href of eight).
- **qa-agent:** before and after byte-identical; no label wraps; a temporary test asserted all 8 hrefs and no `aria-current`; hover and focus match the old rules by CSS (not seen in a browser).
- **spec-compliance:** every criterion passes; two files.
- **architecture-audit:** import direction holds; one duplicate removed, none added.
- **a11y-audit:** names, list semantics, no `aria-current`, 44 px target, contrast in both schemes.

## Audit items
- Closes when this PR merges: H-58 (`audits/home-2026-10-28.md`). H-2 closes once Components-1 is in, with A, B, C and E already merged.
- Opened: H-97 (rail test coverage).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
