Posted on head c4d2f79 (4866b2d with main merged; the PM reran every gate on the merge commit). Code unchanged since this verdict.

PASS

## architecture-audit: U-025 "nav targets" (head 4866b2d)

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (B1 to B17; B16 read with the 2026-10-28 ruling). Scope: 2 `*.module.css` files, in scope under `**/*.module.css`. No TSX, TS, or server changes, so B1 to B15 and B17 have no new code to judge.

### Blocking
- None.

Checked:
- B16 (tokens only): no colour, spacing, radius, or font-size literal in the diff. Every length is a `var(--…)`. The bare numbers are multipliers (`/ -2`, `* -1`), not styles. `calc()` over tokens is allowed and already used in the repo (`Checkbox.module.css:23,36`, `BookingPanel.module.css:103`, `HomeStates.module.css:196`, `Footer.module.css` `.groups`).
- B17 (reuse): the 44 px target is `var(--size-touch-target)` in all three new uses, the same token the repo uses everywhere (Button, Chip, Checkbox, GuestShell, SiteMenu, Stepper). No new function, hook, component, or constant was added, so nothing is duplicated by this diff. The centring formula it uses (`calc((target - content) / 2)`) predates the diff; see Non-blocking.

### Non-blocking
- `Header.module.css:61-63` (`.navLink`): the 44 px target is made with padding plus a negative margin. The repo already has two other ways to do this for the same job: `min-height: var(--size-touch-target)` (Button `Button.module.css:6`, Chip `Chip.module.css:7`, Header `.gifts` line 82) and the negative-margin centring in `BookingPanel.module.css:98-104` (`.privateLink`, which keeps the 20 px label line the same way this diff does). Suggest reusing one of those so the layout rule is the same in every component. Not blocking because it is CSS, not a function, and it renders correctly.
- `Header.module.css:28-29` (`.home`) and `Logo.module.css:7` (`line-height: var(--space-8)`): magic coupling. The header's 6 px offset (`(44 - 32) / 2`) assumes the wordmark is 32 px tall. That is true today: the Logo span is one nowrap inline-block line at `line-height: var(--space-8)`, so its box is 32 px. It is a coincidence of token use, not a declared logo height. If the Logo's line-height changes, the target silently stops being 44 px. Fix: declare one logo-height token (for example `--size-logo-height` in `src/styles/tokens.css`), set the Logo's line-height from it, and use it in `.home`.
- `Checkbox.module.css:36` and `BookingPanel.module.css:103` already compute the same `calc((target - content) / 2)` centring. Duplicated before this diff: audit item for `audits/` in ramble-pm, not a block.
- `Footer.module.css` `.link`: the padding goes from 2 px to 12 px top and bottom with no negative margin, and the list gap is removed. Each footer row grows from 24 px to 44 px, and the pitch from 28 px to 44 px, so the footer list gets about 16 px taller per link. This is an architecture-neutral layout change. Confirm it against Figma in the visual check.

### Unconfirmed
- None.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=PASS
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
