# Correctness Review

- Trace inputs through the complete affected path to observable output.
- Compare behavior with the requirement, existing contracts, and nearby established patterns.
- Check empty, null, missing, duplicate, stale, and boundary values.
- Check success, expected failure, timeout, cancellation, retry, and partial-response behavior where
  applicable.
- Verify errors preserve useful status and context without changing the public contract accidentally.
- Check asynchronous ordering, repeated actions, stale closures, and race conditions.
- Check cleanup for listeners, timers, subscriptions, and pending work.
- Confirm fallback behavior does not silently hide corruption or an upstream failure.
- Treat a concern as a finding only when a concrete failing scenario exists.
