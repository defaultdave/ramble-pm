# Full-run audit, pre-freeze half, 2026-11-18

**Status: draft for the owner.** Read-only analysis of the Ramble run from the project start (first decision 2026-09-16, P0 setup 2026-09-28) to the plan freeze (tag `plan-frozen-2026-10-20`, commit `8715c42`, 2026-10-20 17:42 New York time). It is the companion to [full-run-audit-2026-11-18.md](full-run-audit-2026-11-18.md), which covers the freeze to the ticket close-out, and it ends with the whole-run lessons for the planning method. Every recommendation is a proposal for the owner to decide. Nothing here changes a rule, a file or the board.

**Asked for:** the same audit request (DECISIONS 2026-11-17, lead), extended to cover the project from concept to today.

**How it was made:** one read-only pass over `plan/` and `DECISIONS.md`, `delta-log.md`, `lanes/`, `memory/`, `open-client-facts.md` and `drafts/` in this repo; `git log` up to the freeze tag in `ramble` and the files at that tag (`docs/product/`, `docs/adr/`, `docs/plan/units.yaml`, `docs/design/figma-library.json`); `docs/plan/units.yaml` on `origin/main`; `gh project item-list 19` (490 items, 41 with `actual days`); `gh pr list` and `gh issue list` on `defaultdave/ramble`; transcripts under `~/.claude/projects/*ramble*` priced with the post-freeze audit's section 4 method (deduplicated by message and request ID, Opus 5.5 at $5 / $25 per million, cache write $6.25 or $10, read $0.50; Sonnet at $3 / $15; Haiku at $1 / $5); the vault notes `Projects/Personal/Playbook/Roadmap.md` and `Projects/Ramble Process Audit/Ramble Process Audit 2026-11.md` (the 2026-11-04 process audit). Phase costs on 2026-10-18 are split by the hour against commit and decision times, so the boundaries are approximate.

---

## Executive summary

### What matters, in numbers

1. **P1 to P4 took five calendar days, and most of it was one day.** After P0 closed on 2026-09-28 the project waited 18 days (one decision, on 10-08). The market scan ran on 10-16. On 10-18 the PRD was signed, all ten ADRs accepted, the Figma library and the mobile flow built and signed, and plan artifacts 1 to 3 approved: 30 of the 50 pre-freeze decisions, against about 3.0 hours of owner chat time by the proxy. Artifacts 4 to 7 and the freeze followed on 10-19 and 10-20. No phase had a planned date or an effort estimate; the only planned date, a P5 start on 10-26, was beaten by six days. (Section 1.)
2. **The discovery skip cost little in requirements and a lot in purpose.** The PRD was drafted from the whole sealed brief, so it saw every fact a discovery could have found. None of the eight open client facts (Q-11 to Q-14, Q-16, Q-19 to Q-21) blocked or changed a unit, and none was ever answered. What the skip removed was the conversation that sets appetite and purpose. The PRD kept every real-job requirement "so the estimate reflects the real job" (PRD section 11), which produced a 116-unit, 259-day plan for a demo. The 2026-11-02 re-plan then cut 24 units (43.5 days) and parked 43 (72.6 days): half the board's estimate-days. (Sections 1.2 and 1.3.)
3. **All seven artifacts were produced, reviewed and frozen on time; the estimate was wrong in one direction.** 37 of the 41 measured units closed below their own P10 (optimistic) point, where a calibrated range puts about 4. The panel was four briefs of one model family with no measured agent cycle time to anchor on. The reference-class check compared weekly PR throughput, which is bound by the owner's hours and so agrees with almost any unit estimate. A cycle-time check would have caught it: merged PRs in the owner's two agent-built reference repos closed a median 1.4 hours (robo-advisor, 72 PRs) and 0.8 hours (Harp-Diem, 38 PRs) after opening. (Sections 2.3 and 2.4.)
4. **The uncertainty scores did not predict error, and the risk they flagged was never built.** Uncertainty-1 units closed at a median 30% of estimate, uncertainty-2 units at 20%. All four uncertainty-3 build units (U-046, U-093, U-096, U-101) were cut or moved to the test bed. The three spikes were cheap and decisive (about a day in all, one blocker found before the build: Figma refuses Code Connect writes on the Professional plan). The method's real unknowns (agent speed, review rounds, owner minutes, orchestration) were never scored, because scores attach to units. (Section 2.2.)
5. **Design covered the guest flow and left the rest to the build.** The Figma file holds 29 screens (14 mobile, 10 states, 5 desktop), all guest-facing; 51 of the 88 page routes on `main` today are host or ops pages with no frame. 6 of the 13 units added after the freeze trace to undrawn or unbroken-down screens (4.75 likely days). The Figma-against-built check the owner asked for on 2026-10-24 appears in 9 of 51 unit check folders, and 4 of the owner's 12 prototype feedback items (2026-10-31) were Figma mismatches found by eye. (Section 5.)
6. **The pre-freeze run cost about $632 on disk and about 4.9 owner chat hours; P0 is unmeasured.** P4 was $386 of it. Transcripts before 2026-10-09 are not on disk, so P0 (2026-09-16 to 09-28) has no cost or time figure. The post-freeze audit's pre-build row (10-16 to 10-19, $246) holds the chats only: the subagent transcripts for those days add $299, which puts the run at about $5,360 before the swarm-day estimate. (Section 4.)
7. **Process machinery designed before any unit ran was the most reversed part of the plan.** 9 of the 50 pre-freeze decisions were reversed or abandoned in P5, and six of the nine were process: the two-lane merge desk and tiered auto-merge (retired 2026-11-04), `units.yaml` as the actuals record (replaced 10-22), the owner building the money core (handed to agents 10-29), `/review-pr` per unit (never run). The merge desk itself came up in two days against three likely, then cost 17 sync PRs, 7 promotions and a deleted `integration` branch before it went. (Sections 3 and 6.)

