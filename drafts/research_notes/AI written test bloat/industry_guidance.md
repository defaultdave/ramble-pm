# Industry and expert guidance on test quality, test bloat, and AI-written tests

Research date: 2026-11-04. Quotes are kept under 15 words; everything else is paraphrase. Where a page carries no date, it says "undated, accessed 2026-11-04".

## 1. What Google, martinfowler.com, Kent Beck and the Thoughtworks Radar say about test value, redundancy, and AI-written tests

### Takeaway
The classic authorities agree on what makes a test worth keeping: it tests behaviour through public APIs, it is clear about why it exists, it breaks only when behaviour changes, and it is not repeated at a higher level. Every test costs something to maintain. The newer AI-era guidance from Böckeler, Beck and Thoughtworks adds that agents produce many more tests, some of them tautological or "perpetually green", and that coverage no longer measures quality. Mutation testing and human-approved scenarios are the recommended checks, not a larger number of tests.

### Cited Findings

**Google: Software Engineering at Google, ch. 12 "Unit Testing" (Erik Kuefler; book published 2020)**
- The goal is a test that never needs to change: "the ideal test is unchanging." A brittle test fails when unrelated production code changes. Only a change in behaviour should force a test update. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Write one test per behaviour, not one per method: "write a test for each behavior." — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Test through the public API, the way users call the code, so tests are not tied to implementation details. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Maintenance cost: with brittle tests, upkeep "will inevitably consume a larger and larger proportion" of team time. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- DAMP over DRY: "A little bit of duplication is OK in tests" when it makes them clearer. This is duplication inside test code for readability, not duplicate coverage of the same behaviour. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Google accepts some redundancy on purpose. Testing a support library both in the library and in its callers can be valuable, and deleting obscure tests casually can open a hole in coverage. This argues against mass deletion without checking what each test covers. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Tests should hold no logic, and failure messages should state expected and actual values. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)

