# Performance Review

- Check duplicate network requests, sequential requests that can run concurrently, and request loops.
- Look for oversized SSR payloads and fields serialized but never rendered.
- Check unnecessary deep reactivity, broad watchers, and duplicated server state.
- Verify large or browser-only dependencies do not enter the initial server or client bundle needlessly.
- Check expensive computations are not repeated during every render.
- Review list keys, conditional mounting, and component boundaries for avoidable rerenders.
- Check image dimensions, formats, loading priority, and layout stability where images changed.
- Verify cache behavior is explicit and safe for locale, authentication, and user-specific data.
- Report measured or clearly demonstrable regressions; keep speculative micro-optimizations optional.
