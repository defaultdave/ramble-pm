PASS

## review-agent: NEW-2 "Shared helpers for labels, alert role, field control, known-value pick" (head 7569c58)

Delta reviewed: 557be46..7569c58.

### Blocking
None.

### Non-blocking
- None.

### Verification
- Throwaway test in a scratch worktree (deleted, worktree removed) compared the new code to the old logic:
  - parseStatusFilter vs old find-and-value logic over raw undefined, '', 'a', 'b', 'c', 'A', ['a'], ['a','b'], ['a','a'], [], [''] and three option sets (including an option with value ''): identical results.
  - alertRole vs old toneRole map: identical for all four tones (warning/danger alert, info/success status).
  - fieldControl vs old inline logic (id ?? generatedId, fieldIds describedBy, errorText ? true : aria-invalid) over id, hint, errorText, describedBy in {undefined, '', value} and six aria-invalid values: identical. No hint or error gives undefined describedBy.
  - parseSort: pickKnown returns the same column or null as the old find/undefined check; an empty-string column is still kept in both. Repeated, unknown and empty inputs reach the fallback through parseSingle as before.
- Tablelabels return the same strings as the old template literals ("Scrollable <caption>", "<caption> pages"), so DataTable accessible names are unchanged.
- src/lib and src/components suites: 220 files, 5834 tests passed. tsc shows no errors in the changed files (only unrelated generated PageProps errors absent from the scratch worktree).
- Duplication sweep: no second implementation of the role map, field id logic, or known-value pick remains; the three field components now share fieldControl.

### Unconfirmed
- None.
