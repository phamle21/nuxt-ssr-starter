# Error Handling, Logging, and Alerting Rules

- Return client-safe errors through `AppError`, `defineApiHandler`, and the shared API error contract.
  Never expose raw provider messages, internal messages, or stacks.
- Give known failures a stable `code`, HTTP `statusCode`, `severity`, and safe `publicMessage`; keep
  diagnostic detail in the internal error message and cause.
- Treat expected 4xx failures as `warn` and do not alert. Treat unexpected 5xx and upstream 502/504
  failures as `error` and alert when notification configuration enables it.
- Keep server error logging and alerting centralized in `server/plugins/error.ts`; do not duplicate
  alerts in handlers or components.
- Handle data-fetch errors at their UI boundary. Route global mutation presentation through the
  supported `inline`, `toast`, `dialog`, `page`, or `silent` policy.
- Write one structured JSON log event per line with the standard context fields: `level`, `time`,
  `message`, `code`, `statusCode`, `severity`, `requestId`, `method`, `path`, and `source`.
- Correlate request logs with the request ID created by `server/middleware/request-id.ts`.
- Redact credentials, authorization and cookie headers, tokens, session identifiers, payment data,
  and personal data. Extend `server/logging/redact.ts`; never bypass redaction or log full external
  DTOs.
- Keep alerting non-blocking and prevent notification failures from reaching the request path.
- Require both the global switch and a channel switch plus transport configuration before sending an
  alert. Apply the configured severity threshold and per-channel deduplication.
- Keep notification payloads free of secrets and personal data. Never commit webhook URLs.
- Guard the public client-error endpoint with payload limits, per-IP rate limiting, and deduplication.
- Trust `X-Forwarded-For` only behind a trusted proxy that overwrites it.
- Treat the current rate limiter and deduplication as in-memory, per-instance safeguards, not as
  distributed guarantees. Use shared storage when cross-instance accuracy is required.
- Follow `.ai/skills/add-error-notification-channel/SKILL.md` when adding a notification channel.
