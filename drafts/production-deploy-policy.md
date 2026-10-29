# Production deploys: one per merge, or one per promotion (decision for Dave, draft 2026-10-29)

## Problem
Vercel Hobby allows 100 deployments a day (rolling 24 h). In the last 24 h: 45 production builds (every merge to `main`) and 128 preview builds. The cap blocked a needed production redeploy (`api-deployments-free-per-day`, 402).

## The preview half
Unit `U-001` (branch `unit/U-001-preview-skip`) skips preview builds that cannot change what a preview shows. Draft in review; its PR carries a measured estimate. It does not touch production.

## The production half (this note; Vercel setting, so Dave's)
Production currently builds on every push to `main`, which tiered auto-merge makes about 45 a day.

| Option | What changes | Builds a day | Cost |
|---|---|---|---|
| A. Production Branch becomes `production` | Vercel: Project Settings, Git, Production Branch = `production`. `main` then deploys as an ordinary preview (skippable by the U-001 rule when it only changes tests or docs). Dave (or the PM with his go) fast-forwards `production` from `main` when he wants the demo refreshed: `git push origin main:production` | 1 to 3 | The demo lags `main` by design. A new branch needs a ruleset decision (Dave). |
| B. Keep `main`, accept the cap | Nothing | 45+ | Redeploys blocked on busy days. |
| C. Upgrade to Pro | Plan change | no practical limit | Monthly spend per seat. |

Recommendation: A, plus the U-001 rule. Together they should keep a heavy day well under 100, but that is an estimate until U-001's dry run is in.

## Checks before choosing A (assumptions, verify in Vercel's docs)
- The Production Branch setting accepts any branch name and moves the production domain with it.
- Env vars scoped to Production still apply to builds of `production`; Preview-scoped ones apply to `main` previews. The Blob and database variables are set on both, so the demo keeps working. The `db-migrate-production` workflow and `DATABASE_URL` for Production are unchanged.
- `main` previews use Preview database branches (Neon), which expire after 7 days; nothing should depend on a `main` preview staying up.
- Nothing in `.github/` triggers on Vercel's production status. The PM has not checked.

Decision log entry to add when chosen: `DECISIONS.md`, owner, date, option.
