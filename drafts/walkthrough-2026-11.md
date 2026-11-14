# Walkthrough, November 2026

**Purpose:** Dave walks every built page as each role and writes down what to change. Each row in the findings table becomes a page-change ticket, or gets closed as won't. This is the step between the slim MVP (DECISIONS 2026-11-13) and Dave using the site to test ideas.

**How to use it:** go through the passes in order. Every time something looks wrong, reads badly or is missing, add a row to the findings table at the bottom, even a one-word row. The PM sorts the rows afterwards. Do each pass at phone width first, then desktop, because the site is mobile first.

## Before you start

1. **Pick the site.**
   - **Local (recommended):** `pnpm dev` with a seeded database.
   - **Deployed:** the seed's `production-demo` target leaves out the test accounts (`seedsPersonas` in `src/lib/seed/personas.ts`). On a production-demo database only the guest-without-signing-in passes work.
2. **Signing in.** Sign-in is by email link. Go to `/sign-in`, enter one of the addresses below, then open `/ops/mailbox` and click the link.
   - The mailbox unlocks with the shared secret (U-006) or when you're signed in as ops or admin.
   - Sign-in emails go out right away, so they don't wait for the job queue.
3. **Jobs.** Booking confirmations, reminders and refunds wait in the job queue, and the `pulse` workflow that drained it every 30 minutes is now disabled. Until the test console (U-123, `/ops/dev`) lands, those emails don't arrive on the deployed site. A note in the findings table is enough for anything that waits on a job. Locally, a `POST` to `/api/pulse` with `Authorization: Bearer <PULSE_SECRET>` drains the queue. On the deployed site, re-enabling the workflow and running it by hand does the same (`gh workflow enable pulse --repo defaultdave/ramble`, then `gh workflow run pulse --repo defaultdave/ramble`).
4. **Payments** are fake. The payment form has its own outcome controls (approve, decline and so on).

## Test accounts

All addresses are on `ramble.test`, a reserved domain, so nothing reaches a real inbox.

| Who | Address | Can do |
|---|---|---|
| Gwen Guest | `guest@ramble.test` | Guest account, bookings |
| Olive Owner, host A (Hudson Paddle Club) | `owner.a@ramble.test` | Host owner |
| Sam Staff, host A | `staff.a@ramble.test` | Host staff, read-only |
| Oren Owner, host B (Kiln and Clay) | `owner.b@ramble.test` | Host owner, for checking one host can't see the other's data |
| Sasha Staff, host B | `staff.b@ramble.test` | Host staff |
| Opal Ops | `ops@ramble.test` | Ops |
| Ada Admin | `admin@ramble.test` | Admin, including staff management |

## Pass 1: guest, not signed in

| # | Page | Try |
|---|---|---|
| 1.1 | `/` home | Hero search, home modules, header search pill, footer |
| 1.2 | `/new-york/browse` | Filters (date, guests, price, category, neighborhood), keyword search, empty results, the filter drawer at phone width |
| 1.3 | `/new-york/things-to-do/<category>`, `/new-york/neighborhoods/<neighborhood>` | Landing pages reached from home and browse |
| 1.4 | `/experiences/<slug-id>` | Photos, details, the booking panel (date, time, guests), the host block, the map link |
| 1.5 | `/experiences/<slug-id>/private-session` | The private-session request form. Its ops list (U-083b) is parked, so a sent request goes nowhere you can see |
| 1.6 | `/hosts/<slug>` | Host profile, the host's experiences, cancellation terms |
| 1.7 | `/picks/<slug>`, `/guide/<slug-id>` | Picks and the editorial guide |
| 1.8 | `/help`, `/help/<slug>`, `/legal/<doc>`, `/accessibility`, `/contact` | Help, legal pages, the contact form |
| 1.9 | `/gifts` | Gift guide. **Gifting is parked:** decide whether this page and its links stay, are hidden or go |
| 1.10 | A made-up address | The not-found page |

## Pass 2: book as a guest

| # | Page | Try |
|---|---|---|
| 2.1 | Experience page, then Book | The hold is created and you land on `/checkout/<holdId>` |
| 2.2 | `/checkout/<holdId>` | The single-page checkout: guest details, the fake payment form (approve, then a decline), the hold timer |
| 2.3 | `/orders/<reference>` | The confirmation page |
| 2.4 | `/manage/<token>` (link in the confirmation email, or from the account page) | Manage the booking: move it to another session, cancel it, check the refund wording |
| 2.5 | `/sign-in`, then `/sign-in/confirm` | Sign in as Gwen: the check-your-email state, then an expired link and an already-used link |
| 2.6 | `/account` | Gwen's bookings and the header account link |

