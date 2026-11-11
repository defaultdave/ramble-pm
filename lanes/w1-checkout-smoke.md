

## Moved from STATUS.md 2026-11-11
- **Before you start (Dave):** approve PRs 911 and 915 (checks are green). Then from the ramble checkout push and merge the CI branch: `git push origin unit/U-105-ci`, open a PR to `main` for `.github/workflows/ci.yml` only, bypass-merge with `gh pr merge <n> --merge --admin --repo defaultdave/ramble`. After one green `e2e` run with the database, add the smoke as a required check in the ruleset (his). No Neon secret needed.
- **Run:** `/ramble-pm lane: w1-checkout-smoke`, Sonnet, medium.
- **Prompt:** Read `STATUS.md` lane entry w1-checkout-smoke. Confirm PRs 911 and 915 merged (`git ls-remote` for main), set U-051 and U-105 Done on board #19 once the CI branch has landed and the e2e job ran the booking-path spec (not skipped), record actuals (U-051 about 0.5 d, U-105 about 1 d), and file the Figma differences (S6 email field, S7 copy, S10 heading) as a decision for Dave. Don't commit.


