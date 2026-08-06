# Architecture Rules

## Boundaries

- Keep `app/` browser-safe and free of server-only imports.
- Keep `server/api/` handlers focused on transport concerns.
- Put reusable application orchestration in `server/services/`.
- Put provider-specific clients, DTOs, and mappers in `server/integrations/<provider>/`.
- Put stable serializable app/server contracts in `shared/contracts/`.
- Do not expose external DTOs directly to pages, components, stores, or public API responses.

## Dependency Direction

```text
app → shared
server/api → server/services → server/integrations
server → shared
shared → no app or server imports
tests → app, server, shared
stories → app/components
runtime → no tests or stories imports
```

Use relative imports within the same module or directory. Use `@/` across application folders and
`~~/` across repository-root boundaries such as `server/` and `shared/`. Avoid parent-relative import
chains that cross architectural layers.

## Layering

- Add a layer only when it owns a real responsibility.
- Use a mapper when external data shape differs from the application contract.
- Keep authentication, retries, timeouts, and provider headers inside the integration boundary.
- Keep request parsing and HTTP status handling inside the API route.
- Keep business orchestration independent of HTTP when practical.
