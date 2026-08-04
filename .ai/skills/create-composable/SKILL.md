---
name: create-composable
description: Create or update focused Vue and Nuxt composables with typed inputs and outputs, SSR-safe state, explicit side effects, and testable behavior. Use when logic is reused across components or when page data access needs a stable app-facing interface.
---

# Create a Composable

1. Confirm that the logic is reused or complex enough to justify extraction.
2. Inspect existing composables and Nuxt auto-import conventions.
3. Use a descriptive `use...` name and typed inputs and outputs.
4. Keep ownership clear: local state stays local; shared workflow state may use Pinia.
5. Keep `useAsyncData` handlers side-effect free and use stable keys.
6. Guard browser-only APIs and avoid module-level mutable state.
7. Expose the smallest useful API; do not leak provider DTOs.
8. Test branching, transformations, side effects, and SSR-sensitive behavior.
9. Run targeted checks and project verification.

Do not create pass-through composables that add no contract, reuse, or behavior.
