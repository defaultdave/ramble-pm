# Draft: ADR 0010 amendment, one merge lane

**Status:** draft, 2026-10-23. Not decided. Apply after PRs 162 to 165 land (Dave, 2026-10-23: "draft for after").
**Proposed by:** Dave. **Drafted by:** PM.

## Change

Every unit, standard or critical, merges into `integration`. Dave promotes `integration` to `main` in one reviewed batch (weekly by default), as ADR 0010 already does for critical units. `main` is touched only by promotions, sync-free, and by Dave's hotfixes with bypass.

## Why

- The tier decides where a PR merges, so a wrong base fails `scope-manifest` (PR 162 and 164 on 2026-10-23, both opened against `main` by mistake).
- Two lanes need a sync PR (`main` into `integration`) after every promotion and whenever critical work needs standard units. PR 165 brought in 17 commits and needs four checks and a bypass merge.
- Production is already gated by Dave's manual `vercel promote` (ADR 0007, U-103), so landing standard units on `main` early buys little.

## What stays the same

- Tier still sets how Dave reads: critical PRs are read in the promotion batch; standard PRs rely on the agent checks. The promotion PR lists each merged PR with its tier so he can read only the critical ones.
- The four required agent checks, the approval window, the nightly smoke, and the revert path.
- Production promotion, deploys, rulesets, the App, and secrets stay Dave's.

## Costs

- Standard changes reach `main` (and a staged production build) only at the weekly promotion.
- A promotion batch holds every merged unit, so Dave's weekly read grows unless he reads only the critical PRs.
- A hotfix that cannot wait for a promotion goes to `main` with bypass, then `integration` must absorb it (one sync, only in that case).

## Edits this needs (all in protected paths: Dave merges)

| File | Edit |
|---|---|
| `docs/adr/0010-agent-workflow.md` | Replace the two-tier "Merge rule" bullets with this one lane; keep the tier as the reading rule. Dated amendment line in Status. |
| `scripts/merge-desk/scope-check.ts` | Rule 5: every unit PR must target `integration`. Delete the standard-into-`main` branch. Keep the "carries integration commits" guard. Update `scope-check.test.ts`. |
| `scripts/merge-desk/agent-git.ts` | `isSync` and `automerge` method stay; no change expected. |
| `docs/plan/merge-desk-runbook.md` | Sections on tiers, sync, and promotion: one lane. |
| `CLAUDE.md`, `.claude/agents/ramble-pm.md` | The sentence "Standard-tier units merge to `main` and critical-tier units to `integration`" becomes "Units merge to `integration`". |
| Rulesets on `main` and `integration` | Dave's: `main` takes only promotion PRs. Check the required-check lists still match. |
| `docs/plan/delta-log.md` (in `ramble-pm`) | One line: a departure from the frozen plan's merge rule. |

## Open questions for Dave

1. Hotfix path: bypass merge to `main` plus a sync, or a normal unit PR into `integration` and an out-of-cycle promotion?
2. Promotion cadence: weekly stays, or promote whenever `integration` holds a finished milestone?
3. Does the nightly smoke run on `integration` only now (it runs on both today)?

## Also found on 2026-10-23

`scope-check.ts` rule 2 fails any sync branch with commits that are not on main, so a sync that needs a conflict-resolution merge commit (PR 166) can never pass `scope-manifest` and needs Dave's bypass. With one lane there are no syncs; if the two lanes stay, the rule needs a carve-out.
