FAIL

## review-agent: U-039 "Maps link meeting point cut (BE-8)" (head 97e7b16; round 2 change 272570a)

Ran `vitest run src/lib/experiencePage.test.ts` in the worktree: 103 passed. Probed `mapsHref` directly with bun against about 60 inputs and compared with main's logic.

Scope: `git diff origin/main...HEAD` is 2 files (experiencePage.ts +72 -3, experiencePage.test.ts +40). The ts hunk is one block, from the `maxMapsQueryLength` doc comment down through the end of `mapsHref`: the new constants, `fullStopEndsSentence`, `mapsHref`. PR 232's changes are not in the net diff. In scope.

### Blocking
- src/lib/experiencePage.ts:211-215 (`fullStopEndsSentence`): the "next word is a single letter" test runs before the street-suffix test, so it applies to every full stop, not only to street suffixes. Any note that begins with "A", "I", or a one-digit number is kept in the Maps query. Main cut all of these correctly. Run on the branch:
  - "Pier 26. A guide will wait there." -> query "Pier 26. A guide will wait there" (main: "Pier 26")
  - "The Cloisters. A staff member opens at 9." -> "The Cloisters. A staff member opens at 9" (main: "The Cloisters")
  - "Central Park Zoo. I'm in a red hat." -> "Central Park Zoo. I'm in a red hat" (nextWord is "I" because the apostrophe stops the match)
  - "Pier 26. I will meet you there" and "Pier 26. 5 minutes early please" -> note kept
  Same class and same shape as the round 1 blocker (a guest note after a place, which is the PRD-09 example), and "A guide..." / "I'm..." are common openings. Cause: that single-letter test was only needed for "Ave. B"-style suffix cases (my round 1 rule put it before the suffix test; that ordering is the defect). Fix: in `fullStopEndsSentence`, keep the lowercase-next test where it is, but run the single-letter test only after `streetSuffixes.has(word)` is true (a non-suffix word ends the sentence regardless of a one-letter next word). "Ave. B", "Ave. B and E 4th St.", "Meet at 10 Ave. B", and "Hudson St. A door" (pinned limit) are all suffix cases and keep working. Add rows: "Pier 26. A guide will wait there." -> "Pier 26", "Central Park Zoo. I'm in a red hat." -> "Central Park Zoo", "Pier 26. 5 minutes early please" -> "Pier 26". Consider the lowercase-next test the same way: "Pier 26. the door" keeping the note is harmless (a sentence rarely starts lowercase), so it can stay global.

### Checked, as wanted
- Case table: every row from my round 1 table is in the test (it.each at test lines 237-270) and passes, including "Meet at Gate B. The desk is open." -> "Meet at Gate B", "Gate B. The desk is open." -> "Gate B", "Near St. Marks Pl" whole, "Bleecker St. and Mott St. Ring bell." -> "Bleecker St. and Mott St", "Pier 57, St. Johns Pl" whole, "Union Sq. Meet..." -> "Union Sq", and the pinned "Hudson St. A door" whole.
- Realistic shapes, new vs main: "Pier 57 Apt. 4B. Ring twice." -> "Pier 57 Apt. 4B" (main "Pier 57 Apt"); "No. 7 Pier. Meet at the gate." -> "No. 7 Pier" (main "No"); "St. Patrick's Cathedral. Meet at the steps." -> "St. Patrick's Cathedral" (main "St"); "East River Esplanade at E. 90th St." whole (main cut at "E"); "Corner of 5th Ave. and 42nd St. Ring bell" -> "...42nd St" (main cut at "5th Ave"); "Mt. Vernon Pl. Ring bell." -> "Mt. Vernon Pl"; trailing "!" and "?" are dropped ("Pier 26!" -> "Pier 26", main kept the "!"); "Pier 26 (north side). Ring bell." unchanged and correct; "Pier 26.\nRing bell" cut at the newline (main kept the note); abbreviation at the very end ("123 Main St.", "Pier 57 Ave.") loses only the final stop. Venue-then-note forms ("Dave's Bike Shop. Ask for Sam.", "Bank St. Ask for Sam.") match main. Net: better than main on every shape tried except the blocking one above.
- Linear and bounded: `windowText` is sliced to 400 chars before any scan (line 240); `matchAll(/\S+/g)` and the token loop run on that window only; `fullStopEndsSentence` looks at only the previous and next token; the final `replace(/\s+/g)` is on `line.slice(0, end)`. No nested quantifiers. Timed inputs of `'St. '` x 1e6 and `'a.  '` x 1e6 took 0.34 ms and 0.64 ms (the window caps it). Clamp check: a first sentence longer than the window with no stop returns null (test at line 267, 'a ' x 400 + 'end.'); a stop inside the window is found even when the text runs on.
- Doc comment now describes the rule, names the pinned limit, and has no ticket number. CLAUDE.md comment rule met.
- Duplication sweep (src/lib, src/server, src/components; sentence, abbreviation, whitespace collapse, street suffix, word-char): `presentText` is reused; `src/lib/text.ts` has only Zod schemas; no existing sentence splitter or address-abbreviation set. No duplicate. The inline `replace(/\s+/g, ' ')` is the same one-liner main used elsewhere in the module; a shared helper is out of scope per the manifest. The builder's Reuse section was not in the brief, so it is unchecked.
- Defect classes: unbounded work, none; fails open or repairs input, no (the function returns null on over-long text and does not repair beyond whitespace normalisation, which was already main's behaviour); no logging; no DB or auth surface.

### Non-blocking
- Lowercase-note regression: "Hudson St. use the side door" keeps the note ("Hudson St. use the side door"; main: "Hudson St"). This is round 1 recommended rule 1 (a stop followed by a lowercase word never ends), needed for "Bleecker St. and Mott St". Lowercase-opening notes are rare; accepted. Worth one test row so the trade is on record.
- "Pier 57 ..." -> query "Pier 57 ." (main "Pier 57 .."); cosmetic, ellipsis only.
- Pre-existing, same as main (audit item): "Meet by the fountain in Washington Sq. Park" -> "...Washington Sq"; "U.S. Customs House" -> "U.S". Neither is introduced here.
- Residual limit from round 1 unchanged: "Meet Dr. Smith..." now reads correctly because the next word... in the tried case it kept the whole string; other title forms outside the lead-in list can still cut early.

### Unconfirmed
- Whether seeded meeting points contain a note starting with "A" or "I"; I did not scan the seed fixtures. The blocking finding does not depend on it (the shape is realistic and reproduced).

### Evidence
No before-and-after files in `evidence/pr/` were checked; this is a pure-function change, covered by the probe outputs above.
