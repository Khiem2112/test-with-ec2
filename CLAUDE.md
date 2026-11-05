# Claude Agent Guidance

Refer to AGENTS.md for the authoritative multi-agent SDLC standards, role boundaries, and execution rules.

## Core Directives

- Zero icons and emojis: Never use icons or emojis in code, comments, commit messages, or reviews.
- Zero numbered comments: Document technical logic directly without positional step numbers.
- Pre-commit verification: Always run npm run check before committing; code 0 is mandatory.
- Spec-first development: Always require an approved flow and spec in docs/ before coding non-trivial features.
- Review gates: Perform dual-pass review (Functional and Convention) on all completed tasks.