## Pass 3: host owner (Olive, host A)

| # | Page | Try |
|---|---|---|
| 3.1 | `/host` | Dashboard: today's and upcoming sessions, links |
| 3.2 | `/host/sessions` | The week view: add or edit sessions, change seats, publish a week |
| 3.3 | `/host/bookings`, `/host/bookings/session/<id>` | Bookings search; the guest list for one session, including the print layout |
| 3.4 | `/host/experiences` | Listings, read-only |
| 3.5 | `/host/settings` | Edit name, about and notification email |
| 3.6 | `/host/staff` | Invite Sam; see the staff list |
| 3.7 | Sign in as Sam (`staff.a`) | Staff see the host area read-only, with no guardian or children data |
| 3.8 | Sign in as Oren (`owner.b`) | Host B sees none of host A's sessions, bookings or guests |

Host cancel (U-070) is parked: a host can't cancel a session that has bookings. Ops can (pass 4).

## Pass 4: ops (Opal)

| # | Page | Try |
|---|---|---|
| 4.1 | `/ops` | The ops landing. The dashboard (NEW-7) is parked, so expect a plain page |
| 4.2 | `/ops/hosts`, `/ops/hosts/new`, `/ops/hosts/<id>` | Invite a host, edit one, suspend and unpause |
| 4.3 | `/ops/experiences`, `/ops/experiences/new`, `/ops/experiences/<id>` | Create and edit an experience, upload photos, price options |
| 4.4 | `/ops/experiences/<id>/availability` | Session templates and seat caps |
| 4.5 | `/ops/review`, `/ops/review/<id>` | The approval queue. It may be empty, because nothing moves an experience into review yet (logged follow-up) |
| 4.6 | `/ops/bookings`, `/ops/bookings/<id>` | Find Gwen's booking by email; resend the confirmation, cancel, refund |
| 4.7 | `/ops/sessions`, `/ops/sessions/<id>` | The session list, the impact preview, cancel, capacity change, pause the experience. Check the cancel emails' wording: they say "Ramble cancelled this session" (an open decision) |
| 4.8 | `/ops/support` | Contact-form messages from pass 1.8 |
| 4.9 | `/ops/audit` | Audit rows for what you just did |
| 4.10 | `/ops/mailbox` | Every email the walkthrough sent |

## Pass 5: admin (Ada)

| # | Page | Try |
|---|---|---|
| 5.1 | `/ops/staff` | Invite an ops person, grant and remove roles |
| 5.2 | Once U-123 and U-124 merge: `/ops/dev` | Run jobs, drain the queue, move the clock (hold lapse, reminders), reset demo data |

## Findings

Severity: **B** blocks testing, **F** fix before you test ideas, **L** later. Leave the Ticket column for the PM.

| # | Pass.step | Page | Width | What's wrong or wanted | Severity | Ticket |
|---|---|---|---|---|---|---|
| 1 | 2.5 | `/ops/mailbox` (every `/ops` page) | any | Dev error overlay: "Next.js encountered the unstable value `new Date()` while prerendering". `OpsAreaNav` in the ops layout calls `readOpsCaller` → `getCaller` → `systemClock.now()` before any request data is read. The page itself still renders (unlock form works). Fix: read request data (`connection()` or the headers) before the clock in `callerForHeaders`, or move the nav behind it | F | |
| 2 | 2.5 | `/ops/mailbox` (likely the whole ops shell) | desktop | Needs CSS love. The site header renders unstyled: the skip link shows at all times, and "RambleOperations" runs together in browser-default link colours. The message cards run off the right edge, the content sits in an odd left offset, and the footer shows as bare "Ramble" text under the Next.js issues badge. Cause found: `/host` looks the same. Both the ops and host layouts use `src/components/SiteShell.tsx`, which is a placeholder with no styles at all (a skip link, a header with a link and a span, a footer with one line of text). The guest side has a real `GuestShell` with CSS modules. The host and ops shells need a real header, nav and footer, built on the guest shell's tokens and parts. Screenshot taken 2026-11-14 | F | |
| 3 | 3.1 | `/host` while signed in as a guest | any | It shows "We can't find that page". That's by design: a refused caller gets a not-found, so host pages can't be probed. But a tester who's signed in as the wrong role gets no hint. Decide whether a signed-in non-host should see "This area is for hosts" plus a sign-out link instead | L | |
| 4 | | | | | | |
