"""Profile Claude Code sessions for the Ramble project on one day.

Usage: python3 -I tools/session-profile.py YYYY-MM-DD

For each main session with at least 20 model calls that day (local time): models, calls, user turns,
compactions, average and peak context per call, STATUS.md touches, sleep or CI polls, tool counts,
subagent launches, and the largest tool results. Then context and model per subagent type.
Costs come from `~/.claude/bin/token-audit`; this script reports tokens and sizes only.
"""
import collections
import datetime as dt
import glob
import json
import os
import re
import sys

ROOT = os.path.expanduser("~/.claude/projects")
POLL = re.compile(r"\bsleep\b|gh pr checks|--watch|\buntil\b")


def on_day(ts, day):
    if not ts:
        return False
    return dt.datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone().date() == day


def context(usage):
    return (usage.get("input_tokens", 0) + usage.get("cache_read_input_tokens", 0)
            + usage.get("cache_creation_input_tokens", 0))


def records(path):
    with open(path) as f:
        for line in f:
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


starts = []


def profile_session(path, day):
    first = None
    models, tools, results, agents = (collections.Counter() for _ in range(4))
    ctx, big, pending = [], [], {}
    status_touches = polls = compacts = user_turns = 0
    for d in records(path):
        if d.get("isCompactSummary"):
            compacts += 1
        if not on_day(d.get("timestamp"), day):
            continue
        message = d.get("message") or {}
        if d.get("type") == "user":
            content = message.get("content")
            if isinstance(content, str):
                user_turns += 1
                first = first or content[:120].replace("\n", " ")
            elif isinstance(content, list):
                for block in content:
                    if block.get("type") != "tool_result":
                        continue
                    body = block.get("content")
                    size = len(body) if isinstance(body, str) else len(json.dumps(body))
                    name, desc = pending.get(block.get("tool_use_id"), ("?", ""))
                    results[name] += size
                    big.append((size, name, desc[:90]))
        elif d.get("type") == "assistant":
            usage = message.get("usage")
            if usage:
                models[message.get("model", "?")] += 1
                ctx.append(context(usage))
            for block in message.get("content", []):
                if block.get("type") != "tool_use":
                    continue
                name, args = block["name"], block.get("input", {})
                tools[name] += 1
                desc = str(args.get("command") or args.get("file_path") or args.get("subagent_type") or "")
                pending[block["id"]] = (name, desc)
                if "STATUS.md" in json.dumps(args):
                    status_touches += 1
                if name == "Bash" and POLL.search(args.get("command", "")):
                    polls += 1
                if name in ("Agent", "Task"):
                    agents[args.get("subagent_type", "?")] += 1
    if len(ctx) < 20:
        return
    big.sort(reverse=True)
    print(f"\n### {os.path.basename(path)[:8]}  calls={len(ctx)} user_turns={user_turns} compactions={compacts}")
    print("  first prompt:", first)
    print("  models:", dict(models))
    print(f"  context start={ctx[0] / 1000:.0f}K avg={sum(ctx) / len(ctx) / 1000:.0f}K peak={max(ctx) / 1000:.0f}K"
          f"  STATUS.md touches={status_touches}  polls={polls}")
    starts.append(ctx[0])
    print("  tools:", tools.most_common(8))
    print("  agents:", dict(agents))
    print("  result chars by tool:", [(k, f"{v / 1000:.0f}K") for k, v in results.most_common(5)])
    print("  largest results:", [(f"{s / 1000:.0f}K", n, d) for s, n, d in big[:4]])


def profile_subagents(day):
    models = collections.defaultdict(collections.Counter)
    ctx = collections.defaultdict(list)
    for path in glob.glob(f"{ROOT}/*ramble*/*/subagents/*.jsonl"):
        meta = path.replace(".jsonl", ".meta.json")
        kind = "?"
        if os.path.exists(meta):
            try:
                kind = json.load(open(meta)).get("agentType", "?")
            except json.JSONDecodeError:
                pass
        for d in records(path):
            usage = (d.get("message") or {}).get("usage")
            if d.get("type") == "assistant" and usage and on_day(d.get("timestamp"), day):
                models[kind][d["message"].get("model", "?")] += 1
                ctx[kind].append(context(usage))
    print("\n### Subagents by type")
    for kind, counts in sorted(models.items(), key=lambda kv: -sum(kv[1].values())):
        sizes = ctx[kind]
        print(f"  {kind}: {dict(counts)} context avg={sum(sizes) / len(sizes) / 1000:.0f}K peak={max(sizes) / 1000:.0f}K")


def root_chats():
    """Chats opened at the workspace root that moved into a ramble checkout (token-audit counts them)."""
    keep = []
    for path in glob.glob(f"{ROOT}/-Users-davidfleming-Workspace/*.jsonl"):
        with open(path) as f:
            if any('"cwd":"/Users/davidfleming/Workspace/ramble' in line for line in f):
                keep.append(path)
    return keep


if __name__ == "__main__":
    day = dt.date.fromisoformat(sys.argv[1])
    for path in sorted(glob.glob(f"{ROOT}/*ramble*/*.jsonl") + root_chats()):
        profile_session(path, day)
    profile_subagents(day)
    if starts:
        print(f"\n### Fixed starting context: smallest first call {min(starts) / 1000:.0f}K,"
              f" median {sorted(starts)[len(starts) // 2] / 1000:.0f}K over {len(starts)} sessions")
