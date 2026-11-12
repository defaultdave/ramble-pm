REQUEST_CHANGES (1 blocking, final round) at head b4a7cc0e040667b21e6cfc31af4b1b4fc65f4bcc

Previous four blockers (idOrLeave, acceptedPhotoTypes, fieldsFromIssues mapper, pickKnown): all PASS. B1-B17 pass except B17.

Blocking (B17): src/lib/cacheTags.ts:43 and :66, the new `photos` change kind duplicates the `schedule` kind (same payload, same tag). Fix: rename `schedule` to `experience`, touching src/server/db/sessions.ts (:136, :401, :518, :582, :674) and photos.ts:253; delete `photos`.

Advisory (A1-A16): A1 hosts.ts:76-77 inline copy of idOrLeave (pre-existing); A2 invalid-notice copy repeated in photoForm/experienceEditor/hostSetup; A3 photoAltSummary vs photoViews alt decision; A4 galleryWith vs listGuestPhotos order and cap; A5 parsePhotoForm skeleton vs parseFields; A6 mebibyte constant in storage.ts vs photos.ts; A7 acceptedPhotoFormats vs allowedContentTypes.public; A8 tag-visibility branch in data layer (precedent experienceEditor.ts:324); A9 PhotoFormResult input typed unknown; A10 exports used only by tests (photoNoticeCodes, photoRefusalOf); A11 unused barrel re-export of ExperiencePhotos; A12 repeated refusal redirect in experiencePhotos.ts; A13 leave; A14 keep per module; A15 pre-existing issue-to-field loops elsewhere; A16 test helper repeats.

Known accepted debt from part 1: CheckField vs Checkbox, .problem/.muted, .pair media query, .legend CSS.
(The audit agent could not write this file; the lead-session PM recorded its report here.)
