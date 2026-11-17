# Status

**Updated:** 2026-11-16 night by the lead. Folded the dependabot-review chat's decisions (DECISIONS 2026-11-16): Blocked items cleared except production migrations 0024 to 0032, Sentry, and two new asks (PR 990, U-129's issue). Merged today: ramble 979, 981, 982, 983, 984, 986, 987, 988; 985 closed. Board #19 reconciled: U-102, U-068, U-128 Done, plus ten merged units that had been left In Progress or Todo (U-004a, U-022, U-055, U-073, U-074a, U-074b, U-074c, U-075, U-125, U-120 as NEW-1; delta-log 2026-11-16); U-130 is #989, Todo. Schedule not refit (delta-log). Filed 28 audit tickets (#991 to #1018). Finished lanes swept to `lanes/`. Older `Updated` lines: `lanes/lead.md`.

## Lanes

Several PM chats run at once. Each works one lane and writes only its own parts (rules: **Several sessions at once** in `.claude/agents/ramble-pm.md`). The lead owns this line, `## Next`, `## Blocked on Dave`, the roadmap, and memory.

| Lane | Scope | Session | State | Last update |
|---|---|---|---|---|
| `guest-signin` | U-130: show the guest sign-in link on screen while email is off (DECISIONS 2026-11-16); owns (guest)/sign-in/, src/server/auth/ (sign-in link path only), src/lib/signIn.ts | PM guest-signin, 2026-11-16 | handed off: scoped, issue #989 (Todo); `units.yaml` entry in PR 990, Dave bypass-merges; ready to build | 2026-11-16 23:55 |
| `lead` | Shared status, `## Next`, roadmap, memory | PM lead, 2026-11-16 night | handed off | 2026-11-17 00:20 |
**Phase:** P1 ✅, P2 ✅, and the P3 gate ✅ (all 2026-10-18; the mobile flow and States page are signed off). P3 is complete, including the desktop revision. **P4 Plan started 2026-10-18:** artifacts 1 to 7 done; Dave adopted the recommendations on 2026-10-20 (tiered merge plus levers 2, 3, 4a; December 1 moves). Applied to every plan file. **Plan frozen 2026-10-20:** tag `plan-frozen-2026-10-20` on `8715c42` (history rewritten first to drop personal notes; see `delta-log.md`). Repo public with secret scanning and push protection; GitHub App created (phase A); merge settings, `integration`, and rulesets live (phase C); 133 unit issues on board #19. **P5 started early, 2026-10-20,** with U-118 (in progress; phases A and C done; see `delta-log.md`). From here the plan files are read-only; reality goes in `delta-log.md`.

## Done
Moved to `lanes/earlier.md` (2026-11-04).

## In flight

### Lane: guest-signin
- **2026-11-16, U-130 scoped, not started.** Problem: guests sign in only by emailed magic link, and email is off (`EMAIL_MODE=sink`), so no guest can create an account or sign in. Dave chose option 2: after a guest submits their address, the page shows the sign-in link (the same `/sign-in/confirm` page the email points to) instead of saying "check your email". Rules: it works only while `EMAIL_MODE` is `sink`; it refuses any address that holds a role grant (host, host_staff, ops roles), and those still go through the ops mailbox; the refusal looks the same as a normal "link sent" reply so it does not reveal which addresses hold roles. Known accepted hole: anyone who types an existing guest's address signs in as that guest. Tier: critical (auth path). The PRD-37 wording change goes in `delta-log.md`, since the PRD is frozen.
- **2026-11-16 night, lead:** issue #989 and its board item exist (Todo). `units.yaml` entry in [PR 990](https://github.com/defaultdave/ramble/pull/990) (`pm/units-u130`), which Dave bypass-merges. Lane row set to handed off: scoped, ready to build.

### Earlier (before lanes)
Moved to `lanes/earlier.md`.

## Open client facts (from the PRD, tracked work, not decisions)
| Q | Needs | Feeds |
|---|---|---|
| Q-11 | Answered by the spike (docs only): FareHarbor, Peek Pro, Mindbody need a partner program; Acuity yes (host on Premium); Square no; Eventbrite read-only. Launch on allocations (ADR 0002). Still needed: Marcus's tally of hosts by system | P4 estimate |
| Q-12 | NYC sales tax map | Launch; tax display is already decided by PRD-78 |
| Q-13 | Sponsor contract: what the $60k needs | Launch scope, gift cards (PRD-34) |
| Q-14 | Launch-day catalog size | P4 |
| Q-16 | Lawyer engaged | Terms, waivers, seller-of-record confirmation |
| Q-19 | Monthly burn | Risk ratings in P4 |
| Q-20 | Newsletter traffic per issue | ADR R7 |
| Q-21 | Investor's GMV bar | G6 |

