PASS

## architecture-audit: U-005 "Jobs outbox, drain route, and the pulse" (round 4, merge head 68b178f)

Focused re-check of the merge of `integration` (`820c38d`, PR 222) into round 3's head `50b1116`. Rules B1 to B16 and A1 to A6 of `.claude/standards/architecture.md` at the merge commit.

Merge check: `diff 50b1116 68b178f` equals `diff 4714de3 820c38d`, and `diff 820c38d 68b178f` equals `diff 4714de3 50b1116` (md5 of each diff compared). The merge is exactly the union of both sides; nothing lost or altered.

### Blocking
- None. PR 222 touches no jobs, drain, pulse, heartbeat, `src/lib/jobs.ts`, schema, or env file, so round 3's results stand. Its only `src/app` change is a `@/styles/forced-colors.css` import in four group layouts, with no effect on `/api/pulse`.

### Non-blocking
- `Button.tsx` as a client island (B8) and the forced-colors literals (B16) came unchanged from `integration`; both are covered by the owner's rulings (DECISIONS 2026-10-28, standards text in PR 229 on `main`). Not U-005's change.
- Round 3 audit items stand: the repeated `error instanceof Error ? error.name : …` pattern, `declaredLengthExceeds` in the email module, stale `TODO(U-005)` markers elsewhere.

### Unconfirmed
- As round 3: `run_after` and `created_at` default to `clock_timestamp()`, so a job a handler enqueues during an `asOf` run gets real time (latent until U-054).
