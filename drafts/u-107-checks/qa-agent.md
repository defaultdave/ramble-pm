PASS (gaps named: no browser, and no e2e or Storybook run by the QA agent; CI ran them)

CI on 10b271e: db, storybook, e2e, build, test, lint, format, knip, codeql, gitleaks, osv, scope-manifest all passed. Builder gates: 9,984 unit tests; db tests for account, host guest list and the authz matrix. Unconfirmed: /account in a browser (signed-out redirect, upcoming/past lists, manage link, header link). PM should capture those.
