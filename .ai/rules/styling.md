# Styling Rules

## Approach

- Tailwind CSS 4 is the primary styling tool. Compose utilities in the template for almost everything.
- Reach for custom CSS/SCSS only for cases Tailwind cannot express cleanly. Sass is available for
  these exceptional cases (`sass` is already a dev dependency).
- Do not add another CSS framework or UI/component library without explicit approval.

## Design tokens

- Define shared design decisions (color, spacing, radius, typography, breakpoints) as Tailwind theme
  tokens via `@theme`, in `app/assets/style/tokens.css`.
- The token file stays **CSS, not SCSS**: `@theme` is a Tailwind feature consumed by the Tailwind
  compiler to generate utilities and CSS variables. Never author tokens as Sass variables — Tailwind
  cannot read those, and SCSS variables do not survive to runtime.
- Consume tokens through Tailwind utilities or the generated CSS variables. Do not hardcode raw
  hex/rgb or magic pixel values when a token exists.
- Add a token before repeating a raw value across components.

## File layout (chốt)

```text
app/assets/style/
├── tailwind.css     # entry (pure CSS): @import 'tailwindcss'; @import './tokens.css';
├── tokens.css       # @theme { ... } — nguồn design token, CSS
├── base.scss        # optional: reset/base element styles; KHÔNG chứa directive Tailwind
└── _mixins.scss     # optional: breakpoint mixins/functions mirror theme Tailwind
```

- `tailwind.css` và `tokens.css` là CSS thuần, do Tailwind xử lý.
- `base.scss` (nếu có) nạp qua `nuxt.config.ts` `css: [...]`, giữ tối thiểu.
- Dùng mixin trong component: `<style lang="scss" scoped>@use '@/assets/style/mixins' as *;</style>`.

## Tailwind vs SCSS — when to use which

Use Tailwind utilities for layout, spacing, color, typography, state variants, and responsive. This is
the default.

Reach for scoped SCSS only when:

- selector logic Tailwind cannot express cleanly (structural/pseudo combinations, or styling markup you
  do not control such as CMS/prose output);
- keyframes/animations beyond utility scope;
- a small set of component-internal rules that would otherwise be unreadable utility soup.

Prefer extracting a component or adding a token over `@apply`. Use `@apply` sparingly; never use it to
recreate a whole component's styling.

```vue
<!-- Good: utilities in template, scoped SCSS only for what Tailwind can't do -->
<template>
  <article class="prose max-w-none">
    <slot />
  </article>
</template>

<style lang="scss" scoped>
// Styling CMS HTML we don't control the markup of.
:deep(figure figcaption) {
  font-style: italic;
}
</style>
```

## Structure

- Global entry `app/assets/style/tailwind.css` holds the Tailwind import and `@theme` tokens only.
  Keep it pure CSS. Do **not** run Tailwind directives (`@import 'tailwindcss'`, `@theme`, `@apply`)
  through the Sass compiler — they are Tailwind features, not Sass.
- Global SCSS partials (reset/base/mixins/functions) live under `app/assets/style/` as `.scss` and must
  not contain Tailwind directives. Keep them minimal.
- Component-local styles go in `<style lang="scss" scoped>` inside the SFC. Default to `scoped`; use
  `:deep()` deliberately, not as a way to leak global styles.
- No unscoped global class rules authored from a component. No inline `style` attribute except for
  dynamic runtime values (computed bindings).

## Responsive

- Mobile-first: define base styles, then layer breakpoints up (`sm md lg xl 2xl`).
- Prefer Tailwind responsive prefixes in templates over hand-written media queries.
- In scoped SCSS, use breakpoint values/mixins that mirror the Tailwind theme so both stay in sync.
  Do not invent divergent breakpoints.

## Theming (light/dark)

- Drive theming through tokens/CSS variables switched by `prefers-color-scheme` and/or a `data-theme`
  attribute on the root element.
- Do not branch colors with ad-hoc conditional classes when a token or variable expresses it.

## Constraints

- Keep specificity low; rely on `scoped`. Do not use `!important` to override utilities.
- Do not fight Tailwind by overriding its utility output with global CSS.
- Remove dead styles; keep necessary custom CSS short and local.
