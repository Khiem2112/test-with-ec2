---
name: checklist
description: >
  Pre-commit technical, type-safety, and linting checklist. Verifies static analysis, architectural layering, strict types, and zero emoji / zero numbered comments before commit.
---

# Feature Completion & Pre-Commit Checklist

Before declaring any task complete or creating a commit, verify the implementation against these mandatory quality gates:

## Mandatory Automated Verification Gate

- Run `npm run check` (or scope-specific `npm run check:fe`, `npm run check:be`):
  - Must return exit code 0.
  - Zero TypeScript compiler errors (`tsc --noEmit`).
  - Zero linting errors.
  - All automated tests pass with exit code 0.

## Architectural Layering & Code Quality

- Controller / Route Layer:
  - Validates request payload and parameters.
  - Formats response codes and payloads.
  - Delegates all domain decisions to business services.

- Service Layer:
  - Encapsulates business logic, domain rules, and data persistence transactions.
  - Keeps side-effects explicit and contained.

- Utility Layer:
  - Pure functions only: deterministic output for given inputs, zero side effects.

- Type Safety Discipline:
  - Types defined using `type` instead of `interface`.
  - Explicit return types on all functions and exported methods.
  - Zero `any` types.

## Non-Negotiable Hygiene Audit

- Zero Icons and Emojis: Verify no icons or emojis exist in code, comments, logs, or commit messages.
- Zero Numbered Comments: Verify comments explain technical rationale directly without positional numbers.
- Minimal Blast Radius: Confirm only files declared in task scope were modified.