In this demo, the client facts have no one to ask. Where a fact blocks a decision, the PM proposes a working assumption and logs it as one.

## Blocked on Dave
Refreshed 2026-11-16 night by the lead from the dependabot-review chat's decisions (DECISIONS 2026-11-16). Cleared that day: the architecture rulings (PR 987), lint and TypeScript configs protected (PR 988), U-102 done on MFA, the App's Issues read and write, the `CLAUDE.md` gate bullet (PR 986), the Dependabot job skip (PR 984), the beacon firewall rule, BotID Basic, private vulnerability reporting. Older lists: `lanes/lead.md`. Nothing here blocks the current goal.

1. **PR 990** (`PM bookkeeping: add U-130 to units.yaml`): bypass-merge it, so the U-130 PR passes `scope-manifest`. `gh pr merge 990 --repo defaultdave/ramble --merge --admin`
2. **Production migrations 0024 to 0032:** run the `db-migrate-production` workflow before the next production deploy.
3. **U-129:** create its issue and board item (PR 978 merged 2026-11-14), so it can be set Done.
4. **Sentry** (held until the demo is shared): the server and browser projects, the ops address, the three alert rules in `docs/runbooks/alerting.md`, then `SENTRY_DSN` and `SENTRY_BROWSER_DSN` (the browser one at build time too) in Vercel.
5. **Method Layer 0** (open decision 3): not needed until P6.

Open item from the ADR 0007 measurement amendment (2026-10-18): what New York and US law require for first-party analytics and web-vitals beacons (PRD-73); not researched yet.
Legal and vendor questions for the real job, logged, not blocking the demo: Ramble holding host money and the New York gift law (counsel, Q-16); card refund age limit at 12 months (ask Stripe); Stripe's Connect review time.

