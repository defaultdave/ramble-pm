APPROVE (head 03d6d2f, 15 files, +303/-82, one logical change; no Critical or Required findings)

Scope: all changes within scope. Every file maps to #892, #1003, #1010, #1011, #1012, or its tests, stories, (host) README. No stray files.
Tests: CheckField, HostSessions, HostSetup, Availability suites pass (45/45) in a scratch worktree.

Per issue
- #892 Footer.module.css:87 ring gap now --color-bg-canvas, the issue's stated simpler fix (5.92:1 light, 9.15:1 dark). OK.
- #1003 Input.module.css:60 and ContactForm.module.css:55: focus-visible rule placed after the invalid rule, keeps danger inset plus canvas gap plus ring. Tokens only (B16 ok).
- #1010 CheckField.tsx: reuses fieldControl/fieldIds from src/lib/fieldIds (B17 ok); id, aria-invalid, aria-describedby wired; alert id = errorId so describedby resolves; problem styling composes Input's .error/.errorIcon, not copied. Tests assert accessible description.
- #1011 HostForm.tsx now passes problem to CheckField via the existing problemText (opsForm); AvailabilityView.tsx:104-118 group fieldset describedby the alert id, each day invalid. Tests cover both, plus the no-problem case.
- #1012 HostSessionForms.tsx:44-70 SessionResultHost holds the notice above the rows, focuses it on each new result (new object per report, so repeat cancels refocus). Test rerenders with the row non-editable and the notice survives.

Allowlist (architecture.md): HostSessionForms is already listed ("forms that show a Server Action's result in place and move focus", Dave 2026-11-16). SessionResultHost is a new export from that same allowlisted file, no new 'use client' file or hook. HostSessions stays a server component passing server children through the client wrapper. Optional: confirm Dave reads the 2026-11-16 ruling as covering a wrapper export; no rule is broken on its face.
B7: SessionResultHost is imported by HostSessions.tsx, not only by tests. B2/B4/B1: no violations. No new copy strings (dictionary rule n/a). No logging changes.
README: (host)/README.md updated (flowchart nodes and edges, SessionResultHost row). Accurate.

Non-blocking
- HostSessionForms.tsx:62-66 vs :122-126: the notice markup (div tabIndex -1 + Alert success + focus effect) is now written twice in one file. Small enough to leave; extract a shared SuccessNotice if a third appears (B17 audit item).
- HostForm.tsx: the agreement problem is no longer shown when `agreement` is null (the old paragraph rendered regardless). Only reachable with a tampered tick value and no live agreement; the else branch already tells the user there is no agreement. Not blocking.
- The cancel notice persists until reload or the next cancel; an unrelated later action leaves it showing. Acceptable for this fix.
- Not checked: a visual pass in Storybook (stories added: CheckField InvalidInAGroup); full lint and typecheck were not run.
