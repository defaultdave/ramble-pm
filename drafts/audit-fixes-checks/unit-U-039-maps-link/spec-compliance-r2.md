FAIL

## spec-compliance: U-039 "maps-link" (head 97e7b16, round 2; round-2 head 272570a is an ancestor)

### Blocking
- src/lib/experiencePage.ts:221: the next-word exemption tests `nextWord.length === 1`, and `[\p{L}\p{N}]` counts a digit. The PM rule says a single-letter next word never ends the sentence, so a single digit should not block it. Input "Pier 26. 4 people wait." gives query "Pier 26. 4 people wait, New York" (main gives "Pier 26"). Same for "Gate 5. 2 chairs by the desk." Fix: exempt only a single letter, e.g. `nextWord.length === 1 && /\p{L}/u.test(nextWord)`, and add a test row "Pier 26. 4 people wait." -> "Pier 26".

### Non-blocking
- Test count: `pnpm exec vitest run src/lib/experiencePage.test.ts` reports 103 passed in this worktree. Round 1 recorded 107 under `--project unit` at 13e2c6e. Not a failure here; the PM should confirm the count when the file is re-run in the PR's CI.
- Audit item: presentText (experiencePage.ts:26-29) trims the full input before the window clamp. That is a single linear pass, not a regex, so it is not a defect; noted only for the record.

### Unconfirmed
- None.

### Acceptance criteria (round 2)
1. PASS. Round-1 criteria hold on `git diff origin/main...HEAD`. "W. 23rd St." ends at "St" (experiencePage.ts:221-224 with the "W" exemption at 218; test row in the it.each block at experiencePage.test.ts:240-270), and the round-1 cases still pass in the vitest run (103 passed, 0 failed). Spec probe: "Pier 57, 25 11th Ave. Meet at the gate." -> "Pier 57, 25 11th Ave". Newline, "!", "?", and whitespace collapse are unchanged (experiencePage.ts:244-245, 261-272).
2. FAIL. Compass and inner abbreviations (experiencePage.ts:190-193, 218), lowercase next word (221), prefix rules (224-231), and the non-suffix rule (223) match the PM rule. The digit case at experiencePage.ts:221 does not: a single digit next word blocks the end (see Blocking above).
3. PASS. Every listed case is a test row or passes in a probe run with bun:
   - "Hudson St. The door is on the left." -> "Hudson St" (experiencePage.test.ts:248)
   - "Park Ave. Meet at the gate." -> "Park Ave" (test row in the new it.each block, experiencePage.test.ts:240-270)
   - "Union Sq. Meet at the fountain." -> "Union Sq" (same block)
   - "Meet at Gate B. The desk is open." -> "Meet at Gate B" (same block)
   - "Meet at St. Marks Pl. Ring bell." -> "Meet at St. Marks Pl" (probe; test row uses "Ring the bell.", same path)
   - "Near St. Marks Pl" whole (test row, experiencePage.test.ts:240-270)
   - "Pier 57, St. Johns Pl" whole (test row)
   - "Bleecker St. and Mott St. Ring bell." -> "Bleecker St. and Mott St" (test row)
   - All round-1 cases still present and passing (existing rows at experiencePage.test.ts:215-238 and 273-285).
   Test run: `pnpm exec vitest run src/lib/experiencePage.test.ts` gives 103 passed, 0 failed.
4. PASS. The mapsHref doc comment (experiencePage.ts:233-238) says a full stop ends the sentence except after an abbreviation inside an address, and gives "W. 23rd St." as an example that ends. It no longer says a street full stop never ends the sentence.
5. PASS. Reads are clamped: `windowText = text.slice(0, maxMapsQueryLength * 2)` (experiencePage.ts:243), and tokens come only from `line` (245, 247). The only regexes are `/\S+/g`, `/\s+/g`, `/\.$/`, `/^\p{Ll}/u`, and `/^[\p{L}\p{N}]*/u`, each with a single quantifier over one character class (experiencePage.ts:221, 225-230, and the trailing-period strip in mapsHref). Adversarial probes ("St. " x 200000, "Ave. " x 200000, "a. " x 100000) ran in about 0 ms.
6. PASS. `git diff origin/main...HEAD --stat` shows only src/lib/experiencePage.ts (one hunk, from line 187) and src/lib/experiencePage.test.ts (one hunk, inside describe('mapsHref')). The added constants and fullStopEndsSentence are private to the mapsHref region.
