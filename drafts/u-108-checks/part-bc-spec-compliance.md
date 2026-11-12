PASS

Part B+C criteria met on f289ee9 and unchanged in substance since: updateAllocation (never below sold+held, version-checked, audit row in the same transaction), pause the experience through main setExperiencePaused and cancel its future sessions through cancelSession, each atomic and idempotent, retry completes the rest, no gift emails, no step-up. Axe rows deferred (U-100 not landed).
