SCOPE MANIFEST
IN SCOPE: a test-site console at `/ops/dev`, for ops and admin only and refused in production. It lists jobs (status, attempts, last error), runs one job, drains the queue and triggers pulse. It also sets or advances the Clock port, so a tester can reach hold lapse, reminders, review invites and gift send.
OUT OF SCOPE: fake-gateway outcome controls (FakePaymentForm already has them), data reset (U-124).
DEPENDS: U-073, U-121.
REVIEW TIER: standard.
ESTIMATE: 1.25 days (PM, not panelled).

Source: ramble-pm `drafts/mvp-replan-2026-11-10.md` section 3 (NEW-4); unit U-123 in `docs/plan/units.yaml`.
