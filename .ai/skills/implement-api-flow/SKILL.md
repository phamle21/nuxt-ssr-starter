---
name: implement-api-flow
description: Implement or change a typed Nuxt API flow from page or composable through a Nitro server route, application service, external integration, mapper, and shared contract. Use when reading or mutating data through an external HTTP, REST, or GraphQL system while preserving SSR and security boundaries.
---

# Implement an API Flow

## Establish the Contract

1. Confirm the use case, input, output, error cases, authentication, and cache behavior.
2. Inspect existing routes, services, integrations, contracts, and tests.
3. Define a stable serializable application contract in `shared/contracts/` when both app and server
   need it.
4. Do not invent a universal response envelope or validation library.

## Implement the Layers

1. Put provider DTOs, credentials, headers, timeouts, and transport calls in
   `server/integrations/<provider>/`.
2. Map provider DTOs to application contracts at the integration boundary.
3. Put multi-step orchestration or reusable application logic in `server/services/`.
4. Keep `server/api/` responsible for request parsing, validation, status codes, and calling the
   service.
5. Access the Nuxt route through an app composable when reuse, stable keys, or view-state mapping is
   needed.
6. Let the page or component render the resulting states without provider knowledge.

```text
page/component
→ app composable
→ server/api
→ server/service
→ server/integration
→ external API
→ mapper
→ shared contract
```

For a local endpoint with no external system, omit the integration and mapper. For a trivial
one-use route, omit a service only when the handler remains thin and testable.

## SSR and Security

- Use `useFetch` or `useAsyncData` for render-critical reads.
- Use `$fetch` for event-driven mutations.
- Keep private runtime config and provider credentials server-only.
- Forward only required request context; never blindly proxy all headers or cookies.
- Normalize safe errors and do not return raw provider failures.
- Prevent per-request state from leaking through module-level mutable values.

## Validate

- Test mapping, validation, service branching, and relevant error paths.
- Run targeted tests, lint, typecheck, build, and project verification.
