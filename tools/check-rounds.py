#!/usr/bin/env python3
"""Rounds per unit from the recorded check runs under drafts/.

    python3 -I tools/check-rounds.py 2026-11-01

Lists every unit whose verdict files were written in the day (local time,
00:00 to 04:00 the next morning, so a lane that runs past midnight stays with
its day), with one line per unit: rounds, and each round's verdict per check.
It reads only the first 300 characters of each verdict file.

Verdict files come in three layouts:
  r1-arch.md                       (wave 3 fixtures)
  architecture-audit.md, qa-agent-r2.md
  r1/architecture-audit.md         (round folders)
Briefs, posted copies, PR bodies and READMEs are not verdicts and are skipped.
"""
from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "drafts"
CHECKS = {
    "arch": "arch", "architecture-audit": "arch",
    "review": "review", "review-agent": "review",
    "spec": "spec", "spec-compliance": "spec",
    "qa": "qa", "qa-agent": "qa",
    "a11y": "a11y", "a11y-audit": "a11y",
}
ORDER = ["review", "spec", "arch", "qa", "a11y", "readme"]
OLD = re.compile(r"^r(\d+)-([a-z0-9-]+)\.md$")
NEW = re.compile(r"^([a-z-]+?)(?:-r(\d+))?\.md$")
ROUND_DIR = re.compile(r"^r(\d+)$")


HEAD_ROUND = re.compile(r"\bround (\d+)", re.IGNORECASE)


def head_of(path: Path) -> str:
    return path.read_text(errors="replace")[:300]


def classify(path: Path) -> tuple[int, str] | None:
    """Round number and check name, or None for a file that is not a verdict.

    The round comes from the file name, else from a round folder, else from a
    "round N" in the verdict's first line (a plain file name is round 1 only
    when its text does not say otherwise)."""
    name = path.name
    in_round_dir = ROUND_DIR.match(path.parent.name)
    if name == "README.md" and in_round_dir:
        return int(in_round_dir.group(1)), "readme"
    if name.startswith(("posted", "brief", "pr-body", "README", "measurements")):
        return None
    if (m := OLD.match(name)) and m.group(2) in CHECKS:
        return int(m.group(1)), CHECKS[m.group(2)]
    if (m := NEW.match(name)) and m.group(1) in CHECKS:
        if m.group(2):
            rnd = int(m.group(2))
        elif in_round_dir:
            rnd = int(in_round_dir.group(1))
        else:
            said = HEAD_ROUND.search(head_of(path).split("\n", 3)[2] if head_of(path).count("\n") >= 2 else head_of(path))
            rnd = int(said.group(1)) if said else 1
        return rnd, CHECKS[m.group(1)]
    return None


def verdict(path: Path) -> str:
    if path.name == "README.md":
        return "see README"
    head = head_of(path)
    first = head.split(None, 1)[0] if head.strip() else ""
    if first in ("PASS", "FAIL"):
        return first
    for word in ("FAIL", "PASS", "APPROVE", "REQUEST_CHANGES"):
        if word in head:
            return {"APPROVE": "PASS", "REQUEST_CHANGES": "FAIL"}.get(word, word)
    return "?"


def unit_dir(path: Path) -> Path:
    return path.parent.parent if ROUND_DIR.match(path.parent.name) else path.parent


def main(day: str) -> None:
    start = datetime.strptime(day, "%Y-%m-%d")
    end = start + timedelta(days=1, hours=4)
    units: dict[Path, dict[int, dict[str, str]]] = defaultdict(lambda: defaultdict(dict))
    for path in ROOT.glob("*checks*/**/*.md"):
        kind = classify(path)
        if kind is None:
            continue
        mtime = datetime.fromtimestamp(path.stat().st_mtime)
        if not (start <= mtime < end):
            continue
        rnd, check = kind
        units[unit_dir(path)][rnd][check] = verdict(path)

    if not units:
        print(f"No verdict files written on {day}.")
        return
    round1_fails: Counter[str] = Counter()
    multi = 0
    for unit in sorted(units, key=lambda p: p.relative_to(ROOT).as_posix()):
        rounds = units[unit]
        last = max(rounds)
        if last > 1:
            multi += 1
        parts = []
        for rnd in sorted(rounds):
            cells = ", ".join(f"{c} {rounds[rnd][c]}" for c in ORDER if c in rounds[rnd])
            parts.append(f"r{rnd}: {cells}")
            if rnd == 1:
                round1_fails.update(c for c, v in rounds[rnd].items() if v == "FAIL")
        label = unit.relative_to(ROOT).as_posix()
        print(f"{label}  rounds={last}  " + " | ".join(parts))
    fails = ", ".join(f"{c} {n}" for c, n in round1_fails.most_common()) or "none"
    print(f"\n{len(units)} units with verdicts on {day}; {multi} needed round 2 or later; "
          f"round 1 failures by check: {fails}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
