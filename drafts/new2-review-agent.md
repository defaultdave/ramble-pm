PASS

## review-agent (delta): NEW-2 "hrefWithQuery shared helper" (head 557be46, since b293490)

### Blocking
None.

### Non-blocking
- src/lib/queryHref.ts:6: `entries.map(([name, value]) => [name, value])` only drops the readonly tuple type for URLSearchParams; harmless.
- src/components/Select/Select.tsx: the `TODO(U-073): first caller` removal is correct, since src/components/HomeModules/HomeHero.tsx now imports Select.

### Verified
- browseHref: old path was `toQuery(q)` = `new URLSearchParams(toQueryEntries(q)).toString()`, then `?` + string or bare `browsePath`. New path builds URLSearchParams from the same `toQueryEntries` pairs (copied, same order) and applies the same empty-check. Same serializer, same ordering, so output is identical by construction. Ran a throwaway equivalence test (removed afterwards, worktree clean) comparing old formula to `browseHref` for: empty query, repeated category and neighborhood keys, encoded characters (`&`, space, `+`, `?`, `#`, `/`, non-ASCII), empty-string fields, guests 0, and `after` set or empty. All equal.
- tableHref: still skips undefined, null and empty-string values; empty input or all-unset gives the bare path; repeated keys are carried by hrefWithQuery (covered by the new test with `tag` twice). Object keys are unique, so the old `search.set` and the new push produce the same pairs.
- Suites: `vitest run src/lib src/components` gives 219 files, 5815 tests, all passing. No existing test file changed in the delta (only the new src/lib/queryHref.test.ts), so browse tests are unchanged.
- Duplication: hrefWithQuery replaces two copies of the path-plus-query logic; no remaining duplicate found.
- Hero select CSS: `cursor: default` scoped to `.control.hero .select:not(:disabled)`; no behaviour change.

### Unconfirmed
None.
