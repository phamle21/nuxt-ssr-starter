# Testing Rules

- Test observable behavior, not implementation details.
- Use Vitest; do not introduce another test runner.
- Test mappers, validation, state transitions, and meaningful branching logic.
- Add component tests for interaction, accessibility behavior, or non-trivial rendering.
- Mock at external boundaries and keep fixtures minimal.
- Cover the relevant success, failure, and edge paths.
- Keep tests deterministic and independent of execution order.
- Do not add low-value snapshots or tests that merely restate markup.
- Run targeted tests first, then `yarn verify`.
