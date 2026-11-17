# Ticket close-out, 2026-11-17

Read-only triage of the 70 open issues in `defaultdave/ramble` (51 unit, 19 audit) against origin/main `ac3e87a`, the open PR list (1037, 1038), `DECISIONS.md` (2026-11-10 to 2026-11-17), `lanes/lead.md` (slim MVP goal of 2026-11-13), `drafts/mvp-replan-2026-11-10.md`, `drafts/audit-fixes-triage-2026-11-17.md` and `STATUS.md`. Nothing was changed on GitHub.

## Counts

| Disposition | Issues |
|---|---|
| merged, issue still open | 6 |
| in flight | 4 |
| ready to build | 0 |
| blocked | 2 |
| parked by decision | 45 (32 cut 2026-11-10 plus 13 parked 2026-11-13) |
| owner-held | 13 |

Why "ready to build" is zero: every in-scope unit issue is either merged or in flight (U-076c, U-061, U-078), and the audit tickets that were mechanical are merged. What is left is waiting on rulings. Rows 1001, 1004, 1005 and 791 become buildable once answered (section A).

Unclear points: (1) whether the CI e2e run on main has shown the booking-path spec running, which gates closing #61 and #133; (2) #998, since DECISIONS 2026-11-11 says `human-read` was already made required, while the triage of 2026-11-17 says it is not, so the ruleset needs a look before any edit; (3) which unit id a #1001 and #1004 PR files under (the triage groups them as C-B; the owning unit is not named); (4) `units.yaml` on main still shows `todo` for merged units, so board #19 and PR titles were used as the record, not the YAML.

## Rows

