# U-014a pattern note (draft 2026-10-28, for Dave's approval)

Goes into U-014a's scope manifest once approved. U-014a is the first locking path: it fixes the lock order (device, session, hold, order, gift) that U-047a, U-048, U-052, U-059, U-064a, U-106, and U-108 follow, and the open-hold predicate and spaces-left function each of them reuses (`docs/plan/units.yaml`, U-014a `execution_reason`). It is human-led in the plan; this note is how Dave leads it.

Sources: `docs/plan/units.yaml` U-014a (scope; depends on U-012, U-018, U-013, U-111) and the scopes of U-014b, U-041, U-047a, U-048, U-064a, U-086, U-108; design doc 4.2 (rules 1 to 5), 4.2.1 (Ports and Server Actions tables), 4.2.2 (session columns, spaces left), 4.2.3 ("Rules every money and hold transaction follows", rules 1 to 3; "Holds": table, open hold, transitions, limits, `reserveSpaces` contract), 5.2 (S4, S5), 8 (Neon risk row), Appendix B findings 4 and 13; ADR 0002 (recommendation items 1 to 3 and 13; amendment "Data operations": pooled transaction for holds); ADR 0006 ("Integration tests for holds run against a real database"); ADR 0007 (BotID Basic on reserve); ADR 0010 (critical tier merges to `integration`); `docs/adr/research/u-013-neon-concurrency-spike.md`; PRD-16, PRD-17, PRD-21, PRD-41 (`docs/product/PRD.md`); `.claude/standards/architecture.md` (B2, B6, B7, B10, B12, B13, B14, B17); `drafts/wave3-builder-rules.md`; DECISIONS 2026-10-26 (U-018 B6 ruling; PM reading of B6 for `getGuestSettings`) and 2026-10-28 (U-031 B2 ruling); code on `main` at `5121048`: `src/server/db/{sessions,settings,locks,client}.ts`, `src/lib/{sessions,settings,pricing,spaces,rateLimits,clientAddress,catalog}.ts`, `src/server/db/schema/{catalog,policies,shared}.ts`, `src/server/ports/rate-limit/{index,bot-check}.ts`, `src/server/auth/caller.ts`, `tests/db/editorial-races.db.test.ts`.

Where a line says "Q", it is a call the PM made without a firm source; the questions are at the end.

---

**Pattern note (draft, not yet approved)**

Where things live
- Tables: `src/server/db/schema/holds.ts`, exported from `schema/index.ts`; one migration from `pnpm db:generate --name holds`. If another unit's migration lands first, merge `main` and regenerate (builder rules, Migrations).
- Decisions: `src/lib/holds.ts` with unit tests: the enum tuples, the Zod input and output schemas, `isOpenHold`, `spacesLeft`, `partyFor`, `holdExpiresAt`, `reserveRefusal`, `releaseDecision` (design doc 4.2 rule 5; B2; builder rules, "every domain decision lives in a plain `src/lib` function"). The capacity rule extends `checkAllocationChange` in `src/lib/sessions.ts` instead of adding a second one (B17).
- Data layer: `src/server/db/holds.ts` with `import 'server-only'`: `reserveSpaces`, `releaseHold`, and `readOpenHeldSeats(tx, sessionId, at)`, which `updateSessionAllocation` calls now and U-047a, U-048, and U-108 call later.
- Locks: `src/server/db/locks.ts` gains `lockDevice(tx, deviceKey)` (on the existing `lockFor`, key `hold-device:<deviceKey>`), `lockSessionRow(tx, sessionId)`, and `lockHoldRow(tx, holdId)`, and exports its `Transaction` type (private today). The lock order is written once, in that file's header comment; later units add the order and gift lockers there. If U-005 lands first with its own transaction type, use that one (B17).
- Settings: `readHoldSettings(tx)` in `src/server/db/settings.ts`, replacing its `TODO(U-014a)` (Q1).
- Guest door: `src/server/device.ts` and `src/server/actions/holds.ts` (Q3).

