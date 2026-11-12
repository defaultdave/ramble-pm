APPROVE

Review of Part A on a9c031c: no blocking findings (stale check before any write, started-session refusal, own-host owner refused, cancel rollback tested). Final delta review of the last commits (cursorFrom in lib; main merged with one matrix conflict resolved, both row spreads kept): no findings. Size: 2,826 insertions (about 1,000 tests) is the read-and-cancel half of a unit the lead split into two PRs. Non-blocking logged: a hold expiring between load and submit gives one false stale; the refund-failed-in-the-gap case shows the generic error page.
