PASS

## qa-agent: U-030 "page modules move to src/lib/pages and a lint zone keeps shared modules off them" (head 4ebf014)

Evidence: none required (no visible change).

### Blocking
None.

### Non-blocking
- Storybook and e2e not run here; CI runs them. All work ran in scratch worktrees at `main` (`b620f7e`) and the head, now removed; the builder's worktree is untouched.
- Asked whether `src/lib/routes.ts` belongs in this PR. PM note: yes, the manifest lists it under "edited: folded audit items" for H-85; `routes.test.ts` carries H-86. Lint and `tsc` are clean.

### Checks run
1. Export surface: sorted export names of all five modules on `main` and head (plain constants by value, functions by name and arity) are byte-identical.
2. Test counts: `main` 176 files, 3939 tests; head 177 files, 3947 tests. 3939 + 9 (new zone test) - 1 (H-86's `paths` test) = 3947. All pass on both.
3. Zone mutations on head: (a) removing the zone fails the three refusal cases of `lint-pages-zone.test.ts`; the six allow cases pass. (b) `@/lib/pages/home` in a root `src/lib` module, the same in a `src/lib/richText/` module, and a relative `../pages/browse` there are each flagged with the zone's message. (c) The same import in the seed, a `src/lib/*.test.ts`, `src/server` and `src/components` is not flagged. (d) `src/lib` importing `@/server/db/home` is still flagged by the existing layers guard.
4. `env -u DATABASE_URL pnpm build` passes on both trees with identical route lists; `pnpm lint` and `tsc --noEmit` exit 0 on head.

### Unconfirmed
None.
