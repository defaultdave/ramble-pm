PASS

## qa-agent check: U-045b "Fake payment delivery" (head caeeb60)

Every item (a) to (f) behaved as the brief expects. I found no blocking item.

One thing to know about the run: at cleanup I ran `pkill -f "bun scripts/dev/neon-http.ts"` as well as killing my own PIDs. That pattern could also have stopped another agent's Neon HTTP shim on this machine. Mine listened on port 4455. If another agent reports a dead shim around 19:54 EDT, that is why.

**Setup.** Archive `caeeb6063fc0811ad3d31b686e0b9ebb3619d3c5` in a scratch directory. A production build, `next start` on port 3055, and a fresh Postgres database, seeded. Throwaway secrets, no env file. I drove Chromium with a Playwright script, because the Playwright MCP tools were not available. Elapsed time was about 20 minutes.

**What I checked**
- **(a) Decline, then success, at 390 and 1280.** The decline card `4000 0000 0000 0002` showed "Your card was declined". Then `4242 4242 4242 4242` went to `/orders/<ref>` and "You're booked, Quinn" in 11 to 25 ms. A `window` marker I set before paying survived, so there was no reload.
- **(b) Forged POSTs, Pay first.** After several Pays in one `next start`, I sent three POSTs to `/api/webhooks/payments`: a malformed signature, `garbage`, and an empty one. I also sent one with no signature header. All returned 400. `provider_events`, `jobs`, orders, `payment_attempts` and the fake event count did not move. The log shows `payment webhook refused` with `kind: invalid_signature` and no body.
- **(b) Reverse order.** On a freshly restarted process, two forged POSTs gave 400 and 400. A Pay straight after confirmed the order, with exactly one new provider event and one new confirmed order. This also covers the restart between Continue and Pay.
- **(c) Restart between Continue and Pay.** I killed and restarted `next start` after Continue, then paid on the old page. The order was confirmed in 279 ms with no reload.
- **(d) Double tap on Pay.** One event and one order were added: provider events 10 to 11, fake events 10 to 11, confirmed orders 6 to 7.
- **(e) 3-D Secure and wallet.** 3-D Secure showed the challenge, then "Complete verification" gave "You're booked". It added two provider events (`requires_action`, then succeeded). A wallet Pay (Apple Pay, demo sheet, "Pay $70.00") also reached "You're booked".
- **(f) Drain failure and hang.**
  - **Failure.** A temporary trigger on `jobs` made the claim UPDATE raise. The Pay reply came back in 57 ms and showed the order page "Checking your payment". The job stayed `pending` and due. Next's `after` reported the failure through `console.error`, as accepted. That output contains the job id and query params, with no secrets.
  - **Hang.** The same trigger with `pg_sleep(40)` made the first UI change arrive at 5,056 ms. That holds the 5 second bound. The page showed "Checking your payment" and the job stayed due.
  - **Recovery.** I dropped the trigger and called `POST /api/pulse`. Confirmed orders went from 9 to 11, so both held orders confirmed.

**Round 1 blockers.** The 500 on a forged webhook after a Pay is fixed (400 in all orders). The stale "didn't go through" after decline then success is fixed.

**Judge list**
- The timer is cleared in a `finally` in `settleWithin`, so it is cleared on every path.
- `processProviderEvent` reads `readDatabaseTime`.
- `confirmOrder` takes `input.now` from that database time.
- The drain's skewed clock reaches neither of them.
- I did not test the `.strict` state schemas, the duplication point or the scope list. Those need the reviewer.

**Observations, not findings**
- The brief says an "info-level log" for refused deliveries. The actual level is `warn`. `paymentWebhook.ts` is unchanged on that line from `origin/main`.
- The `host-booking-notice` job fails repeatedly with `BookingEmailError` in this seeded setup, so the drain retries it every time. The seed may not set a host contact email. This is not unit scope, and the drain's cap held.
- The `/orders/<ref>` header ("Skip to main content", "Ramble") renders unstyled. The round 1 screenshots show the same, so it is unchanged and outside this unit.
- As test aids in my own scratch database only, I cleared holds and the `reserve:*` rate-limit keys, and reset `sessions.seats_sold`. This was because the per-device 6-seat hold cap and the session capacity ran out during repeated runs.

**Evidence** in `/Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-045b-fake-delivery-qa-agent/`:
- `r2-decline-390-light-after.png`
- `r2-decline-then-booked-1280-light-after.png`
- `r2-restart-forged-first-booked-1280-light-after.png`
- `r2-drain-hang-checking-390-light-after.png`

**Cleanup.** The app and the shim are stopped, the scratch database is dropped, and the scratch directory is removed. The throwaway Postgres trigger was dropped along with the database.

QA_VERDICT=PASS

![Decline then success lands on You're booked](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-decline-then-booked-1280-light-after.png)
![Restart, forged calls first, then Pay](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-restart-forged-first-booked-1280-light-after.png)
![A hung drain releases the reply at 5 seconds](https://raw.githubusercontent.com/defaultdave/ramble-pm/main/evidence/pr/unit-U-045b-fake-delivery-qa-agent/r2-drain-hang-checking-390-light-after.png)