| Issue | Id | Title | Disposition | Detail |
|---|---|---|---|---|
| 6 | U-004b | U-004b Passkeys and step-up | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 35 | U-029 | U-029 Code Connect mapping | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 48 | U-042 | U-042 Structured data and share images | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 53 | U-046 | U-046 Stripe Connect adapter | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 58 | U-109 | U-109 Refund path in confirmOrder | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 61 | U-051 | U-051 Checkout failure states | merged, issue still open | U-051 merged (PR 911; S10 page and BC-21 covered, PR 915 e2e). Closes by: lead sets board #19 Done after a CI e2e run on main shows the booking-path spec ran (STATUS Next); not yet confirmed. |
| 62 | U-052 | U-052 Payment race and idempotency tests | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 63 | U-053 | U-053 Checkout script inventory and PCI | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 71 | U-061 | U-061 Review moderation basics | in flight | PR 1037 open (agent checks running) |
| 73 | U-062a | U-062a purchaseGift and the gift-purchase confirm | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 74 | U-062b | U-062b Gift checkout and gift-scheduled pages | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 75 | U-063 | U-063 Gift delivery | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 76 | U-064a | U-064a redeemGift and the redemption confirm | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 77 | U-064b | U-064b Gift redemption page | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 78 | U-065a | U-065a Gift exchange: confirm branch | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 79 | U-065b | U-065b Gift exchange: page and top-up | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 80 | U-066a | U-066a Gift expiry and buyer refunds | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 81 | U-066b | U-066b Gift reinstatement | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 86 | U-071 | U-071 Statements and payouts | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 96 | U-076c | U-076c Pages and documents admin | in flight | building now (w3-cms lane, harness worktree; no PR yet) |
| 98 | U-113 | U-113 Ops gift support | parked by decision | Gifting parked, DECISIONS 2026-11-13 and 2026-11-17 (still parked). Rec: keep open, labelled parked (Q2). |
| 100 | U-078 | U-078 Settings and ops switches | in flight | PR 1038 open |
| 101 | U-079a | U-079a Weekly release and transfer events | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 102 | U-079b | U-079b Reconciliation and close-out | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 103 | U-080 | U-080 Finance export | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 104 | U-110 | U-110 Money-held view | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 105 | U-081 | U-081 Dispute record | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 106 | U-082 | U-082 Spreadsheet import | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 110 | U-085 | U-085 Privacy requests | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 111 | U-086 | U-086 Events table and beacons | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 112 | U-087 | U-087 Attribution capture | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 113 | U-088 | U-088 Investor report and funnel | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 114 | U-089 | U-089 Web-vitals field data | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 115 | U-090 | U-090 Live dashboard and cohorts | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 117 | U-092 | U-092 Sitemaps, robots, and crawler checks | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 118 | U-093 | U-093 Redirect map and guide import | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 119 | U-094a | U-094a Post-launch redirect fixes | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 120 | U-094b | U-094b Decommission the old site | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 121 | U-095 | U-095 Lighthouse budgets and lab runs | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 122 | U-096 | U-096 Load test | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 123 | U-097 | U-097 Uptime, heartbeats, SLO, synthetic booking | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 124 | U-114 | U-114 Synthetic booking isolation | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 125 | U-098 | U-098 Backups and restore rehearsal | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 126 | U-099 | U-099 Runbooks and rehearsal | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 127 | U-115 | U-115 Launch cutover runbook and rehearsal | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 128 | U-100 | U-100 Accessibility pass | parked by decision | Wave 4 test bed parked, DECISIONS 2026-11-13 and 2026-11-17. Rec: keep open, labelled parked (Q2). |
| 129 | U-101 | U-101 Device matrix and wallets | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 131 | U-103 | U-103 Staged releases and freeze rule | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 132 | U-104 | U-104 Launch readiness review | parked by decision | Cut in the MVP re-plan, DECISIONS 2026-11-10 (`drafts/mvp-replan-2026-11-10.md` s2). Rec: close as not planned (Q1). |
| 133 | U-105 | U-105 Booking-path smoke and nightly suite | merged, issue still open | U-105 merged (PRs 915, 916, 955). Closes by: board #19 Done, same CI e2e check as U-051; not yet confirmed. |
| 151 | U-119 | U-119 Vercel Analytics and Speed Insights | merged, issue still open | U-119 on main (commit 6672afb1, #163; both packages in package.json). Closes by: a missed close. Owner closes the issue as completed. |
| 319 | BC-14 | BC-14 Consolidate duplicate integer and date guards | owner-held | Q13: BC-14: live parts fixed in PR 1035 (`requireMinor`, jobs `runAfter`); `earliestClock` is a deliberate floor and N1105-8 range guards remain. Close as sufficient? Rec: yes. |
| 326 | BC-21 | BC-21 startPayment ignores the checkout maintenance flag | merged, issue still open | BC-21 fixed: `startCheckoutPayment` returns `maintenanceRefusal` first (`src/server/checkout.ts:93-96`). Closes by: `tools/audit-tickets.ts --run`. |
| 367 | H-23 | H-23 Run accessibility audit on loaded home page | blocked | needs an axe, keyboard and 320px sweep on a Neon preview or demo deploy; a measurement, no code; carries `needs-owner`. Owner Q14. |
| 735 | N1102-1 | N1102-1 Fake gateway stored-success recall rule lives in the data l... | merged, issue still open | Fixed: `recallsStoredSuccess` in `src/lib/fakePayment.ts` with tests. Closes by: `tools/audit-tickets.ts --run`. |
| 791 | N1102-57 | N1102-57 Local run without network cannot create a hold | owner-held | Q11: N1102-57: client skip is done; a seeded e2e database is the open part (M). Build it or close? Rec: close. |
| 830 | TA-24 | TA-24 Tests assert Postgres trigger message text | merged, issue still open | Stale: no test asserts the trigger message text. Closes by: `tools/audit-tickets.ts --run`. |
| 890 | N1104-1 | N1104-1 src/components/FilterBar/NoScriptFilters.tsx:1 is a new 'us... | owner-held | Q6: N1104-1: approve `NoScriptFilters` island (one protected allowlist line; note DECISIONS 2026-11-16 already ratified it as one of seven islands) or build a server route? Rec: approve, and close once the line is checked. |
| 992 | IMG-2 | IMG-2 The vertical card's 100vw overstates the real 342 px column o... | owner-held | Q12: IMG-2: sizing tuning, no measured defect. Measure first? Rec: keep open, labelled parked, until measured. |
| 993 | IMG-3 | IMG-3 The desktop lead picks 1920w, but a source can be as small as... | owner-held | Q12: IMG-3: source-size cap is a judgement call. Rec: keep open, labelled parked. |
| 994 | IMG-4 | IMG-4 The gallery's 66vw and 33vw at tablet widths are rough guesse... | owner-held | Q12: IMG-4: `vw` sizes versus container queries, a measurement item. Rec: keep open, labelled parked. |
| 995 | IMG-5 | IMG-5 fill ignores the stored width and height, so the srcset is ne... | owner-held | Q12: IMG-5: `fill` ignores stored width and height; needs a sizing decision. Rec: keep open, labelled parked. |
| 996 | IMG-6 | IMG-6 Images can't be measured locally | blocked | real-photo LCP cannot be measured locally; needs a preview deploy and a storage decision (H-17); no code fix. Owner Q14. |
| 997 | IMG-7 | IMG-7 With the U-129 underlay, a failed main load shows Chromium's... | owner-held | Q7: IMG-7: CSS fallback landed (PR 1027 line); the client `onError` half needs `Photo` on the island allowlist (protected). Add it? Rec: no (DECISIONS 2026-11-14 chose no new island for U-129); close as covered by the CSS fallback. My inference. |
| 998 | N1105-1 | N1105-1 human-read is not a required check on main, so a critical-t... | owner-held | Q4: N1105-1: make `human-read` a required check on `main` (ruleset 25513279)? Rec: yes. Note DECISIONS 2026-11-11 says it was already added; verify the ruleset first, the issue may be stale. |
| 999 | N1105-2 | N1105-2 scripts/merge-desk/scope-check.ts:5 PROTECTED (.github/, .c... | owner-held | Q5: N1105-2: widen `scope-check.ts` PROTECTED. Rec: config files only, keep `package.json` and the lockfile open. Protected path, bypass merge; the lane prepares the branch. |
| 1001 | N1111-1 | N1111-1 Sign-in links are limited per destination address only, so ... | owner-held | Q9: N1111-1: per-address sign-in limit only. Per-email limit (rec) or lock after N failures? U-130 has merged, so the lane conflict is gone. |
| 1004 | N1111-4 | N1111-4 Unused sign-in link rows keep the address they were sent to... | owner-held | Q10: N1111-4: purge expired `auth_verifications` and `auth_sessions` in the pulse job, 30 days. Rec: yes. Needs 1001's volume answer only for tuning. |
| 1005 | N1111-5 | N1111-5 Two new Route Handlers sit outside B15 | owner-held | Q8: N1111-5: two Route Handlers outside B15. Rec: keep them and add a DECISIONS row extending B15 (no code); guest-signin lane is closed, so no conflict. |
| 1017 | N1112-9 | N1112-9 containsPattern (LIKE escaping) is defined in a page module... | in flight | building now (audit-fixes lane, U-072 batch); needs `server/db/opsSessions.ts`, U-070 has merged |

## A. Build plan for "ready to build"

Nothing is ready today. Still running: U-076c, U-061 (PR 1037), U-078 (PR 1038) and #1017; that is four builders at most. Next, in order, after the owner answers (at most five builders; lanes own disjoint files):

- Lane A1, auth, critical tier, size M then M. #1001 (`src/server/auth/handler.ts`, `src/lib/rateLimits.ts`, `src/server/ports/rate-limit/bot-check.ts`) then #1004 (`src/server/pulse.ts`, a new purge in `src/server/db/`, `src/lib/privacy.ts`). Same lane because both touch the auth tables and rate-limit area. Needs Q9 and Q10. Each needs the owner's human-read.
- Lane A2, images, standard tier, size S each, only if Q12 is answered "build" instead of "measure first": #993, #994, #995, #992 (`Photo.tsx`, `ExperienceGallery.tsx`, `Card.tsx`, image config). One lane, in that order of file overlap (Card, Gallery, Photo). Default recommendation leaves this lane empty.
- Lane A3, e2e database, standard tier, size M, only if Q11 is answered "build": #791 (`playwright.config.ts`, `e2e/checkout.spec.ts`, seed script). Default recommendation leaves this lane empty.
- No builder: #1005 (a DECISIONS row), #890, #999, #998 (owner edits of protected files or the ruleset), #319 (close).

After the in-flight units land, the walkthrough and its page-change units (not among these 70 issues) take the free slots.

## B. Answer sheet for the owner

Reply "all recommended" or list the exceptions by number. Recommended answer first.

1. Close the 32 issues cut on 2026-11-10 as not planned (listed in C1)? Recommended: yes. Alternative: keep open labelled parked.
2. The 13 parked issues (gifting #73 to #77 and #98, wave 4 #48, #111, #114, #117, #121, #122, #128): keep open, labelled parked? Recommended: yes ("I can always add more things later", DECISIONS 2026-11-13). Alternative: close as not planned.
3. Close #61 (U-051), #133 (U-105) and #151 (U-119) as completed? Recommended: yes for #151 now; #61 and #133 once the CI e2e run on main is confirmed.
4. #998 `human-read` required on `main`: check the ruleset; if not required, add it? Recommended: yes.
5. #999 protected list: config files only (`.gitleaks*`, `vitest.config`, `knip.json`, `playwright.config`, `scripts/test-size.ts`), not `package.json` or the lockfile? Recommended: yes.
6. #890 `NoScriptFilters` stays as a client island? Recommended: yes (already one of the seven ratified islands on 2026-11-16; confirm the allowlist line exists, then close).
7. #997 add `Photo` to the island allowlist for an `onError` handler? Recommended: no; close as covered by the CSS fallback.
8. #1005 keep the two Route Handlers and add a DECISIONS row extending B15? Recommended: yes.
9. #1001 sign-in lockout: per-email limit beside the per-address one? Recommended: yes (locking after N failures would let anyone lock out a guest).
10. #1004 purge expired auth rows in the pulse job after 30 days? Recommended: yes.
11. #791 seeded e2e database: close, relying on the existing client skip? Recommended: yes, close.
12. #992 to #995 image sizing: keep open labelled parked until measured on a preview? Recommended: yes.
13. #319: close as sufficient, since the live guards are fixed and the rest is a deliberate floor? Recommended: yes.
14. #367 and #996 (measurements needing a preview deploy): keep open labelled parked, fold #367 into the walkthrough? Recommended: yes.

Automatic, no answer needed: #326, #735, #830 close through `tools/audit-tickets.ts --run` (lead runs it).

## C. Commands (owner runs; closes are the owner's alone)

C1, close the 32 cut issues as not planned (answer 1):
```
for n in 6 35 53 58 62 63 78 79 80 81 86 101 102 103 104 105 106 110 112 113 115 118 119 120 123 124 125 126 127 129 131 132; do gh issue close $n --repo defaultdave/ramble --reason "not planned" --comment "Cut from the MVP on 2026-11-10 (DECISIONS in ramble-pm); can be re-filed if the goal changes."; done
```

C2, close merged units as completed (answer 3; run #61 and #133 only after the e2e check):
```
gh issue close 151 --repo defaultdave/ramble --reason completed --comment "Built and merged (commit 6672afb1, PR 163)."
gh issue close 61 --repo defaultdave/ramble --reason completed --comment "Merged in PRs 911 and 915; BC-21 folded in."
gh issue close 133 --repo defaultdave/ramble --reason completed --comment "Merged in PRs 915, 916 and 955."
```

C3, close audit tickets the owner rules on (answers 7, 11, 13; drop any line for an exception):
```
gh issue close 997 --repo defaultdave/ramble --reason completed --comment "The CSS fallback landed in PR 1027. No client onError island, per DECISIONS 2026-11-14."
gh issue close 791 --repo defaultdave/ramble --reason "not planned" --comment "The client bot-challenge skip is the fix; a seeded e2e database is a separate project."
gh issue close 319 --repo defaultdave/ramble --reason completed --comment "Live guards fixed in PR 1035; the sessions clock floor is deliberate."
```

C4, label the parked issues (answers 2, 12, 14; the label must exist first):
```
gh label create parked --repo defaultdave/ramble --color BFD4F2 --description "Out of the slim MVP, kept for later"
for n in 73 74 75 76 77 98 48 111 114 117 121 122 128 992 993 994 995 367 996; do gh issue edit $n --repo defaultdave/ramble --add-label parked; done
```

C5, audit tickets that are fixed (lead, from the ramble-pm checkout):
```
cd /Users/davidfleming/Workspace/ramble-pm && bun tools/audit-tickets.ts --run
```

C6, not a close: #998 needs a ruleset edit in GitHub settings (ruleset 25513279), #890 and #999 need edits to protected files, #1005 needs a DECISIONS row. Print the exact edit on request.
