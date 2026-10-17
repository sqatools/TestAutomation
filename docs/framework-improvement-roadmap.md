# Automation Framework Improvement Roadmap

This document consolidates the improvements identified in the current Playwright and TypeScript framework. Work through the items individually, updating their status as each is implemented and verified.

## Current framework at a glance

- Playwright Test with TypeScript.
- Chromium, Firefox, and WebKit projects.
- UI, API, and accessibility tests under `tests/`.
- A shared page object for the SQA Tools automation practice page.
- HTML and Allure reporting.
- GitHub Actions workflows for pull requests and manually dispatched test runs.

## Prioritized backlog

### 1. Secure local configuration and generated artifacts

**Priority:** P0 — address before expanding CI or sharing the repository.

**Observed:** `.env` and `allure-results/` are untracked. The current `.gitignore` does not exclude either. The GoRest API example also uses an environment URL and bearer token, so local credentials and run output need an explicit policy.

**Work:**

- Ignore `.env` and other local-only environment files while keeping a sanitized `.env.example` with variable names and descriptions only.
- Ignore generated Allure output and any other generated report/results directories.
- Ensure tests read secrets from environment variables or CI secrets; never check credentials into source or print them in test output.
- Document how developers configure the required variables locally and in CI.

**Done when:**

- No real secrets or generated test results are tracked.
- A new developer can determine required variables from the example file and documentation.
- A targeted repository check confirms that ignored local files remain untracked.

### 2. Make accessibility tests enforce their result

**Priority:** P0 — the current test can pass while reporting accessibility violations.

**Observed:** `tests/accessibility_test.spec.ts` logs axe violations, but the assertion that would fail on violations is commented out.

**Work:**

- Assert that there are no unexpected violations.
- If existing violations must be accepted temporarily, document them explicitly and narrowly rather than disabling the assertion.
- Remove diagnostic logging that does not add useful failure context.
- Keep the target URL configurable or use the framework's designated test environment.

**Done when:**

- A new unexpected axe violation makes the test fail with useful details.
- Any accepted baseline violations are named, justified, and testable.

### 3. Establish deterministic test targets and configuration

**Priority:** P1 — improve reliability before increasing test volume.

**Observed:** Tests navigate directly to public sites, and the shared page object hardcodes the SQA Tools URL. Results can depend on third-party availability, content changes, rate limits, or network conditions.

**Work:**

- Configure a documented `baseURL` and use it in page objects and tests instead of repeating absolute URLs.
- Separate stable tests against a controlled application/environment from optional external-site checks.
- Give external checks an explicit tag and execution policy so external outages do not obscure failures in the core suite.
- Keep test data unique and cleanup reliable for API tests that create remote objects.

**Done when:**

- Routine CI tests have a documented, predictable target and do not require editing source URLs to switch environments.
- External dependency tests can be selected and reported independently.
- A test can be rerun without relying on state left by a prior test.

### 4. Define and validate the test-tagging strategy

**Priority:** P1 — manual dispatch must select the tests it claims to run.

**Observed:** Dispatch workflows filter by `@smoke`, `@sanity`, `@regression`, or `@gorest`, while the public API tests use `@API`. Tag names and case are inconsistent; the API workflow can select no tests for some choices.

**Work:**

- Define canonical tag names and whether they are case-sensitive.
- Apply tags consistently to UI, API, and accessibility tests.
- Align workflow choices with tags that actually exist.
- Make workflows fail clearly when a selected tag matches zero tests.

**Done when:**

- Each dispatch choice selects at least one intended test and excludes unrelated tests.
- A nonexistent or misspelled tag cannot produce a misleading successful run.
- Tagging conventions are documented for new tests.

### 5. Consolidate and harden CI workflows

**Priority:** P1 — reduce duplicate work and clarify what CI guarantees.

**Observed:** `playwright.yml` and `playwright-cron.yml` perform the same pull-request test and report steps, while the cron schedule in the latter is commented out. Workflows install all browsers even if only one project is needed for a particular run.

**Work:**

- Keep one pull-request workflow for shared install, test, and artifact steps.
- Either configure an actual scheduled workflow with a distinct purpose or remove/rename the unused cron workflow.
- Define a tiered strategy, such as fast Chromium checks on pull requests and broader cross-browser coverage on a schedule or manual dispatch.
- Keep report uploads available after test failures, but ensure report-generation failures are visible rather than silently ignored.
- Pin or deliberately manage the Node.js version used in CI instead of depending on an unspecified moving LTS target.
- Use least-privilege workflow permissions and validate user-supplied workflow inputs before using them in commands.

**Done when:**

- Pull requests do not run duplicate copies of the same suite.
- Every workflow has a clear trigger and documented test scope.
- Failures in tests and reporting are distinguishable in the workflow result.

### 6. Separate examples and scaffolds from executable tests

**Priority:** P1 — keep routine test results representative of the product checks.

**Observed:** `tests/seed.spec.ts` contains an empty test, and `tests/example.spec.ts` checks the Playwright website rather than the framework's target application. The configured `testDir` includes both.

**Work:**

