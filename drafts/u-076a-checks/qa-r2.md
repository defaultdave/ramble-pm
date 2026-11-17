# QA r2: PR 1022, U-076a editorial editing (head 7d1d4d3edec6040e5e1410b5654c5cdb747a979e)

VERDICT: PASS

Every remaining round 1 item was run against a production build of the head SHA (`next build` and `next start`, because Turbopack dev cannot run in the sandbox). The run used a fresh seeded database, with Chromium driven by Playwright scripts. No blocking defects. There are a few notes below.

Screenshots: /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-076a-editorial-editing/qa-r2-*.png (36 files, desktop 1280 and mobile 390).

## Results
| Check | Result | Evidence |
|---|---|---|
| Edit a seeded article ("Where do I meet my host?"): edit page loads with the seeded headings, paragraphs and the Published badge | PASS | qa-r2-edit-seeded-desktop/mobile |
| Change the title and append a paragraph, then "Save changes": "Saved." banner, the new title and sentence persist after reload, the address is unchanged | PASS | qa-r2-edit-before-save-desktop, qa-r2-edit-saved-desktop |
| The guest /help list and /help/where-to-meet-my-host show the new title and the added sentence | PASS | qa-r2-help-edited-article-guest-desktop |
| New article: heading, subheading, bulleted list, numbered list, quote, bold, link typed (waiting two animation frames after each toolbar click). Save draft, then reload: all survive (`h2`, `h3`, `ul`, `ol`, `blockquote`, `strong`, `a`), and the reloaded HTML is identical to the saved HTML | PASS | qa-r2-editor-formatted-*, qa-r2-draft-reloaded-* (desktop and mobile) |
| The draft is not visible to guests (the "We can't find that help article" page) | PASS | qa-r2-help-draft-guest-* |
| Publish: "Published. Guests can read it now.", the article appears in the guest /help list and its page renders the headings, lists, quote, bold and link | PASS | qa-r2-published-ops-*, qa-r2-help-published-guest-* |
| Unpublish: "Taken down. Guests no longer see it, and the draft is kept.", Draft badge, gone from the guest list, the page shows not-found | PASS | qa-r2-unpublished-ops-*, qa-r2-help-unpublished-guest-* |
| Invalid address ("Bad Address!! with spaces", "-bad--") on Save draft and on Publish: "Use lower-case words joined by hyphens, such as how-to-cancel." on the address field, nothing created | PASS | qa-r2-invalid-address-*, qa-r2-invalid-address-publish-* |
| Address clash (an existing seeded address, on Save draft and on Publish): "Another article already uses that address. Choose another." | PASS | qa-r2-slug-clash-*, qa-r2-slug-clash-publish-* |
| Non-ops denial: guest session, host-owner session (both confirmed signed in: header shows My bookings / Sign out) and anonymous visitors get the "This area is for the Ramble team" gate on /ops/editorial, /ops/editorial/new and /ops/editorial/[id]. No editor content leaks | PASS | qa-r2-denied-guest-desktop, qa-r2-denied-owner-desktop, qa-r2-denied-anon-desktop |
| Mobile 390: list, new form and edit page have no horizontal overflow, the toolbar wraps onto 3 rows with 46px-high buttons, and the full create, publish and unpublish flow and the refusals work | PASS | qa-r2-list-mobile, qa-r2-new-form-mobile, qa-r2-edit-seeded-mobile |
| Keyboard only: Tab order is Title, Address, Summary, then Bold, Italic, Link, Heading, Subheading, Bulleted list, Numbered list, Quote, then the editor. Space on Bold applies bold and returns focus to the editor. Enter on Heading applies it and returns focus to the editor. Enter on Link moves focus to the "Link address" field, and typing an address and pressing Enter produces the link and returns focus to the editor. The toolbar buttons report aria-pressed | PASS | qa-r2-keyboard-focus-bold-desktop, qa-r2-keyboard-edited-desktop, qa-r2-keyboard-link-desktop |

## Resolved from round 1
- Round 1 finding 2 (the bold text and the following blocks missing after save) was a script artifact, not a product defect. On macOS Chromium, my script's `End` key did not collapse the selection, so `Enter` replaced the selected text. With `ArrowRight` and a wait of one frame, bold, headings and lists all survive save and reload.
- Round 1 finding 3 (the "Skip to main content" link permanently visible and unstyled on the ops pages): this also happens on /ops/hosts and /ops/support (position static at the top of the page), so it is not specific to this PR. qa-r2-ops-other-page-skiplink-mobile.png.
- Round 1 finding 1 (the title lost after a refused submit): confirmed, title, address and body all come back empty after a refusal. Reported as a note only, per the brief.

## Notes (not failures)
1. Title, address and body are all empty after any refused submit (invalid address, address clash, empty body). This is the accepted reload-from-database pattern.
2. A published article's link renders for guests as `<a href="https://example.com/qa" rel="noopener noreferrer">`: `target="_blank"` and `nofollow` from the editor markup are not present on the public page. This is probably the intended sanitizer or renderer output, but confirm it is intentional.
3. A guest request for a draft, unpublished or unknown help slug returns HTTP 200 on the first request, then 404 on later requests, with the not-found UI both times. This is the same for a nonexistent slug, so it is likely a streaming or Suspense behaviour that predates this PR.
4. Pressing Escape in the Link address field leaves it focused and open (not tested against the spec). Enter applies the link.
5. In round 1 and on the first run, `/ops/mailbox` logs "unstable value new Date() while prerendering" in the production build (unrelated).

## Not run
- e2e and unit suites (out of QA scope).
- Slug clash when renaming an existing article (only the new-article form and a seeded-clash address were tried).
- Dev mode (`next dev`), because Turbopack cannot start under the sandbox.

## Environment and cleanup
- The worktree was `/tmp/claude-501/qa-u076a`, reused and moved to the head SHA (checkout needed the sandbox off, because `.git/worktrees` is read-only). Env as in round 1, plus `pnpm db:http` on port 4444. Port 4477 was already used by another agent's shim (qa-1027), which I did not touch.
- Postgres was reachable this time. I used my own database `ramble_qa_u076a` (migrated at head), and the scratch worktree, the app on 3077 and the shim on 4444 were stopped and removed. The database was dropped.
- The Playwright scripts remain in /tmp/claude-501/pw (r2a through r2o.cjs).
