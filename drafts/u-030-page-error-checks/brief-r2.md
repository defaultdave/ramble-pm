# Components-4 round 2: PageError composes PageHeading

Round 1 (head `2ded8f7`): review, qa and a11y PASS; architecture-audit and spec-compliance FAIL. Verdicts in this folder (`r1-*.md`). Fix both blocking items in one round; nothing else.

## Blocking items

1. **B17, architecture-audit:** `PageError` repeats the page shell that `src/components/PageHeading.tsx` already provides (a `display-m` h1, gutter padding, the content-max grid column, a children slot, and a lone action that fills the phone width and keeps its own width from 768 px). `ErrorNotice` already uses it. Fix: `PageError` renders `<PageHeading title={title}>` with the `Alert` and the retry form as children. Delete `PageError.module.css`'s `.page`, `.pageInner` and `.title`; keep only what the retry form needs, if anything.
2. **Spec, spec-compliance:** the `padding-block: var(--space-16)` from 768 px was not in the brief. Composing `PageHeading` removes it: both error pages take `PageHeading`'s padding at every width.

## Scope manifest additions

```
IN SCOPE (in addition to round 1's manifest):
  src/components/PageHeading.module.css   extend the lone-action rule so a form child behaves like a
                                          button child: `.page > form` fills the phone width and is
                                          `justify-self: start` from 768 px; the button inside the form
                                          fills the form (so it is full width on a phone and label
                                          width from 768 px)
  src/components/Notices.test.tsx         one PageHeading case with a form child, if a test can show it
OUT OF SCOPE: PageHeading.tsx's markup and props; ErrorNotice; every other PageHeading caller's look
  (ops mailbox, checkout demo) must not change: check they have no form child, or say what changes.
```

## PM rulings for round 2

- The home error's block padding from 768 px goes from 64 px (HomeStates `.page`) to `PageHeading`'s 32 px; the experience error keeps its 32 px. Accepted: one shell, one padding. Listed in the PR body.
- `PageError` keeps its own test and stories files (it is the component the pages render); the shell's behaviour is covered where `PageHeading` is tested.
- `PageHeading` renders a `<header>`; `ErrorNotice` already puts its error content there, so that is the existing pattern.

## Finish

Merge nothing; commit on `unit/U-030-page-error` as `U-030: PageError composes PageHeading` with the trailer. Rerun every gate from the rules. Report the new head SHA from `git rev-parse HEAD`, each blocking item and how it is fixed, and the story ids (unchanged, or the new ones).
