PASS (re-audited: settling delta audit plus a delta review of the matrix-test fix)

The settling delta audit of the last code batch (8280169) found no blocking items: minors data is selected only for owners and the staff data type has no such fields; no leak path. The two later commits are test-only (bcdf2fc, 4370187) and were reviewed. Non-blocking logged: parse-before-authorise order in grantHostStaff, double email parse on the invite path, no test for a user who is staff of A and owner of B.
