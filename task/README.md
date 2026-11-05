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
   - On Windows (PowerShell):
     ```powershell
     .\.agents\skills\task-runner\scripts\run_tasks.ps1 -TaskFiles task/TASK-01-scaffold-setup.md
     ```
   - On Linux / macOS (Bash):
     ```bash
     chmod +x ./.agents/skills/task-runner/scripts/run_tasks.sh
     ./.agents/skills/task-runner/scripts/run_tasks.sh task/TASK-01-scaffold-setup.md
     ```

## Task Progress Tracking

| Task ID | Title | Scope | Governing Spec | Status | Review Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TASK-01` | Scaffold and Core Types Setup | `shared` | System Foundation | `Pending` | `Pending` |
| `TASK-02` | Workspace and Identity Backend Services | `backend` | docs/workspace-identity/specs/v1.md | `Pending` | `Pending` |
| `TASK-03` | Workspace and Identity API Handlers and UI Components | `frontend` | docs/workspace-identity/specs/v1.md | `Pending` | `Pending` |
| `TASK-04` | Feedback Posts and Deduplication Backend Services | `backend` | docs/feedback-posts/specs/v1.md | `Pending` | `Pending` |
| `TASK-05` | Feedback Posts API Handlers and UI Components | `frontend` | docs/feedback-posts/specs/v1.md | `Pending` | `Pending` |
| `TASK-06` | Smart Voting and Nested Discussions Backend Services | `backend` | docs/smart-voting-discussions/specs/v1.md | `Pending` | `Pending` |
| `TASK-07` | Smart Voting and Nested Discussions API and UI Components | `frontend` | docs/smart-voting-discussions/specs/v1.md | `Pending` | `Pending` |
| `TASK-08` | Post Lifecycle and Merge Engine Backend Services | `backend` | docs/post-lifecycle-merge/specs/v1.md | `Pending` | `Pending` |
| `TASK-09` | Post Lifecycle and Merge Engine API and UI Components | `frontend` | docs/post-lifecycle-merge/specs/v1.md | `Pending` | `Pending` |
| `TASK-10` | Interactive Roadmap and Release Versions Backend Services | `backend` | docs/roadmap-and-releases/specs/v1.md | `Pending` | `Pending` |
| `TASK-11` | Interactive Roadmap and Release Versions API and UI Components | `frontend` | docs/roadmap-and-releases/specs/v1.md | `Pending` | `Pending` |
| `TASK-12` | Notifications, Subscriptions and Webhooks Backend Services | `backend` | docs/notifications-and-webhooks/specs/v1.md | `Pending` | `Pending` |
| `TASK-13` | Notifications, Webhooks and Audit API and UI Components | `frontend` | docs/notifications-and-webhooks/specs/v1.md | `Pending` | `Pending` |
| `TASK-14` | System Integration and Full Verification Gate | `shared` | All Feature Specifications | `Pending` | `Pending` |
