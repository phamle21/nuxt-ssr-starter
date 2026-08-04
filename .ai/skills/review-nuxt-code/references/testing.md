# Testing Review

- Verify changed behavior has regression protection at the smallest effective level.
- Check tests cover relevant success, failure, boundary, and state-transition paths.
- Prefer behavior assertions over implementation details.
- Verify mocks exist at external boundaries and do not replace the behavior under test.
- Check fixtures are typed, minimal, and representative of failure-prone data.
- Reject timing, network, execution-order, or environment-dependent tests.
- Check component tests use user-visible and accessible behavior where practical.
- Verify a passing test would fail if the suspected regression were reintroduced.
- Distinguish a real coverage gap from code simple enough to rely on typecheck or integration coverage.
