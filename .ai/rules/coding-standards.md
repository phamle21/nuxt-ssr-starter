# Coding Standards

## Naming

- Use English for code, identifiers, filenames, tests, and comments.
- Use `PascalCase` for components and types; use `camelCase` for variables, functions, composables,
  and store instances.
- Prefix composables with `use`. Name booleans as predicates and handlers by intent.
- Prefer domain-specific names and follow the nearest established file-naming pattern.

## Structure

- Keep each function and component focused on one responsibility.
- Prefer early returns over deep nesting.
- Extract helpers only when they improve meaning, reuse, or testability.
- Keep side effects explicit and close to their owning boundary.
- Do not add abstractions for hypothetical reuse.

## Comments

- Comment only non-obvious intent, invariants, constraints, security concerns, SSR decisions, or
  temporary workarounds.
- Do not restate code, narrate steps, preserve disabled code, or use comments to compensate for poor
  naming.
- Keep docblocks for public contracts, non-obvious side effects, constraints, or compatibility
  requirements; do not repeat TypeScript signatures.
- Use actionable TODO comments with an owner or issue reference. Do not add unowned TODOs.
