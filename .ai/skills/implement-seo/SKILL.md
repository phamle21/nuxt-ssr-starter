---
name: implement-seo
description: Implement or review SSR SEO, semantic content, social metadata, canonical and multilingual signals, structured data, crawlability, and AI-search discoverability in Nuxt. Use for page metadata, indexing controls, schema markup, sitemap or robots work, content discoverability, and technical SEO reviews.
---

# Implement SEO

## Establish Page Intent

1. Confirm the page purpose, indexability, canonical URL, locale variants, and visible primary content.
2. Ensure important content is available in server-rendered HTML and usable without client-only
   execution.
3. Use one descriptive page title, meta description, primary heading, and semantic landmarks.

## Add Metadata

1. Use `useSeoMeta` for typed standard and social metadata.
2. Use `useHead` for canonical, alternate, and other link elements.
3. Derive metadata from the same trusted content shown on the page.
4. Add `hreflang` only after locale URLs and fallback behavior are defined.
5. Add robots or sitemap configuration only after public base URL and indexing policy are known.

## Add Structured Data

- Prefer JSON-LD and use the most specific supported type.
- Make structured data accurately match visible page content.
- Include required properties and only truthful recommended properties.
- Keep referenced URLs and images crawlable.
- Do not add ratings, reviews, authorship, availability, or other facts that are not real.

## Support AI Discoverability

- Apply the same technical foundation used for search: crawlable SSR HTML, strong internal links,
  clear entities, useful original text, accurate media, and truthful structured data.
- Prefer direct answers, descriptive headings, and explicit relationships when they help users.
- Do not keyword-stuff, generate thin pages, hide text, or create unsupported schema.
- Do not add `llms.txt`, AI-specific markup, or a new SEO module by default. No special file or
  schema is required for Google AI search features.

## Validate

- Inspect rendered HTML, not only client DOM.
- Check title, description, canonical, locale alternates, robots directives, and JSON-LD.
- Validate structured data with the applicable official tool.
- Run typecheck, tests, build, and project verification.

Official references:

- https://nuxt.com/docs/4.x/getting-started/seo-meta
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites
