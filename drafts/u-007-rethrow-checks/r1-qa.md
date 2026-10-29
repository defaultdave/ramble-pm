PASS

## qa-agent: U-007 "page catch blocks log the error kind through rethrowOrLog" (head caa7545)

### Blocking
None.

### Non-blocking
- BrowseContent.test.tsx has no control-flow case of its own (home, banner and route each have one). With the rethrow removed from `rethrowOrLog`, four builder tests failed (the helper's, HomeContent, GuestBanner, the experience route); the browse page alone would not have caught it. A one-case add would close that.
- "Only the digest" titles and docs now read "digest and kind". `src/lib/errorDigest.ts:3-4` stays a suggestion for a later lib PR.
- A non-Error throw, including an object with a `name` property, logs `kind: 'unknown'`; stricter than the spec's literal `error.name`, a deviation in the safe direction.

### Unconfirmed
- e2e not run (needs a server and database this scratch tree had no setup for). No visible UI; the page tests cover the error views.
- `pnpm storybook:test` not run (no component files changed).

### Proof (throwaway tests in a scratch worktree, removed; builder's tree untouched)
53 tests, all pass.
- (a) Log shape at all five sites (HomeContent, GuestBanner, BrowseContent, ExperienceRoute, generateMetadata): one call each with the expected message, and the object has exactly `digest` and `kind` (`toStrictEqual` plus a key list). Error with no digest `{ undefined, 'Error' }`; digest '123' `{ '123', 'Error' }`; RangeError digest '9' `{ '9', 'RangeError' }`; numeric digest 42 `{ undefined, 'Error' }`; a string, null, and `{ name: 'Sneaky', message, digest }` all `{ undefined, 'unknown' }`. The serialised calls never contained the secret message text.
- (b) Rethrow at all five sites: `notFound()`, `redirect()` and a real `DynamicServerError` rethrown as the same object; logger not called. For browse, thrown from the first read, so the pass-through through `readOrRefuse` is proved too.
- (c) Real redaction: each logged object through `redact` from `src/lib/redact.ts`; `kind` and `digest` unchanged, no `[redacted]`.
- (d) Browse reads throw `CachedReadError` with exactly `Browse read failed: Error`, `Browse dates read failed: Error`, `Filter options read failed: Error`, with no original message or cause.
- `pnpm test`: 170 files, 3750 tests pass. `tsc --noEmit` and eslint on src/server and src/app clean.

### Mutation checks on `rethrowOrLog` (each reverted)
Log before rethrow: 19 of the check's tests and 4 builder tests fail. Rename `kind` to `name`: 51 fail. Drop `errorDigest`: 39 fail. Remove the rethrow: the 4 builder tests above fail.

### Sweeps
`unstable_rethrow` now appears only in `readOrRefuse.ts`, `remote.ts`, `rethrowOrLog.ts`. Only `digest` and `kind` leave a page catch; browse errors carry only the read name and kind. Scope: the 15 manifest files.

### Evidence
None needed (no UI change); the proof is the test output above.
