# Prior art: test maps, duplicate-test detection, and agent-friendly test suites

Scope: prior art for (1) a generated "test map" (index of every test file, describe block and test title, readable by people and agents) and (2) a cheap AI agent that consults the map before a new test is added. Researched 2026-11-04. Where a claim comes from a search-result summary rather than a page I fetched, it is marked "(search summary)".

## 1. Tools that list or index tests

### Takeaway
Every major runner can already enumerate tests without running them, and most can emit JSON. So the raw material for a test map is a solved problem. What none of them produce is a committed, human- and agent-readable artifact meant to be consulted before writing a test. They are run-time queries for CI sharding, filtering, or debugging, not a reference document.

### Cited Findings
- **Vitest `vitest list`** prints the tests Vitest would run without running them. Nested names are joined with `>` (e.g. `describe > some-test > test 1`). `--json` writes JSON to stdout or a file, `--filesOnly` prints only file paths, and the command ignores `reporters`. The current docs say that from Vitest 5, test files are parsed statically by default (`--no-static-parse` runs them instead; `--static-parse-concurrency` tunes it). The docs do not document the JSON schema. — [vitest.dev CLI guide](https://vitest.dev/guide/cli)
- The `vitest list` API landed in vitest-dev PR #6013, which followed the closed PR #4240. The earlier PR said the JSON would include the filename as a separate field. — [vitest PR #4240](https://github.com/vitest-dev/vitest/pull/4240); [commit 583dd8a98](https://redirect.github.com/vitest-dev/vitest/commit/583dd8a98) (search summary)
- **Jest `--listTests`** "Lists all test files that Jest will run given the arguments, and exits": files only, no test names. The current Jest CLI docs also list **`--collectTests`**, which will "Discover and print all test suites and test names without executing them". It registers tests and exits before any test bodies or hooks run, and it supports `--json` and `-t`. (Read from the current docs page. I did not confirm which Jest version introduced it.) — [jestjs.io CLI](https://jestjs.io/docs/cli)
- Older Jest guidance (a 2017 Stack Overflow thread) said Jest had no per-test listing, and the workaround was a `-t` pattern that matched nothing. — [SO mirror](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/47722048/getting-a-list-of-tests-run-with-jest-without-running-suites)
- **pytest `--collect-only`** collects tests without executing them (`-q` for terse output). Module-level code in test files still runs at collection, so import-time side effects still happen. — [code-maven pytest slides](https://slides.code-maven.com/python/pytest-collect-only.html)
- **Playwright `npx playwright test --list`** prints file location, test name and totals without running. Adding `--reporter=json` gives machine-readable output. — [playwrightsolutions.com](https://playwrightsolutions.com/is-there-a-way-to-list-all-the-playwright-tests-without-running-them/)
- **Bazel** `bazel query "tests(//...)"` expands `test_suite`s into concrete test targets, with tag and size filtering. `bazel test` accepts the same expression syntax. This works at the level of test targets (binaries), not individual test cases. — [VirtusLab Bazel book, Test Suites](https://bazel.virtuslab.com/book/1~2~6/); [lowRISC OpenTitan bazel_query.py](https://www.github.com/lowRISC/opentitan/blob/30d7e787c753caaa03fe68a4a70da1bbcbc1d96f/ci/scripts/lib/bazel_query.py); [volcengine Q&A](https://www.volcengine.com/article/1240586) (search summary)
- **Test management tools that sync from code**: Testomat.io imports automated tests by parsing source code, with re-import on each commit to stay in sync. On import it flattens nested `describe` blocks into sibling suites named after their parent. By default it does not keep the original file structure, though the pytest plugin has a keep-structure option. — [Testomat.io: import tests from source code](https://docs.testomat.io/project/import-export/import/import-tests-from-source-code/); [pytestomatio](https://awesome.ecosyste.ms/projects/github.com%2Ftestomatio%2Fpytestomatio) (search summary)
- Testomat.io also ships AI "skills", including `detect-duplicate-test-cases`, which finds duplicates, near-duplicates and overlaps. It runs over Markdown test cases rather than code, and the skills are Enterprise-plan only. — [Testomat.io AI skills](https://docs.testomat.io/advanced/ai-powered-features/ai-skills) (search summary)

### Inferences
- The "test map" generator is a thin layer: `vitest list --json` (or `jest --collectTests --json`, `pytest --collect-only -q`, `playwright test --list --reporter=json`) plus formatting into a committed Markdown file. Static parsing in Vitest 5 makes it cheap enough to regenerate on every commit or in a pre-commit hook.
- What is new is the use: a committed index that is diffed in PRs and read by agents before they write tests. The parts that already exist are enumeration (runners) and sync into a SaaS catalog (Testomat.io and similar). Testomat.io's flattening of nested describes shows that commercial catalogs lose the describe hierarchy, which is the structure a test map would keep.
- Bazel's level of detail (targets, not cases) means big-company build catalogs are not test maps in this sense.

### Gaps
- I found no public write-up of a "test inventory" or "test map" practice at a large company (Google, Meta, Microsoft) that indexes test titles for human or agent lookup. Searches surfaced only test selection and flakiness work.
- The JSON schema for `vitest list --json` is undocumented. Check by running it.
- I did not verify TestRail, Qase or Xray code-sync features, or Gradle's test reporting or listing capabilities.

## 2. Duplicate and redundant test detection

### Takeaway
Detection exists in four families, and each misses what an agent-written suite needs. Lint rules catch only identical titles in one block. Clone detectors catch copy-paste but penalise deliberately DAMP tests. Coverage and mutation redundancy is expensive, needs a full run, and gives false positives. Embedding and LLM similarity is new (2023 to 2026), noisy (about 30% false positives in one ChatGPT study), and mostly runs after the fact over a whole suite, not as a gate before a single new test.

### Cited Findings

**Lint rules (title-level)**
- `vitest/no-identical-title` (recommended in the official `@vitest/eslint-plugin`) flags tests or describes with the same title at the same level. The same title in different `describe`s is allowed. Titles built from variables and `.each` titles are skipped. — [Bun lint docs: vitest/no-identical-title](https://bun.com/docs/lint/rules/vitest/no-identical-title); [@vitest/eslint-plugin](https://classic.yarnpkg.com/en/package/@vitest/eslint-plugin)
- Oxc ports the Jest rule, which reports "when two test suites or two test cases at the same level of a test suite have the same title". — [oxc jest/no-identical-title](https://oxc.rs/docs/guide/usage/linter/rules/jest/no-identical-title)

**Copy-paste detectors**
- SonarQube excludes files from duplication via `sonar.cpd.exclusions`. A community thread reports a `**/test/**` exclusion being ignored when the same folder was also set as `sonar.tests`. — [SonarQube docs: excluding from coverage or duplication](https://docs.sonarsource.com/sonarqube-server/project-administration/setting-analysis-scope/exclude-from-coverage-duplication); [Sonar community thread](https://community.sonarsource.com/t/sonarcloud-cpd-exclusions-being-ignored-in-the-log/112221.md)
- Google's Testing on the Toilet, "Tests Too DRY? Make Them DAMP!" (Dec 2019), recommends leaning toward DAMP (descriptive and meaningful phrases) over DRY in unit tests when the two conflict. Deliberately repeated setup is therefore expected, and copy-paste detectors will flag it. — [Google Testing Blog](https://testing.googleblog.com/2019/12/testing-on-toilet-tests-too-dry-make.html)
- Enterprise Craftsmanship argues DRY vs DAMP is a false dichotomy, and that the real problem is shared setup coupling tests. — [enterprisecraftsmanship.com](https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/)

**Test smell detectors**
- tsDetect (Java/JUnit) reports F-scores of 87.8% to 100% on its own rules. — [testsmells.github.io tool correctness](https://testsmells.github.io/pages/research/toolcorrectness.html)
- A 2024 thesis ran JNose and TestSmellDetector over 500 GitHub (Java) projects and compared them. — [IYTE thesis](https://openaccess.iyte.edu.tr/handle/11147/14950?mode=full) (search summary)
- SNUTS.js (SBES 2024) is a JavaScript test smell detector. It reports 100% accuracy, but only for three smells (Anonymous Test, Overcommented, General Fixture), and says existing JS tools need heavy configuration. — [SNUTS.js, SBES 2024](https://sol.sbc.org.br/index.php/sbes/article/view/30417)
- AromaLIA is language-independent (C#, Java, JS, TS, Python), covers 10 smells, and reports 97% precision, 96% recall and 97% F1. — [AromaLIA](https://sol.sbc.org.br/index.php/cbsoft_estendido/article/view/46016)
- A CBSoft paper notes that tsDetect, JNose and RAIDE detect smells only after the test is written, and proposes linting for real-time prevention. — [From Reactive to Preventive](https://sol.sbc.org.br/index.php/cbsoft_estendido/article/view/46023)
- A 2024 study (Ouédraogo et al., as cited in a 2026 paper) found LLM-generated tests show relatively more General Fixture, Duplicate Assert, Lazy Test and Empty Test smells than EvoSuite suites. — [Humanizing Automatically Generated Unit Test Suites, arXiv 2606.28229](https://arxiv.org/html/2606.28229v1) (search summary)

**Coverage-based redundancy and suite minimisation**
- Classic coverage-based redundancy treats two tests with the same coverage as redundant. Coverage-only redundancy measurement is known to give many false positives. — [Test Redundancy Measurement Based on Coverage Information](https://www.researchgate.net/publication/220719878_Test_Redundancy_Measurement_Based_on_Coverage_Information_Evaluations_and_Lessons_Learned); [A tester-assisted methodology for test redundancy detection](https://www.researchgate.net/publication/327541275_A_tester-assisted_methodology_for_test_redundancy_detection) (search summary)
- Practitioner example: in an open-source PR, a test became a removal candidate only if another test covered a superset of its arcs and its assertions could be folded into the surviving test. Collected tests went from 1289 to 1166 with no lost line or branch coverage. — [nonconform PR #56](https://github.com/OliverHennhoefer/nonconform/pull/56)
- **Meta TestGen-LLM** (2024) only keeps LLM-generated tests that clear filters "that assure measurable improvement over the original test suite". In the Instagram evaluation, 75% of test cases built, 57% passed reliably and 25% increased coverage. 11.5% of the classes it was applied to were improved, and engineers accepted 73% of its recommendations. Tests that do not add coverage are discarded, which makes this a coverage gate at the point of addition. — [arXiv 2402.09171](https://arxiv.org/abs/2402.09171)
- Commentary on TestGen-LLM notes that coverage gains are gameable and do not by themselves prove test quality. — [Engineer's Codex](https://read.engineerscodex.com/p/metas-new-llm-based-test-generator) (search summary)

**Mutation-based redundancy**
- In mutation-testing theory, a mutant is dynamically subsumed if it is always killed whenever another is. Subsumed mutants inflate mutation scores (Papadakis et al.). — [Optimizing Mutation Testing by Discovering Dynamic Mutant Subsumption Relations](https://www.academia.edu/66877793/Optimizing_Mutation_Testing_by_Discovering_Dynamic_Mutant_Subsumption_Relations); [Freeing Testers from Polluting Test Objectives, arXiv 1708.08765](https://arxiv.org/pdf/1708.08765) (search summary)
- A suite is minimal against a mutant set if removing any test lowers the mutation score. Different removal orders give different minimal suites. — [minimal mutants blog](https://nimble-genie-739c5b.netlify.app/post/2016/10/02/minimal-mutants); [Reduction of Test Suites Using Mutation](https://www.academia.edu/10635473/Reduction_of_Test_Suites_Using_Mutation) (search summary)
- Stryker's JSON report includes test files and test positions (from about @stryker-mutator/core 5.0.1), and the mutation-testing-metrics schema has a `testFiles` field. That is enough to compute which tests kill which mutants, but I found no built-in "redundant tests" report. — [Stryker core CHANGELOG](https://unpkg.com/browse/@stryker-mutator/core@5.0.1/CHANGELOG.md); [mutation-testing-metrics diff](https://socket.dev/npm/package/mutation-testing-metrics/diff/1.7.1) (search summary)

**Semantic, embedding and LLM-based duplicate detection**
- **LTM** (IEEE TSE 2024, FSE 2025 journal-first) embeds test methods with pre-trained code models (CodeBERT, GraphCodeBERT, UniXcoder) and uses cosine or Euclidean similarity plus a genetic algorithm to minimise suites without running them. UniXcoder/Cosine beat the earlier ATM approach: fault detection 0.84 vs 0.81, and about 5x faster minimisation. — [arXiv 2304.01397](https://arxiv.org/abs/2304.01397v2); [FSE 2025 listing](https://conf.researchr.org/details/fse-2025/fse-2025-journal-first/41/LTM-Scalable-and-Black-Box-Similarity-Based-Test-Suite-Minimization-Based-on-Languag)
- **TestChimp Semantic Graph** (open source, MIT, post dated 2026-07-04) scans Playwright `*.spec`/`*.test` files and parses suite path, title, intent comments, annotations and body. It embeds them (OpenAI `text-embedding-3-small` or Voyage `voyage-4`) and clusters with DBSCAN. Default cosine thresholds are 0.75 for a graph edge, 0.80 for "similar" and 0.92 for "potential duplicate". An LLM names the clusters. It ships a local UI and JSON endpoints (`/api/graph`, `/api/similar`), and it does not use coverage. It is not a built-in gate: the post suggests attaching cluster summaries to an agent's context before it writes, and re-running on PR branches. Server-side continuous checks are "on the roadmap". This is the closest existing prior art to idea (2). — [TestChimp blog](https://testchimp.io/blog/semantic-graph-duplicate-test-detection-agentic-qa/)
- **ChatGPT on redundancy** (system test cases from requirements): about 47% of ChatGPT-flagged redundancies matched developer judgement and 30.16% were false positives. The model mistook tests for different user roles as duplicates. — [arXiv 2412.03693](https://arxiv.org/pdf/2412.03693)
- **Tscope** (non-LLM) breaks natural-language test cases into atomic tuples to find redundancy, evaluated on 3,467 test cases. — [arXiv 2210.01661](https://arxiv.org/pdf/2210.01661)
- An industry defensive disclosure describes LLM-summarised test intent compared by an ML model, with pairs scoring ≥ 0.8 recommended for consolidation. It is not peer-reviewed. — [TDCommons](https://www.tdcommons.org/cgi/viewcontent.cgi?article=10470&context=dpubs_series)
- LLMs often generate near-duplicate test cases, which then need filtering. — [arXiv 2503.17998](https://arxiv.org/pdf/2503.17998) (search summary). Counterpoint: TestPilot reported that 92.8% of its generated tests had ≤ 50% similarity (normalised edit distance) to existing tests. — [TestPilot paper (Schäfer et al.)](https://www.franktip.org/pubs/testpilot2024.pdf) (search summary)
- A 2026 paper concludes that "similarity-centric evaluation is insufficient" for LLM-based test refactoring. — [arXiv 2606.28229](https://arxiv.org/html/2606.28229v1) (search summary)

### Inferences
- Nothing found does the exact pre-write check in idea (2) as a cheap, in-loop step over a text index of titles. The nearest are: TestChimp (embeddings over full test bodies, Playwright only, run over the whole suite, gating left to the user), TestGen-LLM (coverage gate after generation, needs a full build and run), JetBrains finding-tests (coverage lookup to find where to add, below) and Testomat.io (Markdown test cases, Enterprise only).
- A title and describe map is far cheaper than embeddings, coverage or mutation, but it is only as good as the titles. That makes "behaviour-named titles" a precondition, and lint rules like `no-identical-title` a weak floor.
- The ChatGPT 30% false-positive result argues for the agent producing "possibly covered by X, check" suggestions rather than blocking.

### Gaps
- I found no study measuring how often AI coding agents add duplicate tests in real repos.
- I did not confirm whether PIT has a built-in "subsumed tests" or redundant-test report. Searches returned only general theory.
- I did not check jscpd options for test-specific thresholds.

## 3. Test file size, splitting by concern, and shared setup

### Takeaway
Size limits for test files exist only as project-level ESLint overrides and a few ADRs (500 lines is a recurring split threshold). There is no widely cited style-guide rule. Shared setup and per-file database isolation (Postgres `CREATE DATABASE ... TEMPLATE`) are documented practice in blogs and plugins rather than in runner docs.

### Cited Findings
- ESLint `max-lines` defaults to 300, and the docs note that recommendations usually range from 100 to 500. — [ESLint max-lines docs (GitHub)](https://github.com/eslint/eslint/blob/0d6235ea201b8b90761ee69bb4d46ae18899c28d/docs/rules/max-lines.md)
- Community pattern: base `max-lines` of 80, with an override for `*.test.js` raised to 200 as a warning. — [DEV Community](https://dev.to/mlennox/riding-rough-shod-over-your-eslint-rules-1c3p)
- Shopware ADR (2026-05-06): Administration test files over 500 lines should be split into smaller spec files. ESLint warns at 500 lines and errors at 1000. — [Shopware ADR](https://developer.shopware.com/docs/resources/references/adr/2026-05-06-split-large-administration-test-files.html)
- Saropa (Dart) lint rules flag test files at 600 lines and suggest splitting by domain, widget or use case. — [saropa_lints AvoidLongTestFilesRule](https://pub.dev/documentation/saropa_lints/14.3.6/saropa_lints/AvoidLongTestFilesRule-class.html)
- Biome has `noExcessiveLinesPerFile`. — [Biome rule](https://biomejs.dev/linter/rules/no-excessive-lines-per-file)
- Postgres template DB pattern: run migrations once into a template (`is_template=true`), then in `beforeAll` `CREATE DATABASE ... WITH TEMPLATE` a per-file DB named from a hash of the file path, and drop it in `afterAll`. — [Deel engineering blog](https://www.deel.com/blog/database-integrations-tests/)
- Postgres refuses to clone a template while other sessions are connected ("source database ... is being accessed by other users"). One author measured `CREATE DATABASE ... TEMPLATE` at about 87 ms. — [dev.to: new PostgreSQL DB per xUnit test](https://dev.to/davidkudera/creating-new-postgresql-db-for-every-xunit-test-2h73?comments_sort=oldest)
- Library support: pytest-mock-resources template databases, pgtestdbpy, and Mergify's database-per-test write-up. — [pytest-mock-resources](https://pytest-mock-resources.readthedocs.io/en/stable/relational/template-database.html); [pgtestdbpy](https://pypi.org/project/pgtestdbpy); [Mergify blog](https://mergify.com/blog/postgres-database-per-test-sqlalchemy)
- For DB names, use UUID entropy rather than truncated timestamps to avoid collisions in parallel runs. — [qaskills.sh](https://qaskills.sh/blog/testcontainers-postgres-per-test-database) (search summary)

### Inferences
- File-size limits and the test map support each other: smaller files split by concern make each map section a coherent behaviour list, and the map makes the split visible.
- Shared fixtures reduce boilerplate duplication, which is a different problem from behavioural duplication. A clone detector catches the first, and a map plus agent targets the second.

### Gaps
- I did not find Google or Airbnb style-guide rules on test file size or "one behaviour per file". The Google material found is DRY vs DAMP only.
- I did not fetch Vitest or Jest `globalSetup` or Vitest fixture (`test.extend`) docs in this pass.

## 4. Making codebases and test suites agent-friendly

### Takeaway
Repo maps (Aider) and AGENTS.md/CLAUDE.md conventions are established ways to give an agent a compact view of a codebase. Aider's map ranks symbols, and nothing I found says it treats tests specially. The closest "map for tests" prior art is JetBrains' coverage-backed finding-tests skill (2026) and TestChimp's suggestion to feed cluster summaries to agents. A committed title-level test map as agent context appears to be new.

### Cited Findings
- **Aider repo map**: a concise summary of the whole git repo listing files and their key symbols (classes, functions, signatures, and critical lines), sent with each request. It is built by graph-ranking files and symbols by how often they are referenced, sized by `--map-tokens` (default 1k tokens), and expands when no files are in the chat. The page does not mention special handling for tests. — [aider.chat repo map](https://aider.chat/docs/repomap.html)
- **AGENTS.md**: an open convention for agent instructions, loaded from the nearest file. Nested per-package files are used in monorepos. — [agents.md](https://agents.md/); [Factory docs](https://docs.factory.ai/cli/configuration/agents-md)
- Practitioner guides recommend listing exact and file-scoped test commands, keeping the file to about 150 to 200 lines, and favouring small files and diffs. These are blogs, not measured results. — [Builder.io](https://www.builder.io/blog/agents-md); [AI Hero guide](https://www.aihero.dev/a-complete-guide-to-agents-md); [Real Python](https://realpython.com/agents-md/)
- Codex reportedly caps each AGENTS.md at about 32 KiB. — [buildmvpfast.com](https://www.buildmvpfast.com/blog/agents-md-standard-battle-tested-guide-2026) (search summary, secondary source)
- **JetBrains finding-tests skill** (2026-05-22): uses coverage data to show an agent which existing tests already exercise a method, so it extends a nearby test file instead of creating a new one. The blog reports a call-count comparison (14 calls with the skill). Without coverage data the agent has to guess. — [JetBrains .NET blog](https://blog.jetbrains.com/dotnet/2026/05/22/claude-codex-ai-agent-skill-for-writing-tests/) (search summary; the page returned 403 to my fetch, so the numbers are unverified)
- Simon Willison's agentic-engineering patterns: agents asked about an existing feature "will probably find and read the relevant tests". He recommends starting a session by having the agent run the existing suite. — [simonwillison.net](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests)
- SpecStory guide: reviewers should check whether an agent change edits an existing test rather than adding one, and treat edits that weaken a test as tampering. — [SpecStory](https://specstory.com/learning/test-quality/checking-agent-written-tests) (search summary)
- TestChimp suggests attaching semantic cluster summaries of the test suite to an agent's context before it writes tests. — [TestChimp blog](https://testchimp.io/blog/semantic-graph-duplicate-test-detection-agentic-qa/)

### Inferences
- What is new in idea (1): a repo map specifically for tests, built from runner-enumerated titles and describe hierarchy rather than from code symbols. It is committed, diffed, readable by humans, and used as the lookup step before writing. Existing pieces cover the parts (runner enumeration, Aider-style maps, AGENTS.md pointers, TestChimp clustering, JetBrains coverage lookup), but none combines them this way.
- What is new in idea (2): a cheap model reading a text index as a pre-write check. JetBrains uses coverage (precise, but needs instrumentation and a run). TestChimp uses embeddings (needs an API key and full bodies). TestGen-LLM uses a post-hoc coverage filter. A title-index check is cheaper than all three but weaker. A defensible design pairs it with a later coverage or mutation check.

### Gaps
- I could not verify the JetBrains post's exact methodology and numbers (403 on fetch).
- I found no measured study of whether AGENTS.md or repo maps reduce duplicate tests. The ETH Zurich context-file benchmark and GitHub's AGENTS.md analysis were mentioned in search results, but I did not locate either.
- I found no tool that applies Aider-style repo maps to test files specifically.