The `holds` table (design doc 4.2.3, Holds)
- `id` uuid; `session_id` uuid, FK sessions, restrict; `purpose` pgEnum `hold_purpose` (`booking`, `gift_redemption`); `gift_id` uuid, null, **no foreign key** (U-064a adds it, units.yaml); `status` pgEnum `hold_status` (`active`, `paying`, `converted`, `released`); `seats` int; `device_key` text; `ip_hash` text; `expires_at`, `created_at`, `updated_at` timestamptz; `paying_until` timestamptz, null; `released_reason` pgEnum `hold_released_reason` (`expired`, `guest_left`, `payment_abandoned`, `sold_out_after_lapse`, `session_cancelled`, `superseded`), null; `superseded_by` uuid, null, FK holds. Every column the design doc lists ships now, so U-014b, U-047a, and U-106 write columns that exist.
- The enum tuples live in `src/lib/holds.ts` and feed both `pgEnum` and Zod, as U-012 did for sessions (`src/lib/sessions.ts`, `schema/catalog.ts`).
- CHECKs, each matching a Zod rule, each with a db test that the database refuses the bad row (builder rules, quality bar 2):
  - `gift_id IS NOT NULL` exactly when `purpose = 'gift_redemption'` (design doc: required for a redemption).
  - `seats BETWEEN 1 AND 6` (design doc input: space-using total 1..6).
  - `device_key` and `ip_hash` match `^[0-9a-f]{64}$` (sha-256 hex, the shape `rate_limits` keys already use, `src/lib/rateLimits.ts`).
  - `released_reason IS NOT NULL` exactly when `status = 'released'`.
  - `superseded_by IS NOT NULL` exactly when `released_reason = 'superseded'`, written with `coalesce` because a CHECK passes on unknown (as `experiences_age_rule_limits` does); `superseded_by <> id`.
  - `status = 'paying'` implies `paying_until IS NOT NULL`; `paying_until` is null or `>= expires_at` (design doc: `greatest(expires_at, now()) + grace`).
  - `expires_at > created_at` and `expires_at <= created_at + interval '60 minutes'` (`settingsBounds.holdMinutes.max`, `src/lib/settings.ts`).
  - `updated_at >= created_at`; `isReadableDate` on every timestamp (`schema/shared.ts`).
- Index `holds_session_open_idx` on `(session_id) WHERE status IN ('active', 'paying')` for the spaces-left read. U-014b adds the device indexes its limits need.

The `hold_items` table (design doc 4.2.3, Holds)
- `hold_id` uuid, FK holds, restrict; `price_option_id` uuid, FK price_options, restrict; primary key on both; `quantity` int; `unit_price_minor` int; `uses_space` boolean.
- CHECKs with db tests: `quantity BETWEEN 1 AND 6` (design doc input); `unit_price_minor BETWEEN 0 AND 10000000` (`MAX_UNIT_PRICE_MINOR`, `src/lib/pricing.ts`).
- Rules across rows or tables, held by the data layer and pinned by db tests: each item's price option belongs to the session's experience; `holds.seats` equals the sum of quantities whose `uses_space` is true; at most 4 items (`MAX_LINES`, `src/lib/pricing.ts`).

