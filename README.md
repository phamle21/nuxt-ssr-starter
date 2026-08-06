# Nuxt SSR Starter

A production-oriented Nuxt 4 starter for server-rendered applications. It provides a strict TypeScript baseline, a browser-to-Nitro API boundary, internationalization, shared error contracts, structured logging, optional error notifications, and an automated quality workflow.

## Technology stack

- Nuxt 4 and Vue 3 with server-side rendering
- TypeScript in strict mode
- Yarn 4
- Pinia
- Tailwind CSS 4, with SCSS reserved for exceptional custom styling
- `@nuxtjs/i18n`
- Vitest and Vue Test Utils
- Storybook with the accessibility addon
- Oxlint and Oxfmt

Exact versions are declared in [`package.json`](./package.json).

## Requirements

- Node.js `24.14.0`
- Corepack enabled
- Yarn `4.13.0`

This repository uses Yarn only. Other package managers are not supported.

## Getting started

```bash
corepack enable
yarn install
cp .env.example .env
yarn dev
```

The development server is available at `http://localhost:3000` by default.

## Commands

| Command | Purpose |
|---|---|
| `yarn dev` | Start the development server |
| `yarn build` | Build the production application |
| `yarn preview` | Preview the production build locally |
| `yarn start` | Run the built Nitro server |
| `yarn storybook` | Start Storybook on port 6006 |
| `yarn test:unit` | Run unit tests once |
| `yarn type-check` | Generate Nuxt types and run Vue TypeScript checks |
| `yarn lint` | Run Oxlint |
| `yarn format:check` | Check formatting with Oxfmt |
| `yarn verify:core` | Check and build the runtime application without test or Storybook tooling |
| `yarn verify:test` | Run the detached unit and integration test suite |
| `yarn verify:storybook` | Build the detached component stories |
| `yarn verify:quick` | Run formatting, linting, type-checking, and unit tests |
| `yarn verify` | Run application, test, and Storybook verification |

Use `yarn verify:quick` during development and `yarn verify` before handing off a production change.

## Project structure

```text
app/                         Browser-safe application code
  components/               Reusable UI and feature components
  composables/              SSR reads and event-driven API requests
  layouts/                  Application layouts
  pages/                    Routes, SSR orchestration, and page metadata
  plugins/                  Nuxt application integrations
  stores/                   Shared Pinia state
  utils/                    Pure browser-safe helpers
i18n/locales/               Translation messages
server/
  api/                      Nitro HTTP endpoints
  exceptions/               Error normalization and safe public errors
  integrations/             Provider-specific clients, DTOs, and mappers
  logging/                  Structured logging, redaction, and rate limiting
  notifications/            Error notification orchestration and channels
  services/                 Domain use-case orchestration
shared/                     Serializable contracts and shared types
tests/                      Tests mirroring app, server, and shared source paths
stories/                    Stories mirroring app component source paths
```

Directories for domains, services, or integrations should be added only when real application code needs them. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for layer responsibilities, dependency rules, and data flows.

Tests and stories are tooling adapters, not runtime layers. For a source file such as
`app/components/ui/AppButton.vue`, use `tests/unit/app/components/ui/AppButton.test.ts` and
`stories/app/components/ui/AppButton.stories.ts`. Tooling imports runtime source through `@` for
`app/` and `~~` for the repository root; runtime source must never import from `tests/` or `stories/`.

## Application data flow

Browser code calls controlled Nitro endpoints instead of calling an external backend directly:

```text
app page/component
  -> app composable
  -> server/api
  -> server/service
  -> server/integration
  -> shared contract
```

- Use `useAppFetch` for render-critical SSR reads.
- Use `useAppRequest` for event-driven requests and mutations.
- Keep credentials, provider DTOs, authentication headers, retries, and timeouts in the server integration boundary.
- Map external data to stable contracts under `shared/` before returning it to the application.

## Environment configuration

Copy [`.env.example`](./.env.example) to `.env` for local development. Do not commit secrets or webhook URLs.

| Variable | Default | Description |
|---|---|---|
| `NUXT_PUBLIC_APP_NAME` | `Nuxt Application` | Public application name |
| `NUXT_PUBLIC_ERROR_REPORTING_ENABLED` | `true` | Enables browser runtime error reporting |
| `NUXT_ERROR_REPORTING_TRUST_PROXY` | `false` | Trusts `X-Forwarded-For` when resolving the client IP |
| `NUXT_ERROR_NOTIFY_ENABLED` | `false` | Master switch for server-side error notifications |
| `NUXT_ERROR_NOTIFY_SLACK_ENABLED` | `false` | Enables the Slack notification channel |
| `NUXT_ERROR_NOTIFY_SLACK_WEBHOOK_URL` | empty | Private Slack webhook URL |
| `NUXT_ERROR_NOTIFY_GOOGLE_CHAT_ENABLED` | `false` | Enables the Google Chat notification channel |
| `NUXT_ERROR_NOTIFY_GOOGLE_CHAT_WEBHOOK_URL` | empty | Private Google Chat webhook URL |
| `BASE_URL` | `/` | Nuxt application base URL when deployed under a subpath |

`NUXT_ERROR_REPORTING_TRUST_PROXY` must be enabled only when the application is behind a trusted proxy that overwrites `X-Forwarded-For`. A proxy deployment that leaves this disabled may group all users under the proxy address for rate limiting.

Additional limits and severity thresholds can be configured through the nested `runtimeConfig` values in [`nuxt.config.ts`](./nuxt.config.ts).

## Error handling and observability

The starter includes:

- stable error responses shared between Nitro and the application;
- request IDs returned through the `x-request-id` response header;
- structured JSON logs with recursive redaction;
- payload limits and per-IP rate limiting for client error reports;
- optional Slack and Google Chat notifications with severity filtering and deduplication;
- inline, toast, dialog, page, and silent application error modes.

Rate limiting and notification deduplication are in-memory and per application instance. Use shared storage when a deployment requires consistent behavior across multiple instances or serverless invocations.

## Internationalization

English is the default locale. Locale messages live under `i18n/locales/<locale>/`, grouped by namespace and exported from the locale's `index.ts` file. All user-facing application copy should go through `@nuxtjs/i18n`.

The URL strategy is `prefix_except_default`: the default English locale has no prefix, while additional locales receive one.

## Engineering and AI guidance

- [`AGENTS.md`](./AGENTS.md) is the canonical entry point for coding agents.
- [`.ai/rules/`](./.ai/rules/) contains mandatory engineering constraints.
- [`.ai/skills/`](./.ai/skills/) contains task-specific implementation and review procedures.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) defines application boundaries and architectural decisions.

Requirements supplied by a feature specification remain the source of truth. The AI rules describe how to implement work; they do not replace product requirements or acceptance criteria.

## License

Licensed under the [MIT License](./LICENSE).
