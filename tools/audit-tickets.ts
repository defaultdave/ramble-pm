#!/usr/bin/env bun
// Files every live audit item as a GitHub issue and puts it in the Maintenance sprint on board #19.
// The pass files in audits/ stay the findings; once an item has a ticket, the ticket holds its status.
//
// Run: bun tools/audit-tickets.ts           print what it would file (reads only)
//      bun tools/audit-tickets.ts --run     file the issues as the App, then add them to the board
// Rows whose status names only merged PRs are reported, not filed. A second run skips items that already have a ticket, so it is safe after a partial run. Issues go through the App;
// the board goes through the owner's `gh` login, because a GitHub App cannot reach a user-owned project.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REPO = "defaultdave/ramble";
const OWNER = "defaultdave";
const BOARD = 19;
const SPRINT = "Maintenance";
const LABEL = "audit";
const OWNER_LABEL = "needs-owner";
/** Pause between issues, to stay under GitHub's limits on creating content. */
const PAUSE_MS = 1500;
const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const AUDITS = join(ROOT, "audits");
/** Hand-written short titles by item ID; an item without one uses its first sentence. */
const TITLES = join(AUDITS, "ticket-titles.json");

export type Item = { id: string; text: string; lens: string; from: string; status: string; file: string; row: string };
export type Live = "live" | "done" | "unknown";

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

/** Reads every item table in a pass file: a table whose first column is ID and whose last is Status. */
export function parseItems(markdown: string, file: string): Item[] {
  const items: Item[] = [];
  let columns: string[] | null = null;
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) {
      columns = null;
      continue;
    }
    const row = cells(line);
    if (row[0] === "ID" && row.at(-1) === "Status") {
      columns = row;
      continue;
    }
    if (!columns || !/^\**[A-Z]+\d*-\d+[a-z]?\**$/.test(row[0])) continue;
    const at = (...names: string[]) => row[columns!.findIndex((c) => names.includes(c))] ?? "";
    items.push({
      id: row[0].replaceAll("*", ""),
      text: at("Item", "Finding"),
      lens: at("Lens"),
      from: at("From", "Found", "Where"),
      status: (row.at(-1) ?? "").replaceAll("*", ""),
      file,
      row: line,
    });
  }
  return items;
}

/** A `later` item is already carried by the unit it names, so only work due now becomes a ticket. */
export function classify(status: string): Live {
  const s = status.toLowerCase();
  if (/^(open|fix|decided|assigned)/.test(s)) return "live";
  if (/^(closed|done|won.t|later|pr \d|\(a\) closed)/.test(s)) return "done";
  return "unknown";
}

