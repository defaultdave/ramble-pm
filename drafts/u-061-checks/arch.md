ARCH_VERDICT=APPROVE
ARCH_BLOCKING_COUNT=0

Architecture audit, PR 1037, head 82419476449df898bfcceca1ac5e4e044fbc9a8c, two rounds. Round 1 (8 blocking: B2 refresh decision, B5 row and id parsing, four B17 duplicates) all verified cleared; B1 to B17 swept over the head with no blocking finding. Advisory: the first-name mapping call repeats once in reviewList.ts (a shared wrapper if a third caller appears); the list read is not audited by design (first name only).
