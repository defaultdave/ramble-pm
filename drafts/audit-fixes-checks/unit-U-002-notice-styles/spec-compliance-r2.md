PASS

## spec-compliance: U-002 "notice styles" (head 5aa3be8, merged 3a4c0f3)

### Blocking
- None.

### Non-blocking
- None.

### Unconfirmed
- None.

### Acceptance criteria (round 2)
| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Round-1 criteria 1 to 8 hold on origin/main...HEAD; criterion 7 allows src/app/global-error.tsx | PASS | `git diff --name-only origin/main...HEAD` lists 8 files, all within the allowed set plus global-error.tsx (`src/app/global-error.tsx`). Round-1 anchors still present: `src/components/PageHeading.module.css:1-10`, `src/components/PageHeading.tsx:8-9`, `src/components/ExperiencePage/ExperienceError.module.css:8` (same `var(--space-8) var(--space-6)` gutter). Round 2 changed no style, copy, story, or route file. |
| 2 | Notices.test.tsx has describe('PageHeading') rendering title and one child; asserts level-1 heading, child, and module page class on container | PASS | `src/components/Notices.test.tsx:45-60`: renders `<PageHeading title="Plan your day"><p>Pick a time</p></PageHeading>`; asserts `getByRole('heading', { level: 1, name: 'Plan your day' })` (line 52), `getByText('Pick a time')` (line 57), and `getByRole('banner').className` matches `/page/` (line 58). The header is the container from `src/components/PageHeading.tsx:8`. Local run: `npx vitest run src/components/Notices.test.tsx` gave 3 of 3 passed. |
| 3 | global-error.tsx imports the same base and tokens stylesheets as the guest layout, no header or footer, still renders html and body | PASS | `src/app/global-error.tsx:5-6` imports `@/styles/base.css` and `@/styles/tokens.css`, the same two imports as `src/app/(guest)/layout.tsx` (the `import '@/styles/base.css'` and `import '@/styles/tokens.css'` lines). The component renders `<html lang="en">` and `<body>` (`src/app/global-error.tsx:10-11`), with `<main>` and `<ErrorNotice>` only; no GuestShell, header, or footer. |
| 4 | Round 2 (b2fd1d4..5aa3be8) touched only Notices.test.tsx and global-error.tsx | PASS | `git diff --stat b2fd1d4 5aa3be8` lists exactly `src/app/global-error.tsx` (+2) and `src/components/Notices.test.tsx` (+18). |

### Evidence
- Command output: `npx vitest run src/components/Notices.test.tsx` in the worktree, 3 passed (3). No image evidence was needed; this is a spec check.

---
<sub>spec-compliance | haiku | read-only | round 2 | head 5aa3be8</sub>