/** The short title: the override if there is one, else the first sentence, cut at a word near 72 characters. */
export function titleOf(item: Item, overrides: Record<string, string>): string {
  const plain = item.text.replace(/\*\*|`|\\/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  const first = overrides[item.id] ?? plain.split(/(?<=[.:;])\s/)[0].replace(/[.:;]$/, "");
  const cut = first.length <= 72 ? first : `${first.slice(0, 72).replace(/\s+\S*$/, "")}...`;
  return `${item.id} ${cut}`;
}

/** The first row for an ID wins: a later table only updates an item raised earlier. */
export function uniqueById(items: Item[]): Item[] {
  return [...new Map([...items].reverse().map((i) => [i.id, i])).values()].reverse();
}

/** A `fix` row can outlive its fix: the PRs it names, where every one has merged, mean the work is done. An `open` row says otherwise itself. */
export function shippedBy(status: string, merged: Set<number>): boolean {
  if (/^open/i.test(status)) return false;
  const named = [...status.matchAll(/\bPRs? (\d+)/g)].map((m) => Number(m[1]));
  return named.length > 0 && named.every((n) => merged.has(n));
}

/** The ticket recorded on an item's row. The row is the record of filing, because GitHub can drop labels without an error. */
export function ticketOf(status: string): number | null {
  const m = status.match(/ticket \[#(\d+)\]/);
  return m ? Number(m[1]) : null;
}

function body(item: Item): string {
  return [
    item.text.replaceAll("\\|", "|"),
    "",
    `- Pass: [${item.file}](https://github.com/${OWNER}/ramble-pm/blob/main/audits/${item.file})`,
    item.lens && `- Lens: ${item.lens}`,
    item.from && `- From: ${item.from}`,
    `- Status when filed: ${item.status}`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

/** Folds the wording passes have used into the five lenses of audits/README.md; anything else is `other`. */
export function lensOf(lens: string, file = ""): string {
  const l = lens.toLowerCase();
  if (file.startsWith("js-weight")) return "performance";
  if (/access|a11y/.test(l)) return "accessibility";
  if (/perf|cach/.test(l)) return "performance";
  if (/visual|cosmetic|usab/.test(l)) return "visual";
  if (/arch|secur|correct/.test(l)) return "architecture";
  if (/code|dry|test|tool/.test(l)) return "code";
  return "other";
}

export const labelsOf = (item: Item) => [LABEL, `lens: ${lensOf(item.lens, item.file)}`, ...(/owner/i.test(item.status) ? [OWNER_LABEL] : [])];

function gh(args: string[]): string {
  const p = Bun.spawnSync(["gh", ...args], { stdout: "pipe", stderr: "pipe" });
  if (p.exitCode !== 0) throw new Error(`gh ${args.slice(0, 3).join(" ")} failed: ${p.stderr.toString().trim()}`);
  return p.stdout.toString().trim();
}

/** The App token, from the sibling ramble checkout, so this repo holds no credentials code. */
function appToken(): string {
  const p = Bun.spawnSync(["bun", join(ROOT, "..", "ramble", "scripts", "merge-desk", "app-token.ts")], { stdout: "pipe", stderr: "pipe" });
  if (p.exitCode !== 0) throw new Error(`app-token failed: ${p.stderr.toString().trim()}`);
  return p.stdout.toString().trim();
}

async function api(token: string, path: string, payload: unknown): Promise<Response> {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    body: JSON.stringify(payload),
  });
}

function loadItems(): Item[] {
  return readdirSync(AUDITS)
    .filter((f) => f.endsWith(".md") && f !== "README.md" && f !== "design-departures.md" && !f.startsWith("agents-"))
    .sort()
    .flatMap((f) => parseItems(readFileSync(join(AUDITS, f), "utf8"), f));
}

function mergedPrs(): Set<number> {
  const prs = JSON.parse(gh(["pr", "list", "--repo", REPO, "--state", "merged", "--limit", "1000", "--json", "number"])) as { number: number }[];
  return new Set(prs.map((p) => p.number));
}

/** Records the ticket on the item's row, so a reader of the pass file can follow it. */
function linkRow(item: Item, number: number): void {
  const path = join(AUDITS, item.file);
  const linked = `${item.row.replace(/\s*\|\s*$/, "")} · ticket [#${number}](https://github.com/${REPO}/issues/${number}) |`;
  writeFileSync(path, readFileSync(path, "utf8").replace(item.row, linked));
}

async function fileIssues(items: Item[], overrides: Record<string, string>): Promise<void> {
  const token = appToken();
  for (const name of new Set(items.flatMap(labelsOf))) {
    const r = await api(token, "/labels", { name, color: name === OWNER_LABEL ? "d93f0b" : "c5def5" });
    if (!r.ok && r.status !== 422) throw new Error(`label ${name}: HTTP ${r.status}. Does the App have Issues: Read and write?`);
  }
  for (const item of items) {
    const r = await api(token, "/issues", { title: titleOf(item, overrides), body: body(item), labels: labelsOf(item) });
    if (!r.ok) throw new Error(`issue ${item.id}: HTTP ${r.status} ${await r.text()}`);
    const number = ((await r.json()) as { number: number }).number;
    linkRow(item, number);
    const labelled = await api(token, `/issues/${number}/labels`, { labels: labelsOf(item) });
    if (!labelled.ok) throw new Error(`labels on #${number}: HTTP ${labelled.status} ${await labelled.text()}`);
    console.log(`${item.id} #${number}`);
    await Bun.sleep(PAUSE_MS);
  }
}

type Issue = { number: number; id: string; url: string };
type BoardItem = { id: string; sprint?: string; content?: { number?: number; repository?: string } };

/** Puts every audit ticket on the board in the Maintenance sprint. */
function syncBoard(issues: Issue[]): void {
  const projectId = gh(["project", "view", String(BOARD), "--owner", OWNER, "--format", "json", "-q", ".id"]);
  const fields = (JSON.parse(gh(["project", "field-list", String(BOARD), "--owner", OWNER, "--format", "json"])) as {
    fields: { id: string; name: string; options?: { id: string; name: string }[] }[];
  }).fields;
  const sprint = fields.find((f) => f.name === "Sprint");
  const unit = fields.find((f) => f.name === "Unit ID");
  const option = sprint?.options?.find((o) => o.name === SPRINT);
  if (!sprint || !unit || !option) throw new Error(`Sprint has no "${SPRINT}" option; run bun scripts/plan/board-dates.ts --run in ramble first`);
  const board = (JSON.parse(gh(["project", "item-list", String(BOARD), "--owner", OWNER, "--limit", "2000", "--format", "json"])) as {
    items: BoardItem[];
  }).items;
  const inSprint = new Set(board.filter((i) => i.sprint === SPRINT).map((i) => i.content?.number));
  const todo = issues.filter((i) => !inSprint.has(i.number));
  for (const issue of todo) {
    const id = gh(["project", "item-add", String(BOARD), "--owner", OWNER, "--url", issue.url, "--format", "json", "-q", ".id"]);
    const edit = (...args: string[]) => gh(["project", "item-edit", "--id", id, "--project-id", projectId, ...args]);
    edit("--field-id", sprint.id, "--single-select-option-id", option.id);
    edit("--field-id", unit.id, "--text", issue.id);
  }
  console.log(`${todo.length} tickets added to ${SPRINT}`);
}

if (import.meta.main) {
  const run = process.argv.includes("--run");
  const overrides: Record<string, string> = await Bun.file(TITLES).json().catch(() => ({}));
  const items = uniqueById(loadItems());
  const merged = mergedPrs();
  const tickets = (list: Item[]): Issue[] =>
    list.flatMap((i) => {
      const number = ticketOf(i.status);
      return number === null ? [] : [{ number, id: i.id, url: `https://github.com/${REPO}/issues/${number}` }];
    });
  const shipped = items.filter((i) => classify(i.status) === "live" && ticketOf(i.status) === null && shippedBy(i.status, merged));
  const live = items.filter((i) => classify(i.status) === "live" && !shipped.includes(i));
  const unknown = items.filter((i) => classify(i.status) === "unknown");
  const todo = live.filter((i) => ticketOf(i.status) === null);
  console.error(`${items.length} items, ${live.length} live, ${live.length - todo.length} already ticketed, ${todo.length} to file`);
  for (const i of shipped) console.error(`names merged PRs, not filed, close the row: ${i.id} (${i.file}): ${i.status.slice(0, 80)}`);
  for (const i of unknown) console.error(`status not recognised, not filed: ${i.id} (${i.file}): ${i.status.slice(0, 70)}`);
  if (!run) {
    for (const i of todo) console.log(`${titleOf(i, overrides)}  [${labelsOf(i).join(", ")}]`);
    console.error("Dry run. Apply with: bun tools/audit-tickets.ts --run");
  } else {
    await fileIssues(todo, overrides);
    syncBoard(tickets(uniqueById(loadItems())));
  }
}
