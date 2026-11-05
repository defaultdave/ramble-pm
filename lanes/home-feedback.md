# Lane history: home-feedback

Moved from STATUS.md on 2026-11-01. Newest first.

- **2026-10-31 10:25, done.** PR 295 merged by Dave's approval at 14:21 UTC. PF-1 to PF-6 done, PF-7 open. Last worktree and branches removed. Second U-033 PR not pulled forward: PM decision in `DECISIONS.md`.
- **2026-10-31 10:25, handed off.** Merged: PR 291 (guests, searches), PR 293 and 294 (skeleton, hero copy), PR 292 (fonts). [PR 295](https://github.com/defaultdave/ramble/pull/295) (U-033 one row and drawer) at `0c616cd`, four checks posted, auto-merge queued, Dave's review requested. U-033 set In Progress on board #19; it stays there for the second PR. Worktrees removed except `agent-a7a123c1f204d7750`, kept until 295 merges. Details in `audits/prototype-feedback-2026-10-31.md`.
- **2026-10-31 00:40, claimed.** New lane because the `lead` row reads active. Items in `audits/prototype-feedback-2026-10-31.md`. Two builders: `unit/U-030-font-swap` and `unit/U-031-guests-search`.
- **2026-10-31 00:55, PF-4 added.** Browse filters to one row plus the drawer: U-033, pulled forward from after the Prototype on Dave's feedback. It waits for `unit/U-031-guests-search` because both touch `FilterBar` and `filters.ts`; then builder on `unit/U-033-compact-bar` from `origin/main`. **For the lead:** U-033 moved earlier; set it In Progress on board #19 at pickup.

## Moved from STATUS.md, 2026-11-04 (size trim)

### Lane: home-feedback
- **2026-10-31 10:27, deployed on Dave's yes.** `ramble-sand.vercel.app` serves `5f5843c`, `dpl_7uwMQ1jgxYiCYAQw64Xp3umEDt8A`. Home and browse return 200 and browse has the new openers. Checked over HTTP only, no booking run.
- Older entries: `lanes/home-feedback.md`.

### home-feedback

All of Dave's 2026-10-31 feedback merged to `main` (PR 291 to 295). Left: [PR 296](https://github.com/defaultdave/ramble/pull/296), a comment-only change, auto-merge queued, Dave's review requested; after it merges remove worktree `agent-a93001ef331917ea4` and branches `unit/U-033-focus-comment`, `worktree-agent-a93001ef331917ea4`. It needs no deploy. Production has all of it since 10:27. PF-7 is open for the lead to schedule.

For the lead: U-033 stays In Progress on board #19 with issue 39 open; its second PR goes back to the planned slot after the Prototype, and the plan's filter list needs reconciling with Figma first. Roadmap: U-033 first PR pulled forward and merged. Memory lessons: measure on a seeded page, a placeholder database proves nothing; CLS does not see a replaced skeleton, so compare tops; font fallbacks tuned on a Mac do not hold on Linux or Android, so check `local()` resolved; the browse no-script promise is broken on `main` (PF-7), and home may be too.
