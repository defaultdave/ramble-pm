PASS

## qa-agent: U-030 "menu dismiss" (head b07f2e3), round 2

### Blocking
None.

### Checks run
- pnpm test: 257 files, 6586 tests pass.
- Six mutations (Escape handling, focus return, pointerdown add, removeEventListener cleanup, stopEscapePropagation, WhenDetails close on date change): all killed, no survivors. The round 1 cleanup survivor is now killed.
- storybook FilterBar + GuestShell: 20 of 20 pass. Round 1 FilterBar "Drawer Open" failures did not reproduce on main or the branch (flaky).

### Evidence
- menu-375-light-before-open.png, menu-375-light-after-open.png: the open menu, unchanged.
- menu-375-light-before-after-escape.png: Escape before the fix; the menu stays open.
- menu-375-light-after-after-escape.png: Escape after the fix; menu closed, focus ring on Menu.
- menu-375-light-after-outside-press.png: a press outside closes the menu.
- NOTE.md: why there is no before shot for the outside press.
