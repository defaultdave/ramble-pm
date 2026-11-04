# Standards owner pack (2026-11-04)

Five open owner tickets and the approved gallery island all need text in `.claude/standards/architecture.md` in ramble, which only Dave edits. Each change below is an exact replacement against `origin/main` `d0203cc`. Apply, commit as `PM bookkeeping: ...`, push, PR, bypass-merge; the PR closes #737, #738, #433, #434, #320.

## 1. Allowlist (line 40): N1102-3 #737, N1030-8 #434, BE-17 island

Replace `show with scripting off (Dave, 2026-11-01, #487).` with:

> show with scripting off (Dave, 2026-11-01, #487); `StickyAside`, so the booking panel sticks at both ends of the experience page (Dave, 2026-11-01, PR 300); the filter bar's `WhenDetails`, which opens and closes the date disclosure and loads the date picker on first open (PR 299); and the experience gallery strip, which sets its tab stop only while the strip overflows (Dave, 2026-11-04, BE-17).

## 2. Hooks (line 40): N1102-4 #738

Replace `which \`SiteMenu\` and the filter bar's \`WhenDetails\` share (Dave, 2026-11-01, PR 303).` with:

> which `SiteMenu` and the filter bar's `WhenDetails` share (Dave, 2026-11-01, PR 303). `useWhenDisclosure` is local to the filter bar (`WhenDetails` and `LazyDatePicker` only; PR 299); a hook used by one island's files is not a shared hook.

## 3. Layers (line 33): N1030-8 #434

Replace `- \`src/lib\` imports only \`src/lib\` and pure libraries (Zod, date math). It is safe in the browser.` with:

> - `src/lib` imports only `src/lib` and pure libraries (Zod, date math). It is safe in the browser. `src/lib/pages/` holds the page view models (PR 270): plain functions under the same rule, called by `src/app` and `src/components`.

## 4. B13 (line 76): N1030-7 #433

Replace `falls back to a direct Postgres read (U-009 spike) |` with:

> falls back to a direct Postgres read (U-009 spike). Also allowed: a presentation-only read in `server/**` (a banner, cover photos, a filter's options) that logs through `rethrowOrLog` and renders without its data, when the page still works and nothing is written |

## 5. B6 (line 69): BC-15 #320

Replace the row's closing `instead of \`requireRole\` |` with:

> instead of `requireRole`. System money paths are exempt too: a ledger write such as `postEntries` takes no `Caller`, because only server functions that have already checked their own subject (checkout, the payment webhook, refunds, jobs) call it, and it is never exported to a Server Action |

## Recommendation

Take all five as written. Each one writes down a call you already made (PRs 270, 299, 300, U-016's ruling, the 2026-11-04 island) or a pattern 39 call sites already follow (`rethrowOrLog`), so no code changes.
