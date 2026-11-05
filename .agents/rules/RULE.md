# System Guardrails and Non-Negotiable Rules

## Rule 1: Zero Icons and Emojis
- Never produce, inject, or permit emojis or icons in source code, documentation, test logs, commit messages, completion reports, review findings, or conversational responses.
- Use plain text and standard GitHub-flavored Markdown only.

## Rule 2: Zero Numbered Comment Chains
- Never write comments formatted with chronological step numbers (such as `// 1.`, `// Step 1`, `<!-- Bước 1 -->`, `// Phase 1:` inside code routines).
- Comments must document technical rationale, architectural intent, or operational logic directly and naturally.

## Rule 3: Strict TypeScript Standards
- Declare data models using `type` instead of `interface`.
- Functions and methods must have explicit return types.
- The `any` type is forbidden. Use `unknown` with type guards or discriminated unions.

## Rule 4: Minimal Blast Radius
- Modify only the files designated in the approved task definition.
- Never perform opportunistic refactoring outside the assigned scope.

## Rule 5: Pre-Commit Automated Verification Gate
- Every commit must pass all verification checks (`npm run check`) with exit code 0.
- Commits are strictly blocked if any typecheck, lint, or test failure occurs, or if any Critical/High review finding remains unresolved.
