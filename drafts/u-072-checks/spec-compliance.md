PASS

All lite-cut criteria met (see 8280169); head 4370187 only adds two test-only commits on top: the matrix test admits readAccountBookings by exact name (a self-scoped guest read) and still fails for any other function that admits host_staff, and holdsRole (a pure predicate behind requireRole) is exempt by name from the completeness test. Axe rows not required (U-100 not landed).
