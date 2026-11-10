SCOPE MANIFEST
IN SCOPE: a pulse step that runs `generateSessions` to keep 12 weeks of sessions ahead of now. It is idempotent and has a DST test.
OUT OF SCOPE: template UI (U-074c), host week view (U-068).
DEPENDS: none.
REVIEW TIER: standard.
ESTIMATE: 0.75 days (PM, not panelled).

Source: ramble-pm `drafts/mvp-replan-2026-11-10.md` section 3 (NEW-3); unit U-122 in `docs/plan/units.yaml`.
