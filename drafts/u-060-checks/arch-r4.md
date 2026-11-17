Round 4 head 05656f00d7debd980f0bafc74cdf6adf9b1599c1. Delta since 9c15e850: the review seed reads the terms document through its own db client (CI e2e seed failed on dbRead, the Neon HTTP driver), plus a merge of main (U-076a). Reviewed by the agent on that delta: APPROVE.

ARCH_VERDICT=APPROVE
ARCH_BLOCKING_COUNT=0

Architecture audit, PR 1024, head 9c15e850. Round 1 (12 items) and round 2 (8 items) all verified fixed; B1 to B17 swept over the added lines with no blocking finding. Advisories: the demo reset (wipe, runSeed, seedReviews) is several commits, not one transaction; ReviewInviteError export has no importer.
