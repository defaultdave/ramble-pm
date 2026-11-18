# Full-run audit, 2026-11-18

**Status: draft for the owner.** Read-only analysis of the post-freeze half of the Ramble run, from the plan freeze (2026-10-20) to the ticket close-out (2026-11-18); the pre-freeze half (project start to the freeze) is in [full-run-audit-pre-freeze-2026-11-18.md](full-run-audit-pre-freeze-2026-11-18.md). Every recommendation is a proposal for the owner to decide. Nothing here changes a rule, a file or the board.

**Asked for:** DECISIONS 2026-11-17, lead (owner direction): "run a full audit of the whole project run (plan to date: rounds per unit, rework, owner minutes, tokens, what the one-ticket pipeline cost against the swarm) and bring improvements", and settle whether swarm runs should be the default for auto runs.

**How it was made:** one Opus chat with five read-only Sonnet data gatherers (PR throughput, rounds and churn, tokens, owner time, audit dispositions). Their tables were spot-checked against the raw data before use; the checks are noted where they changed a figure. Raw pulls: `gh pr list` (374 PRs), `gh issue list` (672 issues), `gh project item-list 19` (490 items), `docs/plan/units.yaml` on `origin/main`, transcripts under `~/.claude/projects`.

---

## Executive summary

The whole-run lessons for the planning method, joining both halves, are in [the pre-freeze file's whole-run summary](full-run-audit-pre-freeze-2026-11-18.md#whole-run-lessons-for-the-planning-method).

### What matters, in numbers

1. **The estimates were four times too high for agent work, and the plan never learned it.** The 41 units with a measured `actual days` on board #19 closed at 19.7 days against 73.4 likely estimate-days: 27% of estimate, median 23%. 40 of 41 were more than 25% under; none ran over. The Prototype landed 2026-10-28 against a frozen P50 of 2026-11-30. The forecast was last refit on 2026-11-03 because `forecast.ts` cannot price units added after the freeze. (Board #19; `delta-log.md` 2026-10-24, 2026-11-16, 2026-11-17.)
2. **The cost was about $5,060, and half of it was the PM chats, not the builders.** Lead and lane chats cost $2,557 (50.5%), builders $2,106 (41.6%), all five reviewer types $387 (7.6%). That is about $17.90 per merged unit PR. `token-audit --project ramble` reports only $2,347, a 47% undercount. The swarm day (2026-11-17) left only $5 of transcripts on disk, so its cost is unmeasured. (Section 4.)
3. **Fix rounds, not unit count, drive time and builder cost, and the architecture audit drives the rounds.** 78% of the 74 units tracked in chat needed a second round (median 2, p75 3, max 9). The architecture audit caused 36% of check failures. Its three big defect classes (B2 domain logic in the data layer, B17 reuse, B7 unused exports) recurred in 21, 20 and 17 units, and all three recurred on 2026-11-17 despite written builder rules. Wave 3 needed a median of 3.5 rounds. (Section 2.)
4. **Owner time was never measured.** 30 of the 31 filled `dave minutes` values are 0 placeholders. From GitHub: 98 owner approvals on 68 PRs, 30 of them repeats on 20 PRs; 81 PRs merged under the owner's login, 36 of them PM bookkeeping. A chat-activity proxy gives 15.2 and 13.6 hours in the weeks of 2026-10-19 and 10-26, then 6.1, 3.5 and about 0 (the proxy misses GitHub review time). Against the assumed 10 to 15 hours a week, the load was at the ceiling for two weeks and well under it afterwards. (Section 3.)
5. **The swarm raises throughput, not quality. The data does not support "single tickets cause more churn".** Five-lane periods merged 10 to 14 unit builds a day; the two one-unit-at-a-time periods merged 1.2 to 1.7. Rounds per unit were not lower in the swarm (3.5 against 2). The measured churn signals rise with parallel work: 9 of 10 swarm builds needed a `Merge main` commit against 2 of 5 in the slim MVP period, and one PR went DIRTY and needed a second owner approval. Audit yield afterwards was about the same: 0.33 kept findings per unit PR for wave 3 against 0.31 for the 2026-11-10 wave. (Section 5.)
6. **The audit system found real bugs but filed mostly noise until the bar went up.** 455 items were filed, plus 156 digest rows and 17 wave 3 findings. 255 filed items (56%) were fixed by a merged PR, 107 (24%) were dropped below the bar, and 181 duplicate tickets came from one tool defect. After the 2026-11-04 bar, only 14% of nightly findings were kept. The nightly cost at least $205 over 12 measured nights, one of them $70.47 for 14 fixes. The promised weekly digest sweep never ran. (Section 6.)
7. **Most process failures were orchestration, not code.** On 2026-11-17, 7 lanes needed 21 lane-PM launches (`audit-fixes` 8, `w3-cms` 6), and the lead misread two live fixers as dead, causing duplicate runs. The lead end steps were not run that day. Ten merged units sat in the wrong board status for up to six days. Issue closes, audit ticket closes and board sync all fell to the owner or to hand work. (Section 7.)

### Should swarm runs be the default for auto runs?

**Yes, with conditions; not for the reason given.** The swarm is better because it merges about seven times as many units a day at about the same cost per unit and the same audit yield. It does not reduce rounds or churn: on every measure available it raises merge churn, collisions and relaunch overhead. Make it the default when all of these hold:

- at least three ready units with disjoint file scopes (the 2026-10-28 memory rule), at most five builders (the machine limit, `lanes/lead.md` 2026-11-17 Next);
- migration numbers and shared files (`(ops)/layout.tsx`, READMEs) assigned an order before launch;
- each lane PM works from a lane state file small enough that a relaunch costs minutes, not a context rebuild;
- critical-tier reads go to the owner as one packet per wave, after every other check is green, so heads stop moving under a read;
- each wave ends with one code-reading audit (the wave 3 shape) and a recorded cost line.

Keep one unit at a time when units share page modules (the 2026-10-29 lib-refactor lesson), for a critical money chain whose reads must land in order, for design-led work that needs the owner at the screen, and for a tail of one or two units. The serial-period data is thin (10 builds in all), so this answer rests mostly on throughput, where the gap is too large to be a confound.

### Recommendations, ordered by expected payoff

| # | Change | Where | Evidence | Cost to do | What shows it worked |
|---|---|---|---|---|---|
| 1 | **A wave contract for swarm runs** (the conditions above), and swarm as the default auto-run mode under it | `.claude/agents/ramble-pm.md` section **Several sessions at once**; the lane table template under `## Next` in `STATUS.md` | Builds a day 10 to 14 (swarm) against 1.2 to 1.7 (serial); 21 lane launches for 7 lanes; PR 1030 DIRTY and re-approved; U-034 migration renumbered twice (section 5) | About half a day of PM writing | Next wave: at least 8 builds a day, no re-approval caused by a moved head, at most one relaunch per lane |
| 2 | **Cut architecture rounds at the source.** (a) The builder runs the architecture-audit prompt and `pnpm knip` in its own worktree before its first report. (b) The audit agent lists every instance of every firing rule in round 1. (c) A standing cap: after round 3 the PM rules and the rest become follow-ups (the U-032 decision of 2026-11-10, made general). (d) Rounds after round 1 re-run only the failed checks plus one focused re-check | Builder brief (`drafts/wave3-builder-rules.md` and the copy the lanes use); `drafts/wave3-review-rules.md`; `~/.claude/agents/architecture-audit.md` in vig (a proposal for the owner, global file) | 78% of units needed round 2; architecture 36% of failures; B2, B17 and B7 recurred in 21, 20 and 17 units; U-074b ran 9 rounds the day after the U-032 cap; architecture checks cost $31 and $46 on 2026-11-10 and 11-11 (section 2) | Under a day | Median rounds at most 2 and no unit past 4 in the next wave; architecture share of failures under 25% |
| 3 | **Bring the lead and lane chat cost down to the builders' level.** Lane PMs on Sonnet; restore the 250K hand-off after the close-out (set aside 2026-11-18); one background wait instead of polling loops | `.claude/agents/ramble-pm.md` (model and hand-off line); `.claude/skills/ramble-pm/` start text | Chats $2,557 of $5,060; Opus chats $1,887; the 2026-10-29 token review made the same proposals and the chat share stayed near half (section 4) | An hour | Chat share under 30% of a wave's cost; subagent-to-chat cost ratio above 2 |
| 4 | **Fewer, batched owner asks.** One read packet per wave; the App merges a conflict-free `main` into a waiting PR only when it goes DIRTY; `tools/audit-tickets.ts` gains a close step; PM bookkeeping PRs batched to one a day; Dependabot patch bumps on auto-merge | `.claude/agents/ramble-pm.md` (owner asks); `tools/audit-tickets.ts`; `scripts/merge-desk/` (proposal, a protected path) | 30 repeat approvals on 20 PRs; 81 owner merges, 36 bookkeeping; 8 close blocks handed over on 2026-11-17; 3 issues left open although their rows say closed (section 3) | One to two days, part of it in protected files the owner merges | Owner asks per wave in at most two sittings; no repeat approval from a moved head |
| 5 | **Repair the measurements before the next run.** Fix `token-audit`'s worktree labelling and add prices for the 5.5 and Fable models; at each lane end, write a cost line from `token-audit` into the lane file, so a lost transcript does not lose the cost; board `tokens` becomes dollars from that run; `dave minutes` stays empty unless measured; the owner logs one number per sitting | `~/.claude/bin/token-audit`; `tools/day-cost.py`; lead end steps in `.claude/agents/ramble-pm.md`; board #19 field descriptions | The 47% undercount; Opus underpriced; no swarm-day transcripts; 30 of 31 owner-minute values are 0; the board token figures match no metric (sections 3 and 4) | Two to three hours | The next audit answers questions 3 to 5 from records, with no estimates |
| 6 | **Replace the five-lens nightly with a per-wave code-reading audit**, plus one browser and visual pass per section milestone. Drop the weekly digest promise or schedule it | `audits/README.md`; the `ramble-nightly-audit` task (off since 2026-11-13) | Post-bar nightly kept 14%; $70.47 for 14 fixes on 2026-11-02; scoped passes yield most (test audit 28 of 29 fixed); wave 3 cost one lane and kept 4 of 17; digest never swept (section 6) | An hour | Kept share above 30% at a recorded cost per kept item |
| 7 | **Recalibrate the planning method for agent work.** Estimate agent-built units in wall-clock hours plus expected rounds, apply the measured 0.27 ratio, and let `forecast.ts` take a PM estimate for units added after the freeze | `tools/plan/forecast.ts`, `tools/plan/dave-time.ts`; the method notes for the next project (`plan-project` skill in vig, owner's file) | 40 of 41 units more than 25% under; the forecast stuck at the 2026-11-03 refit (section 1) | Half a day | The next project's forecast lands within 25% for most units |

---

## 1. Plan against actual

### 1.1 The frozen estimate and what happened, for the build

| Measure | Frozen plan (2026-10-20) | Actual | Source |
|---|---|---|---|
| Demo scope | 116 units, 228 to 299 days of work, 259 at P50 | 88 board units built (merged PR), 148.4 likely estimate-days; plus 12 units added after the freeze (U-021c, U-119 to U-130) with no panel estimate | `plan/06-estimate.md` Headline; board #19 joined to merged PR titles (count below) |
| Prototype milestone | P50 2026-11-30, P90 2026-12-07 | Complete 2026-10-28, 33 days before P50 | `plan/06-estimate.md`; DECISIONS 2026-10-28 ("with the Prototype complete") |
| Full build | P50 2027-03-08, P90 2027-03-26 | Scope re-planned three times; slim MVP plus wave 3 merged 2026-11-17 (last PR 1041 at 00:44 on 11-18) | `plan/06-estimate.md`; `prs.json` |
| Last forecast | refit at each closing unit | Last refit 2026-11-03 (finish likely Dec 2, range Nov 24 to Dec 8); not refit since, because `forecast.ts` needs a frozen solo estimate for every unit | `delta-log.md` 2026-11-16 and 2026-11-17 |
| Owner calibration | "P5 calibrates it after the first three merges" (gate hours per unit against 1.1 h) | Never done; `dave minutes` was not measured (section 3) | `plan/06-estimate.md` Calibrating in P5 |

The 2026-11-03 forecast range (Nov 24 to Dec 8) bracketed nothing that was later built, because the scope moved under it; the slim MVP landed a week before that range opened.

### 1.2 Measured units, by tier, execution and section

41 units carry both an estimate and `actual days` on board #19. `actual days` is agent wall clock from branch cut to merge over a 6-hour day (`delta-log.md` 2026-10-24). An estimate-day is 6 focused hours of the unit owner's time from branch cut to merge-ready (`plan/06-estimate.md`, What a day means). The two are close enough to compare, but `actual days` leaves out the PM's orchestration time, waits before branch cut and later audit-fix work.

| Group | Units | Likely estimate (days) | Actual (days) | Actual over estimate |
|---|---|---|---|---|
| All measured | 41 | 73.4 | 19.65 | 27% (median 23%, range 4% to 100%) |
| Critical tier | 15 | 35.0 | 7.6 | 22% |
| Standard tier | 26 | 38.4 | 12.05 | 31% |
| Agent fan-out | 36 | 56.4 | 15.65 | 28% |
| Human-led as planned (U-014a, U-016, U-047a, U-048, U-049; moved to agents 2026-10-29) | 5 | 17.0 | 4.0 | 24% |
| Checkout | 7 | 19.0 | 4.04 | 21% |
| Data | 10 | 18.75 | 5.4 | 29% |
| Platform | 8 | 11.5 | 2.37 | 21% |
| Catalog (U-030, U-031) | 2 | 5.0 | 2.48 | 50% |
| Ops (U-076b, U-076c, U-083b) | 3 | 2.9 | 1.25 | 43% |

Source: `gh project item-list 19 --owner defaultdave --format json --limit 600`, fields `estimate likely (days)` and `actual days`, computed in the audit's scratch script. Two board items with actuals (U-126, U-128) have no estimate and are left out.

### 1.3 Units more than 25% off, and why

40 of 41 measured units were more than 25% under; U-061 (0.5 against 0.5) was the only one inside the band, and none was over. The reasons the delta log gives are the same throughout:

| Reason given | Where |
|---|---|
| Parallel `senior` builders with a PM-run review fan-out finished each unit in one sitting; review rounds were most of the elapsed time | `delta-log.md` 2026-10-24 (U-009, U-025, U-026, U-117) and 2026-10-28 (U-030, U-021a, U-031) |
| The estimate priced a solo builder; the unit was agent-built in parallel with others | `delta-log.md` 2026-10-29 (U-019, U-045b, U-015) |
| "Merged agent units have closed at 10 to 40 percent of estimate, so the refit is the slow case" | `delta-log.md` 2026-10-29 forecast refit |

The units closest to their estimate were the ones with the most rounds: U-031 at 53% (seven rounds), U-030 at 45%, U-076c at 67% (four rounds across six builder sessions). That fits finding 3: rounds, not building, set the elapsed time.

What the comparison hides: about 106 audit-fix PRs (section 6) reworked merged units after their `actual days` closed. No unit's actual includes them.

### 1.4 What the re-plans removed

| Re-plan | What it did | Agent-days | Share | Source |
|---|---|---|---|---|
| 2026-11-02 demo re-plan | 24 units cut, 44 parked; Ramble becomes a demo and test bed | Board `Plan` = Cut: 24 units, 43.5 likely days; Parked: 43 units, 72.6 days; Test bed: 8 units, 13.0 days | Cut 19%, parked 31%, test bed 6% of the 231.9 board estimate-days | `delta-log.md` 2026-11-02; board #19 `plan` field |
| 2026-11-10 MVP re-plan | 91 open units sorted: 59 MVP (14 in, 37 lite, 8 new) at 71.55 lite agent-days; 8 test bed at 8.25; 32 cut. 28 of the 43 parked units were later built, worth 43.4 frozen likely days | 71.55 agent-days planned | Not comparable with frozen days: lite cuts were re-estimated | `drafts/mvp-replan-2026-11-10.md` section 6; board join |
| 2026-11-13 slim MVP | Parked gifting (6 units, 8.5 days), reviews (3.0), host cancel (1.0), U-083b (0.5), CMS and settings (5.55), NEW-7 (0.5), wave 4 test bed (8.25) | 20.05 MVP days parked, plus the 8.25-day test bed track | 28% of the MVP plan | DECISIONS 2026-11-13; days from `drafts/mvp-replan-2026-11-10.md` section 2 |
| 2026-11-17 swarm | Un-parked reviews, host cancel, U-083b, CMS and settings, and the ops dashboard (U-126, read here as NEW-7 by its title) | 10.55 days brought back; gifting (8.5) and wave 4 (8.25) stay parked | | DECISIONS 2026-11-17 "swarm to finish" |

Net position at 2026-11-18, on the board's frozen estimates: 88 units built (148.4 likely days, 64%), 45 not built (83.5 days, 36%): 23 cut (42.0), 15 parked (29.25) and 7 test bed (12.25). Source: board #19 joined to merged PR titles and branches in `prs.json`.

---

## 2. Rounds and rework

### 2.1 Rounds per unit

The posted check runs hide most rounds: since 2026-11-02 agents post only final verdicts, so 262 of 273 PRs read as one round. The figures below come from the check fixture folders, the chat transcripts that `tools/check-rounds.py` reads, and the lane files.

| Source and period | Units | Median | p75 | Max | Needed round 2 or later |
|---|---|---|---|---|---|
| Chat rows, all | 74 | 2 | 3 | 9 | 78% |
| Chat, Prototype (to 10-31) | 36 | 2.5 | 3 | 5 | 89% |
| Chat, MVP (11-10 to 11-16) | 37 | 2 | 4 | 9 | 70% |
| Fixture folders (`drafts/*-checks/`), all | 78 | 1.5 | 2 | 6 | 50% |
| Wave 3 (11-17 to 11-18), lane files | 10 | 3.5 | 4 | 7 | 80% |
| Posted check runs (a floor) | 273 PRs | 1 | 1 | 4 | 4% |

Source: `python3 tools/check-rounds.py <date>` for each day 2026-10-24 to 11-18 (gh reads, sandbox bypassed); `lanes/w3-*.md`. The sets overlap and were not de-duplicated exactly (estimate: about 130 distinct units have some data). Maintenance-period chat rows are missing because those checks ran outside the matched chats.

The long tail: U-074b 9 rounds (architecture FAIL through round 8, `audits/agents-2026-11-11.md`), U-077 7, U-076a 7, U-031 7, U-014a 6, U-020 6, U-055 6, U-106 6.

### 2.2 Which checks bounced

| Check | Round 1 failures | All rounds | Share of all |
|---|---|---|---|
| Architecture audit | 18 | 28 | 36% |
| Review | 18 | 20 | 26% |
| Spec compliance | 16 | 18 | 23% |
| QA | 6 | 7 | 9% |
| Accessibility | 3 | 4 | 5% |

Source: the 78 fixture folders in `drafts/*-checks/`, read through `tools/check-rounds.py`.

By period, round 1 failures (daily summaries, partly double counted): Prototype review 20, spec 17, architecture 24, QA 9, a11y 5; maintenance 9, 8, 2, 4, 0; MVP 5, 0, about 10, 2, 0; wave 3 (lane files, estimate) about 4, 2, about 17 architecture round-instances, 2, 2. From 2026-11-10 on, architecture dominates and piles up in a few long units.

CI failures in a 28-PR sample, once per commit and job: `human-read` 12 (by design until approved), `knip` 6, `e2e` 5, `db` 3, `test` 3, `lint` 3, `scope-manifest` 2, `format:check` 2, `storybook` 1; `expire preview branch` 12 (infrastructure noise). Source: `gh api repos/defaultdave/ramble/commits/<sha>/check-runs` over the sample's commits.

### 2.3 Defect classes that repeated

| Class | Units hit (keyword match, estimate) | First to last seen | Rule added | Recurred after the rule |
|---|---|---|---|---|
| B2: domain decision in the data layer | 21 | 10-28 to 11-17 | Builder and review rules, 10-26 and 10-27 (`MEMORY.md` wave 3) | Yes: U-076a rounds 1 to 5, U-070, U-126, U-060 on 11-17; PR 1044 round 2 on 11-18 |
| B17: reuse and duplication | 20 | 10-29 to 11-17 | Blocking rule and builder "Reuse before writing", 10-28 | Yes: U-074b (4 rounds), U-126 (5), U-076b, U-060; PR 1046 round 2 on 11-18 |
| B7 and `knip`: unused or test-only exports | 17 (12 by knip) | 10-28 to 11-17 | `knip` in CI and in the builder gate list; B7 ruling 10-26 | Yes: `knip` red on U-070, U-076a, U-126 |
| B6: unguarded read | 14 | 10-28 to 11-17 | Exemptions 10-29, 11-10, 11-16 | Yes: U-126, U-130 |
| B13: catch returns a value | 14 | 10-29 to 11-17 | Rulings 10-29, 11-10, 11-17 | Yes |
| B8: client island allowlist | 15 | 10-28 to 11-17 | Allowlist grown several times | Yes: `RichTextEditor` on 11-17 |
| Migration number collision | at least 4 | 10-26 to 11-10 | Second to land regenerates | Yes: U-034 renumbered twice on 11-10 |
| Haiku checks stricter on unchanged code | 8 or more long units | 10-26 to 11-17 | PM rules from the standard's text; U-032 cap 11-10 | Yes: U-074b to round 9 on 11-11, U-076a 5 architecture rounds on 11-17 |
| gitleaks test secrets | 9 | 10-26 to 10-30 | Low-entropy fakes, range scan before push | Not seen after 10-30 |
| Build without `DATABASE_URL` | 2 | 10-26 to 11-01 | Gate added | A variant on U-060 (e2e seeding) on 11-17 |

Sources: verdict files in `drafts/*-checks/`, `lanes/*.md`, `DECISIONS.md`, `memory/MEMORY.md`. Unit counts are keyword matches and are estimates.

What this says: the rules that stuck were mechanical (a gate, a scan, a fake value). The rules that did not stick were prose in a brief (B2, B17). The builder rules for wave 3 already say "every domain decision ... lives in a `src/lib` function" and give a grep to list what exists (`drafts/wave3-builder-rules.md`, Reuse before writing), and the classes recurred anyway. Recommendation 2 moves the check into the builder's loop instead of adding more prose.

The cap: DECISIONS 2026-11-10 let U-032 merge after its fourth architecture round with later findings as follow-ups. It was written for one unit and not carried into the brief the lanes copy, so U-055, U-106 and U-056 ran past it the same day and U-074b ran to round 9 the next (`audits/agents-2026-11-10.md` finding 2).

### 2.4 Churn: merged code later changed by audit fixes

| Group | Merged PRs | Lines added | Lines deleted |
|---|---|---|---|
| Unit build PRs | 181 | 438,613 | 9,049 |
| Audit-fix PRs, all | 88 | 81,892 | 49,766 |
| of which maintenance fixes | 38 | 47,219 | 20,443 |
| of which test-audit splits and moves | 37 | 31,283 | 28,308 |
| of which wave 3 era audit fixes (11-17 and 11-18) | 13 | 3,390 | 1,015 |

Source: `prs.json` classified by branch and title (rule in section 5.1; estimate). Excluding the test moves, audit fixes added about 12% of what unit builds added, and deleted 2.4 times as much.

A sample, by `git blame` of the lines each fix removed or replaced on `origin/main`:

| Audit-fix PR | Lines removed | From | Share of that unit PR's added lines |
|---|---|---|---|
| 1028 (U-127 stable 404) | 221 | 209 from PR 941 | 16% |
| 1031 (U-057 reminder re-time) | 89 | 65 from PR 971 | 3% |
| 1030 (U-072 dedupe) | 103 | across PRs 964, 946, 940 | 1.7% |
| 1023 (U-068 form and focus) | 82 | PRs 945, 964 | 1% |
| 1025 (U-038 guarded-form runner) | 221 | PRs 933, 924, 932 | about 1% |
| 1035 (U-077 refund retry) | 24 | PR 967 | 0.5% |

Churn is light and concentrated: one fix replaced a sixth of a page; the rest touched 0.5% to 3% of the unit. No product code was reverted (one "Revert" title, PR 139, was the merge-desk dry run). About 5 of the 17 closed-unmerged PRs were redone product work (1021, 966, 970, 929, 173).

### 2.5 PM rulings that overrode a check

About 26 DECISIONS entries rule a check finding out or narrow it (estimate: 16 architecture, 8 spec, 5 a11y or QA), from PR 184 spec criterion 5 (2026-10-24) to the U-078 round 2 B17 and B5 ruling (2026-11-18). An auditor honours a ruling when its prompt cites it (`lanes/w3-cms.md`); the rulings do not stop the next round finding new instances.

---

## 3. Owner time

### 3.1 What the records hold

| Record | What it shows | Source |
|---|---|---|
| Board `dave minutes` | 31 filled; 30 are 0, one is 10 (U-128). Every critical-tier unit (12) shows 0 | board #19 |
| `units.yaml` | U-118: 120 minutes (the owner's own estimate for one day) | `docs/plan/units.yaml` on `origin/main` |
| Plan assumption | 12.5 h a week budget, about 10.2 h used at P50: 5.6 h own units, 3.8 h gates, 0.8 h tasks, 2.3 h slack; critical diff read 15 / 30 / 45 minutes by complexity | `plan/07-resourcing.md`; `tools/plan/dave-time.ts` |

The 0 values mark "logged", not "measured". The plan's central assumption (about 1.1 h of owner time per fan-out gate, 7x leverage) was therefore never tested.

### 3.2 Per week, from GitHub and a chat proxy

| ISO week | Chat-activity proxy (h) | Owner messages | Owner approvals | PRs merged under the owner's login (approx.) |
|---|---|---|---|---|
| 43 (Oct 19 to 25) | 15.2 | 184 | 37 | about 28 |
| 44 (Oct 26 to Nov 1) | 13.6 | 183 | 5 | about 25 |
| 45 (Nov 2 to 8) | 6.1 | 85 | 8 | about 13 |
| 46 (Nov 9 to 15) | 3.5 | 54 | 41 | about 12 |
| 47 (Nov 16 to 18) | 0.2 | 5 | 20 | about 5 |

Sources: GraphQL reviews over all 374 PRs (`gh api graphql`, reviews by `defaultdave`); merged-by login per PR; 554 top-level typed messages across 132 session files under `~/.claude/projects/*ramble*`. The proxy sums gaps of 15 minutes or less between messages plus 2 minutes per message, in New York time.

**The proxy is not a time log.** It cannot see time on GitHub or at a console (2026-11-17 has 14 approvals and no chat messages), and it counts some injected messages. Read it as a floor on total time for weeks 46 and 47. An estimate from the GitHub counts alone (98 approvals at 5 to 15 minutes, 81 merges at about 3 minutes) gives 12 to 29 hours over the run, 3 to 6 hours a week; with rulings, walkthroughs and console tasks, about 5 to 9 hours in the busy weeks (estimate). Either way: near the 10 to 15 hour ceiling in weeks 43 and 44, well under it after the one-merge-lane change on 2026-11-04.

Per unit: 98 approvals for 99 distinct units built is about one approval per unit; 81 owner merges is 0.8 per unit. Minutes per unit cannot be stated.

### 3.3 What the owner was asked for

| Kind | Count | Dates | Wait before the owner acted |
|---|---|---|---|
| Review approvals | 98 on 68 PRs (30 repeats on 20 PRs) | 10-21 to 11-18 | Median 0.1 h from PR creation before 11-05; median 1.5 h, p90 about 54 h from 11-05 (clock starts at creation, so re-approvals overstate it) |
| `human-read` (critical tier) | about 62 approval events on 33 PRs | 11-11 to 11-18 | as above; 1042 and 1044 still waiting at 11-18 |
| Merges under the owner's login | 81: 36 PM bookkeeping, 22 unit or other, 10 integration syncs, 7 promotions, 6 Dependabot | 10-21 to 11-17 | Promotions merged 1 to 6 minutes after opening |
| Decisions and rulings | about 53 owner-attributed DECISIONS entries; peaks 10-29 (17), 11-01 (7), 11-17 (7) | | Answer sheets answered the same day |
| Answer sheets | 3 (about 28, 30 and 14 rows), each answered "all as recommended" | 10-29, 11-01, 11-17 | Same day |
| Secrets, App, rulesets, console | at least 10 | 10-25 to 11-17 | Production secrets missing on 10-30 held a redeploy (length not recorded) |
| Deploys and migrations | at least 10 owner-run | 10-26 to 11-04 | Production migrations 0024 to 0034 still pending |
| Issue closes | 8 `gh issue close` blocks (about 51 issues) and the close-out script | 11-17 to 11-18 | Run by the lead on 11-18 01:35 on the owner's goal |
| Protected-file hand edits | 3 or more (`CLAUDE.md`, `architecture.md`, `scope-check.ts`), later one bypass PR (1043) | 11-02, 11-17 | 1043 waiting at 11-18 |

Sources: GraphQL PR data; `DECISIONS.md`; `drafts/owner-commands-2026-11-17.md`; `drafts/owner-closeout-2026-11-18.sh`; `roadmap/status.json` standups; `STATUS.md` `## Blocked on Dave`.

8 of 32 standup "what held us up" entries (25%) name the owner as the hold (`roadmap/status.json`, 2026-10-29 to 11-18). Most holds were agent-side.

### 3.4 Asks that could have been avoided or batched

| Ask | Why avoidable or batchable | Evidence |
|---|---|---|
| Repeat approvals after a head moved | A PR waiting on a read went DIRTY as others merged; the new head voided the approval | 30 repeats on 20 PRs; PR 967 approved 6 times, 954 5 times, 909 4 times; PR 1030 DIRTY on a README line after five merges (`lanes/lead.md` 2026-11-17) |
| PM bookkeeping merges | Records PRs the App could have batched to one a day | 36 of 81 owner merges; 7 on 10-22, 7 on 10-29, 5 on 11-02 |
| Sync merges | Auto mode refused PM-posted sync checks, so each needed a bypass | 10 syncs (standup 2026-11-03); ended by one merge lane, 11-04 |
| Issue closes | The App lacked Issues write and `tools/audit-tickets.ts` has no close step | #326, #735, #830 open although their rows say closed (`lanes/lead.md` 2026-11-17 bookkeeping); 8 close blocks |
| Rulings the 2026-10-29 rule already covered | Logged as "owner, on the lead's recommendation" | B9 waivers, seeded `host-agreement`, U-068 scope on 11-12; #998 handed back as a ruling although `human-read` was already required (DECISIONS 2026-11-11) |
| Critical reads sent one at a time | 28 approval events on 11-12 alone across U-077, U-108, U-112, U-107, U-059, U-068 | GraphQL reviews |
| Dependabot merges | Patch bumps could auto-merge | 6 owner merges |

What worked: the three answer sheets, each settled in one reply.

---

## 4. Tokens and cost

### 4.1 Total, and the undercount

| Run | Command or method | Cost | Calls |
|---|---|---|---|
| Tool as-is | `~/.claude/bin/token-audit --since 2026-10-17 --project ramble --by agent` | $2,347 | 27,041 |
| Every session whose cwd contains `Workspace/ramble`, tool's prices | token-audit's own parser with the full cwd as the project key (audit scratch script) | $4,458 | 50,511 |
| Same, repriced (best estimate) | Opus 5.5 at $5 / $25 per million (cache write $6.25 or $10, read $0.50), Haiku 5.5 at $1 / $5; Fable left at the tool's default | **$5,060** | 50,511 |

Two undercounts. (1) `token-audit` labels a project by the last three path parts, so `ramble/.claude/worktrees/agent-*` loses "ramble" and every isolated builder and check vanishes: `senior` reads $64 in the tool and $1,563 in fact. (2) Its price table has no entry for `claude-opus-5-5`, `claude-haiku-5-5` or Fable, so they fall to Sonnet prices; Opus is underpriced and Haiku overpriced. The repricing is an assumption, not a published price.

9,300M tokens in all, 96.7% cache reads. Repriced cost split: cache reads $3,204, cache writes $1,216, output $639. Not included: about $156 of records in Ramble sessions whose cwd was elsewhere, about $37 of Obsidian process-audit sessions, and the missing swarm-day transcripts (4.4). The billing console is the authoritative figure and was not read.

### 4.2 By agent type

| Agent | Calls | Tokens (M) | Cost, repriced | Share |
|---|---|---|---|---|
| Interactive chats (lead, lanes, other PM chats) | 14,300 | 4,287 | $2,557 | 50.5% |
| `senior` builders | 16,526 | 3,525 | $1,562 | 30.9% |
| `general-purpose` (swarm lanes and builders) | 7,000 | 844 | $544 | 10.7% |
| `review` | 4,089 | 204 | $156 | 3.1% |
| `qa` | 3,064 | 165 | $118 | 2.3% |
| `architecture-audit` (Haiku) | 2,949 | 161 | $71 | 1.4% |
| `spec-compliance` (Haiku) | 2,025 | 84 | $35 | 0.7% |
| `a11y-audit` | 398 | 16 | $7 | 0.1% |
| Other | 160 | 14 | $9 | 0.2% |

Source: the repriced whole-cwd run above, grouped by `attributionAgent`. Interactive chats by model: Opus $1,887, Sonnet $596, Fable $74 across 137 sessions. Lead and lane chats cannot be separated in the logs (`attributionAgent` is empty for chats).

The 2026-10-29 token review put checks at 24% of cost; over the whole run they are 7.6%. The chats were 61% then and 50.5% now. The two proposals that review ranked first (a 250K hand-off; lane chats on Sonnet) would have cut the largest bucket; the share barely moved, and the hand-off was set aside on 2026-11-18 (DECISIONS).

### 4.3 By phase, and per merged unit

| Phase | Chats | Subagents | Total, repriced | Merged PRs | Unit PRs | Cost per unit PR |
|---|---|---|---|---|---|---|
| Pre-build 10-16 to 10-19 | $245 | $0 | $246 | 0 | 0 | |
| Prototype and lanes 10-20 to 10-31 | $1,360 | $1,160 | $2,520 | 155 | 109 | $23.1 |
| Maintenance 11-01 to 11-09 | $475 | $544 | $1,019 | 109 | 85 | $12.0 |
| MVP and slim MVP 11-10 to 11-16 | $471 | $744 | $1,215 | 65 | 52 | $23.4 |
| Swarm 11-17 (transcripts missing) | $1 | $4 | $5 on disk | 22 | 21 | unmeasured |
| Close-out 11-18 (in progress) | $5 | $50 | $55 | 2 | 2 | |
| **Run** | **$2,557** | **$2,503** | **$5,060** | **353** | **269** | **$17.9** (excl. pre-build) |

Per distinct unit (99 U-ids in merged PR titles): about $51. Per merged PR: $14.3. Subagent-to-chat ratio by phase: 0.85, 1.15, 1.58. Spikes: 2026-10-29 $1,014 and 2026-11-04 $429. Unit PR here means a `unit/` branch or a `U-nnn` title, which counts audit-fix and follow-up PRs as unit PRs.

### 4.4 The swarm day and the board's token field

**The 2026-11-17 swarm is not on disk.** Transcripts under `~/.claude/projects` stop at about 05:18Z on 11-17 and resume at 05:00Z on 11-18; the swarm merged 22 PRs between about 05:28Z and 15:56Z. Verified: the swarm lead's session file and its subagent files hold timestamps only through the 05Z hour. An estimate at the MVP and maintenance rates ($12 to $23 per unit PR) gives **$250 to $500 for the day (estimate, unmeasured)**, which would put the run at about $5,300 to $5,600.

Board `tokens` (28 units, 58.7M in all) match no metric the transcripts give: 30 to 60 times below total tokens, 3 to 10 times above output, roughly the size of fresh tokens with no stable ratio. They cannot be used.

---

## 5. One unit at a time against the swarm

### 5.1 Periods and classification

PRs were classified by head branch, title and author: Dependabot; sync or promotion; PM, docs and state (`pm/*`, `dave/*`, `claude/*`, `chore/*`); and for `unit/*` and `senior/*`: audit fix (`-audit-` or an audit ID in the title), maintenance or test batch, resubmit (same title as an earlier PR), unit build (first PR for its U-id) and follow-up. Days are New York calendar days of `mergedAt`.

| Period | Dates | Mode | Boundary evidence |
|---|---|---|---|
| Set-up and merge desk | 10-21 to 10-23 | Mostly one at a time; one opt-in three-unit swarm on 10-22 | DECISIONS 2026-10-21; `lanes/earlier.md` |
| Prototype and post-Prototype lanes | 10-24 to 10-31 | Rolling pool of up to five builders from 10-26; three or more lanes from 10-28 | DECISIONS 2026-10-26, 10-28 |
| Sprint 1 close, maintenance and test waves | 11-01 to 11-04 | Several builders; test-fix lane up to five | `lanes/test-fixes.md`; `lanes/maint-wave-4a.md` |
| Idle | 11-05 to 11-09 | No unit PRs | `prs.json` |
| MVP five-lane waves | 11-10 to 11-12 | Five lanes ("swarm it up") | DECISIONS 2026-11-10; `lanes/w1-*.md`, `lanes/w2-*.md` |
| Slim MVP | 11-13 to 11-16 | One unit or lane at a time; automatic runs off | DECISIONS 2026-11-13 |
| Swarm and wave 3 | 11-17 | Five lanes plus two second sessions | DECISIONS 2026-11-17; `lanes/lead.md` 2026-11-17 |

The run was not "one-ticket pipeline, then swarm". It was parallel from 10-26 on, with two short serial stretches. The swarm of 11-17 was the project's second five-lane wave, not its first.

### 5.2 Comparison

| Measure | Set-up (serial) | Prototype pool | MVP five lanes | Slim MVP (serial) | Swarm 11-17 |
|---|---|---|---|---|---|
| Days | 3 | 8 | 3 | 4 | 1 (about 11 hours) |
| Unit builds merged per day | 1.7 | 4.4 | 14.0 | 1.2 | 10 |
| All unit PRs merged per day | 4.0 | 12.1 | 15.0 | 1.8 | 21 |
| Unit-PR lines merged per day | 4,165 | 26,863 | 47,899 | 2,800 | 50,784 |
| Median lines per unit build | 826 | 4,749 | 1,920 | 817 | 2,088 |
| Median commits per unit build | 3 | 4 | 4 | 2 | 6 |
| Builds with a `Merge main` commit | 1 of 5 | 15 of 35 | 11 of 42 | 2 of 5 | 9 of 10 |
| Rounds per unit, median | no data | 2.5 (chat) | 2 (chat; p75 4, max 9) | U-125 3, U-129 3 (two units) | 3.5 (lane files; max 7) |
| Documented collisions | sync conflicts | 4 or more (syncs, DIRTY 246, conflicts 236, 241) | 1 migration renumbered twice (U-034) | none found | 1 DIRTY needing re-approval (1030); 2 duplicate fixer runs; 21 lane launches for 7 lanes |
| Owner approvals in the week | 37 (wk 43) | 5 (wk 44) | 41 (wk 46) | (wk 46) | 20 (wk 47, 14 on 11-17) |
| Cost per unit PR | $23.1 (with Prototype) | $23.1 | $23.4 (with slim MVP) | $23.4 (with MVP) | unmeasured; estimate $12 to $24 |
| Kept audit findings per product PR afterwards | | | 0.31 (11-11 nightly: 8 kept, 26 product PRs); 0.60 (11-12: 9 of 15) | | 0.33 (wave 3: 4 kept, 12 PRs) |

Sources: `prs.json` and `pr_commits.tsv` with the classification rule above; merge commits from `gh api repos/defaultdave/ramble/pulls/N/commits`; rounds from section 2.1; collisions from `lanes/earlier.md`, `lanes/e2e-money.md`, `lanes/audit-fixes.md`, `lanes/w1-browse.md`, `lanes/lead.md`; cost from section 4.3; audit counts from `audits/nightly-2026-11-11.md`, `audits/nightly-2026-11-12.md`, `audits/wave3-2026-11-18.md`.

### 5.3 What the comparison supports, and what it does not

**Supported:**

- Throughput. Five-lane periods merged 10 to 14 unit builds a day against 1.2 to 1.7 in serial periods. The gap is about seven times, far larger than any confound below.
- Cost per unit does not rise with parallel work. The MVP wave cost $23.4 per unit PR, the same as the Prototype pool ($23.1); the swarm day is unmeasured but its lanes were Sonnet subagents.
- Audit yield after a wave is about the same: 0.31 to 0.33 kept findings per product PR.

**Not supported:**

- "Single tickets cause more code churn." Every churn signal available rises with parallel work: `Merge main` commits (9 of 10 swarm builds against 2 of 5 serial), DIRTY PRs and repeat approvals, duplicate fixer runs. The audit-fix churn the owner saw on 11-17 (11 of its 21 unit PRs were audit fixes) was repair of the 11-10 wave's code, not a cost of serial work.
- "Swarms need fewer rounds." Wave 3 needed a median of 3.5 rounds against 2 in the MVP wave. Rounds track the architecture audit's defect classes (section 2.3), not the number of lanes.

**Too thin to conclude:**

- The serial periods hold 10 builds in all. The slim MVP stretch ran with automatic runs off (DECISIONS 2026-11-13) and owner activity at its lowest (3.5 h proxy), so its slowness is partly the owner being away, not the mode.
- Swarm cost, swarm owner minutes and the swarm's lane-PM overhead are unmeasured (sections 3 and 4).

**Confounds:**

- Unit size and type: the serial stretches built set-up units and the test console; the waves built feature units with migrations. Two swarm PRs (1024, 1040) are about half generated migration snapshot.
- Hours open is not build time: in earlier periods the PM opened PRs after local review (median 0.0 to 0.1 h open); on 11-17 PRs opened early and carried fix rounds (1.1 h).
- Learning: later waves had more rules and rulings. That should have lowered rounds; it did not.
- Different audit methods: the 11-11 and 11-12 nightlies ran five lenses with browsers and refuting verifiers; wave 3 was four code-reading auditors with a drop-before-filing rule.
- Day boundaries: New York days; a UTC cut moves early-morning merges.

---

## 6. The audit system

### 6.1 What was raised

| Source | Dates | Filed items | Digest rows |
|---|---|---|---|
| Home pass (H) | 10-28, 10-29 | 111 | 0 |
| Browse and experience (BE) | 10-28 | 21 | 0 |
| Booking and checkout (BC) | 10-28 on | 58 | 0 |
| JS weight (JS), images (IMG) | 11-01, 11-14 | 15 | 0 |
| Prototype feedback (PF) | 10-31 | 12 | 0 |
| Sprint 1 close (SC) | 11-01 | 27 | 0 |
| Test audit (TA) | 11-03 | 29 | 0 |
| Nightly before the bar (10-29 to 11-03) | | 157 | 0 |
| Nightly after the bar (11-04 to 11-13) | | 25 | 155 |
| Test bloat (TB) | 11-04 | 0 | 1 |
| **Total** | | **455** | **156** |
| Wave 3 | 11-18 | 4 kept | 13 dropped |

Source: ID rows in each file under `audits/`, repeated rows counted once. The 455 matches the 456 that `bun tools/audit-tickets.ts --run` reported on 2026-11-17 (`lanes/lead.md`) within one row.

GitHub side: 529 issues carry an audit ID, but only 348 are unique items. **181 were duplicates** from the 2026-11-01 filing that lost its labels and was re-run; they were closed on 11-02. 110 of the 455 never had a ticket. Source: `gh issue list --state all` titles and labels.

### 6.2 What happened to the 455 filed items

| Disposition | Items | Share |
|---|---|---|
| Fixed by a merged PR (ID or ticket in the title, or the row names the PR) | 255 | 56% |
| Folded into or carried by a unit | 33 | 7% |
| Already fixed, stale or duplicate (closed with no new PR) | 32 | 7% |
| Dropped below the bar (11-04 mass close) | 107 | 24% |
| Closed as decided (won't, not a defect) | 14 | 3% |
| Closed at the 11-18 close-out with no PR trace | 4 | 1% |
| Closed unfixed at the 11-18 close-out | 7 | 2% |
| Still open (auth or protected files) | 3 | 1% |

Source: audit files joined to `issues.json` and `prs.json` by ID and ticket number. Matching is by title only (PR bodies not pulled), so the "fixed" row is approximate.

By pass: section audits fixed 56% of 205; nightlies before the bar 41% of 157 (2026-11-02 alone: 14 of 70, 55 dropped); nightlies after the bar 80% of 25 filed; test audit 28 of 29; Prototype feedback 12 of 12.

### 6.3 Signal and cost

| Pass type | Raised | Kept or fixed | Note |
|---|---|---|---|
| Home pass | 80 candidates | 65 verified (15 refuted, 19%) | 1 "now", 14 "before launch", 49 "later" |
| Nightly before the bar | 157 | 65 fixed (41%) | 80 dropped later |
| Nightly after the bar | 180 | 25 filed (14%), 20 fixed | 155 to the digest |
| Test audit | 29 | 28 fixed | A scoped pass; the highest yield |
| Wave 3 | 17 | 4 kept (24%) | PM re-read every kept item |

Fix rate by lens (345 ticketed items): accessibility 70%, other 70%, architecture 48%, visual 43%, code and DRY 39%, performance 23%. Bugs and accessibility got fixed; DRY and naming nits mostly did not. The code and DRY lens was the largest source of dropped items.

Nightly cost (from `audits/agents-*.md`): 10-31 $13.67; 11-01 about $1.1; **11-02 $70.47 (Fable, 56 subagents) for 70 items, 14 fixed**; 11-03 $5.05; 11-04 $32.06; 11-05 $24.71; 11-06 to 11-09 under $1 each; 11-11 at least $34.26; 11-12 at least $21.53. At least about $205 over 12 nights; 10-29, 10-30 and 11-13 not measured; section and test passes have no cost line. Rough yield: about $2.40 per fixed nightly item (estimate). The 2026-11-02 agent review said the nightly "costs more than the work it audits".

Fix work: about 106 PRs name an audit item (86 by title, about 20 more from `lanes/audit-fixes.md`), about 133k lines changed, inflated by test moves and generated files.

**What this says.** Scoped passes (the test audit, the Prototype feedback) and passes with a verifier and a bar kept their signal. The open-ended nightly before the bar produced a backlog that cost a mass close and a triage day to clear. The bar (2026-11-04) fixed the filing; it did not fix the cost, because the five lenses still ran and wrote 155 digest rows nobody swept. The weekly digest sweep promised in `audits/digest.md` has no PR, ruling or lane record after 2026-11-04.

---

## 7. What failed in the process and tooling

| Failure | Count or instance | Effect | Source |
|---|---|---|---|
| Lane PM subagents cut off mid-round and relaunched | 21 launches for 7 lanes on 11-17: `audit-fixes` 8, `w3-cms` 6, `w3-reviews` 2, `w3-ops-host` 2, three lanes 1 each | Each relaunch rebuilt context from STATUS and GitHub | `lanes/lead.md` 2026-11-17 and the lane rows moved on 2026-11-18 |
| Lead misread a live fixer as dead | 2 (U-076a, U-060) | Duplicate fixer runs; two round 2 fixes of U-060 at once | `lanes/lead.md` 2026-11-17; DECISIONS 2026-11-17 (w3-reviews) |
| Hand-made worktree refused by a hook | U-076c on 11-17; W3-1 (B-1) held on 11-18 | Relaunch with harness isolation; B-1 built but not pushed | `lanes/lead.md`; `STATUS.md` lane `audit-auth` |
| QA posted `action_required` without a database | PR 1030 | Needed a real pass | `lanes/lead.md` 2026-11-17 |
| A lane reported ready with `knip` red | PR 1026 | Another round | `lanes/lead.md` 2026-11-17 |
| PRs going DIRTY while waiting on a read | PR 1030 (and 954 re-ran `human-read` 4 times) | Repeat owner approvals (30 in the run) | `lanes/lead.md`; GraphQL reviews |
| `STATUS.md` publish limit (25 KB) | At least five "Moved from STATUS.md" sections in `lanes/lead.md`, two labelled as size trims; a heading match once cut the Lanes table | Lead time spent trimming; one restore | `lanes/lead.md`; `memory/MEMORY.md` 2026-11-16 |
| Lead end steps not run | 11-17 (context limit): roadmap, standup, schedule, board dates, audit tickets, artifact, memory | Roadmap and board stale for a day | `lanes/lead.md` 2026-11-17 |
| Board status lag | 10 merged units left In Progress or Todo for up to six days | Wrong status on the board the owner reads | `memory/MEMORY.md` 2026-11-16 |
| Issue closes left to the owner | App had no Issues write until late; `audit-tickets.ts` has no close step | 8 close blocks to the owner; 3 issues open although closed in the audit files | `lanes/lead.md` 2026-11-17 bookkeeping |
| Duplicate audit filing | 181 tickets | A day of cleanup | Section 6.1 |
| `human-read` not required until 11-11 | The 2026-11-04 ADR 0010 amendment never reached the `main` ruleset, so 10 PRs merged with `human-read` failing (913, 920, 926, 931, 935, 937, 940, 942, 944, 952), money and auth among them | Critical-tier code merged unread for a week; read after the fact | DECISIONS 2026-11-11 |
| A unit-specific round cap not made general | U-032 cap on 11-10; U-074b ran 9 rounds on 11-11 | Rounds and cost | Section 2.3 |
| Wrong branch prefix | PR 1021 on `pm/` failed `scope-manifest` | Owner closed it; refiled as 1023 | DECISIONS 2026-11-17 (audit-fixes) |
| Sandbox limits for checks | Reviewers and QA cannot reach Postgres, Docker or Chromium; Docker died twice on 11-17 | Runtime checks moved to the PM or skipped | `memory/MEMORY.md` 2026-10-28; lane files |
| Weekly usage limit | The owner's weekly limit paused the lanes on the afternoon of 10-29, with branches half built | Lost afternoon; one round 2 and one fix half done | `lanes/audit-fixes.md` 2026-10-29 13:40; `lanes/critical-path.md` 2026-10-29 |
| Measurement tools | `token-audit` worktree labelling and missing prices; forecast cannot price post-freeze units; board `tokens` undefined; `dave minutes` placeholders; swarm transcripts missing | Questions 3 to 5 of this audit answered partly by estimate | Sections 1, 3, 4 |
| Planned retrospective | Asked for on 2026-10-28 (`drafts/retro-plan.md`); not run until this audit | Lessons landed in memory piecemeal, not as rule changes | DECISIONS 2026-10-28; `drafts/retro-plan.md` |

The pattern: what the lead does by hand at the end of a session (board sync, end steps, closes, trimming STATUS) is what slipped, and it slipped most on the busiest days. Recommendations 1, 4 and 5 move those steps into scripts or lane-end checklists.

---

## What this audit could not measure

- **Owner minutes per unit and per critical read.** No log exists; the board values are placeholders. Section 3 gives counts and a chat proxy only.
- **The swarm day's cost.** Its transcripts are not on disk. The $250 to $500 figure is an estimate from other phases' rates.
- **Lead against lane chats.** The logs do not tell one PM chat from another.
- **True prices for Opus 5.5 and Fable.** The repricing assumes Opus 4.7 prices; the billing console was not read.
- **Rounds for maintenance-period units and for most posted PRs.** Posted checks show final verdicts only; the chat reader misses some sessions.
- **Fix links.** PR bodies were not pulled, so audit fixes were matched by title; `Closes #n` links are unverified.
- **Severity of most audit items.** Only the home pass, browse pass and wave 3 recorded one.
- **Wall-clock build time against waiting time.** `actual days` mixes build, rounds and waits; there is no split.
- **Lost work inside lanes.** Uncommitted work lost at a lane cut-off leaves no trace unless a lane file mentions it.

## Data to start collecting

| What | How | Where |
|---|---|---|
| Cost per lane and per wave | At each lane end, `token-audit` (fixed) over the lane's sessions and worktrees; one line with dollars, calls and model mix | The lane file, and a `cost` column on the lane row |
| Owner minutes | One number per sitting (reads, merges, rulings), typed by the owner or timed by the lead from first to last action | A dated line in DECISIONS or the standup's `ownerMinutes` field |
| Rounds per unit, by check | The lane PM records each round's failing checks and rule IDs in the lane file, in a fixed table, so `check-rounds.py` can read it | `lanes/<lane>.md` |
| Build time against wait time | Branch cut, first ready-for-review, all agent checks green, owner read, merge: five timestamps per unit | Board #19 or the lane file |
| Audit cost per kept item | Each audit pass records its cost beside its kept count | The pass file's Status line |
| Relaunches and lost work | Each lane PM relaunch with its cause (context, turn limit, error) and anything lost | The lane file |
| Owner asks | Each ask with its kind, when it was raised, when it was answered, and whether it could have been batched | The standup's `needsDecision` entries, kept as history |
