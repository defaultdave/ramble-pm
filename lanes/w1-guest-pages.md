# Lane w1-guest-pages (history)

2026-11-10 (PM w1-guest-pages). Claimed at 10:30, ran W1-B from `drafts/mvp-replan-2026-11-10.md`: U-037, U-036, U-038. Five PRs, each through overlap check, `senior` builder in a worktree, an independent reviewer (four verdicts, mutation sample), `post-check.ts`, review requested, auto-merge: 912 (U-037), 917 (U-036), 918 (U-038 legal render), 923 (help and accessibility), 924 (contact form, migration 0027, generic ops-notice). Detail, lessons and follow-ups are in the lane entry in STATUS.md.


## Moved from STATUS.md 2026-11-11
### Next chat: w1-guest-pages

**Before you start:** nothing; the lane is done. **Run:** none needed unless Dave wants the follow-ups; they fit a `maint` chat or W2-D (U-043 starts from the `ops-notice` job kind, `/ramble-pm lane: w2-guest-extras`). **Model and effort:** Sonnet, medium. **Prompt:** Lane `w1-guest-pages` is closed (units U-036, U-037, U-038 merged, PRs 912, 917, 918, 923, 924). Pick up only the follow-ups in the lane entry in `STATUS.md` that Dave asks for, first splitting `tests/db/seed.db.test.ts` and restoring its `help: 0` guard. Each PR: overlap check, `senior` builder (`isolation: "worktree"`, run `pnpm format:check`, and for any route change update its `e2e/routes.ts` row), independent reviewer with four verdicts and a mutation proof, `post-check.ts` on the final head, review requested, auto-merge. Never touch CLAUDE.md or `.claude/standards/`. Don't commit in the ramble main checkout.

