PASS

Part B+C criteria met on f289ee9 and unchanged in substance since: updateAllocation (never below sold+held, version-checked, audit row in the same transaction), pause the experience through main setExperiencePaused and cancel its future sessions through cancelSession, each atomic and idempotent, retry completes the rest, no gift emails, no step-up. Axe rows deferred (U-100 not landed).

Re-posted on 1a73035: the only change since e948cd3 is a test-only commit that splits src/lib/opsSessions.test.ts (883 lines, over the 800-line lint hard limit) into opsSessions.test.ts, a new opsSessionsPause.test.ts and a shared opsSessions.fixtures.ts, moved verbatim with no behaviour change (3 files, no production code). Full lint, format, typecheck, knip and 10,538 unit tests pass locally.
