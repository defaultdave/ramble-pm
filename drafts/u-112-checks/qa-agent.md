PASS (gaps named: no browser, and no e2e or Storybook run by the QA agent; CI ran them)

CI on 934dd1d: db, storybook, e2e, build, test, lint, format, knip, codeql, gitleaks, osv all passed (the earlier PrivateSessionForm test failure on 4bacb5f was a flake in a file this PR does not touch). Builder ran the full db suite locally (two holds-races timeouts under shared load, passing alone) and 10,088 unit tests. Unconfirmed: the two pages in a browser; PM should capture /ops/staff (invite, resend, remove) and /ops/audit.
