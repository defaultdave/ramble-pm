# Components-4 brief, round 1: one PageError

UNIT: U-030 (carrier unit). Branch: `unit/U-030-page-error`. BASE: `main`, cut after refactor PR G (PR 270) merged. PR title and commits: `U-030: one PageError for the home and experience error states, and one retry width`.

Source: `drafts/lib-layout-refactor.md`, "Follow-up PRs after G", row Components-4; audit rows in `audits/home-2026-10-28.md`:
- **H-61** (decided 2026-10-29, owner): `HomeError` and `ExperienceError` are one component that has already drifted on title size and the retry width cap, and browse has a third retry pattern. Build one `PageError` **with the `display-m` title and a content-width retry button from 768 px**.
- **H-65** (decided 2026-10-29, owner): the home error's "Try again" is 1152 px wide on desktop while the experience and browse ones cap theirs; **content width from 768 px**, delivered by H-61's `PageError`.

Figma: library frame "S3 Error with retry", node `53:249` (`docs/design/figma-library.json`). Tokens only.

## Scope manifest

```
SCOPE MANIFEST
IN SCOPE:
  new
    src/components/PageError/PageError.tsx        props: title (the h1 text), alertTitle, alertBody,
                                                  retryHref; renders the h1 (display-m), the danger
                                                  Alert, and a GET form to retryHref with a secondary
                                                  "Try again" Button; full width on a phone, content
                                                  width from 768 px (min-width breakpoint)
    src/components/PageError/PageError.module.css page column on --size-content-max with the gutter on
                                                  the outer wrapper (the H-31 pattern in
                                                  HomeStates.module.css .page/.pageInner)
    src/components/PageError/PageError.test.tsx   heading level and text, alert text, form action and
                                                  method, button label
    src/components/PageError/PageError.stories.tsx one story per caller's copy (home, experience)
    src/components/PageError/index.ts
  edited
    src/app/(guest)/HomeContent.tsx               <PageError title="Ramble" ... retryHref="/" />
    src/app/(guest)/experiences/[slugAndId]/page.tsx  <PageError title="Experience" ...
                                                  retryHref={experiencePath(address)} />
    src/components/HomeStates/index.ts            drop HomeError
    src/components/HomeStates/HomeStates.module.css  delete .retry and .retry > button if nothing else
                                                  uses them; keep .title (HomeTitle and others use it)
    src/components/HomeStates/HomeStates.stories.tsx, HomeStates.test.tsx  move the error cases to
                                                  PageError's files
    src/components/ExperiencePage/index.ts        drop ExperienceError and ExperienceErrorProps
    src/components/ExperiencePage/ExperiencePage.stories.tsx, ExperiencePage.test.tsx  same
    src/components/BrowseResults/BrowseResults.module.css  .error: the retry button takes content
                                                  width from 768 px, as PageError's does (browse keeps
                                                  its own error block inside the results; only the
                                                  retry width joins)
  deleted
    src/components/HomeStates/HomeError.tsx
    src/components/ExperiencePage/ExperienceError.tsx
    src/components/ExperiencePage/ExperienceError.module.css
OUT OF SCOPE:
  src/components/ErrorNotice.tsx and the group error.tsx boundaries (a client retry; a different
  pattern; Suggestions if you see a merge); the literal "Ramble" brand h1 (H-79, Components-7);
  copy changes (every title, alert title and body stays word for word); BrowseResults.tsx markup;
  any other state component; .claude/**, docs/plan/**.
REFERENCE CODE:
  src/components/HomeStates/HomeError.tsx, src/components/ExperiencePage/ExperienceError.tsx and
  ExperienceError.module.css (today's two versions; the experience one already has display-m and a
  20rem cap from 768 px); src/components/Alert, src/components/Button.
```

## PM rulings

- "Content width from 768 px" means the button sizes to its label (no `flex: 1`, no fixed cap) at 768 px and up; below 768 px it stays full width, as both pages do today.
- The home error's title shrinks from `display-l` to `display-m`: that is the owner's H-61 answer, a visible change.
- Browse keeps its alert-and-retry block inside the results; only its retry width changes to match.

## Evidence

The local sandbox refuses Chromium, so do not attempt captures; the PM builds Storybook on `main` and on the branch and captures the home error, experience error and browse error at 320 px and 1280 px. Name the story ids that show each in your report.

## Gates

`pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm knip`, `env -u DATABASE_URL pnpm build`, gitleaks over the range. `pnpm storybook:test` and e2e need a browser; if the sandbox refuses them, say so (CI runs both).
