# Project Agent Guidance: Autonomous Multi-Agent Development Pipeline

## 1. Project Overview & Operational Mandate

This workspace serves as Mock Project 1 (proj-1) under the AutoFlow framework. It is specifically configured for practicing end-to-end autonomous multi-agent software engineering:
- Autonomous Design: Transforming high-level ideas into approved behavioral flows, UI contracts, technical specifications, and phase-gated implementation plans.
- Autonomous Implementation: Executing atomic tasks bounded strictly to assigned checklists with zero collateral edits and strict convention enforcement.
- Autonomous Review & Verification: Conducting independent dual-pass reviews (Functional and Convention), remediating findings, verifying automated pre-commit gates, and executing safe git commits.

## 2. Non-Negotiable Engineering Constraints

- Zero Icons and Emojis: Source code, documentation, test logs, commit messages, and agent communication must never contain icons or emojis.
- Zero Numbered Comments: Comments in code must describe technical rationale, architectural intent, or operational logic directly. Positional step chains (such as // 1., // Step 1, // Buoc 1) and trivial comments (such as // Call API) are strictly prohibited.
- Strict TypeScript Standards (.agents/skills/typescript/SKILL.md):
  - Always use `type` instead of `interface` for props, state, payloads, and object shapes.
  - Zero `any`: The `any` type is strictly forbidden. Use `unknown` with type guards, discriminated unions, or Zod schemas.
  - Explicit return types: Every exported function, service, controller, and handler must declare an explicit return type.
  - Immutability: Never mutate objects or arrays in-place; use spread syntax (`[...arr]`, `{...obj}`). Do not use `Object.assign`.
  - Nullish coalescing: Use `??` and `?.` instead of `||` to prevent falsy value bugs (`0`, `""`).
  - No `var`: Use `const` by default, `let` only for reassignment.
  - Clean imports: Use barrel files (`index.ts`) instead of deep relative internal paths.
  - Persistence & DTO safety: Derive query payloads and DTOs using `Pick`, `Omit`, or `z.infer`. Never manually duplicate Prisma model fields into redundant DTOs. Never expose sensitive internal fields to client projections.
- Architectural Layering (.agents/rules/RULE.md):
  - Controllers parse requests, validate input schemas, and format HTTP responses.
  - Services encapsulate business logic, domain rules, and database transactions.
  - Pure Utils (`src/utils/`) must be stateless with zero database calls, zero API calls, and zero file I/O.
- Minimal Blast Radius: Modify only files explicitly designated in the approved task definition. Opportunistic refactoring outside task boundaries is forbidden.
- Hard Pre-Commit Verification Gate: Every commit requires all automated checks (`npx tsc --noEmit` and `npm run check`) to exit with code 0.

## 3. Autonomous Multi-Agent Architecture

The engineering lifecycle is operated by four specialized agent roles:

| Role | Agent Definition | Model Tier | Workspace Mode | Primary Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| Orchestrator | .agents/agents/orchestrator.md | Gemini 3.8 Flash (High) / Pro | inherit | Overall lifecycle coordination, design governance, task breakdown, subagent dispatching, and gate authorization. |
| Task Implementer | .agents/agents/task-implementer.md | Gemini 3.8 Flash (High) / Pro | branch / inherit | Bounded code implementation, atomic checklist completion, and generation of Code Completion Reports. |
| Task Reviewer | .agents/agents/task-reviewer.md | Pro | inherit | Independent dual-pass code review (Pass A Functional, Pass B Convention) and blocker sign-off. |
| Task Tester | .agents/agents/task-tester.md | Gemini 3.8 Flash | inherit | Automated execution of lint, typecheck, unit tests, and verbatim reporting of exit codes. |

Subagent Guardrails:
- Maximum concurrency: 2 to 3 worker subagents concurrently.
- Maximum hierarchy depth: Exactly 1 (leaf workers must never spawn child subagents).
- Isolation: Use Workspace branch (Git worktree isolation) when multiple workers touch the codebase concurrently.

## 4. End-to-End Lifecycle Stages

### Stage 1: Autonomous Design
Governed by .agents/skills/feature-delivery-workflow/SKILL.md:
1. Operational Flow: Draft implementation-neutral user/operator journey at docs/<feature>/flows/v1.md using docs/templates/flow-v1.md. Requires explicit approval.
2. UI Design Contract: Define surface inventory, responsive layout, and interaction patterns at docs/<feature>/designs/v1.md using docs/templates/ui-design-v1.md. Requires explicit approval.
3. Technical Specification: Map flows to domain entities, database schemas, API contracts, and file changes at docs/<feature>/specs/v1.md using docs/templates/spec-v1.md. Requires explicit approval.
4. Implementation Plan & Task Breakdown: Translate approved specs into bounded phases at docs/<feature>/implementation-plans/v1.md using docs/templates/implementation-plan-v1.md. Extract atomic tasks into task/TASK-<id>-<name>.md using .agents/skills/task-runner/templates/task.md.

### Stage 2: Autonomous Implementation
Governed by .agents/skills/task-runner/SKILL.md:
1. Select the next pending task from task/.
2. Check reuse-first precedents before creating new abstractions.
3. Implement code bounded strictly to task target files.
4. Run intermediate verification checks.
5. Generate Code Completion Report using .agents/skills/task-runner/templates/code-completion.md.

### Stage 3: Autonomous Review, Remediation & Commit Gate
Governed by .agents/skills/code-review/SKILL.md:
1. Pass A - Functional Review: Verify code implementation directly against task acceptance criteria, input boundaries, and error recovery using .agents/skills/functional-review/SKILL.md.
2. Pass B - Convention Review: Audit architectural layering, strict types, and zero emoji / zero numbered comment rules using .agents/skills/checklist/SKILL.md.
3. Blocker Policy: Critical and High findings are hard blockers. The implementer must remediate and trigger re-review.
4. Pre-Commit Verification Gate: Execute npm run check (or npm run check:fe and npm run check:be). All checks must exit with code 0.
5. Safe Commit: Stage specific touched files and commit using Conventional Commits format with plain text only.

## 5. Skill Loading Policy

Do not load all skills at startup. Load the minimal relevant subset on demand:
- Product flow and discovery: ecommerce-operations-flow, jtbd-framing, journey-mapping, information-architecture.
- Technical implementation: feature-delivery-workflow, task-runner, reuse-first, typescript, db-conventions.
- Review and verification: code-review, functional-review, checklist.
- Ambiguous requirements: implement-qa (write questions to QA/QA-<task-id>.md and await user confirmation).

## 6. Command Approval & Security Policy

Follow the provider-neutral execution policy in .agents/rules/command-whitelist.md.
Allowlisted commands (npm run check, npm run lint, tsc --noEmit, git status, git diff) execute without prompting. Commands outside the whitelist require user approval.

