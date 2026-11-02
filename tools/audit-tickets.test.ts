import { describe, expect, test } from "bun:test";
import { classify, lensOf, parseItems, shippedBy, titleOf, uniqueById } from "./audit-tickets";

const pass = `Intro.

| ID | Item | Lens | From | Status |
|---|---|---|---|---|
| **N1-1** | \`a.ts:1\` splits on a \\| pipe. Fix it. | Code and DRY | PR 9 | open (owner decision) |
| H-2 | Done already. | Architecture | PR 9 | closed, PR 10 |

| Item | Result |
|---|---|
| N1-3 | not an item table |

| ID | Finding | Where | Saving | Status |
|---|---|---|---|---|
| JS-1 | Calendar import. | \`F.tsx:9\` | 39 KB | fix |
`;

describe("parseItems", () => {
  test("reads item tables of either shape, and only those", () => {
    const items = parseItems(pass, "p.md");
    expect(items.map((i) => i.id)).toEqual(["N1-1", "H-2", "JS-1"]);
    expect(items[0]).toMatchObject({ lens: "Code and DRY", from: "PR 9", status: "open (owner decision)" });
    expect(items[0].text).toContain("\\| pipe");
    expect(items[2]).toMatchObject({ text: "Calendar import.", from: "`F.tsx:9`", lens: "" });
  });
});

describe("classify", () => {
  test.each([
    ["open (owner decision)", "live"],
    ["fix: PR 299", "live"],
    ["decided 2026-10-29", "live"],
    ["closed, PR 10", "done"],
    ["won't: demo only", "done"],
    ["later: U-074b", "done"],
    ["partly fixed: see notes", "unknown"],
  ])("%s is %s", (status, want) => expect(classify(status)).toBe(want as ReturnType<typeof classify>));
});

describe("lensOf", () => {
  test.each([
    ["a11y", "accessibility"],
    ["Caching", "performance"],
    ["Cosmetic", "visual"],
    ["Security", "architecture"],
    ["Code and DRY", "code"],
    ["", "other"],
  ])("%s is %s", (lens, want) => expect(lensOf(lens)).toBe(want));
});

describe("uniqueById", () => {
  test("keeps the first row for an ID, in order", () => {
    const rows = parseItems(pass + pass, "p.md");
    expect(uniqueById(rows).map((i) => i.id)).toEqual(["N1-1", "H-2", "JS-1"]);
  });
});

describe("shippedBy", () => {
  test.each([
    ["fix: PR 301", true],
    ["fix, PRs 301", true],
    ["fix: PR 301 and PR 999", false],
    ["fix: audit-fixes lane", false],
    ["open: the rest; the first half shipped in PR 301", false],
  ])("%s is %s", (status, want) => expect(shippedBy(status, new Set([301]))).toBe(want));
});

describe("titleOf", () => {
  const item = parseItems(pass, "p.md")[0];
  test("takes the first sentence, without markup", () => {
    expect(titleOf(item, {})).toBe("N1-1 a.ts:1 splits on a | pipe");
  });
  test("prefers an override and caps the length", () => {
    expect(titleOf(item, { "N1-1": "Short" })).toBe("N1-1 Short");
    expect(titleOf(item, { "N1-1": "word ".repeat(30) }).length).toBeLessThan(85);
  });
});
