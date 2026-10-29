PASS

## review-agent: U-039 "Maps link meeting point cut (BE-8)" (head 4fad64a; round 3)

Ran `pnpm exec vitest run src/lib/experiencePage.test.ts` in the worktree: 111 passed (103 before, 8 new rows). Re-ran my round-2 probe (about 60 inputs, plus extras) against this head with bun and compared each with main's `indexOf('. ')` logic.

Scope: `git diff origin/main...HEAD` (merge base 2bc8c4e) is 2 files, experiencePage.ts +76 -3 and experiencePage.test.ts +49. The ts hunk is the abbreviation sets, `fullStopEndsSentence` and `mapsHref` only. A two-dot diff against the current origin/main (178b6d3) lists 27 files because main has moved on (PR 235); that is not this branch. `git merge-tree origin/main HEAD` merges clean and keeps main's `venueCity` import in `mapsHref`. In scope.

### Blocking
None.

### Round-2 blocker: fixed
The lowercase test now runs first, then `if (!streetSuffixes.has(word)) return true;`, and the single-character exemption runs only for suffixes and counts letters only (`/\p{L}/u`). Probed:
- "Pier 26. A guide will wait there." -> "Pier 26"
- "The Cloisters. A staff member opens at 9." -> "The Cloisters"
- "Central Park Zoo. I'm in a red hat." -> "Central Park Zoo"
- "Pier 26. 5 minutes early please" -> "Pier 26"
- "Pier 26. 4 people wait." -> "Pier 26"
- Also cut at the place: "Pier 26. I will meet you there", "Pier 26. A", "Pier 26. 1", "Pier 26. 2:30 start", "Pier 26. $5 extra", "Pier 26. #4 gate", "Pier 26. (north side)", "Pier 26. \"Sam\" waits", "Pier 26. É la porta", "Bethesda Terrace. 2 guides wait.", "Bethesda Terrace. 12 guides wait.", "Hudson River Park. 9 am".
- Digit after a suffix, which the spec round-2 verdict failed: "Park Ave. 5 is closed" -> "Park Ave"; "Lexington Ave. 4 people wait." -> "Lexington Ave"; "Hudson St. 5 min early" -> "Hudson St"; "Hudson St. 9" -> "Hudson St"; "Union Sq. 5 min early" -> "Union Sq"; "Union Sq. 5th Ave side" -> "Union Sq"; "Pier 62 Ave. 5 is far" -> "Pier 62 Ave".

### Round-2 case table: all rows hold
"Meet at Gate B. The desk is open." -> "Meet at Gate B"; "Gate B. The desk is open." -> "Gate B"; "Near St. Marks Pl" whole; "Bleecker St. and Mott St. Ring bell." -> "Bleecker St. and Mott St"; "Pier 57, St. Johns Pl" whole; "Union Sq. Meet..." -> "Union Sq"; "Hudson St. A door" whole (pinned); "Ave. B", "Meet at 10 Ave. B", "Park Ave. A. Meet" -> "Park Ave. A"; "Pier 57, 25 11th Ave. Meet at the gate." -> "Pier 57, 25 11th Ave"; "Gate 5. Meet at the sign." -> "Gate 5". The `it.each` table in the test file covers these and passes.

### No new regression against main on realistic meeting points
Better than main, unchanged from round 2: "Pier 57 Apt. 4B. Ring twice." -> "Pier 57 Apt. 4B"; "No. 7 Pier. Meet at the gate." -> "No. 7 Pier"; "St. Patrick's Cathedral. Meet at the steps." whole name; "East River Esplanade at E. 90th St." whole; "Corner of 5th Ave. and 42nd St. Ring bell" -> "...42nd St"; "Mt. Vernon Pl. Ring bell."; "W. 23rd St. The door is open" -> "W. 23rd St"; "Meet Dr. Smith at the gate. Ring bell" -> "Meet Dr. Smith at the gate" (main "Meet Dr"). Same as main: "Dave's Bike Shop. Ask for Sam.", "Bank St. Ask for Sam.", "Hudson St. The door opens at 9.", "Pier 26 (north side). Ring bell.", "Grand Central Terminal, main concourse clock. Wait there.", "Brooklyn Bridge Park, Pier 1. Look for the flag." Newline and "!" cuts as before. No input of the shape "place. note" that main cut and the branch keeps, apart from the pinned limits below.

### "Ave. 5 is closed" kept whole: acceptable
Output is "Ave. 5 is closed" (main "Ave"). It needs the street suffix to be the very first token of the meeting point, with a digit next and a note behind it. A real meeting point names something before the suffix ("Park Ave", "5th Ave", "Pier 62 Ave"), and the same row with any name first cuts correctly. A meeting point that opens with a bare "Ave." or "Rd." is not an address a guest would write, and the failure mode is a longer Maps query that still searches, not a wrong cut or a lost link. Pinning it in a test is the honest record. Accepted.

### Non-blocking
- Pinned limits that stay, each a suffix word followed by a one-letter word: "Hudson St. A door", "Times Sq. A guide waits" (probed; main cut at "Times Sq"). Same trade as round 2, needed for "Ave. B". Suffix-then-"A"/"I" notes are the one residual shape; "I'll"/"I'm" after a suffix would behave the same. Worth keeping in mind if a seeded meeting point ends in a suffix and a note opens with "A".
- "Hudson St. use the side door" keeps the note; now pinned by a test row (round-2 suggestion taken).
- Pre-existing, same as main (audit item): "Washington Sq. Park" and "U.S. Customs House" cut early; not introduced here.

### Unconfirmed
- Whether any seeded meeting point has a suffix followed by an "A" or "I" note; I did not scan the seed fixtures.

### Checks
- Linear and bounded: unchanged from round 2 (400-char window, previous and next token only); the diff touches only the ordering of existing tests.
- Duplication: no new export; the sets and function are the round-2 ones. `presentText` still reused.
- Comments: the doc comment still states the pinned limit and names no ticket. CLAUDE.md rule met.
- Defect classes: unbounded work, DB/Zod, fail-open, logging: none.

### Evidence
No before-and-after files in `evidence/pr/` were checked; pure-function change, covered by the probe outputs above and the 111 passing tests.
