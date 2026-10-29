PASS

## qa-agent: U-030 "one session window and two named session predicates" (head 1e9beb9, round 1)

Round 1 summary (full verdict in the session transcript): a throwaway dump at b01cdf8 and 1e9beb9 over 10 minuteAsOf keys (both DST nights, New Year's Eve, a leap day) and 7 bad keys, and a 5-position by live by spaces grid on home and the browse mirror, differs only in: home includes a live session with space exactly at from, excludes one exactly at to; bad keys throw ZodError instead of RangeError; date-only, offset, no-Z and minutes-only keys now refused. Seed probes identical on the curated fixtures at four instants and with the 400-experience scale fixture. pnpm test 173 files, 3790 tests pass. Ten mutants of sessionWindow.ts all killed. test:db refused by the sandbox (connect EPERM 5432). Non-blocking: seed upcoming() gains the browse window as an end bound (no probe result changes today); browse now refuses a no-seconds key (minuteAsOf output unaffected).
