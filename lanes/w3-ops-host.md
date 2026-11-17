
## 2026-11-17 progress
- **w3-ops-host 2026-11-17 ~02:30, U-083b:** PR 1019, list-only queue (status deferred, DECISIONS 2026-11-17). Review round 1 (docs fix), QA, spec, arch, a11y pass; checks posted at 06d9f45, auto-merge queued; waiting on CI. Board In Progress.
- **w3-ops-host, U-070:** PR 1026 (critical). Arch audit round 1 had 3 blocking (B6, B2, B5), fixed on wip/U-070-r1 (3d972f3), main merged, gates rerun; checks to repost on the final head, then request review and queue auto-merge; `human-read` waits on Dave's approval.
- **w3-ops-host, U-126:** not started (builds after U-083b merges).
- **w3-ops-host, for the lead:** (1) U-060 lines in this section belong to `w3-reviews`; it seems to have written under the wrong heading. (2) Docker Desktop and ramble-postgres-1 died twice mid-run (`docker desktop start`, `docker start ramble-postgres-1`). (3) Audit area id `...0a9` is taken by `requests` in opsAudit.ts. (4) units.yaml U-083b scope still says "with status".

## 2026-11-17 late: hand-off
- U-083b: merged as PR 1019 (c018035). Board Done, actual 0.15 days, tokens about 330k. Scope reduced to list-only (DECISIONS 2026-11-17).
- U-070: PR 1026, head 67766554. Arch audit took 3 rounds (B6 caller on shared impact reads, B2 stale decision to lib, B5 fingerprint parse, then host-scope binding in the query); review approved 3 rounds; QA passed at cdc3dc3 with full db/test reruns at the final head. Checks posted at 67766554; review requested from Dave; auto-merge queued; critical tier so `human-read` needs his approval.
- U-126: built (commit 9190a44 on unit/U-126, unpushed). Builder wall-clock was about 5 hours (machine load), so main has moved: merge first.
- Issue numbers: U-083b #108, U-070 #85, U-126 #951. Board helper: set Status with `gh project item-edit` (Status field PVTSSF_lAHOAHFEDM4BnoszzhmMWVY; options Todo f75ad846, In Progress 47fc9ee4, Done 98236657; project id PVT_kwHOAHFEDM4Bnosz; Actual days field PVTF_lAHOAHFEDM4BnoszzhmgkcU, Dave minutes ...gkdI, Tokens ...gkdc).
- For the lead: Docker Desktop and ramble-postgres-1 died twice (`docker desktop start`, `docker start ramble-postgres-1`). Audit area id `...0a9` is `requests`. units.yaml U-083b scope still says "with status". STATUS.md is at the 25 KB limit: the w3-reviews U-060 bullets under my lane heading are long. `git switch -c <b> origin/<b>` half-fails in the builder sandbox: `git reset --hard HEAD` then plain `git switch <b>` fixes it.

## 2026-11-17 round 2 (swarm subagent)
- U-070 PR 1026: `knip` failed on `hostCancelNoticeCodes` exported but used only inside its file. Fixed on wip/U-070-r4 (a9d15d8, main merged), four agent checks reposted, `human-read` re-passed after the owner's approval of the new head; merged 997d578. wip/U-070-r1..r4 removed.
- U-126 PR 1036: merged main, knip fix on two unused fixture exports, pushed (head moved through 5 audit rounds to 13fe9b8). Arch audit blocking items by round: B6 (latest-audit read unguarded), B17 (open-support and refund-failed predicates; tile pluralisation vs count(); support href and filter literals), B2 (separator in component). Each fixed. The haiku audit found new items on unchanged code each round; the last prompt demanded the rule wording per item. Merged 49dfb6e. QA PNGs in `evidence/pr/unit-U-126/`; QA throwaway DB dropped.
- Machine notes: seed.db and sign-in-on-screen db tests and a HostSessions unit test flaked once each under load from other lanes; reruns passed.
- Decisions confirmed in review: count reads write no audit row; today's sessions counts scheduled only; refund-failed and support links use the queues' filter params. Possible follow-up: the sessions tile links to unfiltered /ops/sessions (no today filter exists).
