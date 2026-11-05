---
name: feature-delivery-workflow
description: >
  Orchestrates autonomous application delivery through approved UX flow, UI
  design, technical specification, phase-gated implementation, review, fixes,
  and re-review. Use for new or materially changed journeys; skip it for
  behavior-preserving fixes and small visual-only refinements.
---

# Feature Delivery Workflow

This skill is the lifecycle router. It orchestrates the entire engineering sequence from design through implementation and review. Load the minimal referenced skills needed for each stage.

## Authority Order

1. Current user request and explicit decisions.
2. Approved feature flow plus all later approved flow diffs (`docs/<feature>/flows/`).
3. Approved feature UI design plus all later approved design diffs (`docs/<feature>/designs/`).
4. Approved feature specification plus all later approved spec diffs (`docs/<feature>/specs/`).
5. Implementation plan and task breakdown (`docs/<feature>/implementation-plans/` and `task/`).
6. Applicable implementation and review skills routed by `AGENTS.md`.

## Stage 0: Classify The Change

A new flow/spec cycle is required when the request changes an actor, entry point, decision, durable state, consequential action, permission, recovery path, business rule, or acceptance criterion.

Do not require a new cycle for:
- a behavior-preserving defect fix;
- a spacing, contrast, or responsive refinement that changes no behavior;
- an internal refactor that preserves public contracts and observable outcomes.

If a material requirement is ambiguous, use `implement-qa` and halt only the work that depends on the unanswered decision.

## Stage 1: Operational Flow

1. Load `ecommerce-operations-flow` or applicable domain flow skill.
2. Use JTBD, journey mapping, and information architecture when discovery is needed.
3. Create `docs/<feature>/flows/v1.md` from `docs/templates/flow-v1.md`, or a delta-only `v<N>-diff.md` for a later material revision.
4. Keep the document implementation-neutral. Do not choose component classes, endpoints, database fields, or library APIs here.
5. Mark it `In review` with `Approval: Pending`.
6. Do not advance to binding technical specifications or code until the flow approval record is explicit.

## Stage 2: UI Design Contract

After flow approval:
1. For user-facing surfaces, create `docs/<feature>/designs/v1.md` from `docs/templates/ui-design-v1.md`.
2. Inspect existing UI precedents before claiming reuse. Define desktop and mobile layout, state placement, action hierarchy, navigation, and recovery behavior.
3. Mark the design `In review` and block technical implementation until approval is recorded. Backend-only features record `Not applicable` in the spec.

## Stage 3: Technical Specification

After required flow and design approval:
1. Create `docs/<feature>/specs/v1.md` from `docs/templates/spec-v1.md`.
2. Inspect the repository before naming files or reusable modules.
3. Map every flow branch and acceptance criterion to UI state, API behavior, domain logic, persistence, and error recovery.
4. Split delivery into sequential implementation phases. Each phase must be independently buildable and verifiable with an explicit review checkpoint.
5. Mark the spec `In review` and keep implementation blocked until approval is recorded.

## Stage 4: Implementation Plan & Task Breakdown

After spec approval:
1. Create `docs/<feature>/implementation-plans/v1.md` from `docs/templates/implementation-plan-v1.md`.
2. Extract bounded phases into discrete task files under `task/TASK-<id>-<name>.md` using `.agents/skills/task-runner/templates/task.md`.
3. Ensure each task defines dependencies, atomic checklist items, acceptance criteria, and specific verification commands.

## Stage 5: Implementation

After task definition approval:
1. Implement one approved task at a time.
2. Follow strict TypeScript and layered architecture conventions.
3. Preserve unrelated code; modify only files within the assigned task scope.
4. Run intermediate automated verification checks.
5. Produce a Code Completion Report.

## Stage 6: Dual-Pass Review

At each declared checkpoint, run `code-review`:
- Pass A (Functional Review): Verify implementation against approved flow, spec, acceptance criteria, edge cases, and recovery paths.
- Pass B (Convention Review): Verify adherence to TypeScript rules, architectural boundaries, and audit for zero emojis and zero numbered comments.

## Stage 7: Defect Remediation & Commit Gate

1. Remediate all Critical and High findings.
2. Re-run automated verification checks (`npm run check`) ensuring exit code 0.
3. Re-run the review pass for the affected scope until verdict is `PASS`.
4. Execute safe git commit with Conventional Commits format and plain text only.

