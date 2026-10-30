PASS

## spec-compliance: U-030 "home Picks read" H-46 (head b80cd3f, round 2)

All seven acceptance criteria PASS. Read-only static review; the db suites were not run by this check (the review-agent and qa-agent checks run them).

- AC1 PASS: only the collections the Picks modules name are read, at most 20, distinct, gift guide excluded (`src/server/home.ts:45-48`, `src/lib/pages/home.ts:74-79`, `src/lib/editorial.ts:356-362`; tests `src/lib/pages/home.test.ts:234-262`, `src/server/home.test.ts:88`).
- AC2 PASS: at most 12 entries (`picksCandidates`) and the full guest-visible count; the window count is taken before the limit (`src/server/db/editorial.ts:106,123,179`; tests `tests/db/editorial.db.test.ts:2570-2611`).
- AC3 PASS: the intro and entries past 12 are never selected (`editorial.ts:85-94,138,179`; `HomePickSchema` has no intro; test `editorial.db.test.ts:1098-1110`).
- AC4 PASS: a pinned Pick is found with 201 other Picks published (`editorial.ts:174` filters by id before the 200-row list limit; test `editorial.db.test.ts:2570-2600`).
- AC5 PASS: draft or unknown ID, empty IDs, over 20 or malformed IDs refused, and a Pick with no visible entries are all tested (`editorial.db.test.ts:1112-1136`).
- AC6 PASS (note): one guest-visibility join (`editorial.ts:119`); the staff list, gift guide and `getPublishedPick` go through `readCollections` with the intro and full entries, and their tests are unchanged. The old `listPublishedPicks` test was removed and its assertions moved to `listHomePicks`.
- AC7 PASS (note): the changed files are inside the manifest. `HomeContent.test.tsx` changed two fixture lines forced by the `HomePick` type; the PM accepts that.

Observation, not a spec failure: `editorial.ts:52-58` imports schemas from a lib page module (allowed by B4; the architecture audit passes it).

No blocking issues.
