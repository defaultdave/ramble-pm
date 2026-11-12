PASS (re-posted on the merge head)

Unchanged from 834200d except merges of Part 1 (eed268c, which carries main incl. U-072) with no conflicts; a delta review of the merge commits confirmed Part 2 vs Part 1 is only Part 2 work and that the money-fix commits (d202617: refundIdFor, pickRetry) are in the head. Earlier verdicts on this stack: architecture-audit settling delta PASS, review APPROVE, spec PASS (axe rows deferred). Local gates on 9a07aa5: format, lint, typecheck, knip, 10,501 unit tests, build.
