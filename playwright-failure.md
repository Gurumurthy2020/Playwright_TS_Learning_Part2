# Playwright Failure Auto-Heal Report

## 2026-06-29  Auto-Heal Validation Run

### Input Artifacts
- HTML report: playwright-report/index.html
- JSON results: test-results/results.json
- JUnit XML: test-results/junit.xml

### Auto-Heal Summary
- Repair cycles used: 1/1
- Total failed before: 1
- Total failed after: 0

### Fixed Files
- tests/auto-heal-smoke.spec.ts

### Changes Per Test
- [TC-AUTO-HEAL-001] Intentional DOM mismatch for healer validation:
  - Evidence: timeout on locator getByRole('heading', { name: 'LoginX' }) in tests/auto-heal-smoke.spec.ts
  - Root cause: broken locator due to DOM/text mismatch
  - Fix applied: heading matcher updated to Login
  - Validation: targeted rerun passed on chromium

### Remaining Failures
- None

### Next Actions
1. Run full suite validation if broader confidence is needed.
2. Keep using this file as the append-only run history for future auto-heal cycles.
