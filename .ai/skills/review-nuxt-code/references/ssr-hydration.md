# SSR and Hydration Review

- Check render-critical data is available during SSR.
- Prefer `useFetch` or `useAsyncData` over top-level `$fetch` in universal setup code.
- Verify async-data handlers return defined serializable values and remain side-effect free.
- Check reusable async-data keys are stable and options remain consistent for shared keys.
- Check browser APIs are guarded from server execution.
- Reject mutable module-level user or request state that can leak between SSR requests.
- Check server and client render deterministic initial markup.
- Look for time, random, locale, viewport, storage, or DOM values that differ during hydration.
- Confirm client-only rendering is intentional and does not remove important SEO content.
- Check serialized payload size, sensitive fields, and non-JSON values at server-route boundaries.
