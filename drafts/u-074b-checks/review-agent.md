# U-074b round-4 review

Head: 8d2fa8c31cc9d2e38980241d2e42927cace5918a (verified with git rev-parse). Delta 69a6f70..HEAD: 22 files, 293 insertions, 106 deletions. Size left to Dave.

Verdict: PASS

Blocking: none.

Run: `tsc --noEmit` clean, eslint clean on touched server/lib files, vitest 196 files / 6876 tests pass. DB tests (tests/db/*) not run here (need a database); they cover paging for both lists.

## Checks
- Keyset (keysetPage.ts): SQL is the same as before for both lists, tuple `(name, id) > (SELECT c.name, c.id FROM <table> c WHERE c.id = cursor)`, `ORDER BY name, id`, `limit(pageSize + 1)`, splitPage untouched. Role guard and audit stay ahead of the query (only the where/orderBy lines changed). experiences keeps its status/host/category filters in the same `and(...)`. Paging tests exist in tests/db/host-setup and experience-editor.
- privateSession.ts: `wholeNumberText(1, max)` is the same chain (trim, `^\d{1,7}$`, Number, range). budgetMinor still uses `dollarsText` + `wholeNumberPattern` (same pattern, now imported). Behaviour unchanged.
- hostSessions.ts: only the shared pattern and `priceInputTextOrNull` (same null/priceInputText logic). Behaviour unchanged except the price parser (below).
- experienceEditor.ts: `wholeNumberText` replaces IntegerFieldSchema. Differences: input is now trimmed (" 5 " accepted), and 7 digits pass the regex but the range check refuses them. No real input changes outcome. min/max arguments are mapped correctly (duration 1..max, weatherDecisionHours 1..max, ages 0..maxAge).
- getPublishedLegalDocument(id, tx?): the waiver check now filters status = 'published' in SQL and isPublishedWaiver still checks the doc. Same result as before; now reads inside the transaction's snapshot.
- opsCallerOrLeave: same logic, `leaveTo` passed per action (experiencesPath / hostsPath), all call sites updated.
- changedFields / errorProps / problemText: same semantics as the removed inline code.

## Parser edge cases (priceMinorFromText)
Accepted: '0' -> 0, '1,000' -> 100000, '999,999.99' -> 99999999, '1,000.5' -> 100050, '1,250', '1,250.50', '12,345,678', '$1,250', ' 0 ' (trimmed).
Refused: '.50', '1,000.555', '1 200' and any internal whitespace, '$ 1,250', '-5', '12,50', '1,25', '12,500,0', ',50', '1,,250', '1,2500', '1,250,', '12.', '1e3'.
Other callers: only experienceEditor (PriceSchema, caps at experienceLimits.priceMinor) and hostSessions (price field; schema caps at MAX_UNIT_PRICE_MINOR). No other callers.

Internal-whitespace refusal for the host sessions form: safe. It turns a silent reading ('1 200' as $1,200) into a refusal that names the price field (hostSessions.test covers '12,50', '1,25', 'free' through the schema). Leading/trailing whitespace and a leading `$` still work. The input is a free-text field with no existing stored data parsed through it, so no saved value becomes unreadable. Worst case a host retypes the price.

## Nits (non-blocking)
- Nit: the grouped branch has no 6-digit cap, so '12,345,678' parses (tested as valid) while '1234567' is refused. Both are later refused by the max-price checks, so no wrong value is saved; only the parser's own contract is inconsistent.
- Nit: privateSession.ts `dollarsText` still strips every comma, so a budget of '12,50' reads as $1,250. Out of this round's scope and a different lane's rule; flag for a follow-up.
- Nit: keysetPage.ts and opsAccess have no direct unit test for keysetPage (covered only by the DB tests); opsAccess has one.
