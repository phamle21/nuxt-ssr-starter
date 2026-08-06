---
name: add-error-notification-channel
description: Add or update an error notification transport such as Slack, Google Chat, or email while preserving shared filtering, deduplication, redaction, configuration, and non-blocking delivery. Use when introducing or changing an alert channel.
---

# Add Error Notification Channel

1. Read `.ai/rules/observability.md` and inspect the notification types, formatter, orchestrator,
   adapters, runtime configuration, and tests.
2. Add the transport adapter under `server/notifications/channels/`. Keep transport-specific payloads,
   headers, timeout behavior, and response validation inside the adapter.
3. Add private `runtimeConfig.errorNotify` settings with an enable switch, transport configuration,
   and optional severity threshold.
4. Register the channel once in the orchestrator without duplicating eligibility, deduplication, or
   failure handling.
5. Document non-secret environment variables in `.env.example`; never add a credential or webhook.
6. Test disabled, eligible, below-threshold, successful, and failed delivery paths.
7. Keep delivery non-blocking and prevent adapter failures from escaping into request handling.
8. Run targeted notification tests, then project verification.
