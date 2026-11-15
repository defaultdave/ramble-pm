VERDICT: PASS

Checked on github.com at branch unit/U-009-page-maps with headless Chromium (Playwright library script; Playwright MCP tools were not available). All pages returned 200 and rendered as Markdown with tables. Every Mermaid iframe contained an SVG; no "Unable to render rich display" or parse-error box appeared.

| File | Diagrams rendered / total | Errors |
|---|---|---|
| src/app/README.md | 0 / 0 (no Mermaid block in source; 1 table renders) | none |
| src/app/(guest)/README.md | 14 iframes / 13 blocks | none (see note) |
| src/app/(guest)/new-york/README.md | 3 / 3 | none |
| src/app/(guest)/experiences/[slugAndId]/README.md | 2 / 2 | none |
| src/app/(guest)/sign-in/README.md | 4 / 4 | none |
| src/app/(checkout)/checkout/README.md | 3 / 3 | none |
| src/app/(checkout)/(site)/README.md | 3 / 3 | none |
| src/app/(host)/README.md | 8 / 8 | none |
| src/app/(ops)/README.md | 7 / 7 | none |

Note: the guest page showed 14 iframes against 13 mermaid fences in source. Every one had an SVG and no error, so I count it as a non-issue, but I did not identify the extra iframe.

Screenshot: /Users/davidfleming/Workspace/ramble-pm/evidence/pr/unit-U-009-page-maps/experience-diagram.png
