---
name: write-vitest-tests
description: Add or update focused Vitest tests for Vue components, composables, Pinia stores, mappers, services, and Nuxt behavior. Use for regression coverage, new logic, state transitions, error handling, or interaction tests while avoiding brittle implementation-detail tests.
---

# Write Vitest Tests

1. Identify observable behavior and the regression risk.
2. Inspect test configuration, setup, helpers, and nearby tests.
3. Choose the smallest suitable level: pure unit, component, store, service, or Nuxt integration.
4. Cover the relevant success, failure, and edge paths.
5. Mock at system boundaries; do not mock the behavior under test.
6. Use accessible queries and user-visible behavior for component tests.
7. Keep fixtures small, typed, and local unless reuse is proven.
8. Avoid timing dependence, test ordering, network access, and large snapshots.
9. Run the targeted test, then lint, typecheck, and project verification.