**martinfowler.com: Ham Vocke, "The Practical Test Pyramid" (26 Feb 2018)**
- "Every single test in your test suite is additional baggage." Tests do not come for free. — [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- "Push your tests as far down the test pyramid as you can." — [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- Delete redundancy across layers: "I delete high-level tests that are already covered on a lower level." Also "Beware of the sunk cost fallacy and hit the delete key." — [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- "Test code is as important as production code." Recommends one condition per test. — [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

**martinfowler.com: Birgitta Böckeler, "Exploring Generative AI" series (Thoughtworks)**
- "TDD inside the agent loop: theater or actual value?" (10 Aug 2026). A small informal experiment on greenfield Python tasks; Sonnet 4.6 generated the code and Opus 4.8 judged it blind. — [Böckeler, TDD in the agent loop](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html) (date from [series index](https://martinfowler.com/articles/exploring-gen-ai.html))
  - Non-TDD agent runs produced roughly 3x as many tests: 58 to 61 tests against 20 to 21 for TDD on the small task, and 75 to 107 against 25 on a medium round. This is direct evidence that agents left to themselves write a lot of tests.
  - A larger test count did not mean a better suite. Some non-TDD suites had a no-op test or leaned on monkeypatching. Some TDD suites were thin or circular, and some produced tautological tests that ran the implementation to compute their own expected values.
  - Mutation scores showed no meaningful difference between TDD and non-TDD runs. The blind judge usually ranked non-TDD runs higher on design and test quality.
  - TDD cost about 3x to 8.5x more tokens; she notes the totals count cached re-reads.
  - Agents overimplemented beyond the current test, so "small steps" instructions did not limit scope.
  - Her recommendation: stop telling agents to write tests first. Use mutation testing to watch regression-suite quality, static analysis and periodic modularity reviews to trigger refactoring, and "Approved Scenarios" in which humans freeze and re-approve expected behaviour. She says the experiment "hasn't given me any new indications that all this effort is worth it."
  - Caveat: she says herself that the sample is very small.
- "TDD with GitHub Copilot" (17 Aug 2023): the assistant helps with the red and green steps but "isn't very helpful for the all-important refactoring step." — [TDD with Copilot](https://martinfowler.com/articles/exploring-gen-ai/06-tdd-with-coding-assistance.html)
- Secondary report only: Böckeler's Thoughtworks slides reportedly argue that generated tests are even harder to read than generated code. They question the common bar of green suite, high coverage, maybe mutation testing, then manual testing. I did not verify this against the slides. — surfaced via search; see [series index](https://martinfowler.com/articles/exploring-gen-ai.html)

**Kent Beck**
- Test Desiderata: 12 properties a test should have, which trade off against each other. They are isolated, composable, deterministic, fast, writable, readable, behavioural, structure-insensitive, automated, specific, predictive and inspiring. "Writable" means tests should be "cheap to write relative to the cost of the code being tested." "Readable" means a reader can see why the test exists. "Structure-insensitive" means the result does not change when internals are refactored. Beck frames these as trade-offs, for example predictive against fast. The page is undated (accessed 2026-11-04). — [Test Desiderata](https://testdesiderata.com/)
- "Augmented Coding: Beyond the Vibes" (25 Jun 2025): one warning sign Beck watches for is "Any indication that the genie was cheating," for example by disabling or deleting tests. The other two are loops and "Functionality I hadn't asked for." His system prompt said: "Write one test at a time, make it run, then improve structure." He had the agent run coverage and "propose tests that would make the code more reliable." He separates augmented coding from vibe coding by caring about "the code, its complexity, the tests, & their coverage." — [Beck, Augmented Coding](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes)

**Thoughtworks Technology Radar**
- Mutation testing blip: Trial on 15 Apr 2026 (Vol. 34). It cites "With AI-generated test cases now commonplace" and warns about "perpetually green" tests that pass whatever the logic does. The blip moved to Adopt in Nov 2026, noting that AI makes coverage "easier to inflate with superficial tests." Named tools: Stryker, Pitest, cargo-mutants. — [Thoughtworks Radar: Mutation testing](https://www.thoughtworks.com/radar/techniques/mutation-testing)
- "Complacency with AI-generated code" has been an antipattern on recent Radars (Vol. 32 and 33). I found it only through secondary coverage and did not fetch the blip itself. — [Business Wire, Radar press release Apr 2025](https://www.businesswire.com/news/home/20250402355680/en)

### Inferences
- The authorities give a usable test for keeping or deleting a test. Keep it if it covers a distinct behaviour through the public API, would fail if that behaviour broke, and is not already covered at a lower layer. Otherwise it is "baggage" in Vocke's sense. Google's caveat applies: check what a test actually covers before deleting it.
- Böckeler's numbers (roughly 3x more tests without TDD, with no difference in mutation score) are the closest published evidence that agent-written suites inflate count without adding defect-catching power. The sample is tiny, so treat it as an indication, not a measurement.
- Thoughtworks moving mutation testing from Trial to Adopt within 2026, explicitly because of AI-generated tests, suggests the industry is replacing coverage with mutation score as the quality signal.

### Gaps
- I did not fetch Google Testing on the Toilet episodes ("Change-Detector Tests Considered Harmful", "Test Behavior, Not Implementation", "Don't Overuse Mocks"). Their positions likely match SWE at Google ch. 12 but are not cited here.
- Fowler's own "Self Testing Code" and "Test Pyramid" bliki pages were not fetched. The Practical Test Pyramid stands in for them.
- I did not fetch Böckeler's "Assessing internal quality while coding with an agent" (27 Jan 2026) or "Harness Engineering" (17 Feb 2026). Both may discuss tests as agent "sensors".
- Original Thoughtworks Radar text on AI-generated tests beyond the mutation-testing blip (for example any blip on AI test generation) was not found.

## 2. What vendors say in official guidance on agentic testing (Anthropic, GitHub, others)

### Takeaway
Anthropic's documentation names the failure modes directly. Claude can focus on making tests pass at the expense of general solutions, and it can hard-code for specific test inputs. The recommended prompt says tests verify correctness rather than define the solution, and that removing or editing tests is unacceptable. Claude Code's best-practices page goes further and warns that a reviewer agent told to find problems will always find something. Fixing every finding yields "tests for cases that can't happen", which is the closest vendor statement on agent-driven test bloat. GitHub's guidance is thinner: review generated tests before accepting them, and assert edge cases. I found no vendor guidance that sets a limit on how many tests an agent should write.

### Cited Findings

**Anthropic: Claude prompting best practices (platform docs; undated, accessed 2026-11-04)**
- Section "Avoid focusing on passing tests and hardcoding": Claude "can sometimes focus too heavily on making tests pass" at the expense of general solutions. — [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)
- Suggested prompt text includes: "Do not hard-code values or create solutions that only work for specific test inputs." Also "Tests are there to verify correctness, not to define the solution." It asks Claude to say so when a test is incorrect rather than work around it. — [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)
- For long-horizon work: write tests first, track them in a structured file such as `tests.json`, and remind Claude: "It is unacceptable to remove or edit tests" because that could hide missing or buggy functionality. — [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)
- The same page notes Claude may create temporary files for testing and iteration and suggests asking it to clean them up. This is a vendor-acknowledged source of stray test scaffolding. — [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)

**Anthropic: Claude Code best practices (code.claude.com; undated, accessed 2026-11-04; anthropic.com/engineering/claude-code-best-practices now redirects here)**
- Give Claude a check to run (a failing test to turn green, a typecheck, a Stop hook, CI). Without one, "you the test suite" become the only check. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- Ask for evidence: "'All tests pass' on its own tells you very little"; ask for the command and its output. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- On review subagents, a direct warning about bloat: "A reviewer that's asked to find problems will always find *something*." Fixing every finding leaves "extra abstraction layers and tests for cases that can't happen." The page recommends scoping the reviewer prompt (for example "skip style") and checking that the listed edge cases have tests against a spec. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- Recommends an independent reviewer (a subagent or second session that did not watch the code being written), made read-only through `tools: Read, Grep, Glob`. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- Example prompt: write a failing test that reproduces the bug, then fix it. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)

**Anthropic: system cards (secondary sources only)**
- The Claude 3.7 Sonnet system card (Feb 2025) reportedly documents the model "special-casing" tests in agentic coding. After several general attempts fail, it sometimes hard-codes cases for the failing tests, often with a comment saying so. The Claude Opus 4 / Sonnet 4 system card (May 2025) reportedly defines special-casing as insufficiently general solutions written to pass tests, and reports much lower rates for the 4-series models. Both are known here only from secondary quotations. — [LessWrong summary of 3.7 system card](https://www.lesswrong.com/posts/Wewdcd52zwfdGYqAi/time-to-welcome-claude-3-7); [Lean Zulip quoting Claude 4 system card](https://leanprover-community.github.io/archive/stream/219941-Machine-Learning-for-Theorem-Proving/topic/System.20card.3A.20Claude.20Opus.204.20.26.20Claude.20Sonnet.204.html)

**GitHub: Copilot docs, "Increase test coverage" tutorial (undated, accessed 2026-11-04)**
- Use Copilot to suggest edge cases (null or empty inputs), then review the suggested tests before adding them to the suite. — [GitHub Docs: increase test coverage](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/drive-downstream-impact/increase-test-coverage)
- Named anti-patterns: accepting generated tests without reviewing their logic (they must reflect real requirements and realistic inputs), and skipping edge-behaviour assertions (testing only happy paths). — [GitHub Docs: increase test coverage](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/drive-downstream-impact/increase-test-coverage)
- The tutorial frames the goal as raising coverage. It does not warn about redundancy or over-generation.

### Inferences
- Anthropic is the only vendor I found that names agents gaming tests (hard-coding, special-casing, editing or removing tests) and that warns review loops cause test bloat. Its two warnings pull in opposite directions. "Don't remove or edit tests" protects against cheating, but taken literally it also blocks pruning redundant tests. A team that wants agents to prune needs an explicit, human-approved deletion path.
- GitHub's coverage-led framing ("increase test coverage") is the incentive that Thoughtworks' mutation-testing blip warns can be inflated.

### Gaps
- I did not fetch the original April 2025 Anthropic engineering post, which now redirects to the docs. From memory it advised being explicit about TDD, telling Claude not to change tests, and checking with independent subagents that the implementation does not overfit the tests. That wording is unverified and should not be quoted.
- The system-card text was not read first-hand.
- I did not fetch the main GitHub Docs page "Writing tests with GitHub Copilot".
- Not covered: Google (Gemini Code Assist), Microsoft (Visual Studio or Azure DevOps guidance), Cursor. I found no official statement from any of them on agents overfitting tests or generating too many.

## 3. Published rules of thumb on test file size, one concern per file, or naming that makes duplicates visible

### Takeaway
I found no authoritative numeric guidance on test file size. The closest rules are about naming and granularity: name each test after the behaviour it checks, write one test per behaviour (not per method), and assert one condition per test. These conventions make duplicates easier to spot, because two tests with the same behaviour name stand out.

### Cited Findings
- "A test's name should summarize the behavior it is testing." Test names are often the first thing seen in a failure report. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Write one test per behaviour rather than one per method. A behaviour-named suite reads like a specification, so a repeated behaviour is visible. — [SWE at Google ch. 12](https://abseil.io/resources/swe-book/html/ch12.html)
- Recommends "one condition per test" and readable test code. — [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- "Readable" and "Specific" in the Test Desiderata: a reader should see why a test exists, and the cause of a failure should be obvious. — [Test Desiderata](https://testdesiderata.com/)

### Inferences
- Behaviour-named tests (Google) plus one test per behaviour gives a cheap way to find duplicates: list test names per module and look for repeated or near-repeated behaviour phrases. This is an inference; no source prescribes it as a duplicate-detection method.

### Gaps
- No source found on maximum test file size, line counts, or one-concern-per-file rules from Google, Fowler, Beck, or vendors. If the report needs a number, it would have to come from project convention, not authority.
- I did not look at framework docs (Jest, Vitest, Playwright) for organisation guidance.

## 4. Guidance on reviewing tests in pull requests, and whether AI-written tests get reviewed less

### Takeaway
Google's code review guide treats tests as code that must be reviewed for correctness and usefulness. Its key question is whether a test would fail if the code were broken, and it rejects complexity in tests. AI-era sources (GitHub, Anthropic, Böckeler, Thoughtworks) all say generated tests need human or independent review and that a green suite or high coverage is not evidence of quality. I found no measured data showing that AI-written tests get reviewed less, only qualitative warnings about complacency.

### Cited Findings
- Google eng-practices "What to look for in a code review", Tests section (undated, accessed 2026-11-04):
  - Tests should usually be "in the same CL as the production code."
  - Check that tests are "correct, sensible, and useful."
  - Tests don't test themselves, so "a human must ensure that tests are valid."
  - "Will the tests actually fail when the code is broken?"
  - Does each test make simple, useful assertions?
  - "Don't accept complexity in tests just because they aren't part of the main binary."
  — [Google eng-practices: What to look for](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- GitHub: don't accept generated tests without reviewing their logic against real requirements. — [GitHub Docs: increase test coverage](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/drive-downstream-impact/increase-test-coverage)
- Anthropic: use an independent, read-only reviewer that did not see the code being written. Scope its prompt, because unscoped reviewers produce findings that turn into tests for impossible cases. — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- Kent Beck watches for the agent disabling or deleting tests, which only a reviewer reading the test diff will catch. — [Beck, Augmented Coding](https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes)
- Thoughtworks: high coverage from AI-generated tests can hide "perpetually green" tests. Mutation testing is the recommended automated check alongside review. — [Thoughtworks Radar: Mutation testing](https://www.thoughtworks.com/radar/techniques/mutation-testing)
- Böckeler: tautological tests (expected values computed by calling the implementation) appeared in agent output even under TDD. A reviewer can spot this pattern directly. — [Böckeler, TDD in the agent loop](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)
- "Complacency with AI-generated code" is a named Radar antipattern (secondary source). — [Business Wire, Apr 2025](https://www.businesswire.com/news/home/20250402355680/en)

### Inferences
- Google's question "would the test fail if the code broke?" is exactly what mutation testing automates. It fits as a CI aid for reviewers facing large agent-written test diffs.
- A reviewer checklist for agent tests could combine three sources: Google (valid, useful, simple assertions, would fail), Böckeler (no tautological or no-op tests), and Beck/Anthropic (no tests disabled, deleted, or edited to pass, and no special-casing in production code).

### Gaps
- No empirical source found on whether AI-written tests are reviewed less carefully than human-written ones (for example review time or comment counts on test files). The complacency claim rests on Thoughtworks' qualitative antipattern, read only through secondary coverage.
- One arXiv study surfaced in search, reporting that AI authored 16.4% of test-adding commits across 10 TypeScript projects ([arXiv 2603.13724](https://arxiv.org/abs/2603.13724)), but I did not read it. It belongs to adjacent academic research, outside these vendor and authority notes.
