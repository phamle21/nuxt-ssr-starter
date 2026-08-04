---
name: create-nuxt-page
description: Create or update Nuxt 4 file-based pages that render correctly with SSR, compose reusable components, load data through project boundaries, expose accurate SEO metadata, and handle route states. Use for new routes, dynamic pages, or page-level changes.
---

# Create a Nuxt Page

1. Inspect adjacent routes, layouts, middleware, and page tests.
2. Confirm the route shape, parameters, rendering requirement, and expected states.
3. Keep the page focused on route composition, data orchestration, metadata, and view selection.
4. Use an app composable for reusable fetching or stateful behavior.
5. Render important content during SSR unless the requirement is explicitly client-only.
6. Handle loading, empty, not-found, error, and success states as applicable.
7. Set accurate title, description, canonical, social metadata, and structured data when requirements
   are available.
8. Keep the heading hierarchy and landmark structure semantic.
9. Add focused tests and run project verification.

Do not invent locale routing, metadata copy, canonical rules, or business behavior.
