# Security Review

- Check secrets remain in private runtime configuration and server-only code.
- Trace untrusted params, query values, bodies, headers, cookies, URLs, HTML, and external responses.
- Verify input validation occurs at the appropriate boundary.
- Reject raw internal or provider errors exposed to clients.
- Check logs for tokens, credentials, session identifiers, and personal data.
- Review `v-html`, redirects, dynamic links, structured data, and script injection carefully.
- Verify forwarded headers and cookies use an explicit allowlist.
- Check authorization at the server boundary rather than only in UI state.
- Verify per-request state cannot leak through module-level mutable values.
- Do not infer an authentication or CSRF policy that the project has not selected.
