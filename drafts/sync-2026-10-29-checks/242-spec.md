PASS

## spec-compliance: sync 2026-10-29, PR 242 (head 652fafd)

### Blocking
- None. Items 1 to 3 pass.
  1. `git rev-parse origin/main` = 652fafdb7ab8797161725702567ab59bfd1b30f7, the head.
  2. `git merge-tree --write-tree c0df9c1 652fafd` exited 0 with tree a819bcda06478d963b86b1891b1211f701b1f20d and no conflict lines.
  3. All 31 commits in c0df9c1..652fafd are ancestors of main; every first-parent main commit in 91849a0..652fafd carries a `(#n)` squash title or a `Merge pull request #n` subject.

### Non-blocking
- None.

### Unconfirmed
- Item 4 (merged-tree gates) is qa-agent scope.
