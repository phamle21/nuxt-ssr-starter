---
name: review-nuxt-code
description: Review Nuxt, Vue, TypeScript, Nitro, SSR, SEO, accessibility, security, performance, and tests for evidence-backed defects and production risks. Use when asked to review code, inspect a diff or working tree, assess a pull request, perform a quality audit, or identify regressions without implementing fixes.
---

# Review Nuxt Code

## Review Process

1. Establish the requested scope, expected behavior, and available evidence.
2. Inspect the changed code and the smallest surrounding execution path.
3. Read project rules, configuration, and relevant tests before judging a pattern.
4. Load only the reference files relevant to the affected layers.
5. Run read-only checks or targeted tests when they materially verify a suspected defect.
6. Report confirmed findings before summaries or optional improvements.
7. Do not modify code unless implementation is explicitly requested.
8. Never perform a state-changing Git operation.

## Reference Routing

- Read [correctness.md](references/correctness.md) for behavior, edge cases, and error handling.
- Read [vue-nuxt.md](references/vue-nuxt.md) for Vue, Nuxt, reactivity, and layer conventions.
- Read [ssr-hydration.md](references/ssr-hydration.md) for universal rendering and request isolation.
- Read [accessibility.md](references/accessibility.md) for semantic and interaction review.
- Read [security.md](references/security.md) for trust boundaries and sensitive data.
- Read [seo-i18n.md](references/seo-i18n.md) for metadata, crawlability, and localized pages.
- Read [performance.md](references/performance.md) for payload, rendering, and network costs.
- Read [testing.md](references/testing.md) for coverage quality and regression protection.

Do not load every reference when the change affects only one or two areas.

## Finding Standard

Report each finding with:

- severity: `Critical`, `High`, `Medium`, or `Low`
- exact file and line
- concrete failure mode or production impact
- evidence from the execution path, test, or configuration
- the smallest safe fix direction

Do not report personal style preferences, speculative risks without a plausible path, or issues
already prevented by existing code. Separate questions and optional improvements from defects.

If no findings remain after verification, say so and list only meaningful residual test gaps or
assumptions.
