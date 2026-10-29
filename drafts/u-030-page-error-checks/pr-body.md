Follow-up PR Components-4 of the `src/lib` layout refactor (audit H-61 and H-65, decided by the owner on 2026-10-29). The home and experience error states were two copies of one component that had drifted on title size and retry width, and browse had a third retry width. Now one `PageError`, built on the existing `PageHeading` shell, serves both pages with the `display-m` title and a "Try again" that fills a phone and takes its label's width from 768 px; browse's retry takes the same width. Briefs: `drafts/u-030-page-error-checks/brief-r1.md` and `brief-r2.md` in ramble-pm. Carrier unit U-030.

## What the guest sees
- **Home error:** the title drops from `display-l` to `display-m` (the owner's H-61 answer). From 768 px "Try again" goes from a 1152 px bar to its label's width (H-65), and the block padding goes from 64 px to `PageHeading`'s 32 px (PM ruling: one shell, one padding).
- **Experience error:** from 768 px "Try again" goes from a 320 px bar to its label's width. Title and padding unchanged.
- **Browse error:** from 768 px "Try again" goes from a 240 px bar to its label's width. Nothing else changes.
- **Phones:** every retry stays full width; experience and browse are pixel-identical at 320 px.
- **Copy:** every title, alert title and alert body is word for word as before.
- **Other pages on `PageHeading`:** unchanged. The group error notice is byte-identical before and after; the ops mailbox unlock form has fields, so the new rule does not reach it.

| | Before | After |
|---|---|---|
| Home, 1280 px | ![home error at 1280 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-1280-light-before.png) | ![home error at 1280 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-1280-light-after.png) |
| Home, 768 px | ![home error at 768 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-768-light-before.png) | ![home error at 768 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-768-light-after.png) |
| Home, 320 px | ![home error at 320 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-320-light-before.png) | ![home error at 320 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/home-error-320-light-after.png) |
| Experience, 1280 px | ![experience error at 1280 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/experience-error-1280-light-before.png) | ![experience error at 1280 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/experience-error-1280-light-after.png) |
| Browse, 1280 px (light and dark) | ![browse error at 1280 px, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/browse-error-1280-light-before.png) | ![browse error at 1280 px, after](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/browse-error-1280-light-after.png) |
| Group error notice, 1280 px | ![group error notice, before](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/group-error-notice-1280-light-before.png) | ![group error notice, after (identical)](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-030-page-error/group-error-notice-1280-light-after.png) |

Captured by the PM from Storybook builds of `main` (`aeae5e6`) and this head; the Vercel preview is not available. Phone captures for experience and browse are in the same folder.

## What changed
- **New `src/components/PageError/`:** `PageError` (props `title`, `alertTitle`, `alertBody`, `retryHref`) renders `<PageHeading title>` with the danger `Alert` and a GET form to `retryHref` holding a secondary "Try again". Tests (heading, alert, form action and method, button, order) and stories (home and experience, phone and desktop).
- **`PageHeading.module.css`:** its lone-action rule now covers a form whose only child is a button: full width on a phone, its own width from 768 px.
- **Call sites:** `HomeContent.tsx` and the experience page render `PageError`.
- **Removed:** `HomeError`, `ExperienceError` and its CSS, their exports, and the `.retry` rules in `HomeStates.module.css`; their tests and stories moved to `PageError`.
- **Browse:** `BrowseResults.module.css` `.error .form { inline-size: auto }` from 768 px. `BrowseResults.tsx` is unchanged.

## Decisions
- One shell: `PageError` composes `PageHeading` rather than its own page CSS (round 2, B17), so its padding is `PageHeading`'s.
- The form rule uses `:has(> button:only-child)` so forms with fields keep their layout. Firefox 111 to 120 lack `:has()`; there the retry is label width on phones too, still working (accepted, H-103).
- `main` moved to `326c958` (Components-1: `CategoryRail.tsx` and `HomeModules.module.css`) after this branch was cut; no shared file and the ruleset does not require an up-to-date branch, so CI's merge-ref run covers the combination.

## Gates (head `4e13d94`, base `aeae5e6`)
- **Builder:** `format:check`, `lint`, `typecheck`, `knip`, `env -u DATABASE_URL pnpm build` pass; `test` 3947 pass. `storybook:test` and e2e need a browser the local sandbox refuses; CI runs both.
- **PM:** gitleaks over the range, no leaks; every changed file is in the combined manifest.

## Checks
- **Round 1 (`2ded8f7`):** review-agent, qa-agent, a11y-audit PASS; architecture-audit FAIL (B17: `PageError` repeated the `PageHeading` shell `ErrorNotice` already uses); spec-compliance FAIL (an unbriefed 64 px desktop padding).
- **Round 2 fixes:** `PageError` composes `PageHeading`; the padding goes with its shell; a stray comma in `ExperiencePage.stories.tsx` (H-98).
- **Round 2 (`4e13d94`), all PASS:**
  - **review-agent:** no other `PageHeading` caller changes; `:has()` fallback is graceful; tests still cover form, button and order.
  - **qa-agent:** every pair read at 320, 768 and 1280 px; ErrorNotice byte-identical; 83 targeted tests pass.
  - **spec-compliance:** round 1 item resolved; every criterion of both briefs passes.
  - **architecture-audit:** B17 fixed; the `PageHeading` extension is sound and reaches no other caller.
  - **a11y-audit (round 1):** one h1 with the old text, the alert keeps `role="alert"`, a real submit button, 44 px targets, reflow at 320 px.

## Audit items
- Close when this PR merges: H-61, H-65, H-98 (`audits/home-2026-10-28.md`).
- Opened: H-99 (HomeStates repeats the shell), H-100 (error copy at call sites), H-101 (browse's third alert-and-retry), H-102 (a stale comment in `BrowseResults.module.css`), H-103 (`:has()` in old Firefox, accepted).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
