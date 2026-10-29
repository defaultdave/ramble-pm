PASS

## spec-compliance: U-030 "Cover read failure" (head a8908a4)

Acceptance criteria are owner decision H-50 (drafts/owner-decisions-2026-10-29.md, "Effect" line). All seven are met.

### Blocking
- None.

### Non-blocking
- Criterion-by-criterion evidence (worktree `/Users/davidfleming/Workspace/ramble/.claude/worktrees/agent-a7fbb06c25b4f9bee`):
  1. PASS. Home reads covers after the content reads, through `readGuestCovers` in its own try: `src/app/(guest)/HomeContent.tsx:27-30`; the content `Promise.all` is `:21-25`. Browse: `src/app/(guest)/new-york/browse/BrowseContent.tsx:43-46`, content reads `:38-42`. Shared helper with the try: `src/server/guestCovers.ts:14-25`.
  2. PASS. Failed cover read logs through `rethrowOrLog` with the cover message, which logs only `digest` and `kind` (`src/server/monitoring/rethrowOrLog.ts:13-18`), and returns `new Map()` so cards render with no image (`src/server/guestCovers.ts:23-24`). Tests: `HomeContent.test.tsx:210-227`, `BrowseContent.test.tsx:106-123`.
  3. PASS. Content failure still reaches the error view and never reaches the cover read, since covers are read after the content `await` inside the same try: `HomeContent.tsx:32-34`, `BrowseContent.tsx:48-55`. Tests: `HomeContent.test.tsx:81`, `BrowseContent.test.tsx:136-149` (asserts `server.covers` not called).
  4. PASS. `rethrowOrLog` calls `unstable_rethrow` first (`src/server/monitoring/rethrowOrLog.ts:14`), and the helper's catch goes through it, so a Next control-flow error from the cover read propagates out of `readGuestCovers`.
  5. PASS. Per page, cards-without-images test, content-failure test, and control-flow test exist: `HomeContent.test.tsx:210`, `:229`; `BrowseContent.test.tsx:106`, `:125`, `:136`.
  6. PASS. Not in the diff: `src/server/cache/readOrRefuse` (and its callers in `home.ts`, `browse.ts`, `coverPhotos.ts`), the cover query in `src/server/coverPhotos.ts`, and `src/lib/*`. `git diff origin/main...HEAD` touches none of them. The BE-5 zone check in `BrowseContent.tsx` is not modified.
  7. PASS. Changed files are exactly `HomeContent.tsx`, `HomeContent.test.tsx`, `BrowseContent.tsx`, `BrowseContent.test.tsx`, and one new shared helper `src/server/guestCovers.ts`. Five files, 94 insertions, 17 deletions.

Verification: read the diff and the source at the head commit. Tests were not run (read-only check).

### Unconfirmed
- None.

---
<sub>spec-compliance | haiku | read-only</sub>
