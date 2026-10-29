FAIL

## review-agent: U-039 "Maps link meeting point cut (BE-8)" (head 13e2c6e)

Ran `vitest run src/lib/experiencePage.test.ts` in the worktree: 107 passed. Scope: only `mapsHref`, its private helpers and constants, and its tests changed (2 files, +105 -3). In scope.

### Blocking
- src/lib/experiencePage.ts:283-290 (`endsSentenceAt`): regression against main on the commonest meeting-point shape, a named street (no digit) followed by a note. Main cut these correctly; the branch puts the guest note into the Maps query. Run against the branch code:
  - "Hudson St. The door is on the left." -> query "Hudson St. The door is on the left" (main: "Hudson St")
  - "Park Ave. Meet at the gate." -> "Park Ave. Meet at the gate"
  - "Meet at Main St. Ring the bell." -> "Meet at Main St. Ring the bell"
  - "Union Sq. Meet at the fountain." -> "Union Sq. Meet at the fountain"
  - "Meet at St. Marks Pl. Ring the bell." -> "Meet at St. Marks Pl. Ring the bell" (the test at line ~296 even pins this kind of output for "St. Marks Pl. Ring the bell")
  The fix trades one wrong search for another, and the PRD-09 example ("The exact door is in your confirmation.") is exactly a note after a street. The builder's "previous token contains a digit" gate is too narrow. Fix: use the round 2 rule below. Add the test rows below, including the documented-limit row, which is currently untested.
- Same line, second instance of the same class: "Pier 57, St. Johns Pl" -> query "Pier 57, St" (the digit gate fires on "57," and the next word is not a single letter). Main did the same, so not a regression, but the rewrite claims to handle "St. Marks Pl" and this form still fails. The comma rule below fixes it.

### Non-blocking
- Judgement on the accepted limit: it is a regression, not an acceptable limit (see Blocking). Impact is a degraded search (note text in the query, up to the 200 char cap), not a wrong place, which is why the fix is a rule change and not a redesign.
- The PM's alternative rule, tested mentally and by running a prototype against the same inputs:
  - Fixes: "Hudson St. The..." -> "Hudson St"; "Park Ave. Meet..." -> "Park Ave"; "Meet at St. Marks Pl. Ring the bell." -> "Meet at St. Marks Pl"; "Ave. B and E 4th St." -> whole string; "Pier 57, St. Johns Pl" -> whole string; "Union Sq. Meet..." -> "Union Sq"; all of the builder's cases still pass.
  - Still wrong: (1) "Near St. Marks Pl" -> "Near St" (previous token "Near" is capitalised, so St reads as a street suffix). Same for "Meet St. Patrick Cathedral", "Behind St. Johns". (2) "Bleecker St. and Mott St. Ring bell." -> "Bleecker St" (same as main; sentence cut at first suffix though the next word is lowercase).
- Recommended for round 2: the PM's rule plus two additions.
  1. A full stop followed by a lowercase word never ends a sentence (a sentence starts with a capital). Fixes "Bleecker St. and Mott", "Corner of Bleecker St. and Mott".
  2. St (and Dr) read as a prefix, not a suffix, also when the previous token is a lead-in word from a small list (near, at, by, to, from, behind, outside, opposite, off, of, on, past, see, visit, meet), case-insensitive. Fixes "Near St. Marks Pl". Residual limit, to document in the comment and test: "Meet at Hudson St. The door" reads correctly but "Meet Dr. Smith" style forms outside the list can still cut early.
  Rule in order for a "." followed by whitespace or end: single letter or inner abbreviation (w e n s ft mt mr mrs ms jr sr no apt fl ste) never ends; next word starts lowercase or is a single letter never ends; word is not a street suffix -> ends; suffix is first token, or previous token is lowercase, ends with a comma, or is a lead-in word -> prefix, does not end; otherwise (previous token capitalised or has a digit) -> ends.
- Case table (E = first sentence searched; A = PM rule; R = recommended; B = builder):

| Input | Wanted | B | A | R |
|---|---|---|---|---|
| W. 23rd St. The door is on the left. | W. 23rd St | ok | ok | ok |
| St. Marks Pl | whole | ok | ok | ok |
| St. Marks Pl. Ring the bell. | St. Marks Pl | wrong | ok | ok |
| Ave. B | whole | ok | ok | ok |
| Ave. B and E 4th St. | whole | ok | ok | ok |
| Meet at 10 Ave. B | whole | ok | ok | ok |
| Pier 57, 25 11th Ave. Meet at the gate. | Pier 57, 25 11th Ave | ok | ok | ok |
| Gate 5. Meet at the sign. | Gate 5 | ok | ok | ok |
| 123 Main St. | 123 Main St | ok | ok | ok |
| Hudson St. The door is on the left. | Hudson St | wrong | ok | ok |
| Park Ave. Meet at the gate. | Park Ave | wrong | ok | ok |
| Meet at St. Marks Pl. Ring the bell. | Meet at St. Marks Pl | wrong | ok | ok |
| Meet at St. Marks Pl | whole | ok | ok | ok |
| Pier 57, St. Johns Pl | whole | wrong | ok | ok |
| Union Sq. Meet at the fountain. | Union Sq | wrong | ok | ok |
| Near St. Marks Pl | whole | ok | wrong ("Near St") | ok |
| Bleecker St. and Mott St. Ring bell. | Bleecker St. and Mott St | ok-ish (note kept: "...Ring bell") | wrong ("Bleecker St") | ok |
| Hudson St. A door | ambiguous | whole | whole | whole |

  (Builder row for the Bleecker case actually returns "Bleecker St. and Mott St. Ring bell": the note is kept.)
- Bounded work: the walk is capped at 2 x 200 chars before any scan (line ~300), and a test covers an over-long first sentence. All helpers other than `wordAfter` are bounded by that index. `wordAfter` (line ~248) skips whitespace to the end of the string with no cap; it is hit once per suffix full stop, and the whitespace runs are disjoint, so total work is linear in the input, not quadratic. Meeting point length is Zod-capped upstream. Suggest `Math.min` with the window anyway so the cap is uniform. Regexes: `/\s+/g`, `/\d/`, `/^\p{L}$/u`, per-char `/[\p{L}\p{N}]/u`; all linear, no nested quantifiers.
- Duplication sweep: searched src for sentence, abbreviation, whitespace, word-char, and `\p{L}` helpers. `src/lib/text.ts` holds only Zod text schemas (`requiredText`, `optionalText`, `isStorable`). `presentText` in the same file is reused. No duplicate. Builder-supplied Reuse section: not seen in the brief, so unchecked.
- Helper count: 5 helpers plus 2 sets for 80 lines is on the heavy side. `isWhitespace`, `isWordChar`, `wordBefore`, `wordAfter`, `tokenBeforeWord` are char-walkers that a single `/\.(?=\s|$)/g` loop with `text.slice(0, i).match(/(\S+)\s+([\p{L}\p{N}]+)$/u)` would replace in about half the lines. Not blocking, but the round 2 rule changes add branches, so take the chance to shrink.
- Comments follow CLAUDE.md (non-obvious why only, no ticket numbers).

### Unconfirmed
- Whether any seeded or real meeting point contains the Saint-prefix or lead-in shapes; I did not scan the seed fixtures, so the lead-in list is a guess at real data.
- Surrogate-pair letters (astral plane) are tested one UTF-16 unit at a time by `isWordChar`; I did not find a real address that hits this.
