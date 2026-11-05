---
name: code-review
description: >
  Routes code reviews by independently selected review mode and code scope. Use for functional verification, convention audits, phase gates, pre-commit review, or delegated read-only review.
argument-hint: "[mode:functional|convention|both] [scope:auto|backend|frontend|database|security|all] [target]"
---

# Code Review Router

This skill routes review requests to the appropriate review methodology and authoritative sources.

## Mode And Scope Are Independent

- Mode answers: What dimension of correctness is being evaluated?
- Scope answers: Which files or architectural layers are included?

## Modes

| Mode | Purpose | Authoritative Skill |
| :--- | :--- | :--- |
| `functional` | Verify observable behavior, edge cases, state transitions, and error recovery against the approved spec. | [functional-review](../functional-review/SKILL.md) |
| `convention` | Verify code quality, strict typing, architectural layering, zero emojis, and zero numbered comments. | [checklist](../checklist/SKILL.md) |
| `both` | Run `functional` first and `convention` second as separate, independent passes. | Load both [functional-review](../functional-review/SKILL.md) and [checklist](../checklist/SKILL.md) |

## Scopes

- `backend`: Server routes, controllers, business services, pure utilities.
- `frontend`: Client components, state management, forms, user interactions.
- `database`: Schemas, migrations, seed data, database query performance.
- `security`: Auth checks, input validation, role permissions, sensitive credentials.
- `all`: Every affected scope touched by the change.

## Severity & Blocker Classification

- Critical: System crash, security breach, data corruption, or broken primary user journey. Blocker.
- High: Missing acceptance criterion, unhandled error state, or severe convention violation. Blocker.
- Medium: Non-blocking optimization, missing doc note, or minor style inconsistency.
- Low: Informational note or cosmetic improvement.

All Critical and High findings must be resolved and re-reviewed before commit authorization.
