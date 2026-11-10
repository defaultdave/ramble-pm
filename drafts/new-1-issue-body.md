SCOPE MANIFEST
IN SCOPE: /sign-in (email form, uses the sign-in-links rate-limit key); check-your-email, expired-link and used-link states; the landing page on U-004a's verify route (`GET /api/auth/magic-link/verify`), which should confirm with a POST so mail scanners cannot burn the single-use link; sign-out; `next` redirect limited to same-origin paths; sign-in entry in the header
OUT OF SCOPE: Passkeys, social login, the account page (U-107), the ops nav (U-073), anything the line above does not name; adjacent ideas go in the PR's Suggestions section, not in code.
REFERENCE CODE: docs/plan/01-design-doc.md and docs/adr/ for conventions; the Figma `Ramble Core Flow Wireframes` for any sign-in frames; Cat Pass is reference only (ADR 0009).
- Section: platform (Access); MVP wave 1, lane W1-A (drafts/mvp-replan-2026-11-10.md in ramble-pm, section 3, NEW-1)
- Depends on: U-004a
- Built by: agent-fan-out; review tier critical (session and redirect handling)
- Estimate: 0.75 days likely
