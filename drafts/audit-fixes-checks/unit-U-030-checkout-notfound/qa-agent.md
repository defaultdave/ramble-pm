PASS

## qa-agent: U-030 checkout not-found and error states (head 41ff370)

### Blocking
None.

### Non-blocking
- No evidence PNG for the error.tsx state (hard to trigger); error.test.tsx covers it.
- The 8 PNGs are all the not-found state via two entry points.

### Unconfirmed
- e2e not run: port 3100 is held by another server.

### Checks run
- pnpm test: 257 files, 6579 tests pass. Checkout tests plus no-sentry: 26 pass.
- Mutation: reverting not-found.tsx or error.tsx to SiteShell fails the guest-frame test in each file.

### Evidence
- orders-notfound-375-light-before.png / -after.png, orders-notfound-1280-light-before.png / -after.png, gift-notoken-375-light-before.png / -after.png, gift-notoken-1280-light-before.png / -after.png (all in evidence/pr/unit-U-030-checkout-notfound/): the unstyled stand-in before, the full guest frame after, at both widths and both entry points.
