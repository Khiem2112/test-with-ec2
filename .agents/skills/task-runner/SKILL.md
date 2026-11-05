---
name: task-runner
description: >
  Autonomous task execution loop: creates structured tasks with checklists, executes bounded implementation, generates code completion reports, conducts dual-pass reviews, remediates defects, verifies pre-commit gates, creates clean git commits, and updates progress. Supports single-agent execution and multi-subagent orchestration.
argument-hint: "[action:create|run|orchestrate] [plan-or-task-path:optional] [phase-id:optional]"
---

# Autonomous Task Runner

This skill guides the autonomous cycle of defining, executing, reviewing, fixing, and committing development tasks. It enforces strict separation between functional requirements and code conventions, guarantees automated pre-commit gate verification, and maintains complete traceability through standardized templates.

## Operational Constraints

- Zero icons and emojis: Commit messages, review notes, completion summaries, code comments, and log entries must never contain icons or emojis.
- Zero numbered comment chains: Do not write comments indicating chronological step numbers. Use descriptive technical explanations instead.
- Minimal blast radius: Modify only files directly required for the selected task.
- Hard commit gate: A commit is strictly blocked if any automated verification check fails or if any Critical/High review finding remains unresolved.

## Standardized Templates

Templates are located in `.agents/skills/task-runner/templates/`:
- `task.md`: Used to specify scope, dependencies, granular checklists, and acceptance criteria.
- `code-completion.md`: Used by the implementation agent to report touched files, architectural choices, and automated test outcomes before review.
- `code-review.md`: Used during the review phase to record functional and convention findings, fix verifications, and gate decisions.

## Execution Lifecycle

### Stage 0: Task Definition
- Consult the governing feature spec (`docs/<feature>/specs/v1.md`).
- Structure the task file in `task/TASK-<id>-<name>.md` using `templates/task.md`.
- Break down implementation into atomic checklist items `[ ]`.
- Define concrete acceptance criteria and verification commands.

### Stage 1: Task Inspection & Scope Bounding
- Select the next pending task marked `[ ]` or `Pending`.
- Set task status to `In progress`.
- Lock file boundaries to the target files listed.

### Stage 2: Technical Analysis & Pre-Check
- Check `reuse-first` to inspect existing services, schemas, and utilities before creating new abstractions.
- Confirm strict TypeScript standards (`type` over `interface`, explicit returns, no `any`).

### Stage 3: Task Implementation
- Implement changes strictly bounded to the selected task.
- Adhere to layered architecture: controllers parse and respond, services manage domain logic, utils remain pure.
- Verify zero icons/emojis and zero numbered comments.

### Stage 4: Code Completion Summary
- Generate a Code Completion Report using `templates/code-completion.md`.
- Detail all touched files (`Created`, `Modified`, `Deleted`).
- Run intermediate checks (`npm run check`) and document exit codes.

### Stage 5: Dual-Pass Code Review
- Perform an independent review using `templates/code-review.md`:
  - Pass A: Functional Review against acceptance criteria and edge cases.
  - Pass B: Convention Review against TypeScript rules, layering, zero emojis, and zero numbered comments.
- Issue verdict: `PASS`, `PASS WITH WARNINGS`, or `FAIL (REQUIRES FIX)`.

### Stage 6: Defect Remediation & Re-Review Loop
- Apply targeted remediations for any Critical or High findings.
- Re-run verification commands (`npm run check` must exit with code 0).
- Log remediation history and re-review until verdict is `PASS`.

### Stage 7: Safe Commit & Status Update
- Stage files selectively using explicit file paths.
- Commit using Conventional Commits format with plain text only.
- Mark checklist item `[x]` and update task status to `Complete`.

## Execution Strategies

### Strategy 1: Single Continuous Session
Use within the current conversation when tasks are tightly coupled and modify fewer than 4 files in total.

### Strategy 2: New Session Per Task (Recommended Default)
Execute tasks sequentially across clean sessions. In batch mode, run:
```powershell
.\.agents\skills\task-runner\scripts\run_tasks.ps1 -TaskFiles task/TASK-01.md, task/TASK-02.md
```

### Strategy 3: Multi-Subagent Orchestration
Dispatch dedicated worker subagents (`task-implementer`, `task-reviewer`, `task-tester`):
- Concurrency cap: Maximum 2 to 3 workers.
- Worktree isolation: Use `Workspace: branch` for file modifications.
- Independent review: Dispatch `task-reviewer` for Pass A and Pass B.
- Pre-commit gate: Dispatch `task-tester` to verify exit code 0.
