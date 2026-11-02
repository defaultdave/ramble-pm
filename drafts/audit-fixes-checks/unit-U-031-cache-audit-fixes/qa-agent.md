FAIL

## qa-agent: U-031 "cache audit fixes" (head 9d4b9f7)

Result: FAIL on the evidence rule only. Chromium cannot start in this sandbox, so there are no browser screenshots, and the qa-agent rules say a verdict without screenshots is not a PASS. Every functional check below passed. A rerun with a working browser is the only thing missing, and it should take a few minutes against the same seed steps.

### Blocking
- Environment, not the unit: headless Chromium (Playwright chromium_headless_shell-1248) dies on launch with `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer: Permission denied (1100)`. The Playwright MCP tools were not available either. I did not retry outside the sandbox. No screenshots and no embedded evidence images exist for home, browse or an experience page. No before and after files from the builder were in `evidence/pr/` for this unit (no `unit-U-031-cache-audit-fixes` folder).

### What I ran (scratch worktree at 9d4b9f7, production build)
- Own scratch worktree, own database `qa_cache_u031_<epoch>` on the local Postgres (migrated, `SEED_TARGET=local pnpm db:seed`, then `--scale` for 400 experiences and 5,120 sessions), `pnpm db:http` on port 4583, `pnpm build` (exit 0) and `pnpm start` on ports 3583 to 3588. A second scratch worktree at the base commit (`053bd1a`, the parent of 9d4b9f7) was built the same way for before and after comparison. Both worktrees and the database are removed.
- Render, as fetched HTML (no browser): home, `/new-york/browse` and an experience page all return 200 on head and base. Visible text, with scripts and styles stripped, is identical line for line between base and head: home 99 lines, browse 86, experience 130. Head pages show h1 "Ramble", "Browse experiences" and "Tea ceremony at Bramble Outfit", 7, 11 and 6 experience links, no error state, and no "undefined", "NaN" or "[object" in the text.
- Response cache tags (`x-next-cache-tags`, which Next.js only emits with `NEXT_PRIVATE_MINIMAL_MODE=1`; a plain `next start` strips it). Head and base are identical:
  - home: `_N_T_/layout, _N_T_/(guest)/layout, _N_T_/(guest)/page, _N_T_/, _N_T_/index`
  - browse: the layout tags plus `_N_T_/(guest)/new-york/browse/page, _N_T_/new-york/browse`
  - experience: the layout and page tags, `_N_T_/experiences/<slug-id>`, `experience:<id>`, `taxonomy`, `settings` (9 tags)
  - Home and browse data is read in the streamed part of the page, so their data tags are not in the response header. I read those from the cache entries instead (next item).
- Tag budget on the cache entries. I preloaded a small spy (outside the repo, in the scratchpad) that logs the tags of every `use cache` entry as Next.js stores it. After requesting home, browse (plain and `?page=2`) and 8 random experience pages on the 400-experience seed: 167 entries, largest has 13 tags (limit 128), longest tag 47 characters. By shape:
  - `settings`: 1 tag, 300 s revalidate
  - `taxonomy` (getFilterOptions): 1 tag, now 3600 s revalidate, 86400 s expire; on base it was 900 s
  - home entry: `home`, `taxonomy`, 5 `experience:<id>` = 7 tags, 3600 s (keeps its hour on head and base)
  - browse entries: `catalog` plus up to 12 `experience:<id>` = 13 tags max, 60 s
  - experience page entries: `experience:<id>` plus `taxonomy`, 2 tags, 900 s
  - session spaces: one `session:<id>` each, 8 s
  - No `catalog` tag appears on the taxonomy or home entries.
- Mutation check, in the scratch worktree only, restored afterwards (`git status` clean, 25 of 25 pass again). `pnpm exec vitest run src/server/home.test.ts`: baseline 25 passed.
  - `cacheTag(tags.taxonomy)` changed to `cacheTag(tags.catalog)` in `getFilterOptions`: 2 fail (the editorial-profile-and-tags test, and "a listing change of an experience no module names leaves it alone").
  - `cacheLife('editorial')` changed to `cacheLife('catalog')`: 1 fails (the editorial-profile test: got `{editorial, catalog}`, expected `{editorial}`).
  - Both together: 2 fail.
  - The builder's claim holds for either reading of "put catalog back".

### Non-blocking
- The spy shows the base build did not store an `experience:<id>` plus `taxonomy` entry for the experience page in my single-request base run, while head did. The response tags and visible text are identical, so I treat it as a difference in what my one-request run exercised, not a regression. Unconfirmed.
- `ps` and `kill` from a later command are refused by the sandbox for servers started with `nohup ... &` in an earlier command. Servers started and killed inside one command stopped cleanly. Four servers from earlier commands are still running and need stopping by their owner (see below).

### Unconfirmed
- Visual layout, images, focus states and responsive behavior of the three pages (no browser).

### Evidence
- None. No screenshots could be taken (Chromium refused). The HTML text comparison and tag logs above were run live and are not saved as files.

### Left running (sandbox refused kill from a later command, and I did not bypass it)
- 3583 next-server pid 7104, 3584 pid 8217, 3585 pid 9069, and the db shim on 127.0.0.1:4583 pid 6395. Their worktree and database are gone, so they only serve errors now. Stop with `kill 7104 8217 9069 6395`.

QA_VERDICT=FAIL
