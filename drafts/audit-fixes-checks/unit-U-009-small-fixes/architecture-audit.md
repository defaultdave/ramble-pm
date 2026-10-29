PASS

## architecture-audit: U-009 "small-fixes" (head f6c447d)

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project, B1 to B17; A1 to A6 advisory)
Diff: `git diff origin/main...HEAD` in `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a8d7382b1561b11f5` (4 files, 9 insertions, 2 deletions)

### Blocking
- None.

Checked:
- B4 (import direction): the three layouts add one side-effect CSS import (`@/styles/base.css`) each. A stylesheet is not a layer, `src/app` may import any layer, and no new cross-layer import appears.
- B8 (`'use client'`): none added.
- B14, B16: no cache function or styling change in scope. `base.css` is not edited in this diff.
- B7: the `TODO(U-040): first caller` on `spacesLeft` carries the required form. `U-040` is `status: todo` in `docs/plan/units.yaml` (line 974 onward), so the TODO names a unit not yet built. No `src/` importer of `cacheProfiles` exists outside `cacheProfiles.test.ts`. `src/lib` is not a component or data-layer path, so B7 does not reach this file in any case.
- B13, B12, B2, B17: no new logic, catch, money, time, or decision code.
- Comments: the only ticket reference added is the `TODO(U-040)` line. The rewritten `revalidate` comment states a non-obvious why (the in-memory `'use cache'` handler drops the entry rather than serving it stale), consistent with the spike at `docs/adr/research/u-008a-u-009-cache-components-spike.md` (line 45).

Global CSS placement (question from the brief):
- Per-group import is the pattern the repo already uses and the one the spike requires. The spike (line 31) says the dynamic route trees "live in their own route group with their own root layout so the nonce read never touches the shared layout." Each group renders its own `<html>`. No shared `src/app/layout.tsx` exists, so there is no shared root layout to move the import into without restructuring the groups. `(guest)/layout.tsx` and `src/app/global-error.tsx` already import `base.css` the same way.
- A CSS import does not read the nonce, so it does not interact with the nonce CSP read.
- ADR 0005 (line 24) describes "one global stylesheet" from the token build. The import of `base.css` and `tokens.css` per group still yields one stylesheet set per group, as in the guest group.

### Advisory
- `src/styles/base.css:1`: the header comment still reads "Page-level defaults for the guest pages". The file now also loads on checkout, host, and ops. Update the comment to name all four groups, or drop the group name. This is a comment-accuracy note, not a rule breach.
- `src/lib/cacheProfiles.ts` (`browse` comment): "home's 'On this week'" names a call site, which will drift as call sites change. A comment should state the why, not a caller. Non-blocking.
- `src/lib/cacheProfiles.ts` (`TODO(U-040)`): B7 does not apply to a `src/lib` file, so the `first caller` form is optional here. Keeping it is harmless and matches the rest of the repo's convention.

Unconfirmed:
- The design doc (`docs/plan/01-design-doc.md`) has no explicit sentence permitting or forbidding global CSS in route-group layouts. The permission rests on the spike and on the existing guest and global-error precedent, not on a written rule.

---
<sub>architecture-audit | haiku | read-only</sub>

ARCH_VERDICT=PASS
ARCH_SHORTCIRCUIT=0
ARCH_BLOCKING_COUNT=0