### Recommendations, ordered by expected payoff

| # | Change | Where | Evidence | Cost to do | What shows it worked |
|---|---|---|---|---|---|
| 1 | **Pilot before the estimate freezes.** Build the walking skeleton and two or three representative agent units before artifact 6; use their wall-clock time, rounds and owner minutes as the reference class, then freeze | `plan-project` skill stage 6 in vig (`global/skills/plan-project/SKILL.md`, owner's file); this project's BUILD-PLAN shape for the next one | 37 of 41 actuals below P10; median ratio 0.24; reference repos close PRs in 0.8 to 1.4 h; the pipeline lens anchored a C1 unit at "about half a day" (section 2) | One to two days at the start of the next project | The next frozen range holds about 80% of actuals between P10 and P90 |
| 2 | **Merge the method changes already written.** The 2026-11-04 changes (agent units estimated in rounds, owner minutes measured, appetite and first walkable milestone at intake, a preflight unit) sit on vig branch `review-swarm-and-chores` (`31efd21`, `768dad4`), not on `main` | vig `main` (owner's merge) | `git branch --contains 768dad4` lists only `review-swarm-and-chores` and `pr-images-skill` | Minutes, plus a read | `/plan-project` on `main` asks for appetite and estimates fan-out units in rounds |
| 3 | **State purpose and appetite at intake, and prune real-job-only work for a demo.** A brief field "demo or real job"; for a demo, requirements the demo only simulates go to a separate real-job list with no units, and the industry-gap tiers are applied only when a real launch is the goal | `plan-project` intake and `templates/brief.md`; the PRD template's engagement section | PRD section 11 kept simulated requirements in the plan; 24 units cut and 43 parked on 2026-11-02, half the estimate-days; Tier A items (Sentry, backups, BotID, firewall, runbooks) dropped the same day (section 1.3) | An hour | The next plan's cut plus parked share stays under 15% of estimate-days |
| 4 | **A design coverage check at the P3 exit.** Every route in the work breakdown maps to a frame, or to a "from the library, no frame" line with its own estimate; a click-through of the mobile flow is part of the gate; UI units get a required Figma-against-built check that compares screenshots | BUILD-PLAN P3 exit (next project); `drafts/wave3-review-rules.md`; the `qa` brief | 51 of 88 routes have no frame; U-120, U-121, U-125, U-126, U-127 added after the freeze; U-024 seven mismatches; PF items 4 of 12; the click-through was added only on 2026-11-01 (section 5) | Half a day per project, plus one agent prompt | No unit added after the freeze for a missing screen; the owner finds no Figma mismatch by eye |
| 5 | **Score the method's assumptions, not only the units.** Artifact 3 gains an assumption register: agent speed, rounds per unit, owner minutes per gate, merge machinery cost, each with the first P5 event that tests it and the refit it triggers; `forecast.ts` reads the measured ratio | `plan-project` artifact 3 template; `tools/plan/forecast.ts` | No uncertainty-3 unit built; the "calibrate after the first three merges" step never ran; the forecast stuck at the 2026-11-03 refit (section 2.2; post-freeze audit section 1) | Half a day | The first refit after three merges uses the measured ratio and moves the forecast |
| 6 | **Start process machinery at its simplest and add a tier on measured need.** One merge lane with a required human read on the money paths from day one; a second lane only when a measured cost says so | `plan-project` artifact 5 and 7 notes; ADR template in vig | The two-lane desk retired after 13 days; 17 syncs, 7 promotions, one branch deletion (section 6) | None; a rule | No sync or promotion PRs in the next build |
| 7 | **Keep the record of the early phases.** Export a cost and owner-time line at each phase gate, and keep transcripts for the length of a project | Lead end steps (`.claude/agents/ramble-pm.md`); Claude Code transcript retention (a settings change, owner's) | No transcripts before 2026-10-09; P0 cost and time unmeasured; the $299 subagent gap (section 4) | Minutes | The next audit gives P0 a cost figure |
| 8 | **Ask the owner for fewer, deeper gate reads.** One gate per phase with a stated reading time and a short "what I checked" line, instead of 30 rulings in a day | BUILD-PLAN gate list (next project); `ramble-pm.md` gate wording | 30 decisions and 35 owner messages on 2026-10-18, about 3.0 proxy hours; the cross-check of PRD and design (checkout drawn for a real card form while ADR 0003 chose the fake gateway) was missed that day (sections 1 and 3) | None | Each gate records reading minutes and at least one owner change or question |

The whole-run lessons, which join these findings to the post-freeze audit's, are at the end of this file: [Whole run: lessons for the planning method](#whole-run-lessons-for-the-planning-method).

---

## 1. Timeline: plan against actual, P0 to P4

### 1.1 Phases

| Phase | Planned | Actual | Calendar | Cost on disk, repriced | Owner chat proxy | Exit and source |
|---|---|---|---|---|---|---|
| P0 Setup | No date or effort; spec created 2026-09-28 | 2026-09-16 (domain and home decisions) to 09-28 (repo, PM agent, memory, v0 desktop wireframes, discovery kit) | 13 days | Unmeasured (no transcripts before 10-09) | Unmeasured | BUILD-PLAN P0 ✅ 2026-09-28; DECISIONS rows 2026-09-16 to 09-28 |
| Wait | None | 2026-09-28 to 10-16: one decision (10-08, perf examples on a branch) | 18 days | About $7 (four short sessions that mention Ramble, vault cwd) | Under 0.1 h | DECISIONS 2026-10-08; BUILD-PLAN open decision 2 ("discovery waited until the owner was free") |
| P1 Market scan | Parallel research agents; no date | 2026-10-16 evening, one session: 6 teardowns, fee and cancellation claims checked | 1 day | $77 ($66 of it Sonnet research agents) | 0.5 h | DECISIONS 2026-10-16 (two rows) |
| P1 Discovery | Interview sessions, reveal, discovery delta | Session 1 opened 2026-10-18 and closed after the greeting; skipped the same day | 0 | Within the PRD figure | | DECISIONS 2026-10-18; `docs/product/discovery/README.md` |
| P1 PRD and P2 ADRs | No date; "P2 and P3 can run in parallel once the PRD is signed" | 2026-10-18 morning to 14:29 (commit `5e02590`): PRD v1.0 with 78 requirements after two review rounds; ten ADRs accepted in one sitting, three with changes; industry-gap review (113 capabilities plus 17, 249 free-tier claims) adopted by 20:53 | Half a day | $74 | Part of 3.0 h (10-18) | DECISIONS 2026-10-18; STATUS at the tag |
| P3 Design | No date | 2026-10-18 afternoon and evening: library (127 variables, 28 components, 26 icons), 14 mobile screens, 10 states, signed; desktop revision (5 templates) the same day | Half a day | $98 | Part of 3.0 h | DECISIONS 2026-10-18 P3 gate; `docs/design/figma-library.json` (`built` 2026-10-18) |
| P4 Seven artifacts | No date; "the estimate is recorded and dated before any build unit starts" | Artifacts 1 to 3 approved 2026-10-18; 4 and 5 on 10-19 with the three spikes; 6 and 7 and the freeze on 10-20 | 3 days | $386 (10-18 night $136, 10-19 $163, 10-20 $88) | 0.1 h (10-19), 1.3 h (10-20), plus part of 10-18 | DECISIONS 2026-10-18 to 10-20; commit `8715c42` |
| P5 start | 2026-10-26 (the estimate's start date) | 2026-10-20 (U-118 begun at the freeze); first PR 134 on 10-21 | 6 days early | | | `plan/06-estimate.md` Headline; `delta-log.md` 2026-10-20 |

Sources for cost and time: transcripts with a cwd under `Workspace/ramble`, 6 chat sessions and 166 subagent transcripts first written 10-16 to 10-20; the proxy sums gaps of 15 minutes or less between typed owner messages plus 2 minutes per message (63 messages in all), as in the post-freeze audit's section 3.2. The proxy does not see the owner's time in Figma, on GitHub or in a console, so the 10-20 evening (the GitHub App and runbook phase A, "not logged" in `delta-log.md` 2026-10-21) is missing from it.

**What the table shows.** The planning phases were fast and cheap, and the gates were quick. The method assigns estimates only to build units, so P0 to P4 had nothing to be late against. That is a gap in the method for any client engagement: the client pays for discovery and planning too.

### 1.2 What was skipped or rushed

| Item | What happened | Why | Source |
|---|---|---|---|
| Discovery role play | Skipped after session 1's greeting; the sealed-brief rule lifted; PRD drafted from the brief | "Get to the spec and the build sooner; the brief already holds the business facts" | DECISIONS 2026-10-18 |
| Reveal and discovery delta | Dropped with the skip; the package loses its "what discovery missed" piece | Follows from the skip | DECISIONS 2026-10-18; BUILD-PLAN P1 step 4 |
| Layer 0 of the method | BUILD-PLAN open decision 3 says greenfield work needs a discovery layer ahead of the design doc; Ramble was the test of it, and the test did not run | Same | BUILD-PLAN open decision 3 |
| Market scan scope | Six competitors on three topics; supply side, market size, SEO and legal floors deferred | "Enough context for discovery and the PRD" | DECISIONS 2026-10-16 |
| PRD, ADR and design gates | 30 decisions on one day, including the PRD sign-off with 14 judgment calls adopted as recommended, ten ADRs in one sitting and the P3 gate | Owner time | DECISIONS 2026-10-18 |
| P3 scope | Host and ops screens kept out of P3, "built from the library in P5"; no click-through for the mobile flow | Wireframe review recommendation, adopted | DECISIONS 2026-10-18 (wireframe review) |
| Calibration | "P5 calibrates it after the first three merges" | Planned, never run | `plan/06-estimate.md` Calibrating in P5 |

Rushed is a fair word for 10-18 only. The plan files themselves were reviewed in rounds (PRD two, work breakdown four, design doc one adversarial review), so the drafting was not rushed; the owner's reading of them was.

### 1.3 What it cost later

**The open client facts cost nothing, because nothing depended on them.** The eight open facts became working assumptions (`open-client-facts.md`). Q-11 was answered by a docs-only spike and fixed ADR 0002's allocations model; Q-13 put gift cards (PRD-34) first in the cut order; Q-16 made gift validity configuration. None appears again in DECISIONS, the delta log or a lane file as a cause of rework. The demo has no client to ask, and every fact fed real-job scope that was later cut.

**The cost of the skip and the plan's weight sits in the re-plans.** The PM's PRD carried the real job by design (PRD section 11: "a requirement stays in the plan even when the demo simulates it"). The industry-gap review then added Tier A capabilities as P4 input. A discovery conversation is where the owner, as the client, would have said what the build is for and what it is worth. On 2026-11-02 the owner said it: "Ramble is a demo and a test bed ... not a site for real users" (`drafts/demo-replan-2026-11-02.md`).

| Gap found in P5 | Pre-freeze origin | P5 effect | Source |
|---|---|---|---|
| The plan was sized for a real launch | PRD section 11; industry-gap Tier A; Q-07 "plan to December 1" | 2026-11-02: 24 units cut (43.5 days), 43 parked (72.6), 8 test bed (13.0); Sentry, backups, BotID, the firewall rule and runbooks dropped; two later re-plans | `delta-log.md` 2026-11-02; post-freeze audit 1.4 |
| Host and ops screens undrawn | P3 scope decision | U-121 Ops admin UI kit (1.25 days), U-125 Host listings and settings (0.75), U-126 Ops dashboard (0.5); the pipeline lens predicted UI review rounds "likely to go past m" there | `drafts/mvp-replan-2026-11-10.md` section 3; `plan/estimate-panel.json` method notes |
| No sign-in screens or host profile page | P3 and the work breakdown | U-120 Sign-in screens (0.75), U-127 Host profile page (0.75) | same |
| No scheduler for the session generator | Work breakdown | U-122 Rolling session horizon (0.75) | same |
| No unit wired card photos | Work breakdown | U-039 grew by about half a day | `delta-log.md` 2026-10-28 |
| No unit delivered the fake gateway's events in the running app | Work breakdown; the Prototype milestone assumed it | Built on U-045b's branch with a new table, `fake_gateway_state` | `delta-log.md` 2026-10-30 |
| Prototype stub glue had no unit | Artifact 7 | Under half a day, carried as a lead item | `lanes/lead.md` Next (e) |
| Demo tooling absent | The PRD described real users only | U-123 Test-site console (1.25), U-124 Reset demo data (0.5), U-130 Guest sign-in link while email is off (0.75), U-021c test photos | `units.yaml` on `origin/main`; board #19 |
| Checkout drawn for a real card form | P3 drew Figma 05 with Payment Element and express pay on 10-18; ADR 0003 chose the fake gateway the same day | Checkout pays in two taps, a recorded departure | `audits/design-departures.md` (U-047b, 2026-10-29) |
| Layer rules not written at the freeze | Design doc 4.2 named `lib/email`; no project `architecture.md` | Ramble's own `architecture.md` on 10-21; U-001 scope ADDED the import-boundary lint; the architecture audit later caused 36% of check failures | `delta-log.md` 2026-10-21; post-freeze audit section 2 |
| BUILD-PLAN gate 5 contradicted ADR 0010 | Gate 5 says merges to `main` are the owner's; the tiered rule says standard units merge themselves | A delta line to record the reading | `delta-log.md` 2026-10-21 |

---

## 2. Planning method quality

### 2.1 The seven artifacts

| # | Artifact | Produced | Review | Size | Held up in P5 |
|---|---|---|---|---|---|
| 1 | Design doc | 2026-10-18 | Adversarial review, Appendix B; four client decisions | 861 lines | Mostly: two amendments before the freeze (gift lock order, capability tokens); paths changed by the 10-21 layer rules |
| 2 | Work breakdown | 2026-10-18 | Four review rounds; 132 units | 298 lines, record in `units.yaml` | The units held; the gaps in 1.3 were missing units, not wrong ones |
| 3 | Scores | 2026-10-18 | Four-lens panel | 224 lines | Scores did not predict error (2.2) |
| 4 | Dependency graph | 2026-10-19 | Graph review | 1,212 lines | The money-core path was real; the build ran far faster than the path |
| 5 | Execution model | 2026-10-19 | Owner approval | 402 lines | Routing changed twice: levers at the freeze, money core to agents on 10-29 |
| 6 | Estimate | 2026-10-20 | Four-lens blind panel, 3 units moderated | 280 lines, 8,871-line panel JSON | Off by about four times (2.3) |
| 7 | Resourcing | 2026-10-20 | Two drafts | 204 lines | Owner hours never measured |

All seven were produced, in order, with the rule "frozen before any build unit starts" kept to the minute: U-118 began at the freeze. The weakness lay elsewhere: every artifact after 2 rested on estimates that no measured agent work had checked.

### 2.2 Uncertainty scoring and spikes

Frozen `units.yaml`: 135 units (132 open plus U-118 and the two P4 spikes); uncertainty 1: 48, 2: 81, 3: 6; spikes flagged on 4.

| Measure | Value | Source |
|---|---|---|
| Ratio of actual to likely, uncertainty 1 | median 0.30, mean 0.35 (19 units) | board #19, 41 units with `actual days` |
| Ratio, uncertainty 2 | median 0.20, mean 0.25 (22 units) | same |
| Ratio, complexity 1 / 2 / 3 | median 0.61 / 0.21 / 0.23 (4 / 28 / 9 units) | same |
| Ratio, standard / critical tier | median 0.32 / 0.20 | same |
| Ratio, agent fan-out / human-led as routed | 0.28 / 0.24 by sum (36 / 5 units); the human-led money units were handed to agents on 10-29 | same; DECISIONS 2026-10-29 |
| Uncertainty-3 build units | U-046, U-093, U-101 cut; U-096 test bed. None built | board #19 `plan` field |

**What worked.** The spikes. Three ran on 2026-10-19 for about a day of agent time: U-013 (Neon concurrency) confirmed the row-locked hold path that U-014a built; the U-008a and U-009 cache spike set rules both units used (they closed in 0.37 and 0.11 days); U-028 found that Figma refuses Code Connect writes on the Professional plan, which settled U-029 before any build time went into it (DECISIONS 2026-10-19). A fourth candidate set (U-093, U-101, U-046, U-096) was deliberately not spiked and given wide ranges.

**What did not.** Higher scores made the estimate larger but did not make the build slower, so the ratio fell as scores rose. The scores measured how hard a unit would be for a person; for agents, review rounds set the pace (`delta-log.md` 2026-10-24 and 10-26). The one place the panel's notes were right was outside the scores: three of four lenses warned of rework at the seams, and the pipeline lens warned about undrawn host and ops screens.

### 2.3 The frozen estimate against reality

The post-freeze audit measured agent work at 27% of estimate (19.7 days against 73.4, 41 units). Two figures sharpen it: 37 of the 41 closed below their own optimistic point, and no unit ran over.

Why the method missed it:

1. **No measured anchor for agent time.** "One estimate-day is 6 focused hours of the owner's time ... for fan-out units, the day is the pipeline's elapsed time" (`plan/06-estimate.md`). No agent-built unit had been timed. The pipeline lens anchored "a C1 U1 standard fan-out unit is about half a day (an hour of agent build, review, one small fix round, CI)" (`estimate-panel.json`); U-111, a C1 unit, closed in 0.04 days.
2. **One model family, four briefs.** Artifact 6 says so itself: only three units diverged 2x, "which overstates how independent the panel was". All four lenses shared the same prior about agent speed.
3. **The systemic factor only allowed for overruns.** 0.9 / 1.1 / 1.5, set from the owner's human-led history (one project a week early, one epic 36 to 43% late). Nothing in the range allowed for work at a quarter of estimate.
4. **The reference class checked the calendar, not the unit.** It compared 3.5 to 8.6 PRs a week against the forecast's 15 to 22 weeks. Those weeks were set by the owner's hours, so the check agreed with the forecast whatever the unit estimates said.
5. **Calibration had no mechanism.** The plan named the check (gate hours after the first three merges) but no tool or step ran it, and `forecast.ts` could not learn from actuals (`delta-log.md` 2026-10-24: "the forecast does not yet learn from actuals").

### 2.4 What a reference-class check should have used

| Input | What it would have shown | Where it was available |
|---|---|---|
| PR open-to-merge time in the owner's agent-built repos | Median 1.4 h (robo-advisor, 72 merged PRs) and 0.8 h (Harp-Diem, 38); an approximation of branch cut to merge, since branches open before PRs | `gh pr list --state merged` on both repos, run for this audit |
| Review rounds per merged PR in the same repos | The pace-setter for agent units, as wave 1 showed on 10-24 | PR review and commit history |
| A two- or three-unit pilot after the walking skeleton | U-023 closed in 0.25 days against 1.5 on 10-22, two days after the freeze | `delta-log.md` 2026-10-22 |
| Owner minutes per merged PR | The plan's largest assumption (1.1 h a gate), never measured | Nothing recorded; a pilot would have timed it |

The 2026-11-04 process audit proposed estimating agent units in review rounds and owner minutes; that change is written in vig but not on `main` (recommendation 2).

### 2.5 Scope growth after the freeze

| Measure | Value | Source |
|---|---|---|
| Original breakdown | 132 units at artifact 2 (10-18), 134 at artifacts 4 and 5 (10-19), 135 in the frozen record with U-118; demo scope 116 units, 259 days at P50 | `units.yaml` at the tag; `plan/06-estimate.md` |
| Units added to `units.yaml` after the freeze | 12 (U-119 to U-130), 9.5 likely PM days | `units.yaml` on `origin/main` against the tag |
| Units added on the board only | U-021c | board #19 |
| Growth | 13 units, 11% of the demo count; about 4% of its P50 days | |
| Why they were added | 6 design or breakdown gaps (U-120, U-121, U-122, U-125, U-126, U-127; 4.75 days); 4 demo needs (U-123, U-124, U-130, U-021c); 3 new asks or finds (U-119 analytics, U-128 dictionary, U-129 image spike) | `drafts/mvp-replan-2026-11-10.md` section 3; DECISIONS 2026-10-22 |
| Scope added inside units | U-001 import-boundary lint; U-039 card photos (+0.5 day); fake delivery glue on U-045b; stub glue | `delta-log.md` 2026-10-21, 10-28, 10-30 |
| Net scope | 88 units built, 45 not built (23 cut, 15 parked, 7 test bed): scope fell by about a third | post-freeze audit 1.4 |

Growth was small and shrinkage was large. The plan's main error was its weight.

---

## 3. Decisions

### 3.1 Count and type

50 rows in `DECISIONS.md` from 2026-09-16 to 2026-10-20, every one recorded as the owner's (three as "the owner, as the client").

| Type | Count | Examples |
|---|---|---|
| Framing (before P1) | 10 | Domain, name, fresh repo, mobile first, discovery before research, client and PM agents, perf branch |
| ADR acceptances and amendments | 16 | Ten ADRs; R11 and R12 folded in; ADR 0007 measurement; industry-gap folding; board on ADR 0010; capability tokens; tiered auto-merge |
| Gate sign-offs | 8 | PRD, P2 exit, P3 gate, artifacts 1, 2, 3, 4 and 5, freeze decisions |
| Scope and environment | 7 | Gift validity as configuration, repo public at the freeze, Hobby, no domain, data contracts, Prototype milestone, workbook order |
| Design | 4 | Library first and Code Connect, wireframe review, design system plan, Code Connect unpublished |
| Process and permissions | 3 | Discovery skipped; the PM sets up the board; the PM runs the freeze's GitHub steps |
| Research scope and safety | 2 | Small market scan; agents read pages only after one clicked into a live checkout |

By day: 2026-10-18 holds 30, 10-20 holds 5, 10-19 holds 3.

### 3.2 Owner overrides

| Kind | Count | Instances |
|---|---|---|
| A PM recommendation accepted with a change | 3 | ADR 0003 (fake gateway only, no Stripe account); ADR 0007 (repo private now, made public again at the freeze the same day); ADR 0010 (approval on the first units, then automatic) |
| An owner-initiated change to the plan | 7 | Discovery skipped; P3 library first plus Code Connect; U-118 added; tiered auto-merge (after the first resourcing draft showed a 2027 date); the Prototype milestone; the board set up by the PM; the freeze's GitHub steps handed to the PM |
| Recommendations adopted as written | 30 | Including all 14 PRD judgment calls and the freeze levers |

The owner steered by changing the frame (merge rule, milestone, phase order) and accepted the PM's content. That is a sound use of a client's attention; the cost was that no gate on 10-18 caught a cross-artifact conflict (the checkout design against ADR 0003).

### 3.3 Decisions reversed or abandoned in P5

| Pre-freeze decision | What happened | When | Source |
|---|---|---|---|
| Tiered auto-merge: critical units to `integration`, weekly promotion | Promotions on merge from 10-26; `integration`, syncs and promotions retired | 2026-11-04 | DECISIONS 2026-10-26, 2026-11-04 (PR 905) |
| `units.yaml` as the record of actuals (ADR 0010) | Board #19 holds status and actuals; `units.yaml` stopped | 2026-10-22 | `delta-log.md` 2026-10-22 |
| `/senior` and `/review-pr` per unit (ADR 0010) | `/review-pr` never ran; checks posted per agent through the App | from 10-21 | 2026-11-04 process audit, section 2 |
| The owner builds the money core (freeze decision) | U-014a, U-016, U-047a, U-049 to agents under pattern notes | 2026-10-29 | DECISIONS 2026-10-29 |
| No third-party analytics script (ADR 0007) | Vercel Web Analytics on guest pages (U-119) | 2026-10-22 | DECISIONS 2026-10-22 |
| Real-job scope stays in the plan (PRD section 11, Q-07) | Ramble is a demo and test bed; 24 cut, 43 parked | 2026-11-02 | `delta-log.md` 2026-11-02 |
| Industry-gap Tier A as launch scope | Sentry, backups and restore, runbooks, the firewall rule dropped | 2026-11-02 | `drafts/demo-replan-2026-11-02.md` |
| Passkeys and step-up for staff (design doc, U-004b) | Cut; email sign-in links for every role | 2026-11-02 | `delta-log.md` 2026-11-02 |
| Code Connect mapping as a P5 unit (U-029) | Cut | 2026-11-10 | `drafts/mvp-replan-2026-11-10.md` |

9 of 50 (18%). Two more reversed before the freeze: the sealed-brief discovery with reveal (09-28, reversed 10-18) and the private repo (reversed the same day). The decisions that held were the product and stack choices: mobile first, Next.js and Cache Components, Neon with row-locked holds, CSS Modules with Figma tokens, the fake gateway, the clean build.

---

## 4. Cost and owner time

### 4.1 Tokens and cost by phase

| Phase | Dates | Chats | Subagents | Total, repriced | Tokens (M) |
|---|---|---|---|---|---|
| P0 and the wait | 2026-09-16 to 10-15 | about $7 on disk (vault sessions that mention Ramble) | | unmeasured | |
| P1 market scan | 10-16 to 10-17 | $11 | $66 | $77 | 182 |
| P1 PRD and P2 ADRs | 10-18 10:00 to 14:59 | | | $74 | |
| P3 design | 10-18 15:00 to 20:59 | | | $98 | |
| P4 artifacts and freeze | 10-18 21:00 to 10-20 | | | $386 | |
| **10-16 to 10-20** | | **$326** | **$306** | **$632** | **940** |

Hour-level rows do not split chat and subagent cost. By day: 10-18 $305 (chats $176, Sonnet and workflow subagents $129), 10-19 $163 (chats $59, workflow subagents $104, the scoring and estimate panels), 10-20 $88. Opus 5.5 carried $496, Sonnet 5.5 $137. 4,834 calls. Source: every assistant message with a cwd under `Workspace/ramble`, deduplicated, priced as above.

**Reconciliation with the post-freeze audit.** Its pre-build row (10-16 to 10-19) shows chats $245 and subagents $0. The chats match this count exactly; the subagent transcripts for those days hold $299 more (market scan agents on 10-16, workflow subagents on 10-18 and 10-19). 10-20's $88 sits inside its Prototype row. Whole run on disk, with the $299: about $5,360, before the swarm day's $250 to $500 estimate. The pre-freeze half is about 12% of it.

Per artifact of planning output: $386 for seven artifacts and the three spikes, about $55 an artifact. Per decision: about $13. Planning was the cheapest phase of the run by a wide margin; its cost was in what it set in motion.

### 4.2 Owner time

| Day | Typed messages | Proxy hours | What happened |
|---|---|---|---|
| 10-15 to 10-17 | 8 | 0.5 | Market scan |
| 10-18 | 35 | 3.0 | PRD, ten ADRs, design, artifacts 1 to 3: 30 decisions |
| 10-19 | 3 | 0.1 | Artifacts 4 and 5, spikes |
| 10-20 | 18 | 1.3 | Artifacts 6 and 7, freeze, GitHub App (App work not in the proxy) |
| **Total** | **63** | **4.9** | |

Not measured: P0 (no transcripts), Figma review time, the GitHub App and runbook phase A on the evening of 10-20, any reading done outside chat. The plan's budget for P5 was 10 to 15 hours a week; the planning phases took about five hours of typed attention for a plan the owner was asked to stand behind as the client. The 2026-11-04 process audit found about 40 typed hours a week in the first two build weeks, so the planning phases were the lightest owner load of the project.

---

## 5. Design

### 5.1 The Figma file against what got built

| Measure | Figma (2026-10-18) | Built (`origin/main`) | Source |
|---|---|---|---|
| Variables and styles | 127 variables in five collections, 12 text styles, 3 elevation styles | Exported to CSS custom properties by U-023 in 0.25 days | `docs/design/figma-library.json`; `delta-log.md` 2026-10-22 |
| Components | 28 (16 planned in the design system plan) | 88 component folders under `src/components` | `src/components` on `origin/main` |
| Screens | 29: 14 mobile, 10 states, 5 desktop, all guest-facing | 88 page routes; 51 under host or ops paths, with no frame | `src/app/**/page.tsx` on `origin/main` |
| Code Connect | Spike only; publish refused on the Professional plan | One `.figma.ts` file, in the spike folder; U-029 cut | DECISIONS 2026-10-19; mvp-replan |
| Click-through | v0 desktop click-through in P0; none for the mobile flow at the P3 gate | Added 2026-11-01 (74 actions, 15 flows), "to supply evidence for what a P3 click-through would have caught" | `delta-log.md` 2026-11-01 |
| Known departures | | 9 recorded (brand assets, photos, browse paging, display type, section spacing, two-tap checkout, browse filters, booking panel, checkout header) | `audits/design-departures.md` |

The token contract held: names in Figma matched code, and the export unit had nothing to decide. The guest flow was designed well enough that its departures are small and recorded. Everything outside the guest flow was designed in code by agents, and the units added for it (section 1.3) are the measurable cost.

### 5.2 The Figma-against-built review gap

| Evidence | Value | Source |
|---|---|---|
| First miss | U-024 (PR 173): tests, lint, a11y and the review swarm passed; a manual compare found Stepper, Chip, Badge, Alert and Input different from Figma and a Checkbox misaligned | memory `figma-vs-built-review` (2026-10-24) |
| The owner's ask | A standing visual check for UI units; agent type never decided | same |
| How often it ran | Figma referenced in 9 of 51 unit check folders today (8 of 32 on 2026-11-04) | `drafts/*-checks`; 2026-11-04 process audit, Pattern 2 |
| What the owner found by eye | 4 of 12 prototype feedback items were Figma mismatches (PF-2, PF-3, PF-4, PF-6) | `audits/prototype-feedback-2026-10-31.md` |
| Where it lived | A memory line and a review-rules sentence; in no agent file | 2026-11-04 process audit, Pattern 2 |

The gap is a pre-freeze one: ADR 0006 set the per-PR gates (smoke, axe, Lighthouse) and named no visual comparison, though P3 had just built the review frames a comparison needs (14 frames in `figma-library.json`). The check was added as prose after the first miss and ran when someone remembered it.

---

## 6. Process and tooling built before the freeze

| Item | Built when | Held up how | Source |
|---|---|---|---|
| ADR 0010 agent workflow | Accepted 2026-10-18, amended 10-18 (board) and 10-20 (tiered merge) | Its pipeline choice (`/review-pr`) never ran; its record (`units.yaml`) was replaced in two days; its gates (App-posted checks) held for the whole run | DECISIONS; 2026-11-04 process audit |
| Merge desk runbook | Written before the freeze (443 lines, plus `merge-desk-setup.md`) | Phase C ran at the freeze; the D2 dry run passed on 10-21 with three departures from the text; auto-merge on 10-21, five days before the planned P5 start | `delta-log.md` 2026-10-20 and 10-21 |
| U-118 merge desk and agent identity | Started at the freeze; estimate 1.5 / 3 / 7 | Closed in 2 days, 33% under; added 3.4 days to the frozen critical path | `delta-log.md` 2026-10-21; `plan/06-estimate.md` |
| The GitHub App | Created by the owner 2026-10-20 | Held: posts checks, pushes `unit/` branches; lacked Issues write until late, so closes fell to the owner | post-freeze audit section 7 |
| `scope-check.ts` | Written 10-21 | Four review findings fixed the first day; a promotion rule misread `promote/` heads; later caught a wrong branch prefix (PR 1021) | `delta-log.md` 2026-10-21, 10-25 |
| Two-lane merge (`integration`, weekly promotion) | Decided 10-20 | Branch deleted by a promotion on 10-24; 17 sync PRs and 7 promotions by 11-04; retired 11-04 for one lane with a `human-read` check. That replacement's ruleset change did not land until 11-11, and 10 critical PRs merged with `human-read` failing in between | `delta-log.md` 2026-10-24; DECISIONS 2026-11-04, 11-11; 2026-11-04 process audit P3 |
| Approval window | Added 10-21, closed 10-24 | Worked as designed: the owner approved the first PRs, then checks alone merged standard units | DECISIONS 2026-10-21, 10-24 |
| Board #19 and 133 unit issues | Set up 10-20 at the freeze | Became the record of actuals; status lag and placeholder fields later (post-freeze audit sections 3 and 7) | DECISIONS 2026-10-20; `gh issue list` (issues 1 to 133 created at the freeze) |
| Forecast and roadmap tools | `forecast.ts`, `roadmap.ts`, `board-dates.ts` at the freeze | The roadmap held as the owner's view; the forecast could not price post-freeze units or learn from actuals | `delta-log.md` 2026-10-21 to 11-17 |

The pattern matches the 2026-11-04 process audit's finding that mechanisms held and prose did not. The App, the required checks and the scope check were mechanisms and lasted. The two-lane rule was a mechanism too, but it was sized for an owner-read bottleneck the plan predicted and the build did not have.

---

## Whole run: lessons for the planning method

These join this file's findings with the post-freeze audit's. Each is stated for the method, so it applies to the next project.

1. **Measure agent speed before you freeze, and estimate agent work in rounds.** The four-lens panel had no measured agent unit, its range allowed only overruns, and 37 of 41 units closed below P10 at a median 24% of estimate. Post-freeze, rounds (median 2, 78% of units needing a second) set the pace, and the forecast stopped learning on 2026-11-03. A two- or three-unit pilot and a cycle-time reference class would have fixed the scale before any date was promised.
2. **Owner time is the plan's binding input, so measure it from the first gate.** The plan priced the owner at 1.1 hours a gate and 10 to 15 hours a week; 30 of 31 recorded owner-minute values are zero placeholders, and the only measures are proxies (4.9 chat hours for all of P1 to P4; 15.2 and 13.6 hours in the first two build weeks; 98 approvals, 30 of them repeats). A plan whose largest assumption is never measured cannot be calibrated.
3. **Set purpose and appetite at intake; a demo must not carry a real job's scope.** Skipping discovery removed the conversation that would have said what Ramble was for. The PRD kept simulated requirements by rule, and the run then spent three re-plans cutting 19% and parking 31% of the estimate-days. Growth after the freeze was 11% of the unit count; shrinkage was about a third.
4. **Score the method's assumptions, not only the units.** Uncertainty scores tracked human difficulty and missed agent pace; every uncertainty-3 unit was cut before it was built. The real unknowns (agent speed, rounds, owner minutes, orchestration cost, the merge machinery) were never scored or tested. Spikes worked well where they were pointed; nothing pointed one at the method.
5. **Design must cover every screen the build makes, and the check against it must be mechanical.** P3 drew 29 guest screens and no host or ops screens; 51 of 88 routes were designed in code and six units were added for them. The Figma comparison ran in 9 of 51 check folders, and the owner found mismatches by eye.
6. **Build process at its simplest and grow it on measured need; make every rule a mechanism.** The pre-freeze merge desk was the most reversed part of the plan, and post-freeze the swarm's gains and failures were orchestration: 21 lane launches for 7 lanes, lead end steps skipped on the busiest day. Rules that became checks held across both halves; rules written as prose recurred (B2, B17, B7 in 21, 20 and 17 units).
7. **Keep the record as you go, or the delta cannot be written.** P0 has no cost, the swarm day has no transcripts, `token-audit` undercounts by 47%, the pre-build subagent cost was missed by $299, and the board's token field matches no metric. The method's end product is "where the plan was wrong", and that needs a cost and time line written at every gate and every lane end.

---

## What this audit could not measure

- **P0 cost and time (2026-09-16 to 09-28) and the 18-day wait.** No transcripts before 2026-10-09 are on disk; the Ramble git history starts on 2026-10-18 because the repo was fresh and its history was rewritten at the freeze.
- **Planned phase dates and effort for P0 to P4.** None were set; only the P5 start (2026-10-26) was planned.
- **The phase split inside 2026-10-18.** Costs are cut by the hour against commit and decision times; the boundaries are approximate, and the hour rows do not split chat and subagent cost.
- **Owner time outside chat:** Figma review, the GitHub App and console work on 2026-10-20, reading of the plan files.
- **What a real discovery would have changed.** There is no transcript and no discovery delta, so the counterfactual is inference from the brief and the re-plans.
- **True prices for Opus 5.5 and Sonnet 5.5.** The repricing reuses the post-freeze audit's assumption; the billing console was not read.
- **Cycle time from branch cut in the reference repos.** PR open-to-merge is a proxy; branches open before PRs.
