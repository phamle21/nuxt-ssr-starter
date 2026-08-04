# Security Rules

- Keep secrets in private runtime configuration.
- Never expose private runtime config through public config, payloads, logs, or client bundles.
- Validate untrusted route params, query values, request bodies, and external responses as required.
- Do not return raw internal or provider errors to the client.
- Do not log credentials, tokens, session identifiers, or sensitive personal data.
- Treat rendered HTML, URLs, redirects, and structured data as untrusted when sourced externally.
- Preserve SSR request isolation; never store per-user data in module-level mutable state.
- Do not choose an authentication, cookie, CSRF, or validation-library strategy without project
  requirements.
