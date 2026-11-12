PASS (gaps named: no browser, and no e2e or Storybook run by the QA agent; CI ran them)

CI on 666b5ac: db, storybook, e2e, build, test, lint, format, knip all passed (the earlier storybook axe failure on the SupportQueue stories is fixed). Builder gates: 9879 unit tests, support/host/experience/audit/authz db tests. Unconfirmed: the pages in a browser and migration 0032 on a database with existing support rows. PM should capture /ops/support list, resolve form and resolved state.
