# Nuxt Rules

- Use Nuxt 4 `app/`, `server/`, and `shared/` conventions.
- Use Vue Composition API with `<script setup lang="ts">`.
- Keep TypeScript strict; do not use `any` without a concise justification.
- Rely on Nuxt auto-imports unless an explicit import improves clarity or is required.
- Use `useFetch` or `useAsyncData` for SSR page data.
- Use `$fetch` for event-driven actions and server-side integration calls.
- Keep `useAsyncData` handlers side-effect free.
- Use stable explicit keys in reusable async-data composables.
- Account for loading, empty, error, and success states.
- Guard browser-only APIs with the appropriate client boundary.
- Never create module-level reactive state that can leak across SSR requests.
- Use Pinia or `useState` only for genuinely shared SSR-safe state.
- Use `@nuxtjs/i18n` with English as the default locale; route all user-facing copy through i18n — see `.ai/rules/i18n.md`.
