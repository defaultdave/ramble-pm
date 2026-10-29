PASS

## qa-agent: U-054 round 2 (head d0695c0)

Scratch copy of `git archive d0695c0`; nothing written to the repo or any worktree; scratch test deleted.
Blocking: none. Non-blocking: real title in `.ics` SUMMARY not separately confirmed; UTC with no VTIMEZONE is valid. The `.ics` check is seconds-granular in effect because `orders_confirmed_at_in_range` forces `confirmed_at >= created_at` (fixture used `created_at + 2.456 s`).
Round 1 finding: greeting fixed ("Hi Pat Rivera. This session was cancelled because of the weather."), exact-text test passes, regenerated screenshot matches.
Merge integrity: `0013_holds.sql` and its snapshot byte-identical to 8b89ea7; journal ends 0011, 0012, 0013_holds, 0014_host_notification_email; 0014 chains from 0013, 0013 from 0012; 0014 snapshot has holds, hold_items and `hosts.notification_email`; 0014 SQL is the ADD COLUMN plus `hosts_notification_email_shape` (shape and 254 chars); `privacy.ts` is the union.
Gates (scratch): unit 4831 (205 files); db with `--maxWorkers=2` 1240 (21 files), no 53300; typecheck, lint, knip, format:check, db:check clean. Build and e2e from the builder.
Fixture-order checks (6 tests, all non-zero-ms `confirmed_at`): manage link A vs B (43-char token, hash matches A only; `resolveToken('manage', ...)` opens the right order); `.ics` from the live-mode provider request valid VCALENDAR, CRLF only, all stamps `^\d{8}T\d{6}Z$`, DTSTART 20261107T210000Z, DTEND 20261107T230000Z, DTSTAMP truncated `confirmed_at`, SUMMARY present, text part has the Calendar link; retry (500 once, same token, third run sends nothing, one `sent` row, 2 provider calls); dead letter (host with no address ends `dead` at max attempts, no message); raw token in sink mode only in `messages.html` and `messages.text_body`; in live mode in no messages, orders or jobs row.
Mutation: `basicUtc` without truncation fails both new ics tests; restored, 21 of 21.
Evidence: `cancellation-720-light.png` regenerated; other four unchanged from round 1.
