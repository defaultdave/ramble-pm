PASS

## review-agent: U-035 "Category and neighborhood pages" (head 5ee5376, round 2; round 1 at 37bd503)

Scope audit: `git diff 37bd503 5ee5376` touches ten files, all inside U-035: the two e2e specs, the new route test, `BrowseResults` (component and test), `browse.ts` (type only), `landing.ts` and its test, `catalog.ts` and its db test. Nothing from another unit. Checked in a scratch worktree at 5ee5376 (removed after): `tsc` (after `next typegen`), `eslint --max-warnings 0` over the touched trees, and `knip` clean; vitest over `src/app/(guest)/new-york`, `BrowseResults` and `src/lib/pages` 392 passed. Playwright and the db suite were not run here; the fixer's 106 of 106 and 116 of 116 are taken as reported.

### Round 1 blocking items

1. Dead reads and their TODO: FIXED. `getCategoryBySlug` and `getNeighborhoodBySlug` are gone from `src/server/db/catalog.ts` (the diff removes both and their `TODO(U-035)` markers). `grep` over `src`, `tests`, `e2e`, `docs`, `CLAUDE.md` finds no remaining reference to either name or to `TODO(U-035)`. `tests/db/catalog.db.test.ts` loses the matching assertions and the malformed-slug `it.each`, and its header line is updated to "list by name". The `listCategories` and `listNeighborhoods` assertions stay.
2. `landingPaths` in the cookies and headers specs: FIXED. `e2e/guest-cookies.spec.ts:16` adds `...landingPaths.flatMap(({ notASlug, wellFormed }) => [notASlug, wellFormed])` to `guestPaths`. `e2e/security-headers.spec.ts:47-50` adds the not-a-slug path as `{ dynamic: false, status: 404 }` and the well-formed path as `{ dynamic: false, status: 200 }`, which is the shape round 1 asked for and the one `experiencePaths` uses. `landingPaths` in `e2e/routes.ts:122` holds both kinds, so four paths are covered in each spec.
3. A real `LandingRoute.test.tsx`: FIXED. 15 tests in `src/app/(guest)/new-york/_landing/LandingRoute.test.tsx`, modelled on the experience page test, mocking `@/server/landing`, `@/server/browse` and the logger, with the header listing the behaviours. They cover not-found, the page's error state with its retry address, the logged payload being only `{digest, kind}` (asserted against a driver error carrying a query and a secret), success wiring per kind with the browse address, the no-copy page, control-flow rethrow in both the page and its results, the browse query per kind, the empty and error wording, and the head with and without a description, for an unknown page, and on a failed read. I mutated the route in the scratch copy and each of these was caught (a test failed): dropping `rethrowOrLog` in the results; dropping it in the head; swapping intro and body content; reading intro unconditionally; a wrong `browseHref`; returning the empty view in place of `landingErrorView`. Surviving mutants, neither a gap: setting `description: undefined` in place of omitting it (`toEqual` treats them as equal, so the output is the same in effect), and the skeleton's `filters` prop (a visual detail, covered by the BrowseSkeleton stories).

### The `wording?: 'landing'` addition

- Browse output is unchanged when it is absent. `browseView` in `src/lib/pages/browse.ts` never sets it, so every browse and home view is built exactly as before; the only code that sets it is `landing.ts:107` and `:114`. In `BrowseResults.tsx` the landing branch for empty sits after the `dated` branch and before the default, and the error body falls to the old text unless `wording === 'landing'`. The existing browse and `BrowseContent` tests pass unchanged. Mutation check: forcing `wording === 'landing'` to false fails four tests (two component, two route); removing `wording` from `landingErrorView` fails three; so the new wording is pinned at both layers.
- The decision lives in `src/lib` and is tested: `landingView` turns an empty browse page into `{ empty, filtered: false, dated: null, wording: 'landing' }` and `landingErrorView` sets it, each with a `landing.test.ts` case. The component holds no rule about when the wording applies, only the two strings.
- Shape: it is a flag that selects between two fixed strings in the component, not a view that carries its own text. I judged that acceptable here, not blocking: the component already works this way (`filtered` picks the empty heading, body and button inside the same `case`), the view carries text only where it varies by data (`summary`, `dated.message`), and the landing strings are static. It is not a bare boolean: a named literal that can grow. See the first non-blocking item for the cost.

### Blocking

None.

### Non-blocking

- `wording` makes an invalid combination representable: `{ state: 'empty', filtered: true, dated: null, wording: 'landing' }` type-checks and the component renders the landing text and ignores `filtered`. Today only `landing.ts` builds it and always with `filtered: false`, so no input reaches it. If a third wording appears, replace the flag with a `notice` that the view carries (title, text, optional action), the way `dated` does, rather than adding literals to the union.
- The landing empty text repeats the default branch's "New experiences are on their way." and "Nothing to browse yet" shape in the component. One string; fold it if the empty branches are ever tabled.
- `generateStaticParams` in the two `page.tsx` files returning `landingPlaceholderSlug` has no unit assertion (the experience route asserts its own). A wrong return fails `next build`, so it is not unseen; add a one-line check if cheap.
- Carried from round 1 (audit items for the PM, unchanged by this diff): the `.page`, `.intro`, `.title` duplication between `LandingPage.module.css` and the browse page module; the try/read/`rethrowOrLog`/error-view shape repeated across `LandingResults`, `BrowseContent` and `HomeContent`; U-100 must take its axe rows for these routes from `landingPaths`; U-091's crawler-view test should cover an unlisted unknown slug (first request answers 200 with `noindex`). The prerender departure is ruled in DECISIONS.md (2026-11-01) and is not a finding.

### Unconfirmed

- The Playwright specs (cookies, headers) were not run by me, and the db suite was not run. Round 1 read the built app with curl and found these four paths answer as the added rows expect (404 and 200, report-only CSP with no nonce, no `Set-Cookie`, no `cookie` in `Vary`); the fixer reports 106 of 106.
- The Reuse section of the builder's PR body was not available to me, as in round 1.

### Evidence

No files added to `evidence/pr/`. Checked from the diff and a scratch worktree at 5ee5376: the unit run and mutation results above, and `grep` for the removed reads.
