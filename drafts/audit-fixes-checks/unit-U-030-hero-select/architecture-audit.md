PASS

## architecture-audit: U-030 "hero select" (head 99ac78f)

Rules: `/Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md` (project, B1 to B17). Verdict format: `ramble-pm/drafts/wave3-review-rules.md`.
Files audited: `src/components/HomeModules/HomeHero.module.css`, `src/components/HomeStates/HomeStates.module.css`.
Scope: in scope (`**/*.module.css`, B16). Other B rules checked against the diff: no TSX, data, or lib change, so B1 to B15 are N/A.

### Blocking
- None.

### Non-blocking
- `src/components/HomeModules/HomeHero.module.css:138` and `src/components/HomeStates/HomeStates.module.css:335`: B16 (literal breakpoints). The literal `736px` is correct. A container-query length cannot read a custom property, and B16's text lists colour, spacing, radius, and font-size literals, not breakpoints. The existing ruling is in `docs/design/design-system-plan.md:47` in the ramble repo: "Breakpoints themselves are not tokens, because CSS media queries can't read custom properties." Owner decision H-70 (2026-10-29) also left B16's literal list unchanged. Existing `@media (min-width: 768px)` literals in about 15 module files already pass audits. No change needed.
- `src/components/HomeModules/HomeHero.module.css:134-137`: the comment derives 736 (2 x 230 + 218 + 2 x 12 + 34 = 736). The arithmetic checks out. The comment states a why, names no ticket, and is within CLAUDE.md's comment rule.
- Audit item (existing duplication, not new, not blocking): B17 threshold written in two places, hero (`HomeHero.module.css:138`) and skeleton (`HomeStates.module.css:335`). Before this diff both held `640px`, so the duplication predates it. This diff changes both values in lockstep and adds no third copy. Already tracked as H-78 in `ramble-pm/audits/home-2026-10-28.md` ("skeleton layout rules copy blocks from HomeHero and HomeModules CSS; `composes` would remove the drift risk"). Components-6 in `ramble-pm/drafts/lib-layout-refactor.md:730` plans to have skeleton rules compose the hero's CSS, which would remove this copy. Suggest the PM log the 640 to 736 mirror as a note on H-78 rather than a new item. The 2026-10-28 PM ruling already requires the skeleton to mirror the hero's container query on the same wrapper, so this stays the intended pattern until Components-6 lands.
- Not an architecture issue, for the visual check: N1029-2 asks for sweep widths 700, 720, 1152, 1180, 1200, and 1247 px. The threshold change is what fixes it, but the CSS does not prove the 736 choice at those widths. Left to qa and the visual check.

### Unconfirmed
- None.

---
<sub>architecture-audit | haiku | read-only</sub>
