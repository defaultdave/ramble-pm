PASS

## review-agent: U-030 "the category rail renders the shared ChipLink" (head 32a4bd0)

### Blocking
None.

### Non-blocking
- Test gap (audit item): `src/components/HomeModules/HomeModules.test.tsx:125` checks the rail has 8 links and Cooking's href, not the other seven hrefs, and nothing pins that the links come from ChipLink (no `aria-current`, no prefetch); a swap back to a plain `Link` would pass. Enough for H-58, so not blocking.
- No test or story changed; fits the manifest, neither names `.pill`.

### Unconfirmed
- Rail at 320 px not rendered here (no Chromium); each `.pills > li` is `flex: none; max-width: none`, so no seeded label should wrap. The PM's captures confirm.

### Checks
- `CategoryRail.tsx` renders one `<ChipLink label={name} href={href} selected={false} />` per category, keyed by slug; `vitest run src/components/HomeModules` 23 of 23.
- No `.pill` dependents left (only `--radius-pill` token uses); `.link` (PicksSection) and `.action` (GiftGuideSection) still used and keep their focus ring; ChipLink has its own.
- PM rulings followed: ChipLink unchanged, no wrapper or nowrap workaround, `prefetch={false}` from ChipLink; `src/components/Chip` untouched.
- Duplication: one removed, none added.
