PASS (gaps named: no browser, no signed-in rendering, no Postgres so DB tests not run, no real cache invalidation, no page-level tests for the two route files)

# QA U-075, ops review queue and approval (code and test trace, not a browser session)

Head 5ab07c3707faa1fdf03d4be12a4a69e1ab8d10c7. `bunx vitest run --project unit --project components`: 440 files, 9903 tests, all pass.

| Flow | Traced through | Covered by |
|---|---|---|
| Non-ops visitor sees refusal | both pages return OpsAccessDenied when `holdsOpsRole` is false; actions use `opsCallerOrLeave` and redirect to the queue | actions test: admin and nobody redirect, nothing decided; DB test: ForbiddenError, status and audit unchanged. Page branch itself untested |
| Empty queue | `ReviewQueue` DataTable empty state "Nothing is waiting for review" | components test "says so when nothing is waiting" |
| Queue with paging | `readExperiencesForOps` status in_review, cursor from query, links per page | components tests: links to review page, "pages by link" |
| Open an experience | `[id]` page: parseIdField, `readExperienceForOps`, `notFound()` on null | view tests for host, listing, editor link. notFound branch untested at page level |
| Missing alt text named before approval | `photosNeedingAlt` drives a warning Alert naming "photo N" | view test "names the photos with no alt text"; lib tests |
| Approve: live, tags invalidated, audit row, notice | `decideExperienceReview` in one locked transaction: status update, `experience.approved` audit, `listingChanges` tags after commit; action redirects to `/ops/review?notice=approved`; notice "Experience approved. It is live." | DB test (not run here), action test, lib audit test |
| Approval refused server-side | `reviewRefusal` returns alt_missing with photo numbers; action redirects with the numbers in `fields`; page parses them via `photoNumberFields` into a danger notice | lib tests, action test "naming the photos", DB test (refuses, changes nothing, rejection still allowed) |
| Reject with reason code to draft | `parseRejectionReason` from a fixed list; no reason gives a `no_reason` notice and no write; audit has code only; no tag invalidation | action test, DB test, lib tests |
| Not in review: notice, no forms | view shows info Alert and omits the Decision section; server returns not_in_review for draft, live, paused | view test and DB test for draft, live and paused. Notice text covered by lib notice map |
| Stale double submit / concurrent approvals | `SELECT ... FOR UPDATE` then status check inside the transaction, so the second sees live and gets not_in_review | DB test "lets one of two approvals at once win, one audit row" (not run here) |
| Unknown id | bad or absent id gives `notFound()` on the page; action gives not_found and redirects to the queue | DB test (random UUID, "not-an-id"), action test |
| Nav link | `Review queue` added to `opsNavLinks` | opsNav test updated and passing |

Accessibility from the code: forms are plain server-action forms, so they work with no script and by keyboard. The reason field is a labelled Select ("Reason for sending it back") with `required` and a placeholder. The approve and reject controls are real submit buttons. Sections use `aria-labelledby` headings. The queue table has a caption, and notices go through ActionNotice and Alert. One observation, not a failure: the Select's `required` is only a browser check, and the server handles an empty reason with the `no_reason` notice, which is tested at the action level.

## Gaps I could not exercise
- No browser: visual layout, focus order and screen reader output were not seen.
- Signed-in rendering: `readOpsCaller` and the real session were not run. Pages were read, not rendered.
- Database: `tests/db/*` (review, authz matrix, seed) need Postgres and were not run, so locking, the audit row and the concurrency result are read from the code and test source only.
- Real cache invalidation: `updateTagsForChanges` is mocked in tests. That the right tags are busted on a deployed build is unverified.
- Route files `ops/review/page.tsx` and `ops/review/[id]/page.tsx` have no page-level tests (access denied, notFound, notice wiring); that logic is checked only by reading it.

QA_VERDICT=PASS
