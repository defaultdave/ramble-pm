#!/usr/bin/env python3
"""Rounds per unit from the check runs recorded under drafts/ or posted to PRs.

    python3 -I tools/check-rounds.py 2026-11-01

Lists every unit whose verdict files were written or check runs posted in the day (local time,
00:00 to 04:00 the next morning, so a lane that runs past midnight stays with
its day), with one line per unit: rounds, and each round's verdict per check.
It reads only the first 300 characters of each verdict file.

Verdict files come in three layouts:
  r1-arch.md                       (wave 3 fixtures)
  architecture-audit.md, qa-agent-r2.md
  r1/architecture-audit.md         (round folders)
Briefs, posted copies, PR bodies and READMEs are not verdicts and are skipped.
Check subagents run in a lane's chat add `chat U-055` rows (? when no verdict text).
"""
from __future__ import annotations

import json
import re
import subprocess
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
    return "see README" if path.name == "README.md" else verdict_in(head_of(path))


def verdict_in(head: str) -> str:
    first = head.split(None, 1)[0] if head.strip() else ""
    if first in ("PASS", "FAIL"):
        return first
    for word in ("FAIL", "PASS", "APPROVE", "REQUEST_CHANGES"):
        if word in head:
            return {"APPROVE": "PASS", "REQUEST_CHANGES": "FAIL"}.get(word, word)
    return "?"


def unit_dir(path: Path) -> Path:
    return path.parent.parent if ROUND_DIR.match(path.parent.name) else path.parent


def gh_json(*args: str):
    return json.loads(subprocess.run(["gh", *args], capture_output=True, text=True, check=True).stdout)


def posted_rounds(start: datetime, end: datetime):
    """Posted agent verdicts; a commit re-checked after an all-pass round stays in that round."""
    prs = gh_json("pr", "list", "--repo", "defaultdave/ramble", "--state", "all", "--limit", "200",
                  "--search", f"updated:>={start:%Y-%m-%d} created:<={end:%Y-%m-%d}", "--json", "number,headRefName")
    if not prs:
        return
    query = "query{repository(owner:\"defaultdave\",name:\"ramble\"){" + "".join(
        f"p{pr['number']}:pullRequest(number:{pr['number']}){{commits(last:10){{nodes{{commit{{"
        "checkSuites(first:3,filterBy:{appId:5403551}){nodes{checkRuns(first:10){nodes{name conclusion completedAt}}}}}}}}"
        for pr in prs) + "}}"
    repo = gh_json("api", "graphql", "-f", f"query={query}")["data"]["repository"]
    for pr in prs:
        rounds: dict[int, dict[str, str]] = {}
        for node in repo[f"p{pr['number']}"]["commits"]["nodes"]:
            cells = {}
            for suite in node["commit"]["checkSuites"]["nodes"]:
                for run in suite["checkRuns"]["nodes"]:
                    done = run["completedAt"] and datetime.fromisoformat(
                        run["completedAt"].replace("Z", "+00:00")).astimezone().replace(tzinfo=None)
                    if run["name"] in CHECKS and done and start <= done < end:
                        cells[CHECKS[run["name"]]] = "PASS" if run["conclusion"] == "SUCCESS" else "FAIL"
            if cells:
                fix_round = not rounds or "FAIL" in rounds[len(rounds)].values()
                rounds[len(rounds) + fix_round] = cells
        if rounds:
            yield f"PR {pr['number']} {pr['headRefName']}", rounds


AGENT_LOGS = Path.home() / ".claude/projects"
UNIT = re.compile(r"\b(U-\d+[a-z]?|NEW-\d+)\b")

def chat_rounds(start: datetime, end: datetime):
    """Check subagents a lane ran in its chat: the nth run of a check on a unit is round n."""
    runs: dict[str, list[tuple[datetime, str, str]]] = defaultdict(list)
    for meta_path in AGENT_LOGS.glob("*ramble*/*/subagents/*.meta.json"):
        try:
            meta = json.loads(meta_path.read_text())
            unit = UNIT.search(meta.get("description", ""))
            lines = [json.loads(line) for line in meta_path.with_suffix("").with_suffix(".jsonl").open(errors="replace") if line.strip()] if meta.get("agentType") in CHECKS and unit else []
        except (OSError, ValueError):
            continue
        began = next((datetime.fromisoformat(d["timestamp"].replace("Z", "+00:00")).astimezone().replace(tzinfo=None) for d in lines if d.get("timestamp")), None)
        if not began or not (start <= began < end):
            continue
        texts = [c["text"] for d in lines if d.get("type") == "assistant"
                 for c in (d.get("message") or {}).get("content") or [] if isinstance(c, dict) and c.get("text", "").strip()]
        runs[unit.group(1)].append((began, CHECKS[meta["agentType"]], verdict_in(texts[-1][:300]) if texts else "?"))
    for unit, seen in runs.items():
        rounds: dict[int, dict[str, str]] = defaultdict(dict)
        for _, check, result in sorted(seen):
            rounds[1 + sum(check in r for r in rounds.values())][check] = result
        yield f"chat {unit}", rounds


def main(day: str) -> None:
    start = datetime.strptime(day, "%Y-%m-%d")
    end = start + timedelta(days=1, hours=4)
    units: dict[str, dict[int, dict[str, str]]] = defaultdict(lambda: defaultdict(dict))
    for path in ROOT.glob("*checks*/**/*.md"):
        kind = classify(path)
        if kind is None:
            continue
        mtime = datetime.fromtimestamp(path.stat().st_mtime)
        if not (start <= mtime < end):
            continue
        rnd, check = kind
        units[unit_dir(path).relative_to(ROOT).as_posix()][rnd][check] = verdict(path)
    try:
        units.update(posted_rounds(start, end))
    except (OSError, subprocess.CalledProcessError, KeyError, TypeError) as err:
        print(f"Posted check runs not read: {err}")
    units.update(chat_rounds(start, end))

    if not units:
        print(f"No verdict files written or check runs posted on {day}.")
        return
    round1_fails: Counter[str] = Counter()
    multi = 0
    for label in sorted(units):
        rounds = units[label]
        last = max(rounds)
        if last > 1:
            multi += 1
        parts = []
        for rnd in sorted(rounds):
            cells = ", ".join(f"{c} {rounds[rnd][c]}" for c in ORDER if c in rounds[rnd])
            parts.append(f"r{rnd}: {cells}")
            if rnd == 1:
                round1_fails.update(c for c, v in rounds[rnd].items() if v == "FAIL")
        print(f"{label}  rounds={last}  " + " | ".join(parts))
    fails = ", ".join(f"{c} {n}" for c, n in round1_fails.most_common()) or "none"
    prs = sum(label.startswith("PR ") for label in units)
    chats = sum(label.startswith("chat ") for label in units)
    print(f"\n{len(units) - prs - chats} unit folders, {chats} units checked in chat and {prs} PRs with verdicts on {day}; "
          f"{multi} needed round 2 or later; "
          f"round 1 failures by check: {fails}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
