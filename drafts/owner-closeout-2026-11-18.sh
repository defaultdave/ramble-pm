#!/usr/bin/env bash
# Ticket close-out, one run. Owner runs this; agents do not close issues.
#
#   bash drafts/owner-closeout-2026-11-18.sh                # the answers of 2026-11-17, plus the combines below
#   bash drafts/owner-closeout-2026-11-18.sh --drop-parked  # also closes the 13 parked units (gifting, wave 4)
#
# Basis: the owner's "all recommended" answer (DECISIONS 2026-11-17) to
# drafts/ticket-closeout-2026-11-17.md section B. Issue numbers were checked
# against the open issue list, title by title, on 2026-11-18.
# New on 2026-11-18 (lead recommendation, DECISIONS 2026-11-18): the five
# image-sizing tickets become one (#992), and #367 moves into the walkthrough.
# Safe to run twice: closing a closed issue is a no-op.

set -u
R=defaultdave/ramble
close() { # close <reason> <comment> <numbers...>
  local reason=$1 comment=$2; shift 2
  for n in "$@"; do gh issue close "$n" --repo "$R" --reason "$reason" --comment "$comment" || echo "FAILED: #$n"; done
}

# 1. The 32 units cut from the MVP on 2026-11-10.
close "not planned" "Cut from the MVP on 2026-11-10 (DECISIONS in ramble-pm); can be re-filed if the goal changes." \
  6 35 53 58 62 63 78 79 80 81 86 101 102 103 104 105 106 110 112 113 115 118 119 120 123 124 125 126 127 129 131 132

# 2. Built and merged, issue left open.
close completed "Built and merged (commit 6672afb1, PR 163)." 151

# 3. Audit tickets that are fixed or already true on main.
close completed "Fixed; recorded as closed in the ramble-pm audit pass files (2026-11-17)." 326 735 830
close completed "The CSS fallback landed in PR 1027. No client onError island, per DECISIONS 2026-11-14." 997
close completed "Live guards fixed in PR 1035; the sessions clock floor is deliberate." 319
close completed "human-read is already a required status check in the main ruleset (25513279), read 2026-11-17." 998
close completed "NoScriptFilters is on the client islands allowlist (architecture.md, ratified 2026-11-16)." 890
close "not planned" "The client bot-challenge skip is the fix; a seeded e2e database is a separate project." 791

# 4. Combine: one image-sizing ticket instead of five.
gh issue comment 992 --repo "$R" --body "This ticket now carries all image sizing work, to be measured on a preview deploy before any change: IMG-2 (card sizes on phones), IMG-3 (#993, desktop lead source cap), IMG-4 (#994, gallery sizes at tablet widths), IMG-5 (#995, fill ignores stored width and height) and IMG-6 (#996, real-photo LCP cannot be measured locally). Detail for each is in ramble-pm audits/images-2026-11-14.md."
close "not planned" "Folded into #992, which now carries all image sizing work." 993 994 995 996

# 5. Moved into the walkthrough (drafts/walkthrough-2026-11.md, pass 1): a measurement, no code.
close "not planned" "Runs as part of the November walkthrough (axe, keyboard and 320 px sweep of the home page); findings come back as page-change units." 367

# 6. Label what stays open on purpose.
gh label create parked --repo "$R" --color BFD4F2 --description "Out of the slim MVP, kept for later" 2>/dev/null || true
for n in 73 74 75 76 77 98 48 111 114 117 121 122 128 992; do gh issue edit "$n" --repo "$R" --add-label parked || echo "FAILED label: #$n"; done

# 7. Optional: drop the parked units too.
if [ "${1:-}" = "--drop-parked" ]; then
  close "not planned" "Parked on 2026-11-13 and dropped on 2026-11-18; the plan in ramble-pm keeps the unit, so it can be re-filed." \
    73 74 75 76 77 98 48 111 114 117 121 122 128
fi

echo
echo "Open issues now:"
gh issue list --repo "$R" --state open --limit 100 --json number,title --jq '.[] | "#\(.number)  \(.title)"'
