PASS

## spec-compliance: U-035 criterion 1 re-check (agent verdict, recorded by the PM because the agent is read-only)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | units.yaml scope: "Prerendered city pages with editorial copy" | PASS (by recorded PM decision, option b) | `DECISIONS.md:228` (2026-11-01, lead lane, PM decision, Dave can overrule): pages render on first request and stay cached, not prerendered at build, because a build has no database to list slugs from. It names the departure from the unit's "Prerendered" wording and from ADR 0001, and gives the reason. `delta-log.md:98`: the same departure, with the frozen units.yaml and ADR 0001 left as written. |

Holds only while the entry stands. Valid at the fix head, since the fix round does not touch `generateStaticParams`. Criteria 2 to 10 not re-judged; they passed at `37bd503`.

Follow-up, not a criterion: ADR 0001's "warm them after release" is not built; U-104 should carry it.

Blocking issues: none.
