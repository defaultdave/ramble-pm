PASS

## a11y-audit r2: U-023 "line heights" (head 488d885, round 2 on 66039cb)

### Blocking
- None. The round-1 blocking item is resolved.

### Round-1 item: `.privateLink` margin-block
- `src/components/BookingPanel/BookingPanel.module.css:102` now reads `margin-block: calc((1lh - var(--size-touch-target)) / 2);`.
- `lh` resolves to the element's own used line-height. The same rule sets `line-height: var(--font-line-height-label)` (line 105), which is the unitless ratio 1.4286, so `1lh` equals 1.4286 times this element's own computed font-size. Text-only zoom scales that computed font-size, so the margin tracks the line box. No circularity: margin does not feed font-size.
- A user `line-height` forced with `!important` is also picked up by `1lh`, so the margin still matches the rendered line box.
- Arithmetic against the PM's Chromium numbers: 100 percent gives font 14, line 20, margin (20 - 44) / 2 = -12, which matches. Text-only x2 gives font 28, line 40, margin (40 - 44) / 2 = -2, which matches. The line box equals the text's needed height in both cases.
- The text-only row is still a simulation (font-size doubled on the element), not a Firefox run. That is acceptable here because the calc now depends only on the element's own computed values, so the simulation exercises the same resolution path. Firefox Zoom Text Only remains the best final check if the PM wants it.

### Regression sweep
- `git diff 66039cb..488d885` touches one file (`BookingPanel.module.css`, 1 insertion, 7 deletions). Nothing else changed this round.
- `git diff origin/main...HEAD` still covers the same set of files as round 1, with no new frontend changes in the round-2 commit.
- The other `calc` sites (HomeStates bars, `aria-hidden`) and the token changes are unchanged, so round-1 passes still hold.
- The only other `lh` unit in `src` is this declaration. No new fixed-height text containers were added.

### Non-blocking (new, not in round 1)
- `lh` needs Chrome 109+, Firefox 120+, Safari 16.4+. In a browser without it the whole `margin-block` declaration is dropped, the margin falls back to 0, and the 44 px target stays but sits 12 px lower than designed. This is a layout shift only, not a target-size or text-overlap failure, so it does not block. Consider a `margin-block` fallback declaration before this one if older browsers matter for the demo.

### Files relied on
- `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-023-line-heights/measurements.md` (section "Private-session link (round 2)")
- `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a20fac0d4173e93a8/src/components/BookingPanel/BookingPanel.module.css`

---
<sub>a11y-audit | haiku | read-only</sub>
