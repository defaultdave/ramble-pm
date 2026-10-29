PASS

## spec-compliance: U-039 "maps-link" (head 13e2c6e)

### Blocking
- None.

### Non-blocking
- src/lib/experiencePage.ts:292-293 (audit item): the doc comment says a full stop after a street abbreviation ("W. 23rd St. The door...") does not end the sentence. The code does end it there (the "St." after "23rd" passes the numbered-street test at line 283-286), and AC 1 requires that. Reword the comment to match: a street full stop ends the sentence only after a number.
- Hudson St. behavior (requested): on main, "Hudson St. The door is on the left." gives query "Hudson St, New York". On this branch it gives "Hudson St. The door is on the left, New York", because "St." with no number before it does not end the sentence (line 282-286). The note text leaks into the search. Not an AC, so not blocking, but it is a regression for unnumbered streets. The PM should decide whether a named street with no number should end the sentence, and the test at src/lib/experiencePage.test.ts:294-313 has no case for it.
- Related, also not an AC (audit item): a single-letter word before a full stop no longer ends the sentence (line 281, `/^\p{L}$/`). On main, "Meet at Gate B. The desk is open." gives "Meet at Gate B, New York". On this branch it gives "Meet at Gate B. The desk is open, New York".
- Non-blocking note: the 400-char window (line 299-302) refuses a first sentence whose raw length exceeds 400 even when whitespace collapse would bring it under 200. The comment at line 298 says this is intended.

### Unconfirmed
- None.

### Acceptance criteria
1. PASS. "W. 23rd St. The door is on the left." gives "W. 23rd St" (test src/lib/experiencePage.test.ts:295; logic experiencePage.ts:282-286). Probed with bun: output "W. 23rd St, New York".
2. PASS. "St. Marks Pl" and "Ave. B" are not cut (sets at experiencePage.ts:225-234; the no-digit-before rule at 283-286; tests at experiencePage.test.ts:296-298). "Meet at 10 Ave. B" also stays whole (experiencePage.test.ts:299).
3. PASS. "Pier 57, 25 11th Ave. Meet at the gate." gives "Pier 57, 25 11th Ave" (experiencePage.test.ts:300; logic 283-286).
4. PASS. Newline ends the sentence (experiencePage.ts:275); "! " and "? " end it (277); whitespace runs collapse to one space (305). Tests at experiencePage.test.ts:302-309 cover newline, "!", "?", tab, and multi-space.
5. PASS. Trailing period is stripped (experiencePage.ts:307; experiencePage.test.ts:310 "123 Main St." and experiencePage.test.ts:279-283 existing). maxMapsQueryLength is unchanged at experiencePage.ts:222 (not in the diff). Null cases unchanged (experiencePage.test.ts:319-321; the ". Only a note" case returns null via the empty-first check at line 308).
6. PASS. The regexes are `/\s+/g`, `/\.$/`, `/^\p{L}$/u`, `/\d/`, and a single-class `/[\p{L}\p{N}]/u`. None nests quantifiers. The walk stops at windowEnd = min(length, 2 * maxMapsQueryLength) (experiencePage.ts:299-302) before any collapse. Refusal test at experiencePage.test.ts:315-317 covers it.
7. PASS. Each case in 1 to 5 has a test (experiencePage.test.ts:294-313). The existing tests at experiencePage.test.ts:269-293 and 319-326 are still present.
8. PASS. The diff touches only mapsHref and the new private helpers (hunk @@ -221,16 +221,90 @@ in experiencePage.ts, which is the address-to-maps region). presentText (experiencePage.ts:60-63) is unchanged. The test diff is a single hunk at experiencePage.test.ts:288-321.

Verification: `npx vitest run --project unit src/lib/experiencePage.test.ts` in the worktree gives 107 passed, 0 failed.
