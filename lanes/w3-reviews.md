# Lane w3-reviews history

## U-060 round 1 (PR 1024, head 7488736)
Verdicts: review REQUEST_CHANGES, qa FAIL, spec-compliance REQUEST_CHANGES, architecture-audit FAIL, a11y PASS (4 advisories).
Findings (as reported by the previous session):
- Prettier on `review/[reference]/[token]/page.tsx` and `ReviewForm.test.tsx`.
- Seed ran on production-demo (decision: seed only where personas seed).
- B2/B17 duplication: review-invite key prefix, window math in db layer, summary branch in the page, time constants, reference generator.
- PRD-29 "not refunded" not checked.
- e2e malformed-token test `e2e/review.spec.ts:11` fails with no database.
- No-JS submit returns 500 (Origin null from no-referrer policy).
- Form clears input after a failed submit.
- a11y advisories (4).
CI note for the lead: `hosts.spec.ts:14` flaked once, passed on retry (outside lane).
