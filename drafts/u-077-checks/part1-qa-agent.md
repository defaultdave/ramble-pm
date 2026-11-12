PASS (gaps named: no browser, and no e2e or Storybook run by the QA agent; CI ran them)

CI on a3b8709: db, storybook, e2e, build, test, lint, format, knip, codeql, gitleaks, osv, scope-manifest all passed. Local gates on the merged head: format, lint, typecheck, knip and 10k unit tests; the builder ran the db tests for ops-bookings, the authz matrix and host-setup on 6de4e65. Unconfirmed: /ops/bookings and /ops/bookings/[id] in a browser (search by email and by reference, the refund-failed filter, paging, detail with history). PM should capture those.
