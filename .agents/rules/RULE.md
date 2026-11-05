# System Guardrails and Non-Negotiable Rules

## Rule 1: Zero Icons and Emojis
- Never produce, inject, or permit emojis or icons in source code, documentation, test logs, commit messages, completion reports, review findings, or conversational responses.
- Use plain text and standard GitHub-flavored Markdown only.

## Rule 2: Zero Numbered Comment Chains & Descriptive Commenting
- Never write comments formatted with chronological step numbers (such as `// 1.`, `// Step 1`, `<!-- Bước 1 -->`, `// Phase 1:` inside code routines).
- Never write trivial comments that merely restate syntax (`// Call function`, `// Check regex`).
- Comments must document technical rationale, business purpose, and algorithmic intent directly and naturally.

## Rule 3: Strict TypeScript Coding Standards
- Declare all data structures, DTOs, props, and payloads using `type` instead of `interface`.
- The `any` type is strictly forbidden. Use `unknown` with type narrowing, type guards, or validation schemas (Zod).
- All functions, methods, and exported handlers must explicitly declare their return types.
- Enforce immutability: never mutate arrays or objects directly in-place; use spread syntax (`[...arr]`, `{...obj}`). Do not use `Object.assign`.
- Use nullish coalescing (`??`) and optional chaining (`?.`) instead of logical OR (`||`) to prevent bugs with falsy values like `0` or `""`.
- Use `const` by default, `let` only when reassignment is required; never use `var`.
- Use clean barrel imports (`index.ts`) instead of deep internal relative paths.

## Rule 4: Type-Safe Persistence & DTO Derivation
- Derive query payloads and DTOs from authoritative models or Zod schemas using `Pick`, `Omit`, or `z.infer`.
- Never manually hand-copy full database model fields into duplicate parallel DTO types.
- Never expose raw database entities with sensitive internal fields to client responses; always project explicitly.

## Rule 5: Architectural Layering & Pure Utils Boundary
- Controllers and route handlers parse requests, validate input payloads, and format HTTP responses.
- Services encapsulate all business logic, domain workflows, and database transactions.
- Pure Utils (`src/utils/`) must be strictly pure and stateless: zero database access, zero API calls, zero file I/O.
- Small private helpers (1-2 lines) stay inside their caller service; extract to utils only when complex and reused.

## Rule 6: Minimal Blast Radius
- Modify only the files designated in the approved task definition.
- Never perform opportunistic refactoring outside the assigned task scope.

## Rule 7: Pre-Commit Automated Verification Gate
- Every commit must pass all verification checks (`npm run check` or `npx tsc --noEmit`) with exit code 0.
- Commits are strictly blocked if any typecheck, lint, or test failure occurs, or if any Critical/High review finding remains unresolved.
