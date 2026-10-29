# Components-1 brief, round 1: the category rail renders ChipLink

UNIT: U-030 (carrier unit: the home modules). Branch: `unit/U-030-category-chips`. BASE: `main`, cut after refactor PR G (PR 270) merged, so page-module imports read `@/lib/pages/...`. PR title and commits: `U-030: the category rail renders the shared ChipLink`.

Source: `drafts/lib-layout-refactor.md`, "Follow-up PRs after G", row Components-1; audit row H-58 in `audits/home-2026-10-28.md` ("The category rail rebuilds ChipLink in its own `.pill` CSS. The two have already drifted on the focus ring, font-family, cursor and prefetch. Render `<ChipLink selected={false}>` and delete `.pill`."). Extends H-2.

## Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  src/components/HomeModules/CategoryRail.tsx   render <ChipLink label={name} href={href} selected={false} />
                                                inside each <li>; drop the next/link import and styles.pill
  src/components/HomeModules/HomeModules.module.css
                                                delete .pill and .pill:hover; drop .pill from the shared
                                                :focus-visible selector list (keep .link and .action);
                                                .pills and .pills > li stay (the rail's layout)
  src/components/HomeModules/HomeModules.test.tsx and HomeModules.stories.tsx
                                                only if an assertion or story names the old class or markup
OUT OF SCOPE:
  src/components/Chip/** (ChipLink is reused as it is; no className prop, no new variant);
  every other rule in HomeModules.module.css, including .eyebrow (Components-3) and .action
  (Components-2); GiftGuideSection; any other page.
REFERENCE CODE:
  src/components/Chip/ChipLink.tsx and Chip.module.css; src/components/FilterBar/FilterBar.tsx
  (an existing ChipLink caller).
```

## PM rulings

- `ChipLink` sets `prefetch={false}`. The rail's links used to prefetch by default; they stop. Accepted: the same reason as the filter chips applies (each is its own address, and fetching the whole rail ahead is waste on a phone).
- The `.pill` rule had `white-space: nowrap`; `.chip` does not. Do not add a wrapper or a prop to restore it. Check the seeded category names (`src/lib/seed/`) at 320 px: if any label wraps, say so in the report with the name, and the PM decides.
- Gains from the shared chip (the body font-family, `cursor: pointer`, the chip's own focus ring) are the point of H-58 and are expected visible differences.

## Evidence

The owner sees every visible change. The local sandbox refuses Chromium, so do not attempt captures; the PM builds Storybook on `main` and on the branch and captures the home modules' category rail at 320 px and 1280 px, light and dark. In your report name the story ids that show the rail.

## Gates

`pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip`, `env -u DATABASE_URL pnpm build`, gitleaks over the range. `pnpm storybook:test` and e2e need a browser; if the sandbox refuses them, say so (CI runs both).
