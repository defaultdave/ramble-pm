Posted on head 2a85b1e (round 3 at 4fad64a with main merged; the PM reran every gate on the merge commit).

PASS

## spec-compliance: U-039 "maps-link" (head 4fad64a, round 3; round-2 head 97e7b16 is an ancestor)

### Blocking
- None.

### Non-blocking
- Rule conflict for the PM to settle (not a code defect as the code stands): experiencePage.ts:219 (lowercase next word returns false) runs before experiencePage.ts:220 (a non-suffix word returns true). So "Meet at the gate. use the side door" gives the whole string "Meet at the gate. use the side door", because the lowercase rule wins. The amended rule has two clauses that point both ways: "the lowercase-next-word rule applies to every full stop" and "a word that is not a street suffix ends the sentence whatever the next word is." The code follows the first clause. If the second clause was meant to win, line 219 needs to move below line 220 and only apply after a suffix, and a test row should pin "Meet at the gate. use the side door" -> "Meet at the gate". Please confirm which one is meant.
- Builder added two rows outside the PM list: "Park Ave. 5 is closed" -> "Park Ave" (test:262) and "Ave. 5 is closed" pinned whole (test:263). Both match the rule as coded. Logged for the record, not a finding.

### Unconfirmed
- None.

### Evidence
- `src/lib/experiencePage.test.ts` run with `pnpm exec vitest run src/lib/experiencePage.test.ts`: 111 passed, 0 failed (head 4fad64a).
- Probe run in a scratch test file (removed afterwards; worktree clean): "Pier 26. 4 people wait." -> "Pier 26"; "Gate 5. 2 chairs by the desk." -> "Gate 5"; "W. 23rd St. The door is inside." -> "W. 23rd St"; "Meet at St. Marks Pl. Ring bell." -> "Meet at St. Marks Pl"; "Hudson St. use the side door" stays whole; "Pier 26. A guide will wait there." -> "Pier 26".

### Acceptance criteria (round 3)
1. PASS. Round-2 criteria 1, 3, 4, 5, 6 still hold on `git diff origin/main...HEAD`:
   - Abbreviation rule, compass and inner abbreviations: experiencePage.ts:218. "W. 23rd St." ends at "St" (test:241).
   - Suffix and prefix rules: experiencePage.ts:221-227.
   - Newline, "!", "?" and whitespace collapse: experiencePage.ts:242-244, 254-266.
   - Clamped reads: `windowText` at experiencePage.ts:244, tokens from `line` at 247. The regexes are single-quantifier patterns (`/\S+/g`, `/^[\p{L}\p{N}]*/u`, `/^\p{Ll}/u`).
   - Doc comment at experiencePage.ts:228-239 still describes the rule. The branch diff touches only experiencePage.ts and experiencePage.test.ts.
   - Round-1 and round-2 test rows (test:240-251, 262-285) are unchanged and pass.
2. PASS, with the open rule conflict in Non-blocking above.
   - Lowercase next word, every full stop: experiencePage.ts:219, which runs before the suffix check at 220.
   - Non-suffix word ends the sentence: experiencePage.ts:220. This holds for capitals, digits, and other non-lowercase next words.
   - Single-letter exemption after a suffix only: experiencePage.ts:221-223. The inner check is `nextWord.length === 1 && /\p{L}/u`, so a digit is never exempt. "Pier 26. 4 people wait." and "Gate 5. 2 chairs by the desk." both end (`Park Ave. 5 is closed` ends at "Park Ave" in test:262).
3. PASS. Test rows present in the `it.each` table in `describe('mapsHref')` (test:240-285):
   - test:257 "Pier 26. A guide will wait there." -> "Pier 26"
   - test:258 "The Cloisters. A staff member opens at 9." -> "The Cloisters"
   - test:259 "Central Park Zoo. I'm in a red hat." -> "Central Park Zoo"
   - test:260 "Pier 26. 5 minutes early please" -> "Pier 26"
   - test:261 "Pier 26. 4 people wait." -> "Pier 26"
   - test:265 "Hudson St. use the side door" pinned whole
   - Earlier rows unchanged; the round-3 diff adds 9 lines to the table and changes none.
   - The file passes: 111 passed, 0 failed.
4. PASS. `git diff 97e7b16 HEAD` touches only `fullStopEndsSentence` (experiencePage.ts:213-232, the body hunk at 216-223) and the test table (9 added lines at test:256-264). Nothing else changed.

PM ruling on the open rule question: the lowercase-next-word rule applies to every full stop, as coded (it keeps 'Bleecker St. and Mott St.' and '5th Ave. and 42nd St.' whole).
