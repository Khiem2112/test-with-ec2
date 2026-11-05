# Task Queue & Execution Management

This directory holds atomic, bounded task files executed by the autonomous multi-agent pipeline.

## Task File Conventions

- File naming: `TASK-<id>-<slug>.md` (for example, `TASK-01-scaffold-setup.md`).
- Format: Created from `.agents/skills/task-runner/templates/task.md`.
- Content:
  - Governing specification link (`docs/<feature>/specs/v1.md`).
  - Target files explicitly bounded.
  - Granular checklist items `[ ]`.
  - Concrete acceptance criteria.
  - Automated verification commands.

## Execution Workflow

1. Interactive Invocations:
   ```text
   /task-runner run task/TASK-01-scaffold-setup.md
   ```
2. Batch Autonomous Execution:
   ```powershell
   .\.agents\skills\task-runner\scripts\run_tasks.ps1 -TaskFiles task/TASK-01-scaffold-setup.md
   ```

## Task Progress Tracking

| Task ID | Title | Scope | Status | Review Verdict |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-01` | Scaffold and Core Types Setup | `shared` | `Pending` | `Pending` |
