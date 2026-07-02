# Playwright_TS2 Framework

End-to-end Playwright automation framework for OrangeHRM with:
- Acceptance criteria to test case generation
- Test case to automation script generation
- Test execution with Playwright reporters
- Auto-heal flow for failure recovery
- Persistent heal report tracking in `playwright-failure.md`

## Tech Stack

- Playwright Test (TypeScript)
- Node.js
- Dotenv
- Custom GitHub Copilot agents in `.github/agents/`

## Project Structure

```text
.
├── .github/agents/
│   ├── acceptance-criteria-testcase-writer.agent.md
│   ├── acceptance-to-autoheal-pipeline.agent.md
│   ├── playwright-failure-auto-healer.agent.md
│   ├── playwright-test-automation-generator.agent.md
│   └── qa-to-automation-pipeline.agent.md
├── test-cases/
│   ├── admin-user-mgmt-testcases.csv
│   ├── login-slim-testcases.csv
│   ├── pim-add-employee-slim-testcases.csv
│   └── templates/
├── tests/
│   ├── admin-user-mgmt.spec.ts
│   ├── login-slim.spec.ts
│   └── pages/
├── playwright.config.ts
├── package.json
├── test-results/
├── playwright-report/
└── playwright-failure.md
```

## Prerequisites

- Node.js 18+
- npm
- VS Code with GitHub Copilot Chat
- Ollama (for local model auto-heal workflow)

## Installation

```bash
npm install
npx playwright install
```

## Environment

Create a `.env` file in project root based on your test data strategy.

Common variables used in this framework:

```env
ORANGEHRM_BASE_URL=https://opensource-demo.orangehrmlive.com
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=admin123
NON_ADMIN_USERNAME=<your_non_admin_user>
NON_ADMIN_PASSWORD=<your_non_admin_password>
```

## Running Tests

### Full suite

```bash
npm test
```

### Chromium only

```bash
npm run test:chromium
```

### Login slim suite

```bash
npm run test:login:slim
```

### Headed run (login slim)

```bash
npm run test:login:slim:headed
```

### Debug mode

```bash
npm run test:debug
```

### Playwright UI mode

```bash
npm run test:ui
```

### Open HTML report

```bash
npm run test:report
```

## Reports and Artifacts

- HTML report: `playwright-report/index.html`
- JSON results: `test-results/results.json`
- JUnit report: `test-results/junit.xml`
- Auto-heal run history: `playwright-failure.md`

## Agent-Driven Workflow

Use this agent for full pipeline orchestration:

- **Acceptance to Auto-Heal Pipeline**

This parent agent performs:
1. Acceptance criteria processing
2. Test case generation
3. Automation script generation
4. Test execution
5. Failure auto-heal via Ollama-backed healer
6. Summary persistence to `playwright-failure.md`

### Recommended prompt

```text
Run full pipeline from acceptance criteria: generate test cases, create Playwright scripts, execute on chromium, auto-heal failures, and append summary to playwright-failure.md.
```

## Auto-Heal Behavior

The **Playwright Failure Auto Healer** agent:
- Parses failure artifacts from HTML/JSON/JUnit
- Applies minimal safe fixes (prefers page object updates first)
- Re-runs impacted tests
- Appends each run summary to `playwright-failure.md`

## Notes

- `gen:testcases` and `gen:testcases:help` scripts in `package.json` point to `scripts/generate-testcases-from-rally.mjs`. Ensure this file exists before using those scripts.
- Keep assertions in spec files and avoid assertions inside page object classes.
- Prefer semantic locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`) for stability.

## Maintenance Tips

- Clean stale reports before large runs if needed.
- Keep test data deterministic where possible.
- Commit updates to agent files alongside framework changes so behavior stays reproducible.
