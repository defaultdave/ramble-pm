// One-off repair of the 2026-11-01 double filing: closes each duplicate as not planned, labels the kept tickets. Needs the App's Issues write.
import { labelsOf, parseItems, ticketOf, uniqueById } from "/Users/davidfleming/Workspace/ramble-pm/tools/audit-tickets";
import { readdirSync, readFileSync } from "node:fs";
const d = "/Users/davidfleming/Workspace/ramble-pm/audits/";
const items = uniqueById(readdirSync(d).filter((f) => f.endsWith(".md") && f !== "README.md" && f !== "design-departures.md" && !f.startsWith("agents-")).flatMap((f) => parseItems(readFileSync(d + f, "utf8"), f))).filter((i) => ticketOf(i.status) !== null);
const kept = new Map(items.map((i) => [i.id, ticketOf(i.status)!]));
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => l.split("\t"));
const dupes = rows.filter((r) => r[2].includes("ramble-agents")).flatMap((r) => { const id = r[1].split(" ")[0], keep = kept.get(id), n = Number(r[0]); return keep && keep !== n ? [{ n, keep }] : []; });
console.log(`${dupes.length} duplicates, ${items.length} kept`);
const token = Bun.spawnSync(["bun", "/Users/davidfleming/Workspace/ramble/scripts/merge-desk/app-token.ts"]).stdout.toString().trim();
const call = async (method: string, path: string, body: unknown) => {
  const r = await fetch(`https://api.github.com/repos/defaultdave/ramble${path}`, { method, headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${method} ${path}: HTTP ${r.status} ${await r.text()}`);
};
for (const i of items) { await call("POST", `/issues/${ticketOf(i.status)}/labels`, { labels: labelsOf(i) }); await Bun.sleep(800); }
for (const { n, keep } of dupes) { await call("POST", `/issues/${n}/comments`, { body: `Duplicate of #${keep}, from a rerun of the filing tool.` }); await call("PATCH", `/issues/${n}`, { state: "closed", state_reason: "not_planned" }); await Bun.sleep(800); }
console.log("done");
