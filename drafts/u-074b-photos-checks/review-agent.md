# U-074b part 2, round-4 review

Head: 130c8cdef7c239ee04ba26a14b2fcae308e75e26 (delta b4a7cc0..HEAD, 15 files, +51/-54)

Verdict: PASS

Blocking: none.

Checked
- Tag strings unchanged: tagsFor maps 'experience' to tags.experience(id), the same value both old kinds returned. Every producer (sessions.ts x4, pulse.ts, cancelSession.ts, photos.ts addPhoto) emits the same experienceId; the publishWeek reformat is whitespace only.
- Stale references: grep for kind 'schedule' / 'photos' in src and tests finds none. Remaining 'schedule' hits in pulse.test.ts and pulse.ts are unrelated labels (call-order markers, rate-limit key). 'photos' hits are table names.
- Other lanes' files (sessions.ts, pulse.ts, cancelSession.ts): acceptable and necessary. The kind is a closed union, so the rename cannot compile unless every producer moves with it. Each edit is a one-word literal swap (plus a comment and prettier line breaks); no logic touched. tsc is clean.
- Ingest format check unchanged: allowedContentTypes.public is image/jpeg, image/png, image/webp, so acceptedPhotoFormats is ['jpeg','png','webp'] as before. isAcceptedFormat has one caller (photos.ts:104, `!format || !isAcceptedFormat(format)`), which only needs a boolean; the dropped type predicate narrowed nothing it relied on.
- hosts.ts: idOrLeave(formData,'ownerUserId',hostPath(hostId)) is the same parse and the same redirect target as the removed inline code. parseIdField is still used at hosts.ts:65.
- mebibyte: single definition in storage.ts, imported by photos.ts. Values unchanged (5 MiB, 10 MiB, +1 MiB body limit).
- Barrel: ExperiencePhotos is imported directly by ExperienceEditView and the stories, none through the index. refusedHref is a pure extraction.
- Dropped coverage: the 'exactly the codes that have a notice' test is redundant. photoNotices is `satisfies Record<PhotoNoticeCode, NoticeText>` and PhotoNoticeCode derives from photoNoticeCodes, so a missing notice, or a literal key outside the codes, fails tsc. A key added via the spread cannot differ from the codes, since both come from refusalNotices. The rewritten round-trip test now goes through experiencePageNotice (public), so photoRefusalOf is still covered.
- Run: tsc clean; vitest on photoForm, photos, cacheTags, cancelSession, pulse and server/actions: 16 files, 398 tests pass.

Nits
- photoForm.test.ts: the 'maps %s to no refusal' table lost its null case. experiencePageNotice with no notice is covered by its own describe (line 254 onward), so nothing is lost; no action.
- acceptedPhotoFormats now derives the short name by stripping 'image/'. If a non-image type is ever added to the public list, its entry would not match a decoder format name and would simply be refused. Acceptable; no action.
