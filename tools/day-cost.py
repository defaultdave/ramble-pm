#!/usr/bin/env python3
"""Cost of one local (New York) day, by agent, model and session, in one call.

    python3 -I tools/day-cost.py 2026-11-05

`token-audit --yesterday` counts the UTC day, which takes in the evening before
and misses the evening of the day. This uses token-audit's own parser and prices
over local midnight to midnight, with the `ramble` project filter matched
against the whole working directory.
"""
import sys
from collections import defaultdict
from datetime import datetime, timedelta
from importlib.machinery import SourceFileLoader
from importlib.util import module_from_spec, spec_from_loader
from pathlib import Path
from zoneinfo import ZoneInfo

loader = SourceFileLoader("token_audit", str(Path.home() / ".claude/bin/token-audit"))
audit = module_from_spec(spec_from_loader("token_audit", loader))
loader.exec_module(audit)
# token-audit keeps the last three path parts, so `ramble/.claude/worktrees/agent-*`
# (every isolated builder and check, and any chat that cd's into one) loses "ramble".
audit.project_label = lambda cwd: cwd or "unknown"
local = ZoneInfo("America/New_York")
start = datetime.fromisoformat(sys.argv[1]).replace(tzinfo=local)
records = audit.parse_logs(start, start + timedelta(days=1), project_filter="ramble")
print(f"{sys.argv[1]} local: ${sum(r['cost'] for r in records):.2f}, {len(records)} calls, "
      f"{len({r['session_id'] for r in records})} sessions")
for title, key in (("agent", "agent"), ("model", "model"), ("session", "session_id")):
    groups = defaultdict(list)
    for r in records:
        groups[r[key]].append(r)
    print(f"by {title}:")
    for name, rows in sorted(groups.items(), key=lambda kv: -sum(r["cost"] for r in kv[1]))[:10]:
        times = sorted(r["ts"].astimezone(local).strftime("%H:%M") for r in rows)
        span = f"  {times[0]}-{times[-1]}  {rows[0]['label'][22:70]}" if key == "session_id" else ""
        name = name[:8] if key == "session_id" else name[:24]
        print(f"  {name:<24} ${sum(r['cost'] for r in rows):8.2f} {len(rows):6} calls{span}")
