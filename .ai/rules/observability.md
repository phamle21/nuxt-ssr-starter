# Error Handling, Logging & Alerting Rules

Every uncaught exception — server (Nitro) or client (Vue/browser) — must be logged and, above the
threshold, alerted through one shared pipeline.

## Error groups

- **Server expected (client-caused), HTTP 4xx** — validation, not found, conflict. Return a safe error,
  log at `warn`, do **not** alert.
- **Server unexpected, HTTP 5xx / uncaught** — bugs. Safe 500, log at `error`, alert.
- **Server upstream, 502/504** — provider down/timeout. Safe error, log at `error`, alert.
- **Client runtime exceptions** — Vue render errors, `window.onerror`, unhandled rejections. No HTTP
  status; reported to the server, logged, and alerted (rate-limited).
- **Client data-fetch errors** — handled in-component via loading/empty/error/success states.

Note: a true FE *syntax* error is a build-time failure (it fails `yarn build`) and never reaches
runtime; only runtime exceptions flow through this pipeline.

## Error handling

- Throw `AppError` (`server/exceptions/app-error.ts`) for known failures with a `statusCode`, a stable
  `code`, a `severity`, and a client-safe `publicMessage`. Keep internal detail in the error `message`.
- Wrap `server/api` handlers with `defineApiHandler`; it normalizes with
  `server/exceptions/normalize-error.ts`, sets response metadata, and returns `toSafeH3Error`.
  Never leak raw provider/internal errors, messages, or stacks to the client.
- Application reads use `useAppFetch`; mutations use `useAppRequest`. Presentation remains a client
  concern and may be `inline`, `toast`, `dialog`, `page`, or `silent`.
- Server: the Nitro error plugin (`server/plugins/error.ts`) is the single place that logs and alerts
  uncaught errors. Client: `app/plugins/error-report.client.ts` forwards uncaught client errors to
  `POST /api/_error-report`, which logs and alerts through the same code. Do not duplicate alerting in
  handlers or components.

## Logging

- Log structured JSON to stdout via `logger` (`server/logging/logger.ts`), one event per line.
- Standard fields: `level`, `time`, `message`, `code`, `statusCode`, `severity`, `requestId`,
  `method`, `path`, `source` (`server` | `client`).
- Correlate with `requestId` (set by `server/middleware/request-id.ts`).
- Redaction is mandatory: never log tokens, passwords, `authorization`/`cookie` headers, session ids,
  payment data, or personal data. Extend the redact list in `server/logging/redact.ts`; never bypass
  it.
- Do not log full external DTOs or responses that may contain sensitive data.

## Alerting (Slack / Google Chat / future channels)

- Alerts go through `notifyError` (`server/notifications/notify-error.ts`), configured via
  `runtimeConfig.errorNotify`.
- **Master switch** `errorNotify.enabled` turns all alerting on/off.
- **Each channel has its own `enabled` toggle and webhook**; a channel fires only when enabled AND its
  webhook is set. Multiple channels can be active at once — an error goes to every eligible channel.
- Threshold: a channel uses its own `minSeverity` when set, else the global `errorNotify.minSeverity`
  (default `error`). Do not page on expected 4xx.
- **Deduplication**: identical alerts are suppressed per channel within `dedupWindowSeconds`
  (default 300) to prevent floods. In-memory/per-instance — on serverless it dedupes per instance
  only.
- Alerting is non-blocking and must never throw into the request path.
- Never commit a webhook URL; set it via `NUXT_ERROR_NOTIFY_<CHANNEL>_WEBHOOK_URL` (secret,
  server-only). Keep payloads free of secrets and personal data.

### Adding a channel (e.g. Gmail/email)

1. Add an adapter under `server/notifications/channels/` (email uses a different transport than a
   webhook — that stays inside the adapter).
2. Add a matching key with an `enabled` toggle and its transport config to `runtimeConfig.errorNotify`.
3. Document the env vars in `.env.example`.

## Client error endpoint

- `POST /api/_error-report` is public, so it is guarded: per-IP fixed-window rate limit, payload size
  caps, and the shared dedup. It never trusts client input beyond logging strings.
- `errorReporting.trustProxy` is `false` by default. Enable it only behind a trusted reverse proxy
  that overwrites `X-Forwarded-For`.

## Known follow-ups (not yet implemented)

- Persist dedup/rate-limit in shared storage (e.g. KV) for correct behavior across instances.
- The in-memory rate limiter evicts the oldest entry at its capacity, so high client-key cardinality
  can reduce rate-limit accuracy.
- Consider authenticating or signing client reports if abuse volume becomes a problem.
