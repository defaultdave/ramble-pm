Unit U-014b, issue #20. Critical tier, into `integration`. Two rounds; all four checks passed round 2, which also re-checked two merges of `integration` (U-054, U-016, U-047a; then the PR 241 main sync) and the renumbered migration.

SCOPE MANIFEST
IN SCOPE: supersede the same-session hold; a device limit of 6 spaces; a 15-minute block counted from deadlines; hold cleanup; runtime-cached spaces-left reads with a tag per session.
OUT OF SCOPE: the spaces-left UI (U-040), the booking bar (U-041), startPayment (U-047a), U-106's paying-lapse step, `docs/plan/`, `.github/`, `.claude/`.
REFERENCE CODE: docs/plan/01-design-doc.md 4.2.3 (holds, lock order) and the cache sections; `drafts/u-014a-pattern-note.md` and its amendments in `ramble-pm`; `docs/runbooks/cache-conventions.md`.

## What was built
- **Rules in `src/lib/holds.ts`** with unit tests: `holdsToSupersede`, `exceptSuperseded`, `seatLimitRefusal` (6 seats per device or address), `blockRefusal` (3 lapses in a sliding 15 minutes, `until` the third most recent deadline plus 15 minutes), `holdsToRelease`, `cleanupMayContinue`, `scrubCutoff`, `scrubbedHash`, `requireAtMost`; `holdLimits`.
- **`reserveSpaces`** (`src/server/db/holds.ts`): after the device lock, a client-address lock (`lockClientAddress`), then the session row; block, seat limit, spaces left (superseded seats count as free), insert, then mark the device's old active holds `superseded` with `superseded_by`; a refusal at any step writes nothing.
- **Cleanup in the pulse** (`src/server/pulse.ts`): after the drain and the rate-limit purge, `releaseLapsedHolds` (lapsed active as `expired`, lapsed paying as `payment_abandoned`, re-judged under each session lock at database time) then `scrubReleasedHolds` (device key and address hash to zeros 30 days after release); 100 per batch, at most 20 batches, within 60 s; the response gains `holdsReleased`, `holdsScrubbed`.
- **Cached spaces left** (`src/server/spacesLeft.ts`): `getSpacesLeft(sessionId)`, the first `'use cache: remote'` read, profile `spacesLeft`, tag `tags.session(id)`, through `readRemoteOrFallback` (`TODO(U-040): first caller`); `reserveSpaces`, `releaseHold` and `updateSessionAllocation` invalidate the tag.
- **Migration `0018_hold_limit_indexes`**: three indexes (device, address, released and not yet scrubbed). The PII inventory describes the scrub.

## Decisions to know about
- PM rulings (DECISIONS 2026-10-29): released holds are scrubbed, not deleted, after 30 days (holds are referenced with RESTRICT keys and a late payment can convert one); the seat limit and the block count a device's and its address's holds together; cleanup is a pulse step, and U-106's paying-lapse step must run before it (`TODO(U-106)`).
- Two departures from design doc 4.2.3, recorded in the `ramble-pm` delta log: the supersede is written after the checks (same result), and the lock order gains the address lock after the device lock.
- `updateTag` in the data-layer functions throws outside a Server Action; every caller must be one (audit BC-16).

## Gates (on this head)
format:check, lint, typecheck, knip; test 5,669; test:db 1,473 with `--maxWorkers=2`; build with no `DATABASE_URL`; db:check, `db:generate` with no changes; e2e 163; gitleaks over the branch range (no leaks). QA: twelve devices on one address reserving twelve sessions at once hold exactly 6 (10 with the address lock removed); the block edge at `until`; a pulse releasing 233 lapsed holds and scrubbing exactly those past 30 days; a rotated address on the same device still limited.

## Not done
- No page reads `getSpacesLeft` yet (U-040).
- Audit items BC-14 and BC-16 in `ramble-pm` `audits/booking-checkout.md`.

## Evidence
No visible change: rules, server code, a migration and the pulse. QA's probes are in the `qa-agent` check summary.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
