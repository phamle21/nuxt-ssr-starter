---
name: create-vue-component
description: Create or update Vue 3 components in a Nuxt application with typed props and emits, accessible semantics, clear presentation boundaries, focused tests, and optional Storybook coverage. Use for reusable UI components or feature-specific components, not pages or stores.
---

# Create a Vue Component

1. Inspect nearby components, styling, tests, and stories.
2. Decide whether the component is reusable UI or feature-specific; place it with related code.
3. Define a small public API with typed props, emits, and slots.
4. Use `<script setup lang="ts">` and keep business orchestration outside the component.
5. Use semantic HTML, accessible names, keyboard behavior, and visible focus states.
6. Handle meaningful visual states without hiding failures.
7. Prefer Tailwind utilities; use scoped styles or Sass only when utilities are unsuitable.
8. Add a Storybook story for reusable UI and a test for interaction or meaningful logic.
9. Run targeted tests, lint, typecheck, and the required project verification.

Avoid `any`, unnecessary watchers, copied server state, wrapper-only components, and speculative
configuration APIs.
