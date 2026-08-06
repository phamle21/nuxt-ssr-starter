# Frontend Architecture (Nuxt 4 SSR Base)

## Scope

This document describes a **basic Nuxt application structure reusable across multiple projects**. It
focuses on organizing `app/` and the `app / server / shared` boundaries, conventions, and data flows
without coupling the starter to a specific domain or backend.

- Each project defines its own domains. Add domain folders when needed without changing the layer
  boundaries.
- Backends and providers are isolated behind `server/integrations/<provider>/`. This document
  intentionally avoids backend-specific details so the app does not depend directly on a provider.
- When i18n is enabled, use `@nuxtjs/i18n`; English is the default locale and URLs use
  `prefix_except_default`. Message conventions are defined only in
  [.ai/rules/i18n.md](./.ai/rules/i18n.md).

## Core Principles

- **`app / server / shared` boundaries** follow Nuxt 4 conventions.
- **BFF (Backend for Frontend):** the browser does not call a backend directly. `app/` calls Nitro
  (`server/api/`), and Nitro calls the backend. This keeps the frontend independent from the backend
  and keeps secrets and tokens on the server.
- **One-way dependencies:** follow [.ai/rules/architecture.md](./.ai/rules/architecture.md). Do not
  redefine dependency direction per feature.
- **Contracts form the server-app boundary:** backend data is mapped to `shared/contracts` before it
  reaches `app/`. Replacing a backend should affect only `server/integrations/<provider>/`.
- Create a directory only when real code uses it.

## Directory Structure

Domain folder names below are **examples**. Replace them with each project's actual domains while
preserving the boundaries and responsibilities.

```text
repository root/
├── app/                                 # browser-safe code only; never imports server code
│   ├── app.vue                          # root: NuxtLayout + NuxtPage
│   ├── error.vue                        # application-level error page
│   ├── assets/
│   │   └── style/
│   │       ├── tailwind.css             # Tailwind + @theme entry point
│   │       └── tokens.css               # design tokens (color, spacing, radius); add as needed
│   ├── components/                      # reusable components, auto-imported by name
│   │   ├── ui/                          # domain-free primitives: Button, Input, Badge, Modal...
│   │   ├── layout/                      # Header, Nav, Footer, Drawer
│   │   └── <feature>/                   # domain components (optional example)
│   ├── composables/                     # reusable stateful logic; calls Nitro via $fetch/useFetch
│   │   ├── useApi.ts                    # optional server/api wrapper
│   │   └── use<Feature>.ts              # domain-specific composable
│   ├── stores/                          # Pinia: state shared by multiple views only
│   │   └── <feature>.ts
│   ├── layouts/
│   │   └── default.vue                  # add layouts as needed (public, authenticated...)
│   ├── middleware/                      # route middleware (auth, guest...); add as needed
│   ├── plugins/                         # app/browser integrations; add as needed
│   ├── pages/                           # file-based routing: views, data orchestration, SEO metadata
│   │   ├── index.vue
│   │   └── <route>/[param].vue          # dynamic route example
│   └── utils/                           # browser-safe pure helpers (formatting, class merging...)
├── server/                              # Nitro; owns backend transport and secrets
│   ├── api/                             # HTTP endpoints: parse input, set status, call services
│   │   └── <resource>/                  # one endpoint per use case (index.get.ts, [id].get.ts...)
│   ├── exceptions/                      # AppError and safe public-error normalization
│   ├── logging/                         # structured logging, redaction, rate limiting
│   ├── notifications/                   # notification orchestration and channel adapters
│   ├── routes/                          # non-API routes (sitemap.xml, robots.txt...); add as needed
│   ├── services/                        # use-case orchestration, isolated from HTTP for testability
│   │   └── <domain>/
│   ├── integrations/
│   │   └── <provider>/                  # the only layer aware of backend shape and transport
│   │       ├── client.ts                # endpoint, auth headers, timeout, and transport errors
│   │       ├── dto/                      # raw types matching the backend
│   │       └── mappers/                  # raw DTOs → stable shared contracts
│   └── utils/                            # server-only auto-imports (request context, safe errors...)
├── shared/                              # imported by app and server; never imports from them
│   ├── contracts/                       # serializable data crossing the Nitro boundary
│   ├── constants/                       # shared constants
│   ├── logging/                         # error-report contracts shared by app and server
│   └── types/                           # shared pure types; not API payloads
├── i18n/
│   └── locales/
│       └── en/                          # source of truth; namespace files + index.ts aggregator
├── tests/                               # tooling adapter; mirrors app/server/shared paths
│   ├── unit/
│   ├── integration/                     # add only when real integration tests exist
│   └── setup.ts
└── stories/                             # tooling adapter; mirrors app/components paths
```

## Conventions

- **`assets/style/` (singular)** matches the current baseline (`app/assets/style/tailwind.css` and
  the path in `nuxt.config.ts`).
- **Styling:** Tailwind is primary. Use scoped SCSS only for exceptional custom styles and expose
  tokens through `@theme`. See [.ai/rules/styling.md](./.ai/rules/styling.md).
- **Auto-import scope:** Nitro auto-imports only from `server/utils/`; Nuxt auto-imports only
  `shared/utils/**` and `shared/types/**`. Imports from `server/{services,integrations}/`,
  `shared/contracts/`, and `shared/constants/` are intentionally explicit.
