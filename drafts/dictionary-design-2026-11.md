# Text dictionary: design, November 2026

**Status:** draft for Dave. Nothing gets built until he approves it (DECISIONS 2026-11-14). It picks up item 3 of `drafts/sprint-2-production-ready.md`: one locale, typed, no library.

**Evidence:** a read-only inventory of `main` at `7a26999` on 2026-11-14. Its counts come from an AST scan, so they're approximate.

## 1. Problem

Ramble has about 1,500 distinct user-facing strings (about 1,900 occurrences in 315 files), and no one place holds them.

- **Components:** about 670, mostly JSX literals.
- **Lib:** about 690. They sit in 129 exported `*Label`, `*Notice` and `*Message` functions next to domain logic.
- **Routes and metadata:** about 200.
- **Emails:** `bookingBody.ts` alone has 65.

Rewording a page means finding its strings across components, lib modules and tests. 371 `getByText` calls and about 890 role names in tests repeat copy as literals, so a wording change also breaks tests that had nothing wrong with them.

The walkthrough is about to produce a list of page changes, and most of them will be wording.

## 2. Goals and non-goals

**Goals**
- Every piece of interface text for a page lives in one typed module you can find from the page's name.
- Changing wording touches one file, and the tests keep passing unless behaviour changed.
- Client islands ship only the strings they render.
- New hard-coded text is caught in review by a lint rule, not by a person.

**Non-goals**
- **Translation.** The PRD has no translation requirement, so there are no locale switches, no `getDictionary(locale)`, no message-format library and no ICU syntax. Section 8 shows what adding a second locale would cost later.
- **Content stored in the database.** Editorial pages, help articles, home modules, legal documents, experience and host text, and the seed fixtures that create them are content, not interface copy, and they stay data.
- **Developer-facing text.** Zod invariants (for example "The total is the ticket subtotal plus the tax"), `new Error(...)` messages, logger messages, operator-only job text (`abandonedMessage`) and the PII inventory in `privacy.ts` stay where they are.

## 3. Layout

One folder: `src/lib/copy/`, split by area so that an island's import brings in only its own area.

```
src/lib/copy/
  common.ts        actions (Save, Cancel, Close, Continue), error and not-found notices, brand, site nav and footer
  meta.ts          page titles and descriptions, and the one '%s | Ramble' template
  format.ts        count, plural and list helpers (moves countLabel, guestsLabel and andList here); formatMoney and the zoned date labels stay where they are and are re-exported
  guest/home.ts, guest/browse.ts, guest/experience.ts, guest/pages.ts, guest/account.ts, guest/signIn.ts
  booking.ts       the bar, sheet and panel, outcomes (today in booking.ts, bookingOutcome.ts and bookingDraft.ts)
  checkout.ts      checkout, the fake payment form, the hold timer, the order status poller, confirmation
  manage.ts        manage, cancel and move
  host/*.ts        dashboard, sessions, bookings, listings, settings, staff
  ops/*.ts         one file per ops area (bookings, sessions, hosts, experiences, review, support, staff, mailbox, dev)
  email/*.ts       subjects and body text per template (bookingBody.ts moves here)
  forms.ts         user-facing field errors (support, private session, availability, host sessions, invalidFormNotice)
```

**Shape of a file.** Each file is one `as const` object of strings, with functions only where a value has to be filled in. The wording below is illustrative, not the real copy:

```ts
export const bookingCopy = {
  continue: 'Continue',
  holdNote: 'We hold your spots for 15 minutes while you check out.',
  paused: 'Bookings are paused right now.',
  perPerson: (price: string) => `${price} per person`,
  party: (guests: number) => count(guests, 'guest'),
} as const;
```

**Status labels** become exhaustive maps checked by the type system, so adding a status without its label is a type error:

```ts
export const orderStatusLabel = { held: 'Held', paid: 'Paid', /* ... */ } as const satisfies Record<OrderStatus, string>;
```

The label maps that exist today move in with their imports unchanged: `bookingStatusLabels`, `experienceStatusLabels`, `sessionStatusLabels`, `orderStatusLabels`, `supportTopicLabels` and the rest.

## 4. How code reads it

- **Server components, lib view builders and emails** import the area object directly. There's no provider, no context and no async loader, because there's only one locale.
- **Lib view builders keep building views.** `buildExperiencePage`, `checkoutFlow` and the others still return the strings a page renders. They take them from the dictionary instead of writing them inline, so pages and components don't change shape.
- **Client islands** use one of two patterns, chosen per island:
  - **Props from the server parent.** This is the default for any text that comes from data: `BookingBarIsland` already gets `barView`, and `FilterDrawerHost` gets `applyLabel`. It ships nothing extra.
  - **A direct import of its area file.** This is for the island's own fixed chrome, such as "Check again" and "Card number". It's acceptable because area files are small. Importing `copy/index.ts` or another area from an island is not allowed: an ESLint `no-restricted-imports` rule on `'use client'` files makes that a lint error.
