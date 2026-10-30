Sync of `main` into `integration` before the promotion. `main` has three commits `integration` lacks: PR 273 (one `PageError` for the home and experience error states; it deleted `ExperienceError` and `HomeError`), the architecture.md page module paths line, and PR 275 (U-001 deployment config). PR 273 conflicts with U-040 and U-041 in four experience page files, so this head is the resolved merge (first parent `integration` at `ec8a8ed`, second parent `main` at `5dd63e2`), not `main` itself.

## Resolution
- `src/app/(guest)/experiences/[slugAndId]/page.tsx`: integration's dates and booking slots kept; the error state renders main's `PageError` exactly as on `main`.
- `src/components/ExperiencePage/index.ts`, `ExperiencePage.stories.tsx`, `ExperiencePage.test.tsx`: `ExperienceError` exports, stories and tests removed as PR 273 did; integration's booking stories and slot tests kept.
- No other file referenced `ExperienceError` or `HomeError`; no code beyond the resolution.

## Checks
review, spec-compliance and architecture-audit verified the resolution (nothing lost from either side, the error state matches `main`, no new code or layer import); qa-agent lists the gates on the merged tree: test 6,373, test:db 1,567, build without `DATABASE_URL`, e2e 161, storybook 267, gitleaks clean. Verdicts in `drafts/sync-2026-10-30-checks/` in `ramble-pm`.

`scope-manifest` fails on a resolved sync head by design; merge with your bypass and `--merge` (not squash), so `main`'s ancestry stays in `integration`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
