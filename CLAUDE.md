# Claude Agent Guidance

Refer to AGENTS.md for the authoritative multi-agent SDLC standards, role boundaries, and execution rules.

## Core Directives

- Zero icons and emojis: Never use icons or emojis in code, comments, commit messages, or reviews.
- Zero numbered comments: Document technical logic directly without positional step numbers or trivial syntax restatements.
- Strict TypeScript standards:
  - Always `type` instead of `interface`.
  - Zero `any`: use `unknown` + type narrowing or validation schemas.
  - Explicit return types on all exported functions, services, and handlers.
  - Enforce immutability with spread syntax; do not use `Object.assign`.
  - Use `??` and `?.` instead of `||`.
  - Use `const` by default; no `var`.
  - Pure utils only in `src/utils/` (no DB, no API, no file I/O).
- Pre-commit verification: Always run `npm run check` or `npx tsc --noEmit` before committing; exit code 0 is mandatory.
- Spec-first development: Always require an approved flow and spec in docs/ before coding non-trivial features.
- Review gates: Perform dual-pass review (Functional and Convention) on all completed tasks.

