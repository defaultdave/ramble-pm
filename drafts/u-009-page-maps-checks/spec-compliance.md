VERDICT: PASS

# Spec compliance: U-009 page maps (branch unit/U-009-page-maps at 58dee048e87fee50a0fcafa3d58325b268c7af6e)

| AC | Verdict | Evidence |
|---|---|---|
| AC1 | PASS | `src/app/README.md` links all 8 trees: (guest), (guest)/new-york, (guest)/experiences/[slugAndId], (guest)/sign-in, (checkout)/checkout, (checkout)/(site), (host), (ops). 660 link targets across the 9 READMEs checked with a balanced-paren parser, 0 broken. |
| AC2 | PASS | Line 5 of all 8 route-tree READMEs: "Read from main at 2db68ea (2026-11-15). A PR that changes this tree ... updates this file in the same PR." Index README states the same rule. 2db68ea is an ancestor of origin/main. |
| AC3 | PASS | All 8 have `## Legend`, at least 2 mermaid flowcharts each, each block declares classDef server/cached/streamed/client/action, a `Component \| Kind \| File \| Notes` table (new-york's header is column-padded), and `## Worth knowing`. |
| AC4 | PASS | 63 page.tsx under src/app (git ls-files). 61 are linked by file from a README. The 2 not linked by file, `(guest)/sign-in/page.tsx` and `(guest)/sign-in/confirm/page.tsx`, are covered by route and backticked path in `(guest)/sign-in/README.md` (lines 3, 107, 139). No page.tsx is uncovered. |
| AC5 | PASS | `git diff origin/main...HEAD --name-only` lists 9 files, all README.md (8 tree READMEs plus `src/app/README.md`). |
| AC6 | PASS | No U+2014 em dash in any of the 9 changed files. |

Meta: none.
