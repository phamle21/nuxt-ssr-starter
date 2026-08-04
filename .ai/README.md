# AI Instructions

`AGENTS.md` is the canonical entry point. This directory contains context loaded on demand:

- `rules/`: mandatory engineering constraints
- `skills/`: focused procedures for repeatable Nuxt tasks

Do not duplicate rules between files. Link to the canonical rule instead.

The canonical skills live only in `.ai/skills/`. Agent-specific discovery and configuration stay
outside the project structure. Do not copy or link skill content into vendor-specific directories.
