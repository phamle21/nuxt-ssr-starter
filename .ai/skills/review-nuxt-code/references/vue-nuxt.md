# Vue and Nuxt Review

- Verify components use typed props, emits, and slots with a small public API.
- Check computed values are derived rather than duplicated into mutable state.
- Check watchers are necessary, scoped, and free from loops or stale asynchronous writes.
- Verify composables have clear ownership and do not create hidden global state.
- Check pages focus on route composition, data orchestration, metadata, and view states.
- Verify browser-safe code stays in `app/` and server-only code stays in `server/`.
- Check Nitro handlers remain thin and external DTOs are mapped before reaching application UI.
- Verify loading, empty, not-found, error, and success states where applicable.
- Check auto-import assumptions against Nuxt configuration and generated types.
- Reject abstractions that add indirection without responsibility, reuse, or a stable contract.
