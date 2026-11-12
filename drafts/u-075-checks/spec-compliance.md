PASS

# Spec compliance: U-075 (issue 93), branch unit/U-075, head 5ab07c3707faa1fdf03d4be12a4a69e1ab8d10c7

Scope read from docs/plan/units.yaml (U-075) and the replan lite cut in ramble-pm drafts/mvp-replan-2026-11-10.md section 2. The issue has no checkboxes; its scope manifest mirrors units.yaml. Static read only, no tests run.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Approval queue lists experiences in review | PASS | `src/app/(ops)/ops/review/page.tsx:25-31` (status `in_review`); `src/components/ExperienceReview/ReviewQueue.tsx` |
| 2 | Approve takes an experience to live | PASS | `src/lib/experienceReview.ts` `decisionStatuses.approve = 'live'`; `src/server/db/experienceReview.ts:45-47` |
| 3 | Reject (lite-cut reading of "approve/reject to live") sends back to draft | PASS (judgment) | `decisionStatuses.reject = 'draft'`, `src/lib/experienceReview.ts`; reason is a fixed code (photos, description, prices, other) in the audit row `src/lib/experienceAudit.ts` `experienceRejectedEntry`. See deviation note A |
| 4 | Only an experience in review is decided | PASS | `src/lib/experienceReview.ts` `reviewRefusal` returns `not_in_review`; `src/server/db/experienceReview.ts:37` |
| 5 | Photo alt-text check: approval needs alt text or decorative on every photo | PASS | `src/lib/experienceReview.ts` `photosNeedingAlt`, `reviewRefusal`; enforced server-side inside the locked transaction in `src/server/db/experienceReview.ts:31-41` |
| 6 | Refused approval names the photos | PASS | `reviewRefusal` returns `photoNumbers`; `src/server/actions/experienceReview.ts` redirects with `alt_missing` and fields; `src/lib/experienceReview.ts` `altNeededText` |
| 7 | Approval invalidates the experience and guide tags | PASS | `src/server/db/experienceReview.ts:56-61` returns `listingChanges(...)`; `src/lib/experienceEditor.ts:543-559` builds `kind: 'listing'`; `src/lib/cacheTags.ts` `listing` case returns `tags.experience(id)` and `tags.guideEntry(id)`; invalidated after commit at `src/server/db/experienceReview.ts:65`. See deviation note B |
| 8 | Rejection invalidates nothing (not live, so no guest saw it) | PASS | `src/server/db/experienceReview.ts:49-53` returns `changes: []` |
| 9 | Decision and audit row share one transaction | PASS | `src/server/db/experienceReview.ts:31-53`, `writeAudit` inside `db.transaction`; approval row `experienceApprovedEntry` |
| 10 | Tax treatment dropped from the review | PASS | no tax reference in review files (grep: 0 hits across `src/lib/experienceReview.ts`, `src/server/db/experienceReview.ts`, `src/server/actions`) |
| 11 | Guide-only clearing (link-out and affiliate URLs) dropped | PASS | no `linkOutUrl` / `affiliateUrl` writes in the review files (grep: 0 hits) |
| 12 | Content-rights gate dropped | PASS | no rights check in review files (grep: 0 hits) |
| 13 | Routes and states added as U-100 axe matrix rows | PASS by rule, flag | No axe matrix exists in the repo; U-100 has not landed. The units.yaml rule is that whichever of U-075 and U-100 lands second adds the rows, so U-075 is correctly not required to add them. Dave should confirm U-100 picks up `/ops/review` and `/ops/review/[id]` |
| 14 | Seed publishes a current host-agreement (builder's first commit e7d8ffa) | PASS | `src/lib/seed/fixtures/legal.ts:34-42` (doc `host-agreement`); `src/server/db/seed/run.ts:153-175` `writeLegal` creates a draft and calls `publishLegalDocument`; `src/lib/seed/decide.ts:62-73` `legalSeedStep` returns `create_and_publish` when none is published; new assertion `tests/db/seed.db.test.ts:529-531` expects `getCurrentLegalDocument('host-agreement').version` to be 1. No seed code changed |
| 15 | Ops nav links the queue | PASS (extra, small) | `src/lib/opsNav.ts:30-33` |
| 16 | Meta ACs (review verdict, QA verdict) | N/A | not code-verifiable |

## Deviation notes for the lead

- **A. Reject to draft with a fixed reason code.** Within the lite cut. The audit log refuses sentences and `experiences` has no reason column, so the code is the only place a reason can live without a migration. Reject leaves the listing in draft, which is the only sensible destination for something never live. Not a missing requirement.
- **B. `listing` change kind instead of `experience`.** Within scope. The `listing` kind covers `experience:<id>` and `guideEntry:<id>`, plus catalog, neighborhood and category tags, which the units.yaml line requires. `experience` alone would miss the guide tag.
- **C. Approval not gated on photo count.** Within scope. units.yaml asks for alt-text checks, not a minimum photo count.
- **D. Nothing moves an experience into `in_review` yet.** Within the replan. Host submission is NEW-6, and the queue is seed-populated (`src/lib/seed/scale.ts:381` seeds one `in_review`). Not a U-075 gap, but the queue is empty in a real flow until NEW-6 lands.
- **E. Approve always offered, refused server-side with the photo names.** Within scope. The page names the photos ahead of time, and the server is the gate.

## Blocking issues

None found for U-075.

## Not verified

- Tests were not run. The seed assertion (criterion 14) depends on a fresh seed producing version 1 for host-agreement, which the static read supports but I did not execute.
- Criterion 13 depends on U-100 landing later and adding the rows.
