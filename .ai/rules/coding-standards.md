# Coding Standards

## Naming

- Use English for code, identifiers, filenames, tests, and comments.
- Use `PascalCase` for Vue components and TypeScript types.
- Use `camelCase` for variables, functions, composables, and Pinia store instances.
- Prefix composables with `use`.
- Name booleans as predicates such as `isLoading`, `hasAccess`, or `canSubmit`.
- Name event handlers by intent, such as `handleSubmit` or `handleSelectionChange`.
- Prefer domain-specific names over generic names such as `data`, `item`, `value`, or `handler`.
- Follow existing file naming in the nearest feature before introducing a new pattern.

## Functions and Components

- Keep each function or component focused on one responsibility.
- Prefer early returns over deeply nested conditions.
- Extract a helper only when it improves meaning, reuse, or testability.
- Keep side effects explicit and close to their owning boundary.
- Do not create abstractions for hypothetical reuse.

## Comments

Write a comment only to explain non-obvious intent, an invariant, a constraint, a workaround, a
security concern, or an SSR/hydration decision.

Good:

```ts
// Keep the key stable so hydration reuses the server payload.
const key = computed(() => `article:${slug.value}`)
```

Avoid comments that:

- restate the code
- narrate every step of a function
- divide obvious sections such as variables, fetch, transform, and return
- preserve disabled code
- compensate for unclear naming
- describe behavior that is no longer true

Prefer a clear name or a small function over a long explanatory comment. Keep necessary comments
short, local, and up to date.

Do not add docblocks that merely repeat a function name or TypeScript signature. Use a docblock only
for a public contract, non-obvious side effect, invariant, generic constraint, or compatibility
requirement.

Use actionable TODO comments with an owner or issue reference:

```ts
// TODO(PROJ-123): Remove the fallback after the legacy endpoint is retired.
```

Do not add vague comments such as `TODO: fix later`.
