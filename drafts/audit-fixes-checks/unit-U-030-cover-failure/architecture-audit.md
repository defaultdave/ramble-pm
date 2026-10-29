PASS

## architecture-audit: U-030 "cover failure keeps the page" (head a8908a4)

Rules: /Users/davidfleming/Workspace/ramble/.claude/standards/architecture.md (project), B1 to B17.

### Blocking
None.

### Non-blocking
- B13: src/server/guestCovers.ts:22-25 is a catch in server/** that returns an empty Map. This is the case owner decision H-50 option B covers (2026-10-29, owner-decisions-2026-10-29.md): the catch calls rethrowOrLog (unstable_rethrow first, then logs digest and kind only), then renders. The empty Map is confined to covers: the content reads in HomeContent.tsx and BrowseContent.tsx still sit in the page try and fail closed through rethrowOrLog and the error view, and the tests cover both (failed content read renders the error state and reads no cover; failed cover read renders cards without images; control-flow error passes through). The standards file's B13 row does not yet list this exception; the PM should record H-50 against B13 so the next audit does not re-raise it.
- B4/B6: src/app importing src/server/guestCovers is the allowed direction (app to server). getCoverPhotos reads guest-visible rows only, so the guest-read exemption applies; no Caller or requireRole needed. guestCovers.ts imports only lib, server/coverPhotos and server/monitoring. Clean.
- B2: no rule decided in the shell or helper. Id lookup, cover pick, and Map building stay in src/lib/photoViews (coverLookupIds, coversByExperience); the helper only composes them and chooses log-vs-rethrow, which is error handling, not a domain decision.
- B17: no duplication. getCoverPhotos (src/server/coverPhotos.ts) and coversByExperience (src/lib/photoViews.ts) are reused, not reimplemented, and the diff removes the same two-call sequence from both pages. Only HomeContent and BrowseContent used them (grep of src). A separate guestCovers.ts is a defensible home: coverPhotos.ts is the data-layer read that throws, and the page-facing fail-soft wrapper has a different contract. Folding it into coverPhotos.ts would make the read both throw and swallow. Optional: a short test file src/server/guestCovers.test.ts; the behavior is covered today only through the two content tests.
- Audit item: none new.

### Unconfirmed
- None.