- Move code-generation seeds and tutorial examples outside the normal test directory, or configure an explicit test-file pattern that excludes them.
- Keep examples runnable through a separate documented command if they are intended as training material.
- Remove obsolete scaffolds that no longer serve a purpose.

**Done when:**

- The default test command runs only intentional framework/product checks.
- Example or seed content cannot create empty or unrelated test results in CI.

### 7. Improve test isolation and failure diagnosis

**Priority:** P1 — make failures local to one behavior and easier to triage.

**Observed:** `tests/automationPractice.spec.ts` combines forms, file upload, date/time inputs, navigation, iframe visibility, and a comment form into one long test. A failure near the end prevents later behaviors from being independently reported.

**Work:**

- Split large end-to-end flows into focused tests by behavior.
- Keep setup and cleanup local to each test, using Playwright fixtures or hooks where shared setup is genuinely appropriate.
- Avoid adding sleeps or broad retry logic; use Playwright's auto-waiting and condition-based assertions.
- Configure useful failure artifacts (for example, traces on retry and screenshots on failure) without retaining unnecessary artifacts for every passing test.

**Done when:**

- A failure identifies one feature or interaction without requiring the entire long journey to be replayed.
- Tests can run independently and in parallel without depending on execution order.
- CI failure output includes enough evidence to diagnose common UI failures.

### 8. Keep page objects cohesive and selectors resilient

**Priority:** P2 — address as the UI suite grows or during test decomposition.

**Observed:** `AutomationPracticePage` contains locators and actions for many different behaviors, including alerts, comments, dates, file upload, iframes, and navigation. Several selectors are CSS IDs or depend on inline `onclick` attributes.

**Work:**

- Keep page objects focused on a page or cohesive component rather than acting as a large collection of unrelated actions.
- Prefer accessible locators such as roles and labels when the application exposes them.
- For selectors that must use CSS, document or validate the stable test contract with the application.
- Give navigation and action methods explicit return types where that improves clarity.

**Done when:**

- Page objects have clear responsibilities and are easy to update when the UI changes.
- Tests primarily express user-facing behavior rather than implementation-specific selector details.

### 9. Standardize API test setup, assertions, and output

**Priority:** P2 — improve maintainability and avoid avoidable external/API failures.

**Observed:** The public API test suite repeatedly creates and disposes request contexts with a hardcoded base URL. The GoRest test relies on environment variables and includes console output of the response data.

**Work:**

- Use shared Playwright `request` fixtures or a small typed fixture/helper for common API configuration.
- Centralize API base URLs and authorization header construction, with explicit validation when required configuration is missing.
- Assert relevant status codes, response shapes, and error behavior instead of only checking `ok()`.
- Do not log full API payloads or sensitive response data.
- Keep tests that mutate public third-party data isolated, uniquely identified, and reliably cleaned up.

**Done when:**

- API tests use consistent, typed setup and produce useful assertion failures.
- Missing API configuration fails with an actionable message.
- No API test leaks credentials or relies on shared mutable test data.

### 10. Add static quality checks and purposeful package scripts

**Priority:** P2 — establish inexpensive safeguards as the framework becomes shared.

**Observed:** `package.json` has test and Allure scripts but no type-check, lint, or formatting validation. `test:allure` currently runs the same command as `test`.

**Work:**

- Add TypeScript type-checking and a consistent lint/format check using the repository's chosen tooling.
- Add focused commands for the intended test groups (for example, smoke, UI, API, and cross-browser) only where the tagging and CI strategy support them.
- Make script names reflect distinct behavior; remove aliases that imply a difference they do not provide.
- Run relevant checks locally and in CI.

**Done when:**

- Contributors can run the same static checks locally that CI enforces.
- Each package script has a distinct, documented purpose.
- A type error or lint violation in changed automation code fails the appropriate validation.

### 11. Improve framework documentation

**Priority:** P2 — keep contributor setup aligned with actual behavior.

**Observed:** The root `README.md` contains only the project title, while setup and reporting information is spread across example and Allure documents.

**Work:**

- Document prerequisites, installation, environment configuration, local test commands, browser setup, tags, CI workflows, and report locations in one contributor-oriented entry point.
- Link to deeper guides instead of duplicating them.
- Document conventions for adding UI/API/accessibility tests and page objects.

**Done when:**

- A new contributor can install dependencies, configure the environment, run an appropriate test subset, and find its reports using the root documentation.
- Documentation commands and workflow behavior match the current repository configuration.

## Suggested implementation sequence

1. Secure local configuration and generated artifacts.
2. Make accessibility tests enforce their result.
3. Establish deterministic test targets and configuration.
4. Define and validate test tags.
5. Consolidate and harden CI workflows.
6. Separate examples and scaffolds from executable tests.
7. Improve test isolation and failure diagnosis.
8. Standardize API setup and assertions.
9. Refine page objects and selectors as tests are split.
10. Add static quality checks and purposeful scripts.
11. Complete contributor documentation alongside the preceding changes.

## Progress tracking

Update each backlog item with its status (`Not started`, `In progress`, or `Done`), implementation link, and validation evidence as work is completed. Keep this roadmap focused on framework improvements; record individual defects or follow-up work with the corresponding implementation task.
