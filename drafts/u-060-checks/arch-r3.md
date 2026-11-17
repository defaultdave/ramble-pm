ARCH_VERDICT=APPROVE
ARCH_BLOCKING_COUNT=0

Architecture audit, PR 1024, head 9c15e850. Round 1 (12 items) and round 2 (8 items) all verified fixed; B1 to B17 swept over the added lines with no blocking finding. Advisories: the demo reset (wipe, runSeed, seedReviews) is several commits, not one transaction; ReviewInviteError export has no importer.
