# Asset Rules

## Canonical layout

```text
app/assets/
├── fonts/       # Fonts bundled by Vite
├── icons/       # SVG files imported as Vue components
├── images/      # Images imported by application code
└── style/       # Global CSS, SCSS, and design tokens

public/
├── icons/       # Static icons referenced by stable public URLs
├── images/      # Static images referenced by stable public URLs
├── favicon.ico
├── robots.txt   # When required
└── site.webmanifest # When required
```

Do not create alternative asset directories inside pages, components, features, or the project root.

## Placement

- Put an image in `app/assets/images/` when application code imports it and Vite should fingerprint
  and bundle it.
- Put an SVG in `app/assets/icons/` when it is imported as a Vue component through
  `vite-svg-loader`, needs CSS-driven color, or accepts component classes and attributes.
- Put a file in `public/` only when it needs a stable root-relative URL or must be served unchanged.
- Put static public images and icons in their matching `public/images/` or `public/icons/` directory.
- Keep favicons, crawler files, and web manifests at the `public/` root when their conventions require
  it.
- Put fonts in `app/assets/fonts/` and declare them from the canonical global stylesheet.
- Put CSS, SCSS, and design tokens under `app/assets/style/`; follow `styling.md` for their layout.

## Usage

Import bundled assets instead of constructing paths dynamically:

```vue
<script setup lang="ts">
import LogoIcon from '@/assets/icons/logo.svg'
import heroImage from '@/assets/images/hero.webp'
</script>

<template>
  <LogoIcon class="size-6 text-current" aria-hidden="true" />
  <img :src="heroImage" alt="" />
  <img src="/images/product-placeholder.webp" alt="" />
</template>
```

- Do not reference `app/assets/` with a root-relative URL.
- Do not import files from `public/`; reference them with a root-relative URL.
- Use `currentColor` in reusable SVG icons so callers can control color with CSS.
- Decorative images and icons use an empty `alt` or `aria-hidden="true"`. Meaningful images require
  concise alternative text; interactive icons require an accessible name on their control.

## Naming and formats

- Use lowercase kebab-case filenames such as `checkout-empty-state.webp` and `arrow-left.svg`.
- Name files by meaning, not by temporary placement such as `banner-1` or `left-icon`.
- Prefer SVG for icons and simple vector artwork.
- Prefer WebP or AVIF for photographs and large raster artwork; use PNG only when its lossless or
  transparency behavior is required.
- Do not commit source design files, duplicate exports, or unused asset variants.
- Optimize assets before committing them and keep each asset at the smallest dimensions needed by
  the product.