- **Imports:** use relative imports within the same module or directory, `@/` across folders in
  `app/`, and `~~/` from the repository root (`server/`, `shared/`). Do not use `../../` chains to
  cross layers.
- **Detached tooling:** tests live at `tests/<kind>/<source-path>` and stories at
  `stories/<component-source-path>`. Tests and stories may import runtime source; runtime source must
  never import tooling.
- **`contracts` vs `types`:** `shared/contracts/` contains serializable, versionable data shapes that
  cross the Nitro boundary. `shared/types/` contains small shared types such as enums, unions, and
  literals, not API payloads.
- **Naming:** use `PascalCase` for components and types, `camelCase` for variables, functions, and
  composables, the `use` prefix for composables, and predicate names for booleans (`isLoading`,
  `hasAccess`). See `.ai/rules/coding-standards.md`.

## Layer Responsibilities

| Layer | Responsibilities | Exclusions |
|---|---|---|
| `app/pages` | Read route/query parameters, select layouts, orchestrate SSR data and metadata, and select state-specific views | Transport, DTOs, and credentials |
| `app/components` | Render UI and emit events using shared contracts | Backend DTO knowledge; business logic in UI primitives |
| `app/composables` | Provide a stable API for pages/components to call Nitro and manage async-data keys, refreshes, and view state | A second client-side service layer |
| `app/stores` | Hold state shared by multiple views, such as drawers or sanitized sessions | Copying all SSR data into Pinia |
| `server/api` | Parse and validate input, set HTTP status, call services, and map errors safely | Complex orchestration |
| `server/services` | Orchestrate use cases, combine calls, and enforce business rules | Unnecessary dependency on HTTP objects |
| `server/integrations/<provider>` | Handle auth, timeouts, transport, raw DTOs, and mapping to contracts | Exposing raw provider errors to the app |
| `shared/contracts` | Define serializable shapes shared by app and server | Copying the complete backend schema |

## Data Flow

### SSR Read (Render-Critical)

```text
page/component
  └─ composable: useFetch('/api/<resource>/:id')      # SSR read
       └─ server/api/<resource>/[id].get.ts           # parse input, set status
            └─ server/services/<domain>               # orchestration
                 └─ integrations/<provider>/client.ts # transport
                      └─ integrations/<provider>/mappers # raw DTO → contract
       ⇐ shared/contracts → SSR HTML + hydration payload
  ⇐ browser hydration without a duplicate request
```

### Event-Driven Mutation

```text
component (emit)
  └─ useAppRequest action → $api('/api/<resource>', { method: 'POST' })
       └─ server/api → service → integration (mutation) → mapper
       ⇐ contract → update store → refresh related UI
```

Use `useAppFetch` for render-critical reads and `useAppRequest` for mutations. These composables
provide a consistent application API boundary and share the same error contract. Feature code does
not call `$fetch` or `useFetch` directly for application APIs.

## SSR and Hydration Rules

- Use `useFetch` for standard reads and `useAsyncData` for custom orchestration.
- Keep async-data keys stable and handlers free of side effects; always return serializable data.
- Limit the hydration payload to the fields required by the page.
- Do not store request-specific mutable state at module scope; it can leak between SSR requests.
- Use browser APIs only inside client boundaries.
- Handle all four states explicitly: pending, empty, error, and success.

## SEO (When Needed)

- Use `useSeoMeta` for titles, descriptions, and social metadata; use `useHead` for canonical and
  alternate links.
- Render important content in server-generated HTML.
- Derive JSON-LD, when present, from the same displayed contract and add only fields backed by real
  data.
- Place `sitemap.xml` and `robots.txt` in `server/routes/` after the domain and indexing policy are
  defined.
- Add locale alternates only when at least two locales and their corresponding content are ready.

## Error Strategy

The Nitro boundary uses `defineApiHandler` to normalize errors into `AppError` and return stable,
safe `ApiErrorData` without leaking raw provider errors:

```text
400  invalid input
401  unauthenticated or expired session
403  forbidden
404  resource not found
409  state conflict
422  backend rejected structurally valid business input
502  backend returned an invalid response
504  backend timeout
```

`ApiErrorData` contains a stable `code`, public `message`, and `requestId`, plus `fields` or
`retryAfter` when appropriate. The app resolves presentation separately by context: `inline`,
`toast`, `dialog`, `page`, or `silent`. Server error policy and UI presentation policy remain
independent responsibilities.

Log enough context to diagnose failures without logging credentials, tokens, session IDs, or
personal data. See [.ai/rules/observability.md](./.ai/rules/observability.md) for error handling,
logging, and alerting rules.

## Security Baseline

- Keep secrets and tokens in private runtime config or server-side HttpOnly cookies, never in Pinia
  or localStorage.
- Do not expose a generic proxy that lets the browser call arbitrary backend endpoints. Each endpoint
  represents one server-controlled use case.
- Validate untrusted input in `server/api` and preserve SSR request isolation.
- Do not add auth, validation, caching, or other dependencies without a requirement and explicit
  approval.

## Adoption Notes

- Create `server/integrations/<provider>/` only after a project selects a provider and has a real
  integration.
- Define domains, cache policy, and request context from the requirements of each project or feature.
