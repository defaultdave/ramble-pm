# U-024 pattern note (draft for Dave, 2026-10-23)

Goes into issue #31's scope manifest once approved. U-024 sets the pattern for every primitive after it (U-025 to U-027), so the rules below are the ones those units copy.

Where a line says "Dave to confirm", it is a call the PM made without a source in the ADRs.

---

**Pattern note (Dave, approved <date>)**

Files and naming (ADR 0005, architecture.md "Synchronous components")
- One folder per primitive: `src/components/Button/` holding `Button.tsx`, `Button.module.css`, `Button.stories.tsx`, `Button.test.tsx`, and `index.ts` that re-exports the component and its props type. Import as `@/components/Button`.
- Components are synchronous, named exports, no default export, no `'use client'`. Stateless unless absolutely necessary: a component that would hold state takes it as props instead (controlled: `checked` and `onChange`, `value` and `onChange`, `selected` and `onToggle`) and the caller owns the state. Stepper takes `value`, `min`, `max`, and `onChange`. If a primitive truly cannot work without internal state, stop and ask; it would be a client island and needs Dave's approval first.
- Props are the Figma property names, typed exactly: Button `variant` (primary, secondary, ghost), `size` (md, lg), `loading`, `iconStart`; Input `label`, `hint`, `errorText`, `optional`; Checkbox `checked`, `label`, `description`; Chip `selected`, `label`, `count`, `iconStart`; Badge `tone` (green, yellow, blue, pink, neutral), `label`, `icon`; Stepper `label`, `value`, `hint`, `min`, `max`; Alert `tone` (info, success, warning, danger), `title`, `body`, `action`; Skeleton `kind` (card, horizontal-card, text). Figma's `state` property is not a prop: hover, focus, pressed, and disabled come from CSS pseudo-classes and the native `disabled` attribute; error state comes from `errorText` being set. `docs/design/design-system-plan.md` lines 87 to 111 is the source of truth; if it and Figma disagree, stop and say so.
- Each primitive forwards `className`-free props only: it spreads the native element's own props (`ComponentPropsWithoutRef<'button'>` and so on) after its own, so callers can pass `id`, `aria-*`, `onClick`, `name`. No `className` or `style` prop: callers do not restyle a primitive.

Markup and accessibility (PRD-69)
- Native elements first: `<button>`, `<input>`, `<input type="checkbox">`, `<label>`. No `div` with a role where a native element exists.
- Label and hint and error text are wired with `htmlFor`, `aria-describedby`, and `aria-invalid`; ids from `useId`.
- Targets are at least `--size-touch-target` (44 px). Focus is visible with the Figma ring: `:focus-visible` draws the 2 px outer ring in `--color-focus-ring` with a canvas-colored gap, never `outline: none` alone.
- Loading Button keeps its width, sets `aria-busy`, and stays non-clickable; Alert uses `role="status"` for info and success, `role="alert"` for warning and danger.
- Skeleton is `aria-hidden` and sized to match the real card so nothing shifts when content loads (PRD-68).
- Icons come from `lucide-react`, imported by name (`import { X } from 'lucide-react'`), never the whole package. Add the dependency in this unit.

Styling (ADR 0005, UI-2, rule B16)
- CSS Modules beside the component, mobile first, `min-width` breakpoints only. Reference tokens only: `var(--color-...)`, `--space-*`, `--radius-*`, `--font-size-*`, `--elevation-*`. No hex, no raw px for space, radius, or type; no `--palette-*` (raw palette is not for components).
- Dark mode is automatic through the Color collection's tokens; a primitive never reads `prefers-color-scheme` itself.
- Class names are camelCase and state-based through data attributes or `:is(...)`, not BEM strings. Variants map to classes through a small lookup object, not string concatenation of user props.

Logic
- A decision about what to show (Stepper at-min and at-max, Badge tone fallback) is a plain function in `src/lib/`, with a unit test (ARCH-1). The component only renders what the function returns.

Stories and tests (ADR 0006)
- Storybook 9 with `@storybook/nextjs-vite` or the framework adapter that supports Next 16; say which in the PR and why. Add `@storybook/addon-a11y` and fail the CI story build on an accessibility violation. A new CI job `storybook` builds it; list it as a Dave step to make required, do not change the ruleset.
- One story per Figma variant, titled `Primitives/<Name>`, with a Light and a Dark decorator that sets the color scheme, so a reviewer sees what the Figma review frames show.
- Vitest component tests with Testing Library: renders the label, wires the error text to the input, Checkbox toggles through the label, Stepper respects `min` and `max`, a disabled Button does not fire `onClick`. No snapshot tests. Visual regression is not this unit (ADR 0006 adds it later).
- Knip must stay green: every exported primitive is used by its story or `index.ts`; no dead exports.

Not in this unit
- The remaining primitives (Card, Header, Footer, Logo, Illustration, TimeSlot, HoldTimer: U-025), the React Aria wrappers (U-026), and the booking pieces (U-027).
- Code Connect mapping (U-029, blocked on the plan).
- Any use of the primitives in a route: the placeholder pages stay as they are.
- A `tokens.css` change. If a token is missing, name it in the PR and stop; do not add one or hard-code a value. Tokens flow from Figma through `scripts/tokens/build.ts`.

Secrets and settings
- None. Dave steps after merge: make the `storybook` check required.

---

## PM notes for Dave (not part of the note)

1. **The three calls worth your eye:** no `className` prop (strict, keeps the brand consistent, costs flexibility later); Storybook adapter choice left to the agent with a stated reason.
2. **Checked against `src/styles/tokens.css`:** `--color-focus-ring` and `--size-touch-target` exist. Stepper `min` and `max` are not Figma properties (Figma has `at-min`, `at-max` states), so the note adds them as the code form of those states.
3. **Why critical tier matters here:** these conventions get copied by roughly 15 later components. A wrong choice costs more in U-025 to U-027 than in U-024 itself, which is why you read it in the promotion batch.
