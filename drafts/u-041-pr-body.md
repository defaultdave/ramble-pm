Unit U-041, issue #47. Standard tier, into `integration` (the real checkout and confirmation pages live there; DECISIONS 2026-10-29). Built on U-040's pre-merge head, then merged with `integration` (the merge tree equals a clean replay of its commits); one more round retired the demo click-through. Review round 1: spec and a11y passed; review, architecture and QA asked for changes (a refusal from the desktop panel opened the phone sheet as a modal; a duplicate age range helper; the sheet's calendar not following the chosen date; focus lost after a panel refusal). Round 2 fixed them and all five checks passed (review, qa, spec-compliance, architecture-audit, a11y-audit).

SCOPE MANIFEST
IN SCOPE: `useBookingDraft`; date, time, party (adults and children, 21+ rules); book or gift switch; `reserveSpaces`; states S4 and S5; booking bar on phones, panel on desktop; the `unavailable` outcomes and a bookings-paused state on the bar, sheet and panel; retiring the demo click-through.
OUT OF SCOPE: the checkout and confirmation pages beyond removing their demo branches, U-040's dates list beyond its row links, `docs/plan/`, `.github/`, `.claude/`.

## What was built
- **Booking bar on phones, sheet for the choices, panel from 768 px**, all reading one draft per experience (`useBookingDraft`, a module store read with `useSyncExternalStore`). Date, time, party with adults and children and the 21+ rules, and a book or gift switch (gifts say they are not open yet).
- **Real holds:** Continue calls `reserveSpaces` and goes to the real `/checkout/<holdId>`. A double click makes one hold. Refusals show honestly and keep what the guest chose: S4 (one device's seat limit), S5 (sold out, with other dates that have room), too many holds with a retry time, cancelled, past, and bookings paused. A refusal from the panel stays in the panel with focus on the notice; one from the bar or sheet shows in the sheet.
- **Booking choices** read the next 60 days, up to 60 sessions; the sheet's calendar opens on the chosen date's month.
- **Rules in `src/lib`:** the draft reducer, the outcome mapping, and one `allowedChildAges` beside `childAgeAllowed`, now shared by checkout and the booking choices.
- **Demo click-through retired:** the demo checkout and demo confirmation, `demoCheckout.ts`, the demo e2e spec and routes, and the experience page's `bookHref` are gone. Upcoming date rows link to `?date=` on the same page, which preselects that date.

## Gates
format:check, lint, typecheck, knip; test 6,359; test:db 1,567 with `--maxWorkers=2`; build without `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 161 (the demo spec removed); storybook:test 264; gitleaks (no leaks). QA on a seeded production build at 320 to 1280 px: real holds from the bar and the panel, one hold per double click, S4 and S5 with the choices kept, 21+ and kids rules, paused, no sideways scroll, the panel's refusal inline with no dialog.

## Not done
- Releasing a hold when the guest leaves checkout: `releaseHold` keeps its `TODO(U-041)` as an open owner call (audit item BC-32).
- A booking does not yet confirm end to end: after Pay, nothing in the app delivers the fake payment's event to the webhook intake, so the order waits on "Checking your payment" (audit items BC-37, BC-38; outside this unit).
- Smaller items logged: a silent party fit when a time has fewer spaces (BC-34), date cells 39 px wide at 320 px (BC-35), focus after a refusal inside the sheet (BC-39).

## Evidence
![Before: the experience page, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041/experience-390-light-before.png)
![After: the booking bar, 390 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041/after-r2-bar-390-light.png)
![Before: the experience page, 1280 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041/experience-1280-light-before.png)
![After: the booking panel with a date, time and party chosen, 1280 light](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041/after-r2-panel-1280-light.png)
![After: Continue reaches the real checkout with spaces held](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041/after-r2-book-to-checkout-1280-light.png)
![QA: a sold-out refusal stays in the panel, no sheet](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041-qa-agent/r2-a-s5-panel-refusal-1280.png)
![QA: S4, one device's seat limit, on a phone](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-041-qa-agent/phone-s4-refusal-390-light-after.png)

Every state (sheet steps, kids and 21+, paused, dark scheme): `evidence/pr/unit-U-041/` and `evidence/pr/unit-U-041-qa-agent/` in `ramble-pm`. Verdicts: `drafts/u-041-checks/` there.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