## Next
**Now (lead, 2026-11-16 night).** The slim MVP's build units are all merged: the test console (U-123, U-124), dictionary phase 0 (U-128), page maps (U-009 READMEs), the image underlay (U-129). In order:
1. **U-130, guest sign-in link on screen** (lane `guest-signin`, issue #989, critical tier): starts once Dave bypass-merges PR 990. Without it no guest can sign in on the deployed site.
2. **The walkthrough** as guest, host and ops (`drafts/walkthrough-2026-11.md`), Dave's own time, alongside U-130; its "Before you start" needs a refresh first (U-123 and U-124 have landed; U-130 changes guest sign-in).
3. **Page-change units** from the walkthrough's findings table; dictionary phases 1 to 4 ride with them.
4. **Close U-051 and U-105** on board #19 once a CI e2e run on `main` shows the booking-path spec ran, not skipped (PRs 911 and 915 merged; `lanes/w1-checkout-smoke.md`).
5. **Maintenance backlog:** 28 audit tickets filed 2026-11-16 (#991 to #1018: IMG-1 to IMG-7, N1105-1 to 3, N1111-1 to 8, N1112-1 to 9, N1113-1), on the Maintenance sprint; untriaged. N1105-2 is half done by PR 988 (eslint and tsconfig now protected; the gitleaks, vitest, knip and package files are not).

**Goal set by Dave, 2026-11-13 night (lead): wrap the build at a slimmer MVP.** Parked (not cut, can come back): gifting (U-063, U-062a, U-064a, U-064b, U-113, U-062b), reviews (U-060, U-044, U-061), host cancel (U-070), and also U-083b, the CMS (U-076a to c, U-078), NEW-7 and all of wave 4 (U-095, U-092, U-042, U-086, U-089, U-096, U-100). Still built: the test console, NEW-4 (`/ops/dev`) then NEW-5 (reset demo data), one standard-tier lane, about 1.75 agent-days. Then: (1) close out U-108 (done), (2) a walkthrough of the site as guest, host and ops with the seeded personas, findings to a page-changes list, (3) page-change units from that list, (4) Dave uses the site to test ideas. Automatic runs are off (DECISIONS 2026-11-13). Board #19 has no Parked option; parked units stay Todo with no Sprint.

**Text dictionary approved 2026-11-14 (Dave, all as recommended):** `drafts/dictionary-design-2026-11.md`. Next: phase 0 as unit U-128 (scaffold `src/lib/copy/`, `common.ts`, `meta.ts`, `format.ts`, the jsx-no-literals warning, the island import restriction, the contract test, the per-route client JS baseline), standard tier, about 0.75 agent-days, its own small PR. Phases 1 to 4 ride with the walkthrough's page-change units. Phase 0 is done: U-128 merged (PR 975), the `src/lib/copy/` line merged (PR 983).

**Superseded 2026-11-13:** the 2026-11-04 goal (maintenance drain, now in `lanes/lead.md`) and the MVP wave 3 and 4 plan in `drafts/mvp-replan-2026-11-10.md` s4.

**Standing rule since 2026-10-29 (DECISIONS):** the PM proceeds on its recommendation wherever no owner-only capability is needed, logs the call, and lists it under "Decided for you" on the roadmap; work waits for Dave only on promotions, bypass merges, rulesets, the App, secrets, repo creation, deploys and spend.

Older Next items (done or superseded): `lanes/lead.md`.

## Next chat
One block per lane. Open each lane in its own desktop chat with `/ramble-pm lane: <name>` (the PM claims the lane first). The lead's block is the default `/ramble-pm`.

### Next chat: guest-signin
- **Before you start:** Dave bypass-merges PR 990 (`gh pr merge 990 --repo defaultdave/ramble --merge --admin`). Issue #989 and its board item exist.
- **Run:** `/ramble-pm lane: guest-signin` in a new desktop chat; the lane launches the builder (`/senior U-130` in a worktree) and runs the review checks.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read the `guest-signin` lane entry in `STATUS.md` and the 2026-11-16 guest sign-in decision in `DECISIONS.md`. In ramble, read `src/server/auth/auth.ts` (magicLink `sendMagicLink`), `src/server/auth/handler.ts`, `src/lib/email/route.ts`, `src/app/(guest)/sign-in/` and its README. Build U-130: while `EMAIL_MODE` is `sink`, the sign-in page shows the guest a "Continue" link to the confirm page instead of "check your email"; addresses holding any role grant get the normal "link sent" reply and the link goes to the ops mailbox only; with any other email mode nothing changes. New accounts are created the same way as now. Tests cover sink on and off, a guest address, a role-holding address, and that the two replies look the same. Update the sign-in README and add copy through `src/lib/copy/`. Set U-130 In Progress on board #19 when the builder starts. Builder done looks like: a worktree branch `unit/U-130-guest-signin-on-screen` with tests passing, stopped before push. The lane then checks the files against the manifest, pushes and opens the PR through `agent-git.ts`, requests Dave's review, runs review, qa, spec-compliance, a11y-audit and architecture-audit, and queues auto-merge; critical tier, so `human-read` waits on Dave's approval. Log the PRD-37 wording change in `delta-log.md`. Don't commit outside the merge-desk scripts.

### Next chat: walkthrough
- **Before you start:** nothing. Pick local (`pnpm dev`, seeded) or the deployed site; on deployed, guest sign-in waits for U-130 and the personas are not seeded.
- **Run:** `/ramble-pm lane: walkthrough` in a new desktop chat, beside the guest-signin lane.
- **Model and effort:** Sonnet, medium.
- **Prompt:** Read `drafts/walkthrough-2026-11.md` in ramble-pm and the slim MVP goal under `## Next` in `STATUS.md`. First refresh the script's "Before you start" against `main`: the test console (`/ops/dev`, U-123) and reset demo data (U-124) have landed, so step 3 on jobs changes, and U-130 (guest sign-in link on screen while email is off) is coming. Then run the five passes with Dave one at a time (guest not signed in, book as a guest, host owner, ops, admin), phone width first, recording every finding he gives in the findings table with route, role and width. Read pages with `get_page_text` or `read_page`; screenshots at `scale: 0.5`. Done looks like: all five passes walked, the findings table sorted into page-change units (each with a scope line, size and tier) and won't-fix rows, and a proposed order in the lane's "For the lead" notes. Don't commit in ramble.

### lead

**Update 2026-11-16 night (read first):** **Run:** `/ramble-pm`, Sonnet, medium. **Before you start (Dave):** the Blocked list (PR 990 first). **Prompt:** Fold the `guest-signin` and `walkthrough` lanes' "For the lead" notes into `## Next`. When U-130 merges: set it Done on board #19, then file the walkthrough's page-change units (`units.yaml` entries in one `PM bookkeeping:` PR, Dave creates the issues) and open a lane per disjoint file set. Triage the 28 tickets filed 2026-11-16 (#991 to #1018) into the page-change units or the Maintenance tail. Lead end steps: `roadmap/status.json` and today's standup, schedule, `roadmap.ts`, board dates, `audit-tickets.ts --run`, republish the artifact, publish.

Older updates: `lanes/lead.md`.
