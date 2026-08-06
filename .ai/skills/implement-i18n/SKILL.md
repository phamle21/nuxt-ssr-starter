---
name: implement-i18n
description: Add or update user-facing copy through @nuxtjs/i18n — externalize strings, add keys, or add a new locale — keeping English the source of truth and localized rendering SSR-safe. Use when adding or changing display text, or introducing a language.
---

# Implement i18n

1. Confirm the strings are user-facing display copy, not identifiers, logs, or provider data.
2. Read `.ai/rules/i18n.md` for the standard (module, default locale, URL strategy, file layout).
3. Add keys to the matching semantic namespace under `i18n/locales/en/`. Use lowercase namespace
   names and `camelCase` keys named by meaning, not by English wording or UI position.
4. For a new namespace, create its TypeScript file, import it explicitly in the locale `index.ts`, and
   add the matching export key. Do not use `import.meta.glob`.
5. Replace hardcoded template, component, and composable strings with `$t` / `useI18n().t`; use
   interpolation and pluralization instead of string concatenation.
6. Keep keys stable and identical across locales; do not rename a shipped key casually.
7. To add a language: register the locale in config, copy the `i18n/locales/en/` folder to
   `i18n/locales/<code>/`, translate values.
8. Ensure localized content renders during SSR; enable `hreflang`/alternates only with two or more
   locales.
9. Add project-level `DefineLocaleMessage` augmentation only when typed translation keys are enabled;
   do not create competing per-feature schemas.
10. Add tests for non-trivial formatting or pluralization; run project verification.

Do not add another i18n library or invent copy for undecided product requirements.
