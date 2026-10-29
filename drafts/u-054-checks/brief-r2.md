Unit: U-054 "Booking emails". **Critical tier, into `integration`.** **Round 2: focused re-check.** Round 1 at `769c79b2be51886440a0992e8a1c488f82d2eb6b`: spec, QA, a11y PASS; review FAIL (`.ics` DTSTAMP kept non-zero milliseconds) and architecture FAIL (B7 exports). Read your round 1 verdict first: `/Users/davidfleming/Workspace/ramble-pm/drafts/u-054-checks/r1-<check>.md` (`r1-review`, `r1-arch`, `r1-spec`, `r1-qa`, `r1-a11y`). PM ruling (DECISIONS): the dev mailbox keeping the body, and so the manage link, in `messages.html`/`text_body` is accepted per design doc line 484.

New head `d0695c0b6bac487e28fcbbc23670eb7e43a04fa9` on `unit/U-054`:
1. `5e64bcf`: sets `0013_host_notification_email` (SQL, snapshot, journal entry) aside before the merge.
2. `9d56e42cddda89c87378f96042fd714cdb80440e`: merge of `origin/integration` at `8b89ea7dd84c95bb2ee5bb034050c864b25afe0b` (U-014a, `0013_holds`); builder reports it clean.
3. `d0695c0`: round 2 changes and the regenerated migration `0014_host_notification_email`. Diff: `git -C /Users/davidfleming/Workspace/ramble diff 9d56e42cddda89c87378f96042fd714cdb80440e d0695c0b6bac487e28fcbbc23670eb7e43a04fa9` (13 files).
   - `src/lib/ics.ts` `basicUtc` truncates to whole seconds; tests with non-zero milliseconds on start, end and stamp check every DTSTAMP/DTSTART/DTEND matches `^\d{8}T\d{6}Z$`, and 59.999 s truncates down.
   - `src/server/jobs/bookingEmails.ts`: `BookingEmailError` and `liveManageToken` no longer exported; the db test asserts the message.
   - Cancellation greeting `Hi ${name}. ${reasonLine}` in `src/lib/email/bookingBody.ts` with an exact-text test.
   - `bookingRender.test.ts` asserts the Google Calendar URL in the plain-text part.
   - New `src/lib/email/bookingBody.test.ts` tests each body function.
   - `maxMoneyLines` removed; `MAX_LINES` from `src/lib/pricing.ts` used by `orderSummary.ts`, `bookingTemplates.ts`, `src/server/db/bookingEmails.ts`.
Whole branch against integration: `git -C /Users/davidfleming/Workspace/ramble diff 8b89ea7dd84c95bb2ee5bb034050c864b25afe0b...d0695c0b6bac487e28fcbbc23670eb7e43a04fa9` (43 files).

Judge the head as the PR that ships: each round 1 finding of yours is fixed; the merge lost nothing from either side (holds migration 0013 and its snapshot from integration, `src/lib/privacy.ts` the union, the journal ends 0012, 0013, 0014); the regenerated `0014_host_notification_email` has the same SQL as the old 0013 and its snapshot chains from integration's 0013; nothing new is out of scope. Note: U-016 and U-047a, also in review, use 0014 too; whichever lands later regenerates, so do not fail on that.

Builder gates on `d0695c0`: 4831 unit, 1240 db with `--maxWorkers=2` (21 files), 160 e2e, build, db:check, db:generate no new file, knip, format, lint, typecheck. PM gitleaks over `origin/integration..d0695c0`: clean. Evidence: `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-054-booking-emails/` (`cancellation-720-light.png` still shows the round 1 greeting; being regenerated).

**Load:** several units in review on a shared Postgres near its connection limit. Run db tests with `pnpm exec vitest run --project db --maxWorkers=2`; 53300 is the environment, rerun. qa-agent: rerun your fixture-order checks (manage link A vs B, `.ics` validity now with a non-zero-ms `confirmed_at`, retry, dead letter, raw token location) on the head.

Rules: `/Users/davidfleming/Workspace/ramble-pm/drafts/wave3-review-rules.md`. **Never run `git checkout`, `git switch`, `git reset`, `git merge`, or any write in `/Users/davidfleming/Workspace/ramble` or any existing worktree.** Scratch copy only, in a directory no other agent uses: `mkdir -p $TMPDIR/u054r2-$RANDOM`, `git -C /Users/davidfleming/Workspace/ramble archive d0695c0b6bac487e28fcbbc23670eb7e43a04fa9 | tar -x -C <that dir>`, then `pnpm install`. Postgres on 127.0.0.1:5432 (user and password `ramble`), with `dangerouslyDisableSandbox: true`. e2e only through the lock. Never push or call GitHub. Your final message is the verdict (PASS or FAIL first line, header `## <check name>: U-054 round 2 (head d0695c0)`), nothing else.
