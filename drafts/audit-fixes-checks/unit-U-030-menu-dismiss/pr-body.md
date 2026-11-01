Audit BC-51: the phone menu (`SiteMenu`, a native `<details>`) did not close on Escape or an outside press, and focus did not return to Menu. It does now, on every guest page.

## What changed
- `dismissAction` in `src/lib/disclosureDismiss.ts` decides: Escape on an open disclosure closes it and refocuses its summary; a press outside closes it; anything else does nothing. Unit-tested.
- One shared hook, `src/components/Disclosure/useDismissableDetails.ts`, wires the rule to a `<details>`. `SiteMenu` and `WhenDetails` both use it, so the filter bar's calendar lost its own copy of the same code. It listens for the press in the capture phase, so a page that stops the event cannot hide it; `WhenDetails` keeps its focus memory and date-change close.
- The native `<details>` is unchanged, so the menu still works with JavaScript off. No CSS changed.
- Three Storybook plays (open, Escape, outside press); component and hook tests, including that unmounting removes the listener.

## Decision for Dave
`SiteMenu` is now a client island and the shared hook is new. The architecture standard (B8) wants your approval first; the PM approved them for this unit (DECISIONS 2026-11-01, overrule if you disagree). Please add both to the client-islands allowlist in `.claude/standards/architecture.md`.

## Evidence
Escape before, then after (menu closed, Menu focused), at 375 px:

![before]($U/menu-375-light-before-after-escape.png) ![after]($U/menu-375-light-after-after-escape.png)

## Checks
Round 2: review, spec, architecture and qa PASS. Round 1 failed all four on the duplicated wiring (and a missing cleanup test); qa mutation checks on all six behaviours now pass. Gates: format, lint, typecheck, knip, build, 6586 unit tests, 280 Storybook tests, e2e 163 passed, gitleaks over the range.

## Follow-ups logged, not built
- The capture-phase listeners in `FilterDrawerHost` and `focusMemory` could share the wiring.
- The menu stays open after a link click until navigation replaces it.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
