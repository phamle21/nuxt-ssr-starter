---
name: implement-ssr-data-fetching
description: Implement or review Nuxt SSR data fetching with useFetch, useAsyncData, or $fetch while preventing duplicate hydration requests, unstable cache keys, request-state leakage, and oversized payloads. Use for render-critical page data, async composables, caching, refresh, or SSR/client fetching decisions.
---

# Implement SSR Data Fetching

1. Classify the data as render-critical, deferred, event-driven, or client-only.
2. Use `useFetch` for standard Nuxt endpoint reads.
3. Use `useAsyncData` for a custom query function or finer control.
4. Use `$fetch` for event-driven actions and server integration calls, not top-level SSR page reads.
5. Keep async-data handlers side-effect free.
6. Give reusable wrappers stable explicit keys and consistent options for the same key.
7. Return a defined serializable value; avoid `undefined` handlers that may trigger duplicate fetches.
8. Use `pick` or `transform` to limit the Nuxt payload when appropriate.
9. Handle pending, empty, error, refresh, and success behavior explicitly.
10. Use client-only fetching only when the data is intentionally absent from initial HTML.
11. Test transformations and SSR-sensitive branching; verify rendered output when SEO depends on it.

Official references:

- https://nuxt.com/docs/4.x/getting-started/data-fetching
- https://nuxt.com/docs/4.x/api/composables/use-async-data
