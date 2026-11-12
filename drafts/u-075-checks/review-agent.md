# U-075 review agent, round 2

Head: ec7cddcd2c8bbbeb3504a8a5e88d713e87caf3b3 (branch unit/U-075)

Verdict: PASS

Blocking: none.

Nits: none.

Checked
- Reject without a reason: parseRejectDecision returns null when the reason is unknown, blank or non-string, and the action still passes null to decide(). Same behaviour as before; tests cover the table.
- Alt text: hasPhotoDescription is the old inline predicate (decorative, or trimmed non-empty alt, null counts as blank). Decorative, blank, whitespace and null cases are pinned against NewPhotoSchema in photos.test.ts.
- Photo numbering: the decision query uses coverOrder (position asc) with limit maxPerExperience, the same order and limit as galleryWith, which the page reads. New DB test pins [1, 4] against readExperienceForOps with out-of-order positions.
- Notice text: noticeText returns null for null, else the table entry; alt_missing with photo numbers still gets the specific danger title. Unchanged.
- rejectionReasonOptions via labelledOptions yields the same {value,label} list, in order (test added).
- reviewListingFacts moved verbatim; tests added incl. a zero price. No stale imports; no remaining references to parseRejectionReason or listingFacts outside the lib.
- No import cycle (experienceEditor, photos, opsForm, money do not import experienceReview).
- tsc clean; eslint clean; experienceReview and photos unit tests pass (137). The DB test was not run here (needs a database); read by eye, it is consistent.
- No scope creep in the round-2 delta; coverOrder export is the only change outside the unit's files and it is needed.

Size: whole unit over 1000 lines, left to Dave as an owner decision, not failed.
