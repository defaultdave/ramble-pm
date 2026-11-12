# U-074b review, round 2

Head: 51dba4806ae21cdbb24e58bb053b0bcf6d280896 (branch unit/U-074b)
Delta reviewed: 6bd331b..HEAD (31 files, +473/-384), plus origin/main...HEAD

## Verdict: PASS (size is a pending owner decision, not a blocker)

## Blocking
None.

## Pending owner decision
Size: whole unit is 4713 insertions / 185 deletions across 43 files, over the 1000-line rule. Dave has not accepted it yet. Not a defect the author can fix. REVIEW_OWNER_DECISION=size

## Checks
- Notice codes: hostNoticeCodes/experienceNoticeCodes are the old private lists, now exported; the lists are unchanged. parseNotice keeps the pickKnown behaviour (unknown, repeated, missing give null).
- Redirect hrefs: host noticeHref moved from URLSearchParams to tableHref. Same output for the tested cases (`?notice=updated`, `?notice=invalid&fields=name%2CtimeZone`, empty fields dropped); the slug_taken href test still passes unchanged. Experience hrefs unchanged.
- Field-problem parsing: parseProblemFields now takes the field list; each page passes its own (hostFormFields, experienceFormFields). Order and filtering the same.
- Slug limits: slugFor takes the limit; hosts pass hostLimits.slug, experiences experienceLimits.slug. Same comparison.
- oversizedFields, formText, formHas, parseIdField: bodies identical to the removed copies. Host and experience actions use parseIdField with the same arguments.
- userActor moved to lib/audit.ts, identical.
- Imports: no references remain to HostNotice, ExperienceNotice, parseHostNotice, parseExperienceNotice, experienceNoticeHref, parseHostIdField, parseExperienceIdField. `tsc --noEmit` clean; vitest (src/lib, ActionNotice, HostSetup, ExperienceEditor): 198 files, 6865 tests pass.
- Coverage: removed tests (notice and id parsing, problem fields, href building, Host/ExperienceNotice rendering) are replaced by opsForm.test.ts (formText, formHas, oversizedFields, slugFor incl. 80/81 boundary, parseIdField incl. upper-case, parseNotice, noticeText, parseProblemFields, noticeHref) and ActionNotice.test.tsx (status, alert, null). New tests check that codes and fields match their text maps. Nothing lost. Small gap: no per-form test that slugFor receives the right limit, but the existing host and experience slug-length form tests still pass.
- Scope: changes are limited to the helper extraction and the pages, actions and stories that use it. No out-of-scope files.
- Full diff origin/main...HEAD: no defects found beyond the above; round 1 found none.

## Nits
- src/components/ExperienceEditor/ExperienceEditView.tsx:3-4: `linksOut` import sits between experienceStatusLabels and experienceStatusTones, out of alphabetical order. The `linksOut(status)` helper in experienceEditor.ts is a small unrelated refactor of `status === 'guide_only'`; harmless.
