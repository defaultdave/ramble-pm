FAIL

## review-agent: NEW-2 "Ops admin UI kit" (head cb9f090)

Scope: all 44 files are inside the IN SCOPE folders and lib helpers; no ops page or data function. 11 test files, 98 tests pass locally. Stories cover empty, error, focus, dark, submitting, and each tone.

### Blocking
- src/lib/tableQuery.ts:11, 34, 42 (and carriedFields at 118): the helpers take `string | undefined` but a Next page hands them `string | string[] | undefined`. `?q=a&q=b` makes `parseSearchTerm` call `.trim()` on an array and throw a TypeError (500 on a public-shaped URL). `?cursor=a&cursor=b` passes `parseCursor` (array length 2 is under 128) and returns the array as the cursor. `carriedFields` pushes an array as a hidden input value. Fix: accept the same raw type `filters.ts` already uses (`RawSearchParams`, `valuesOf`) and fail closed on more than one value (sort, dir, q, cursor, status all return their default or null), or have `TableQuery` be built by one tested normaliser from raw search params. Add tests with array inputs for every parser.
- src/lib/tableQuery.ts:28-33: `parseCursor` accepts any non-empty string up to 128 characters, but the cursor `splitPage` produces is a row id and the existing browse parser validates it (`CursorSchema` in src/lib/filters.ts:73-78: max 36, `EntityIdSchema`, lowercased). A cursor like `abc` or `'; --` reaches the data function; against a uuid column that is a Postgres cast error, i.e. a 500 with a raw database error on a hand-edited URL. It also duplicates the cap constant (`CURSOR_MAX_LENGTH` 128 vs `maxCursorLength` 36). Fix: reuse `EntityIdSchema` (export the shared cursor schema from `filters.ts` or `catalog`) in `parseCursor`, return null when it fails, and test a malformed, an upper-case, and an oversized cursor.

### Non-blocking
- src/lib/fieldIds.ts: duplicates the hint/error/describedby id logic inline in src/components/Input/Input.tsx:26-37. Input was out of scope to touch, so this is an audit item: switch Input to `fieldIds` and delete its inline copy. The Select and Textarea CSS correctly compose from Input.module.css; the hint and error markup is repeated three times (audit item: a shared field-message block).
- src/lib/tableQuery.ts:38: `parseSearchTerm` truncates an over-long term to 100 characters, which repairs rather than refuses. The `<input maxLength>` stops a browser sending one, so only hand-built URLs hit it; a term over the cap could instead read as empty. Low risk.
- src/components/ConfirmDestructive/ConfirmDestructive.tsx:35-41: `finally { close() }` closes the dialog when the action throws and the error then goes to the nearest error boundary. Fine for redirect and for a Server Action that returns; a caller that wants an inline error has no slot for it. Covered by a test, noted for the first ops page.
- Reuse section: the commit message has none and I could not see the PR body. Reuse found: Badge, Chip, Dialog, Alert, Button, Input CSS, HiddenFields, `splitPage`. Not reused: Input's id logic (above) and the filters.ts cursor schema (blocking above). The PR body should list these.
- No Figma frames exist for these components (decided by the PM); the 44px target, focus ring, tokens (no raw colors or sizes beyond 1px/2px borders and rings), and mobile-first breakpoint (768px min-width) all check out in the CSS.

### Checked and clean
- `parseSort` matches the column against a fixed allow-list and falls back otherwise; `dir` is `desc` or `asc`. Sort links go through `URLSearchParams`, so values are encoded; `path` is a prop from the page, never from the address, so no open redirect. `carriedFields` only echoes address params back into a GET form to the same path.
- `parseFlash` has a 400-character raw cap, strict object, enum tone, 200-character message, and returns null on any parse failure; no repair. React escapes the message.
- Sort links: `aria-sort` on the `th`, icons `aria-hidden`, link text is the header, 44px target, focus ring, scroll region is focusable and named. Dialog: Cancel has autofocus, Dialog is react-aria so focus is trapped and restored.

### Unconfirmed
- Axe results under Storybook were not run here (no browser); stories exist for each state.