Open hold and spaces left (design doc 4.2.2; 4.2.3 "Open hold")
- `isOpenHold(hold, at)`: `status = 'active'` and `expires_at > at`, or `status = 'paying'` and `paying_until > at`. The one predicate for spaces left, the device limit, and the block (the last two are U-014b's).
- `spacesLeft({ allocation, seatsSold }, holds, at)` is `allocation - seatsSold -` the seats of the holds that pass `isOpenHold`, returned as is; `spacesStatus` (`src/lib/spaces.ts`) already reads 0 or less as sold out.
- The data layer fetches open holds with the same predicate in SQL as a pre-filter (a `WHERE` is not a B2 decision) and the lib decides again over the rows; a db test pins that the two agree at each boundary (a deadline equal to `at` is not open). This is the shape of the U-031 ruling (DECISIONS 2026-10-28). The fetch is bounded: each open hold takes at least one space and all fit inside the allocation, so `LIMIT maxAllocation + 1` (1,001, `src/lib/sessions.ts`), and more rows than `maxAllocation` throws (quality bar 1; fail closed).

Time (Q2)
- U-005's `Clock` is not on `main` (`src/server/ports/clock/` is empty). The hold path reads time from Postgres: after the session row lock, a separate statement `SELECT date_trunc('milliseconds', clock_timestamp())` gives `at` (builder rules: "timestamps that order records come from `clock_timestamp()` after any lock"; design doc 4.2.3 rule 2: decide at processing time). It is a separate statement because a `clock_timestamp()` in the locking SELECT's own list can be evaluated before the lock wait ends.
- `at` is passed into every lib function (B12: no `Date.now()` in `server/**` or `lib/**`), and `created_at`, `updated_at`, and `expires_at = holdExpiresAt(at, holdMinutes)` are written from it, so the lib and SQL compare the same millisecond values.

The lock order (design doc 4.2.3 rule 1; B10)
- Device advisory lock (reserve only), session row, hold, order, gift. Transaction-level advisory locks only (`pg_advisory_xact_lock`, as `lockFor` does), because app traffic goes through the pooler in transaction mode (ADR 0002 amendment, Data operations; spike result 1: the pooler does not break `FOR UPDATE`).
- A path that starts from a hold reads its `session_id` with no lock, then locks the session, then the hold, then re-checks what it read (design doc 4.2.3 rule 1).
- Every hold read and write runs inside `db.transaction` on the pooled handle, never on `dbRead` (`src/server/db/client.ts`; the HTTP driver oversold 615 spaces in 8 rounds of the spike).
- The settings row is read with a plain SELECT, so it is not a lock and sits outside the order.

`reserveSpaces(device, input)` (design doc 4.2.3, `reserveSpaces` contract)
- Input, Zod in `src/lib/holds.ts`: `sessionId` uuid; `items`, 1 to 4 of `{ priceOptionId: uuid, quantity: int 1..6 }` with distinct `priceOptionId`s; `purpose`, `booking` or `gift_redemption`; `giftToken`, at most 256 characters (Q9), required exactly when `purpose = 'gift_redemption'`. Ids are lowercased in the schema (builder rules). A failed parse returns `invalid`, never throws. `fieldErrors` values are stable codes (`invalid`, `required`, `not_offered`, `party_size`); the copy is U-041's.
- Output, the design doc union exactly: `held` `{ holdId, expiresAt, totalMinor, lines }`; `sold_out` `{ alternatives }` (Q7); `blocked` `{ reason, until? }`; `unavailable` `{ reason }`; `invalid` `{ fieldErrors }`. `lines` is `PricingLines['lines']` and `totalMinor` is `PricingLines['totalMinor']` from `pricing.lines`, at the rate `pricing.taxRatePpm(experience.taxTreatment, settings.taxRatePpm)` (units.yaml U-014a scope; U-111's two `TODO(U-014a): first caller` markers in `src/lib/pricing.ts` go).
- Steps, in one transaction (design doc order):
  1. Parse. A gift redemption returns `unavailable` `gift_not_valid` before any lock, with `TODO(U-064a): the gift branch` (Q6).
  2. `readHoldSettings(tx)`: `bookingsPaused`, `holdMinutes`, `taxRatePpm`. Paused returns `unavailable` `bookings_paused`.
  3. `lockDevice(tx, device.deviceKey)`. U-014a takes it so the order is fixed now; U-014b's supersede and limits run under it.
  4. `lockSessionRow`: the session joined to its experience's `status` and `tax_treatment`, `FOR UPDATE OF sessions` (the shape `updateSessionAllocation` uses). Then read `at`.
  5. `reserveRefusal` decides: no session, or an experience whose status is not `live`, gives `invalid` with `fieldErrors.sessionId = 'invalid'`, one answer for both (Q5); a session that is not `scheduled` gives `unavailable` `session_cancelled` (design doc 4.2.2: only `scheduled` sessions accept holds; Q5); `starts_at <= at` gives `unavailable` `past`.
  6. Read the experience's price options. `partyFor(items, options)`: an option not on this experience (`not_offered`) or a space-using total outside 1..6 (`party_size`) gives `invalid` on `fieldErrors.items`. `pricing.lines` runs only on a party `partyFor` accepted, so its `RangeError` stays a programming error and is never caught.
  7. `TODO(U-014b): supersede the device's open active hold on this session, then the limits` at this point in the steps.
  8. `readOpenHeldSeats`, then `spacesLeft`; party seats above spaces left gives `sold_out`.
  9. Insert the hold (`active`, `seats`, `device_key`, `ip_hash`, timestamps from `at`) and its items, with `unit_price_minor` and `uses_space` snapshots taken from the same `lines` result. `TODO(U-086): the hold_placed event in this transaction` (U-086's scope). Commit.
- Every refusal writes nothing. No raw database error, params, or body is logged; log the error kind and an id (quality bar 4).

`releaseHold(device, { holdId })` (design doc 4.2.1 Server Actions table; 4.2.3 Transitions)
- Read the hold's `session_id` with no lock; lock the session, then the hold; read `at`; re-check under the locks.
- A missing hold and another device's hold get the same answer, `not_found` (builder rules: uniform refusals).
- `releaseDecision`: `active` (open or lapsed) becomes `released` with `released_reason = 'guest_left'` and `updated_at = at` (design doc Transitions: `active` to `released` on `releaseHold`); `paying` returns `payment_in_progress` and writes nothing (design doc); `released` returns `released` and writes nothing; `converted` returns `not_found` (Q4).
- Output: `{ status: 'released' } | { status: 'payment_in_progress' } | { status: 'not_found' }` (Q4).

Capacity edits (units.yaml U-014a scope; design doc 4.2.1 `updateAllocation` row; PRD-41)
- `updateSessionAllocation` (`src/server/db/sessions.ts`, U-012) already locks the session row; after the lock it reads `at` and `readOpenHeldSeats`, then calls `checkAllocationChange(seatsSold, heldSeats, allocation)`. Its `TODO(U-014a)` goes.
- `checkAllocationChange` refuses `allocation < seatsSold + heldSeats` with `{ reason: 'below_sold_and_held', seatsSold, heldSeats }`, replacing `below_seats_sold`. The function has no caller yet (`TODO(U-068): first caller`), so the rename touches only U-012's tests.
- The CHECK `sessions_seats_sold_within_allocation` stays the backstop under both (ADR 0002 item 1).

Tests
- Unit: every schema refusal; `isOpenHold` at each boundary; `spacesLeft`; `partyFor`; `reserveRefusal`; `releaseDecision`; `holdExpiresAt`; the extended `checkAllocationChange`.
- Db, `tests/db/holds.db.test.ts` in `pnpm test:db` (CI runs it against its Postgres 17 service, `.github/workflows/ci.yml`; Q8):
  - each CHECK refuses its bad row;
  - each output, with no row written on any refusal; `held` totals for a taxable, a not-taxable, and an unknown experience;
  - a changed `holdMinutes` changes `expires_at`;
  - a lapsed `active` hold and a `paying` hold past `paying_until` do not count; a `paying` hold past `expires_at` but before `paying_until` does;
  - the SQL pre-filter and `isOpenHold` agree at the boundaries;
  - `releaseHold` on its own hold, another device's hold (same answer as a missing one), a paying hold, a released hold twice, a converted hold;
  - capacity: refused below sold plus held; allowed when only lapsed holds stand in the way.
- Concurrency (ADR 0002 item 13; ADR 0006; the spike harness `docs/adr/research/spikes/u-013-neon/spike.mjs` is reference only):
  - 30 parallel one-space reserves from 30 devices on a session of 10, through a pool of at least 20: exactly 10 `held` and 20 `sold_out`, 5 rounds;
  - 60 parallel reserves of 1 to 3 spaces across 3 sessions of 10: no session ever has more than 10 held seats, 5 rounds (the spike's shape);
  - locked re-check (builder rules, Concurrency): a second connection holds the session row lock, inserts an open hold taking the last spaces, and commits; the waiting reserve answers `sold_out`. The same with the session set to `cancelled`, answering `session_cancelled`. Each test fails if the re-check under the lock is removed;
  - lock order: while a second connection holds the device advisory lock, a reserve waits, and a third connection's `FOR UPDATE NOWAIT` on the session row succeeds (it fails if the session were locked first);
  - reserve, release, and a capacity edit on one session in parallel, 50 rounds: no deadlock (SQLSTATE 40P01), and `seats_sold` plus open held seats never exceeds the allocation;
  - `at` is taken after the lock wait (the publication-time test in `tests/db/editorial-races.db.test.ts` is the pattern).

Not in this unit
- Supersede, the 6-space device limit, the 15-minute block, the cleanup job, and the runtime-cached spaces-left read with its per-session tag and invalidation (U-014b). Home's "On this week" still subtracts only `seats_sold` (`src/lib/home.ts`, the `spacesStatus` filter); it moves to U-014b's cached read.
- The gift branch and the `holds.gift_id` foreign key (U-064a); `active` to `paying` and every `paying_until` write (U-047a); `converted` (U-048); release on session cancel (U-059); the paying-hold lapse (U-106); the `hold_placed` event (U-086); the booking bar, sheet, panel, and the S4 and S5 states (U-041); `updateAllocation` and the ops capacity screens (U-108); a per-experience bookings pause (U-078; no column for it exists on `main`).

Secrets and settings (Dave)
- No new secret or env var. The settings row already exists (migration `0006`). BotID Basic needs no account step (ADR 0007), if Q3 stands.
- Before the builder starts: if Q1 is accepted, Dave edits B6 in `.claude/standards/architecture.md` (agents do not edit `.claude/`) and logs it in `delta-log.md`.

---

## PM notes for Dave (not part of the note)

**Q1. B6 and the caller-less reads (the open question from DECISIONS 2026-10-26, U-018 ruling).** The hold path must read `bookingsPaused`, `holdMinutes`, and `taxRatePpm` before it knows any caller, and it writes hold rows for a guest who is a device, not a signed-in user, so `requireRole` (`src/server/auth/caller.ts`) has nothing to check in either case.
- *Option A, widen B6:* add to B6's exemptions "a read of the settings row (configuration, no personal data) that takes the caller's open transaction, and a write joined to a transaction that already checked its subject". The hold path calls `readHoldSettings(tx)` inside the reserve transaction; holds take the device key as an ordinary input, and the reviewer checks the `device_key` match by hand.
- *Option B, typed proof of subject:* `src/server/device.ts` mints a branded `Device` (`{ deviceKey, ipHash }`), constructible only there, from the cookie. Every hold function takes it as its subject check, the way `Caller` works for signed-in roles. `readHoldSettings(tx, device)` takes it too, and so would U-047a's `recordLegalAcceptances(tx, device)`.
- *Recommended: both, each where it fits.* A for the settings read, since nobody owns configuration and a proof parameter there would prove nothing; B for hold rows, since they are a guest's rows keyed by device, so the device is the caller B6 checks (`hold.device_key = device.deviceKey`, with a uniform `not_found`). Suggested B6 wording: "Exempt: a read of the settings row that takes the caller's open transaction. A guest's device-keyed rows (holds, and the orders and acceptances made under a hold) are checked against a `Device` from `src/server/device.ts` instead of `requireRole`." The alternatives are B everywhere (a ceremonial argument on the settings read, but no B6 widening at all) or A everywhere (no `Device` type, so nothing in the types stops a hold function from skipping the device match).
- *`getGuestSettings` (stays in U-018):* it reads over `dbRead` (HTTP driver, outside any transaction), selects only the banner and three switches (guest-visible under B6, PM reading 2026-10-26), and its cached wrapper `getCachedGuestSettings` uses the `settings` profile (revalidate 300 s, invalidated by tag on save). It could give the hold path `bookingsPaused`, but not `holdMinutes` or `taxRatePpm`, which `GuestSettingsSchema` leaves out on purpose ("never a rate or a window", `src/lib/settings.ts`). The hold path would still need a second read, so the recommendation is one read of three columns inside the transaction, and `getGuestSettings` stays for pages.

**Q2. Database time, not the `Clock` port.** Recommended: `at` comes from `clock_timestamp()` after the session lock, as above. The decision is then made in the same clock as the SQL pre-filter and as `confirmOrder`'s later re-check (design doc 4.2.3 rule 2), and U-014a does not wait on U-005. The alternative is to take U-005's `Clock` and pass its time into SQL as a parameter: testable without inserting backdated rows, but a function's clock and Postgres's can differ, and a lock wait makes app time stale. For U-014b: its cleanup job may run under U-005's demo `asOf` clock, so it must judge holds with `isOpenHold` at database time, or a time-travelled pulse would release holds a guest is still using.

**Q3. U-014a ships the guest door.** Recommended: `src/server/actions/holds.ts` (`'use server'` actions `reserveSpaces` and `releaseHold`) and `src/server/device.ts`. The device cookie is `ramble_device`: 32 random bytes in base64url, httpOnly, Secure, SameSite Lax, path `/`, 400 days, set only in the action's response and never on a guest page render (U-009's test that guest routes send no cookies; B14). `device_key` is the sha-256 of the cookie, and `ip_hash` the sha-256 of `clientAddress(x-forwarded-for)`. The reserve action calls `consumeRateLimit('reserve', deviceKey)` (30 per 10 minutes, the existing policy in `src/lib/rateLimits.ts`) and `checkBot()` before the data layer, and adds `initBotId` in a new `src/instrumentation-client.ts` for POSTs to `/experiences/*`, plus `withBotId` in `next.config.ts`. A rate-limited try answers `blocked` `too_many_holds` with `until`, and a bot answers `blocked` `too_many_holds` without `until`, so the design doc's union is unchanged. Why: U-008b left `TODO(U-014a)` markers for exactly this (`src/server/ports/rate-limit/bot-check.ts`, both markers; `index.ts`, the `reserve` follower), no unit's scope mints the device cookie, and design doc 4.2.1 lists both functions as Server Actions. One alternative is data layer only, with U-041 building the actions and the cookie and the markers retargeted to U-041. Another is new `blocked` reasons (`rate_limited`, `bot`) through a delta-log entry. A note: a plain sha-256 of an IPv4 address can be reversed by enumeration. `rate_limits` keys already work that way; a keyed hash would need a new secret.

**Q4. `releaseHold` results beyond the design doc.** The design doc says only that it ends an `active` hold and refuses a `paying` one with `payment_in_progress`. Recommended: a second release of a released hold answers `released` (idempotent, for a double click or a retried request), and a converted hold answers `not_found`, the same as a hold that is missing or belongs to another device, so a stale tab cannot learn anything about a booking. The alternative is a distinct `already_booked`, which U-041 could word better, but it tells a stranger with a hold id that the id became a booking.

**Q5. A missing, hidden, or finished session.** The design doc's union has no "not found". Recommended: a missing session and one whose experience is not `live` give the same `invalid` (`fieldErrors.sessionId`), following the uniform-refusal rule, because a draft or paused experience is a row the guest may not see (`guestVisibleStatuses`, `src/lib/catalog.ts`). A `completed` session gives `session_cancelled`, like a cancelled one. In practice a completed session has also started, so `past` answers first; this only decides the code path. The alternative is a new `unavailable` reason such as `not_found`, which needs a delta-log entry against the design doc.

**Q6. The gift branch as a closed stub.** Recommended: U-014a accepts the full input shape and answers every `gift_redemption` with `unavailable` `gift_not_valid` until U-064a, under a `TODO(U-064a)`. It fails closed, and U-064a changes no schema. This follows the typed-stub pattern units.yaml uses for `confirmOrder`'s later branches (U-048). The alternative is to accept only `booking` in the schema now and let U-064a widen it.

**Q7. `sold_out` alternatives.** The output carries `alternatives: SessionSummary[]` (PRD-21: "shown other dates"), but no unit's scope says who fills it. Recommended: U-014a fills it, after the reserve transaction commits and without the lock: up to 3 other `scheduled` sessions of the same experience that start after `at`, within 14 days, each with spaces left at least the party's seats. `SessionSummary` is `{ sessionId, startsAt, timeZone, spacesLeft }`. The alternative is an empty list with `TODO(U-041)`, which the booking sheet would show as "no other dates" until then.

**Q8. Where the concurrency test runs.** Recommended: in `pnpm test:db`, which CI already runs against its Postgres service. ADR 0006 allows "a CI service container or a database branch", and the spike showed Neon's pooler, direct host, and WebSocket pool behave like local Postgres under the lock (0 oversold in each). ADR 0002 item 13 names a Neon branch in CI; that would mean a new workflow job (yours to land, since the App cannot push workflows) and a Neon secret in Actions. The Neon run under real load is U-096's k6 test.

**Q9. The numbers.** A 256-character `giftToken` bound; a 400-day device cookie (browsers cap cookie lifetime at about 400 days); `at` truncated to milliseconds; up to 3 alternatives within 14 days; the concurrency rounds (30 against 10, 60 against 3 by 10, 5 rounds, 50 mixed rounds). None comes from a source in the plan. Change any you want. The 1..6 quantities, 1..4 items, 10-minute default hold, and the 30-per-10-minutes reserve limit are sourced: design doc 4.2.3, settings defaults, and `src/lib/rateLimits.ts`.

**Why this is critical tier:** U-014a writes the first `FOR UPDATE` and the first advisory lock on a money path, and every later path that moves spaces or money (startPayment, confirmOrder, cancellations, refunds, gift redemption) locks in the order set here and counts holds with this predicate. A wrong order deadlocks those paths under load; a wrong predicate oversells or refuses real guests. That is why it merges to `integration` and you read it in the promotion batch (ADR 0010).
