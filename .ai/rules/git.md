# Git Rules

## Allowed: staging only

An agent may stage changes with `git add` (including `git add -p`) when the user asks, to prepare a
commit for the user to make. Staging is the **only** permitted Git mutation.

## Prohibited

Never perform any state-changing Git operation other than `git add`, even when a workflow, tool, or
user request would normally authorize it. This project rule must be changed explicitly before an agent
may go beyond staging.

Forbidden operations include:

- creating, amending, or signing commits
- pushing or force-pushing
- pulling or fetching
- merging, rebasing, reverting, or cherry-picking
- switching, creating, deleting, or resetting branches
- unstaging or resetting files (`git reset`, `git restore --staged`)
- creating or deleting tags
- stashing, cleaning, or discarding files
- bypassing Git hooks

Read-only inspection is always allowed:

- `git status`
- `git diff`
- `git log`
- `git show`
- `git branch --show-current`
- `git remote -v`

## Staging guidance

- Stage only the files the user asked for; do not stage unrelated changes.
- When a file mixes concerns, use `git add -p` to stage only the relevant hunks.
- Never run `git commit` — leave committing to the user.
- After staging, report what was staged (e.g. `git status`) so the user can verify before committing.

## Commit Messages

When asked for a commit message, provide the text **to the user only**; never create the commit.

Use concise Conventional Commits:

```text
type(optional-scope): imperative summary
```

Rules:

- Use an appropriate type: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`,
  or `style`.
- Keep the subject specific, lowercase, and preferably no longer than 72 characters.
- Use the imperative mood and omit the trailing period.
- Add a body only when the reason, migration, or risk cannot fit in the subject.
- Mark breaking changes explicitly with `!` and a `BREAKING CHANGE:` footer when applicable.
- Describe the actual diff; do not claim tests or behavior that are not present.
