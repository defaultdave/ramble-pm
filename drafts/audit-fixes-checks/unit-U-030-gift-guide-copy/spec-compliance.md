PASS

## spec-compliance: U-030 "gift guide copy" (head a2739e0)

Acceptance criteria are H-68 (owner decision 2026-10-29). Diff reviewed: `git diff origin/main...HEAD` in the worktree, head a2739e04f1b74f109a9807057b551e13d130c260. Checked against the criteria only.

### Blocking
- None.

### Non-blocking
- AC2 (partial, PM ruling wanted): the heading and body fallback copy is gone from production code (`homeCopy.giftGuideHeading` removed, `src/lib/home.ts:108-112` no longer defines it; no reference anywhere on the branch). Three fixed gift guide strings remain in `src/lib/home.ts:108-111`: the eyebrow `'Gift guide'` (line 108), the action `'Shop the gift guide'` (line 110), and the sponsor line `'Presented by our holiday partner'` (line 111, fixed because the editorial store has no sponsor field). H-68 covers heading and body only, so these are read as chrome labels and pass here. Rule explicitly if the owner wants them out of code too.
- AC2 (fixture copy, outside the AC6 file list): `src/components/HomeModules/HomeModules.fixtures.tsx:124-126` hard-codes "Give a Saturday, not a sweater" and its body. It is test and story data, and the branch does not touch it (AC6 excludes it). Log as an audit item if it should move to the seed.
- AC7 (evidence not verified): the PR body could not be read from this check (GitHub API unreachable from the sandbox, TLS error), so the main and branch copy statement is unconfirmed. No gift guide folder exists under `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/` (only `unit-U-030-hero`, `unit-U-030-hero-select`, `unit-U-030-shell`, `unit-U-030-states`, `unit-U-030-time`). The H-68 effect line asks for a 390 px before-and-after, and none exists yet. Recorded as Non-blocking per the AC.
- Behavior note: a gift guide module with no heading and no published guide is now left out (`src/lib/home.ts`, the `module.heading === null && !guide` early return). Main showed the fixed "Give an experience" heading there. This follows from AC1 and is pinned by `src/lib/home.test.ts` ("is left out for ... when it has no heading of its own"). Noted so the PM knows the home page can lose the module if the guide is unpublished.

### Unconfirmed
- The Figma body copy in the seed matches the fixture text, not a fresh read of the Figma frame. The check did not open Figma.

### Acceptance criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Gift guide takes its collection's title and summary when it has none of its own, through the same rule Picks uses, one tested lib function | PASS | One rule: `collectionModuleCopy` at `src/lib/home.ts:206-216`. Picks uses it at `src/lib/home.ts:~294-296`; gift guide uses it at `src/lib/home.ts:~309-322`. Tested in `src/lib/home.test.ts` (describe `collectionModuleCopy`, and "takes its collection title and summary, with a link and the sponsor line"). |
| 2 | No fixed gift guide copy remains in code | PASS (with Non-blocking notes) | Heading fallback removed: no `giftGuideHeading` on branch. Body fallback now comes from the collection summary at `src/lib/home.ts:321-323`. Remaining fixed strings noted above (`src/lib/home.ts:108-111`, fixtures `HomeModules.fixtures.tsx:124-126`). |
| 3 | Seed gift guide collection summary carries Figma's body copy | PASS (already on main) | `src/lib/seed/fixtures/editorial.ts:103-107` on `origin/main`: title "Give a Saturday, not a sweater", summary "Experiences to give for every kind of person. They pick the date; you look thoughtful." Unchanged by this branch. |
| 4 | "See all N" is the real item count, pinned by a test | PASS | Count is `pick.items.length` at `src/lib/home.ts:~300` (`See all ${pick.items.length} picks`). Pinned by `src/lib/home.test.ts:535` ("does not change the count the Picks link shows", expects "See all 5 picks" for a 5-item collection). |
| 5 | Picks output unchanged | PASS | `collectionModuleCopy` returns `module.heading ?? collection.title` and `collection.summary`, the same expressions main used at `origin/main:src/lib/home.ts:279-280`. Picks test assertions at `src/lib/home.test.ts` are untouched in the diff (additions only). |
| 6 | Files changed limited to the listed set | PASS | Diff touches exactly: `src/lib/home.ts`, `src/lib/home.test.ts`, `src/server/home.ts`, `src/server/home.test.ts`, `src/server/db/editorial.ts`. `editorial.ts` change is only the removal of `// TODO(U-036): first caller` above `getPublishedGiftGuide`, which now has a caller at `src/server/home.ts:52`. `src/server/home.ts` adds `giftGuide` to `HomeContent` and reads `getPublishedGiftGuide()` in the existing `Promise.all`; its test is `src/server/home.test.ts:~80-84`. |
| 7 | PR states main's and the branch's gift guide copy (screenshot not required) | UNCONFIRMED, Non-blocking | PR body not readable from this check. No evidence folder for U-030 gift guide in ramble-pm `evidence/pr/`. |

Meta items: none in this AC list.

---
<sub>spec-compliance | haiku | read-only</sub>

SPEC_COMPLIANCE_VERDICT=APPROVE
SPEC_COMPLIANCE_FAILED_ACS=0
