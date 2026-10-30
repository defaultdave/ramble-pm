Audit H-46: the home read loaded every published Pick (up to 200, all items, and the rich-text intro) and cached it. It now reads only the collections its Picks modules name.

## What changed
- `homePickIds(modules)` in `src/lib/pages/home.ts` returns the distinct collection IDs of the Picks modules (at most 20; the gift guide is excluded). `HomePickIdsSchema` refuses a longer or malformed list.
- `listHomePicks(ids)` in `src/server/db/editorial.ts` reads those collections only: the first 12 guest-visible entries, the full guest-visible count, and no intro.
- One shared `readCollectionRows` now holds the guest-visibility join. `readCollections` (staff list, gift guide, `getPublishedPick`) and `listHomePicks` both use it, so there is no second copy (architecture round 1 flagged one).
- A pinned Pick is found however many other Picks are published. A db test publishes 201 others.
- `listPublishedPicks` is removed; its seed test now reads the table directly.

## Behaviour
"See all N" keeps its meaning: the number of guest-visible entries. The home page never rendered the intro. Entries now also order by experience ID after position, which only makes ties deterministic.

## Checks
Review, architecture, spec compliance and qa PASS on the second round. Gates: format, lint, typecheck, knip, build, 6385 unit tests, 1571 db tests, gitleaks over the range. qa mutation checks caught the entry cap and the guest filter. The browser render could not run in the sandbox.

## Follow-ups logged, not built
- Nothing tests that the home read leaves the intro unread (the mutation `intro: true` survives), and `columnsWithoutIntro` is a hand-written copy of the table's columns.
- The gift guide read still loads every entry and the intro.

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
