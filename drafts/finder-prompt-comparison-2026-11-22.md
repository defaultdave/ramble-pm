# Bug finder: published prompts compared (2026-11-22)

Researched by two agents. "Opened" means the PM read the file or the quoted lines too; the rest is the agents' report.

| Prompt | Words | License | What it is | Opened |
|---|---|---|---|---|
| Ours, `investigate-prompt.md` | 795 | ours | one area, code plus a live seeded site, one proven finding or a none; separate verifier | yes |
| [Elastic Bug Hunter](https://github.com/elastic/ai-github-actions/blob/main/.github/workflows/gh-aw-bug-hunter.md) | 1016 | none found: ideas only, no text | recent commits, three searchers keep one, must reproduce with a new test, one issue or `noop` | yes |
| [Anthropic claude-security verifier](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/claude-security/agents/scan-verifier.md) | 966 | Apache-2.0 | tries to disprove one security finding, reads only | key lines |
| [githubnext docs tester](https://github.com/githubnext/agentics/blob/main/workflows/multi-device-docs-tester.md) | 1040 | MIT | layout checklist per screen size | key lines |
| [githubnext adhoc-qa](https://github.com/githubnext/agentics/blob/main/workflows/adhoc-qa.md) | 666 | MIT | open-ended QA, no proof demanded | no |
| [Playwright planner](https://raw.githubusercontent.com/microsoft/playwright/main/packages/playwright/src/agents/playwright-test-planner.agent.md) | 321 | Apache-2.0 | writes test plans: happy path, edge, errors | no |
| [agentic-browser-testing](https://raw.githubusercontent.com/petrkindlmann/qa-skills/main/skills/agentic-browser-testing/SKILL.md) | about 2700 | MIT | one goal, pass or fail decided outside the agent | no |

Ideas worth testing, one at a time:
1. A skip list and a by-design check before reporting (Elastic).
2. A new minimal reproduction the agent wrote, with its code in the finding (Elastic).
3. Refute only with a guard the verifier found and read (Anthropic).
4. A layout checklist per screen size: cut-off, overlapping, overflowing (docs tester).
5. The finding quotes the code line, so duplicates survive line drift (Anthropic, agent report).

Limits: Elastic starts from recent commits. On a canary branch that would point straight at the plant, and our checkout fetches one commit, so any comparison must leave that step out and give both prompts the same area. CR-Bench (https://arxiv.org/html/2603.11078v1) classes comments as bug hit, valid suggestion or noise, but its precision counts only bug hits over all comments, and its valid class is mostly suggestions, so it does not settle real bugs that mask planted ones.
