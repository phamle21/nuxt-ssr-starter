# AGENTS.md — Nuxt Application Instructions

## Purpose

This file is the canonical entry point for AI coding agents (Codex, Claude, and others) working in this
Nuxt application. All commands assume the current directory is the repository root.

Detailed constraints live in `.ai/rules/` and procedures in `.ai/skills/`. This file orients and
routes; it does not restate rule content. When guidance overlaps, the linked rule is canonical.

Setup and startup commands live in [README.md](./README.md).

## Project Baseline

- Nuxt 4 with server-side rendering
- Vue 3 Composition API and `<script setup lang="ts">`
- TypeScript in strict mode
- Yarn 4 only
- Pinia for shared application state
- Tailwind CSS 4 primary; SCSS only for exceptional custom styling — see `.ai/rules/styling.md`
- Canonical image, SVG, font, and public-file placement — see `.ai/rules/assets.md`
- Oxlint and Oxfmt
- Vitest and Vue Test Utils
- Storybook for reusable UI components
- Internationalization with `@nuxtjs/i18n` — canonical conventions: `.ai/rules/i18n.md`
- Centralized error handling, structured JSON logging, and optional Slack/Google Chat alerting — see
  `.ai/rules/observability.md`

Do not introduce a library or architecture for an undecided concern without explicit approval.

## Context Loading

Before implementation:

1. Inspect the affected source, tests, and configuration.
2. Always read `.ai/rules/core.md` and `.ai/rules/git.md`.
3. Read the other relevant files under `.ai/rules/`.
4. Read the relevant project docs when they bear on the task — these business/domain `.md` docs hold
   project decisions and are a source of truth:
   - `ARCHITECTURE.md` — FE structure and boundaries
   - `DESIGN.md` — design system and tokens (when present)
5. Load the matching skill from the routing table below.
6. Ask for missing requirements only when guessing would affect behavior or architecture.

Treat requirements supplied with the task and the project docs above as the source of truth; do not
invent business rules.

## Architecture

The concrete repo structure, layer responsibilities, and data flows live in `ARCHITECTURE.md`.
Canonical dependency constraints live in `.ai/rules/architecture.md` and Nuxt implementation rules
live in `.ai/rules/nuxt.md`.

## Skill Routing

| Task | Skill |
|---|---|
| Create or change a reusable Vue component | `.ai/skills/create-vue-component/SKILL.md` |
| Create or change a Nuxt page | `.ai/skills/create-nuxt-page/SKILL.md` |
| Extract reusable stateful logic | `.ai/skills/create-composable/SKILL.md` |
| Add shared application state | `.ai/skills/create-pinia-store/SKILL.md` |
| Build a request through API layers | `.ai/skills/implement-api-flow/SKILL.md` |
| Fetch SSR page data | `.ai/skills/implement-ssr-data-fetching/SKILL.md` |
| Add or update translations or a locale | `.ai/skills/implement-i18n/SKILL.md` |
| Add or update tests | `.ai/skills/write-vitest-tests/SKILL.md` |
| Add metadata, structured data, or search discoverability | `.ai/skills/implement-seo/SKILL.md` |
| Review code, a working tree, or a proposed change | `.ai/skills/review-nuxt-code/SKILL.md` |

For assets follow `.ai/rules/assets.md`. For custom CSS/SCSS follow `.ai/rules/styling.md`. Load
multiple skills only when the task genuinely spans them.

## Commands

Use the scripts declared in `package.json`; do not duplicate or invent command names. Run scripts
with `yarn <script>` from this directory. If a consuming project provides a containerized
environment, follow that project's repository-level documentation.

Use `yarn verify:quick` during iteration. Run `yarn verify` before final handoff unless the change is
documentation-only.

## Required Agent Behavior

1. Keep changes within the requested scope.
2. Follow existing patterns before introducing a new abstraction.
3. Do not add dependencies without a clear need and explicit approval (canonical: `.ai/rules/core.md`).
4. Add or update tests for changed behavior and meaningful logic.
5. Run targeted checks, then the required verification command.
6. Review the final diff for scope, generated files, secrets, and accidental changes.
7. Report changed files, checks run, assumptions, and remaining risks.
8. Git: staging (`git add`) is permitted when the user asks; never commit, push, or perform any other
   Git mutation. Provide a commit message as text to the user only (canonical: `.ai/rules/git.md`).

Sub-agents are optional. Use them only for bounded, independent analysis or review. Avoid concurrent
edits to the same files. The main agent must perform final integrated verification.
