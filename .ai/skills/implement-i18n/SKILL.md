---
name: implement-i18n
description: Add or update user-facing copy through @nuxtjs/i18n — externalize strings, add keys, or add a new locale — keeping English the source of truth and localized rendering SSR-safe. Use when adding or changing display text, or introducing a language.
---

# Implement i18n

1. Confirm the strings are user-facing display copy, not identifiers, logs, or provider data.
2. Read `.ai/rules/i18n.md` for the standard (module, default locale, URL strategy, file layout).
3. Add keys to the matching namespace file `i18n/locales/en/<namespace>.ts` (create it and register it
   in `i18n/locales/en/index.ts` if the namespace is new); English is the source of truth.
4. Replace hardcoded template, component, and composable strings with `$t` / `useI18n().t`; use
   interpolation and pluralization instead of string concatenation.
5. Keep keys stable and identical across locales; do not rename a shipped key casually.
6. To add a language: register the locale in config, copy the `i18n/locales/en/` folder to
   `i18n/locales/<code>/`, translate values.
7. Ensure localized content renders during SSR; enable `hreflang`/alternates only with two or more
   locales.
8. Add tests for non-trivial formatting or pluralization; run project verification.

Do not add another i18n library or invent copy for undecided product requirements.
