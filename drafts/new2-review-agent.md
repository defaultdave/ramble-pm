PASS

## review-agent: NEW-2 "Shared form components" (head b293490)

Delta reviewed: `git diff 3f4dc00 HEAD` (13 files).

### Blocking
None.

### Non-blocking
- src/components/Select/Select.tsx:33: the comment `TODO(U-073): first caller.` is now stale, because HomeHero is a caller. Remove it or keep it only if U-073 still owns a separate caller. No effect on behavior.
- The hero Select now sits in the shared Field wrapper, so the markup gains one nested div per select (HomeHero `.field` > Field `.field` > label + control). The date Input already nests the same way, so the three fields are consistent. The before and after screenshots show no visual effect.
- Select `.control` is `display: flex` and the label gains `font-family: var(--font-family-body)`; the old hero select had neither. Both resolve to the same rendered result in the screenshots (the body font is inherited).

### Unconfirmed
- None.

### What I checked
- Names and form fields: `name` attributes still come from `browseParamNames.neighborhoods` and `browseParamNames.guests` (Select spreads `...rest` onto the `<select>`). Defaults are unchanged: `defaultValue=""` for the neighborhood and `String(defaultGuests)` for guests. Options come from `neighborhoodOptions(neighborhoods)` and `guestOptions`. The GET form submits the same `neighborhood`, `date`, and `guests` params.
- Accessible names and ids: the label is still bound with `htmlFor` to a `useId` id on the select. With no hint or error, `fieldIds` returns `describedBy: undefined`, so no `aria-describedby` is rendered, the same as before. The chevron keeps `aria-hidden`.
- Styling: the hero variant restores the old hero values over the default Select styles: end padding `--space-10` (default is `--space-12`) and chevron colour `--color-text-secondary` (default is `--color-text-primary`). Label, control and chevron styles otherwise match the old `.label`, `.selectControl` and `.chevron` (same tokens, logical-property equivalents). The `.control.hero` rules have the same specificity as `.control .select` and come later in the sheet, so they win.
- Deleted CSS: `.label`, `.select`, `.selectControl`, `.chevron` are gone from HomeHero.module.css. A repo-wide grep finds no reference to them, to `SelectField`, or to `ConfirmDestructive` in src, .storybook or docs. The only remaining outside reference to HomeHero.module.css is HomeStates composing `copy` and `art`, which still exist.
- Evidence: md5 of all six before/after hero PNG pairs (desktop, mobile, and guests-default-to-two, each at 375 and 1024) in `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-NEW-2/` are identical. Files relied on:
  - hero-before-hero-desktop-375.png and hero-after-hero-desktop-375.png: hero at 375, identical.
  - hero-before-hero-desktop-1024.png and hero-after-hero-desktop-1024.png: hero at 1024, identical.
  - hero-{before,after}-hero-mobile-{375,1024}.png: mobile story at both widths, identical.
  - hero-{before,after}-hero-guests-default-to-two-{375,1024}.png: the guests default of 2, identical.
- Tests: `npx vitest run src/lib src/components` gave 218 files and 5812 tests, all passed. `tsc --noEmit` is clean. The new Select hero test and the existing HomeModules tests (label, options, guests value) cover the markup and the form fields.
- Duplication: the change removes the hero's local SelectField in favour of the shared Select, which is the reuse the rule asks for. No new duplicate found.
