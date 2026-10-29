PASS

## review-agent: U-030 "Cover failure renders cards without images" (head a8908a4)

### Blocking
None.

### Non-blocking
- src/server/guestCovers.ts has no test file of its own. Its behavior (log under the given message, empty Map, control-flow pass-through) is proven through the HomeContent and BrowseContent tests, which mock getCoverPhotos. Acceptable at two callers; a small direct test would pin the contract if a third caller appears.
- The remaining comment in the diff is a why-comment (photo is decoration); none names a ticket. Fine.

### Unconfirmed
- None.

### Findings by the brief's questions
1. Empty Map only for covers: readGuestCovers is called only for covers (getCoverPhotos). Content reads still go through the outer try and rethrowOrLog then HomeError / the Browse error view. Owner decision H-50 option B covers it. The catch logs kind and digest, then returns, so it is not an empty catch.
2. Order and placement: the cover read runs after the Promise.all content reads inside the same try, so a content failure throws before readGuestCovers is reached. The new Browse test "failed content read ... reading no cover" asserts server.covers not called. Home content failure behavior is unchanged.
3. Logs: rethrowOrLog logs only { digest, kind }. Tests assert the exact call and that /secret|Failed query/ is absent. The message is distinct ("... covers could not be read") so cover failures are separable from content failures.
4. Control flow: unstable_rethrow in rethrowOrLog runs before the log; the new tests make getCoverPhotos call notFound() and assert the NEXT_HTTP_ERROR_FALLBACK digest propagates through the outer catch (which rethrows again) and logError is not called. Both pages covered.
5. Failure paths: both pages test cover failure (cards render, no alert, no img, filters still present on Browse) and control-flow; Browse adds the content-failure case. The live-region test was correctly repointed to a content failure.
6. Duplication: getCoverPhotos, coverLookupIds, coversByExperience are only used by these two pages (grep of src); the helper composes them rather than reimplementing. The same sequence was previously copied in both pages, so one shared helper is what the manifest allows ("a shared helper only if both pages need it"). src/server is the right layer (server-only, wraps a server read and the logger). No existing cover helper to extend.
7. Scope: 5 files, all IN SCOPE (two pages, two tests, one shared helper). readOrRefuse, data layer, BE-5, cover query, H-37 untouched. Defect classes: no unbounded work added; no DB/Zod change; fail-open limited to the owner-approved cover case; no raw errors to logs.

### Gates
`pnpm test` in the worktree: 170 files, 3744 tests passed. (PM reports storybook, e2e, build, gitleaks green on a8908a4; not re-run.)

### Evidence
None relied on by this check (static review plus unit run).
