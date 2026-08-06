# Asset Rules

- Keep bundled assets under `app/assets/{fonts,icons,images}` and global styles under
  `app/assets/style/`. Do not create alternative asset roots in pages, components, or features.
- Put imported images in `app/assets/images/` so Vite fingerprints them.
- Put SVG component imports in `app/assets/icons/`; use `currentColor` for reusable icons.
- Put files in `public/` only when they require stable root-relative URLs or unchanged delivery.
  Static public images and icons belong in `public/images/` and `public/icons/`.
- Keep conventional files such as favicons, crawler files, and manifests at the `public/` root.
- Import bundled assets through `@/assets/...`; never address `app/assets/` with a root URL.
- Reference public assets with root-relative URLs; never import them into application code.
- Use lowercase kebab-case filenames named by meaning rather than temporary placement.
- Prefer SVG for icons and simple vectors. Prefer WebP or AVIF for large raster images; use PNG only
  when its lossless or transparency behavior is required.
- Give meaningful images concise alternative text. Mark decorative images and icons with empty `alt`
  text or `aria-hidden="true"`; give icon-only controls an accessible name.
- Do not commit source design files, duplicate exports, unused variants, or unnecessarily large
  dimensions. Optimize assets before adding them.
- Create asset subdirectories only when they contain a real asset.
