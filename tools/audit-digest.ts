#!/usr/bin/env bun
// Moves filed audit items below the filing bar (audits/README.md) to the digest: lists them in audits/digest.md
// and closes their tickets as not planned, as the App.
//
// Run: bun tools/audit-digest.ts <list.tsv>         print what it would do (reads only)
//      bun tools/audit-digest.ts <list.tsv> --run   append to digest.md, then comment on and close each ticket
// list.tsv: issue number, item ID, reason; one per line. Rows already in digest.md are skipped, so a rerun is safe.

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPO = "defaultdave/ramble";
const PAUSE_MS = 800;
const DIGEST = join(dirname(new URL(import.meta.url).pathname), "..", "audits", "digest.md");
const HEADER = `# Audit digest

Findings below the filing bar (\`README.md\`, owner 2026-11-04) whose tickets were closed as not planned. The lead sweeps them with at most one PR a week, or drops them. New nightly digest rows stay in their pass file's \`## Digest\` table.

ID | Ticket | Reason | Moved
--- | --- | --- | ---
`;

const [listPath] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!listPath) throw new Error("usage: bun tools/audit-digest.ts <list.tsv> [--run]");
const run = process.argv.includes("--run");

const known = existsSync(DIGEST) ? readFileSync(DIGEST, "utf8") : "";
const rows = readFileSync(listPath, "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split("\t"))
  .map(([number, id, reason]) => ({ number: Number(number), id, reason: reason ?? "" }))
  .filter((r) => !known.includes(`| #${r.number} |`));

for (const r of rows) console.log(`#${r.number}\t${r.id}\t${r.reason}`);
if (!run) {
  console.error(`Dry run: ${rows.length} tickets. Apply with --run.`);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
if (!known) appendFileSync(DIGEST, HEADER);

const token = Bun.spawnSync(["bun", "/Users/davidfleming/Workspace/ramble/scripts/merge-desk/app-token.ts"]).stdout.toString().trim();
const call = async (method: string, path: string, body: unknown) => {
  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${method} ${path}: HTTP ${response.status} ${await response.text()}`);
};
for (const r of rows) {
  await call("POST", `/issues/${r.number}/comments`, {
    body: `Below the audit filing bar (owner, 2026-11-04): ${r.reason}. Moved to the digest (\`audits/digest.md\` in ramble-pm); a weekly sweep may still pick it up.`,
  });
  await call("PATCH", `/issues/${r.number}`, { state: "closed", state_reason: "not_planned" });
  appendFileSync(DIGEST, `${r.id} | #${r.number} | ${r.reason} | ${today}\n`);
  await Bun.sleep(PAUSE_MS);
}
console.log(`closed ${rows.length}`);
