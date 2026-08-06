# Styling Rules

- Use Tailwind CSS 4 as the primary styling system. Do not add another CSS framework or component
  library without explicit approval.
- Use Tailwind utilities for layout, spacing, color, typography, state, and responsive behavior.
- Define shared design decisions in `app/assets/style/tokens.css` with `@theme inline` and consume
  them through semantic utilities or generated variables.
- Keep `tailwind.css` and `tokens.css` as plain CSS. Never run Tailwind directives through Sass.
- Do not hardcode raw colors or repeat magic values when a semantic token exists; add a token when a
  design decision becomes shared.
- Keep global style files under `app/assets/style/`. Load optional global styles explicitly from
  `nuxt.config.ts`.
- Use scoped SCSS only for selector logic, controlled third-party markup, or animation that Tailwind
  cannot express clearly. Do not introduce SCSS files before such a need exists.
- Keep component styles scoped. Use `:deep()` deliberately and never leak global component classes.
- Do not use inline styles except for values computed at runtime.
- Prefer mobile-first Tailwind responsive variants. Custom breakpoints must match the Tailwind theme.
- Drive light/dark themes through semantic tokens and CSS variables, not ad-hoc conditional colors.
- Keep specificity low; do not use `!important` to override utilities or use `@apply` to recreate
  whole components.
- Remove dead styles and unused style dependencies.
