PASS

## spec-compliance: U-009 "small-fixes" (head f6c447d)

### Blocking
- None.

### Non-blocking
- evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-before-with-pr240.png: the file name says the "before" capture was taken with PR 240 applied, so the before and after may differ by more than this unit. The PM should confirm the before shot is from a tree without this diff's change and the PR 240 change, or relabel it. Not an AC failure.
- evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-after.png: the footer "Ramble" text is clipped at the bottom-left edge in the after shot. Visual defect outside these ACs, for qa or the H-64 and H-80 items to judge.

### Unconfirmed
- None.

### Acceptance criteria
1. H-73 (base.css import, same order as guest): PASS. `src/app/(checkout)/layout.tsx:4` `import '@/styles/base.css';` then `:5` `import '@/styles/tokens.css';`. `src/app/(host)/layout.tsx:4-5` and `src/app/(ops)/layout.tsx:4-5` match. The guest layout is `base.css` at line 6, then `tokens.css` at line 7 (`src/app/(guest)/layout.tsx`).
2. H-35 (revalidate comment): PASS. `src/lib/cacheProfiles.ts:4-7` now reads "Seconds after which the server treats the entry as out of date. Next's in-memory 'use cache' handler drops it here rather than serving it stale". No "served stale after revalidate" wording remains.
3. H-55 (browse comment, no rename): PASS. `src/lib/cacheProfiles.ts:25` "Short-lived schedule reads: browse results for one filter combination, and home's 'On this week'". The key `browse:` is still at `:26`.
4. H-56 (TODO on spacesLeft): PASS. `src/lib/cacheProfiles.ts:29` `// TODO(U-040): first caller`, directly above the `spacesLeft` doc comment at `:30` and profile at `:31`. U-040 is "Upcoming dates and spaces left" in `docs/plan/units.yaml:974`, and it is not built: no `src` code uses the `spacesLeft` profile (grep finds only the TimeSlot `spacesLeft` prop). STATUS.md lists U-040 as wave 4 of the e2e-money lane, not yet built.
5. No profile value changes; only four files: PASS. `git diff origin/main...HEAD --stat` lists exactly the four files. In the `cacheProfiles.ts` diff, every changed line is a comment; no `stale`, `revalidate`, or `expire` value changed.
6. H-73 evidence in `evidence/pr/unit-U-009-small-fixes/`: PASS. Both `ops-mailbox-390-dark-before-with-pr240.png` and `ops-mailbox-390-dark-after.png` exist. The before shot shows near-invisible cream heading text on a white canvas. The after shot shows light text on a dark canvas, so the `color-scheme` change is visible. The capture covers only the ops layout; the AC asks only for a dark-mode before and after pair.

### Evidence
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-before-with-pr240.png: ops "Dev mailbox" at 390 px in dark mode before the change. Light text on a white canvas, heading nearly invisible.
- /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-small-fixes/ops-mailbox-390-dark-after.png: same page after the change. Dark canvas, light text. Footer "Ramble" text clipped at the bottom-left.

---
spec-compliance | haiku | read-only
