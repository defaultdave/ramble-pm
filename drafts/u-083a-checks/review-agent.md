APPROVE (round 2 on 65e1f39; round 3 changed only shared helpers, covered by the architecture audit)

Round 1 blocking: pastCursor duplicate of keysetPage (fixed by generalising keysetPage.ts). Verified: auth on both db functions, row lock under test, migration CHECK sound on existing rows, audit holds ids only, bounded reads. Non-blocking logged: no direct desc test of keysetPage.
