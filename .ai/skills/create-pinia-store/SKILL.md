---
name: create-pinia-store
description: Create or update typed Pinia stores for state shared across views or multi-step workflows, with SSR request isolation, explicit actions, reset behavior, and focused tests. Use only when local component state, a composable, or Nuxt async data is insufficient.
---

# Create a Pinia Store

1. Confirm why the state must be shared or persist across views.
2. Inspect existing stores and naming conventions.
3. Define a narrow typed state model, derived getters, and action-based mutations.
4. Keep external transport and raw DTOs outside the store.
5. Avoid copying server data into a store without a lifecycle or invalidation need.
6. Keep state serializable and safe across SSR requests.
7. Define reset and cleanup behavior for user- or workflow-scoped state.
8. Test actions, getters, state transitions, and reset behavior.
9. Run targeted checks and project verification.
