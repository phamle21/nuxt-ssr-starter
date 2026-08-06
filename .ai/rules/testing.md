# Testing Rules

- Test observable behavior, not implementation details.
- Use Vitest; do not introduce another test runner.
- Test mappers, validation, state transitions, and meaningful branching logic.
- Add component tests for interaction, accessibility behavior, or non-trivial rendering.
- Mock at external boundaries and keep fixtures minimal.
- Cover the relevant success, failure, and edge paths.
- Keep tests deterministic and independent of execution order.
- Do not add low-value snapshots or tests that merely restate markup.
- Keep tests outside runtime source under `tests/`, mirroring the source path: `app/foo.ts` maps to
  `tests/unit/app/foo.test.ts` and `server/foo.ts` maps to `tests/unit/server/foo.test.ts`.
- Import app source with `@/` and repository-root source with `~~/`; runtime source must never import
  tests, fixtures, mocks, or stories.
- Run targeted tests first, then `yarn verify`.
