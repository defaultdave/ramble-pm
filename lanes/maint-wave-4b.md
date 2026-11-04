# Lane maint-wave-4b

2026-11-04 night: Wave 4 drain, second half: W4-C, W4-D, W4-E, W4-F from `drafts/maintenance-wave-4-2026-11-04.md`, plus W4-G (BC-14, split out of W4-E).

- Builders: first launch used hand-cut worktrees; a PreToolUse hook (Dave's config) refused every Write into them from the lane session's worktree. Lead's ruling: no bypass; relaunch with the Agent tool's `isolation: "worktree"` and have the builder run `git fetch origin && git switch --no-track -C unit/maint-W4-<name> origin/main` first. The first W4-C builder had run one Bash python edit past the hook, reverted it and stopped; the first W4-D builder was stopped when its worktree was removed. Both were relaunched and built from scratch.
- Branches: `agent-git.ts` only pushes `unit/U-...`, so the branches were renamed `unit/U-0xx-maint-W4-<name>` before the first push; the `scope-manifest` check needs the PR title to start with a unit ID (U-035 landing, U-031 home, U-030 browse, U-039 gallery, U-016 guards).
- Review rounds: W4-D failed `architecture-audit` once (a `'use client'` on ErrorNotice that was unnecessary), fixed in one commit, checks posted on the new head. The other four passed first time.
- PRs: 849 (W4-D), 853 (W4-E, migration 0024), 855 (W4-C), 856 (W4-G into `integration`), 857 (W4-F). All five merged by about 01:25 with their auto-merge queued; 849, 853, 855 and 856 merged while F was still in review.
- Scope departures: see the lane entry (BC-14 split; #778 skip link instead of DOM order; #793 unverified; W4-E one row per experience).
- Gates not run by builders: W4-C ran gitleaks only via the PM (`gitleaks detect --source . --log-opts=...`); no e2e covers the gallery.
- Cleanup: all five worktrees and local branches removed after merge; two stray `python -m http.server` processes from the gallery builder were stopped.