- **Metadata** reads `meta.ts`. The four group layouts share one title template instead of repeating `{ default: 'Ramble', template: '%s | Ramble' }`.
- **Plurals, money and dates.** The dictionary holds the words, and the formatting helpers stay as they are:
  - `formatMoney` and the `zonedLabels.ts` wrappers keep formatting values.
  - `count()` replaces both `countLabel` and the 18 hand-written `=== 1 ?` checks.
  - `Intl.PluralRules` isn't needed for English with no translation.

## 5. Tests

- **Component and lib tests assert with the dictionary**, for example `getByRole('button', { name: bookingCopy.continue })`, not the literal. A wording change then breaks no test, and a test that checks the wrong key fails, because the rendered text differs.
- **One contract test** pins a handful of strings that matter outside the code: the legal demo label, the email subjects, the payment-failure message, and the 404 heading. Changing any of those should be a decision.
- **E2E** (`e2e/routes.ts` headings) also imports from `meta.ts` and `common.ts`.
- **Migration is gradual.** A file's tests switch over in the same PR that moves that file's copy. A codemod handles the mechanical `getByText('literal')` cases where the literal is found in the dictionary.

## 6. Enforcement

- **New literals in `src/components/**` and `src/app/**`** fail ESLint's `react/jsx-no-literals`, with `noStrings: true` for JSX text and a short allowlist for punctuation (`·`, `,`, `/`, `(`, `)`).
- **Phase-in.** The rule starts as a warning everywhere and becomes an error per folder once that folder is migrated, using an ESLint override list in `eslint.config.mjs`. That keeps the build green during migration.
- **Attributes.** `react/jsx-no-literals` doesn't look at attributes, so literal `aria-label`, `title`, `placeholder` and `alt` values are caught by a `no-restricted-syntax` selector on those attribute names, under the same per-folder phase-in.
- **The architecture audit** gets one check: copy inside a lib module outside `src/lib/copy/` is a finding once its area is migrated.

## 7. Migration

The migration runs in five phases. Each phase is standard tier and no behaviour changes.

| Phase | What moves | Why first | Rough size |
|---|---|---|---|
| 0 | Scaffold `src/lib/copy/`, `common.ts`, `meta.ts`, `format.ts`; the lint rule as a warning; the import restriction for islands; the contract test | Everything else builds on it | 0.75 d |
| 1 | Guest pages: home, browse, experience, picks, guide, help, legal, contact, account, sign-in | What the walkthrough looks at first | 1.5 d |
| 2 | Booking, checkout, manage | The busiest islands; the bundle check matters most here | 1.25 d |
| 3 | Host and ops | The largest files (`opsBookings`, `experienceEditor`, `ExperienceForm`) | 2 d |
| 4 | Emails and user-facing form errors | Least visible; templates are already isolated | 1 d |

That's about 6.5 agent-days. Phases 1 to 4 can also ride along with the walkthrough's page-change units: a unit that rewords a page moves that page's copy first. Done that way, the dictionary costs little extra and the folders reach "error" one at a time.

**Bundle check.** Phase 0 records the client JS for each route (home, browse, experience, checkout). Each phase reports any change in its PR. A growth over 1 KB gzipped on any route sends the island back to the props pattern.

**Home skeleton (N1101-2).** The skeleton is fitted to the hero copy's wrap. Phase 1 moves the hero copy and re-checks the skeleton at 430 and 1232 px in the same PR.

## 8. If a second locale ever comes

The cost is known and bounded. You'd:
- turn each area object into a type (`typeof bookingCopy`);
- add a second object per locale that satisfies it;
- read the locale from the request in server code;
- pass it to islands as a prop.

Nothing in this design prevents that, and none of it is built now.

## 9. Decisions for Dave

1. **Scope:** interface copy only, with database content and developer text out (section 2). Recommended: yes.
2. **Layout:** one folder split by area, over one big file. One file would ship every string to every island. Recommended: by area.
3. **Islands:** server-built props first, direct area imports for fixed chrome, and nothing else (section 4). Recommended: yes.
4. **Tests assert through the dictionary**, plus one contract test (section 5). Recommended: yes.
5. **Lint:** warn now, error per folder as it migrates (section 6). Recommended: yes.
6. **Rollout:** ride along with the walkthrough's page changes, with phase 0 first as its own small PR (section 7). Or run it as a separate track. Recommended: ride along.
7. **Your file:** `.claude/standards/architecture.md` needs a line naming `src/lib/copy/` as the home for interface copy, and the island import rule. It's yours to edit.
