# Task Queue & Execution Management

This directory holds atomic, bounded task files executed by the autonomous multi-agent pipeline. Every task is strictly traced to an approved Operational Flow, Technical Specification, and Implementation Plan.

## Task File Conventions

- File naming: `TASK-<id>-<slug>.md` (for example, `TASK-02-workspace-identity-backend.md`).
- Format: Created from `.agents/skills/task-runner/templates/task.md`.
- Content:
  - Governing Operational Flow link (`docs/<feature>/flows/v1.md`).
  - Governing Technical Specification link (`docs/<feature>/specs/v1.md`).
  - Implementation Plan link (`docs/<feature>/implementation-plans/v1.md`).
  - Target files explicitly bounded.
  - Granular checklist items `[ ]`.
  - Concrete acceptance criteria mapped to Spec AC numbers.
  - Automated verification commands.

## Execution Workflow

1. Interactive Invocations:
   ```text
   /task-runner run task/TASK-02-workspace-identity-backend.md
   ```
2. Batch Autonomous Execution:
   - On Windows (PowerShell):
     ```powershell
     .\.agents\skills\task-runner\scripts\run_tasks.ps1 -TaskFiles task/TASK-02-workspace-identity-backend.md
     ```
   - On Linux / macOS (Bash):
     ```bash
     chmod +x ./.agents/skills/task-runner/scripts/run_tasks.sh
     ./.agents/skills/task-runner/scripts/run_tasks.sh task/TASK-02-workspace-identity-backend.md
     ```

## Task Traceability & Progress Tracking

| Task ID | Title | Scope | Governing Flow | Governing Spec | Status | Review Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TASK-01` | Scaffold and Core Types Setup | `shared` | System Baseline | Baseline Scaffold Setup | `Pending` | `Pending` |
| `TASK-02` | Workspace and Identity Backend Services | `backend` | [workspace-identity/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md) | [workspace-identity/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md) | `Pending` | `Pending` |
| `TASK-03` | Workspace and Identity API Handlers and UI Components | `frontend` | [workspace-identity/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md) | [workspace-identity/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md) | `Pending` | `Pending` |
| `TASK-04` | Feedback Posts and Deduplication Backend Services | `backend` | [feedback-posts/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md) | [feedback-posts/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md) | `Pending` | `Pending` |
| `TASK-05` | Feedback Posts API Handlers and UI Components | `frontend` | [feedback-posts/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md) | [feedback-posts/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md) | `Pending` | `Pending` |
| `TASK-06` | Smart Voting and Nested Discussions Backend Services | `backend` | [smart-voting-discussions/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md) | [smart-voting-discussions/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md) | `Pending` | `Pending` |
| `TASK-07` | Smart Voting and Nested Discussions API and UI Components | `frontend` | [smart-voting-discussions/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md) | [smart-voting-discussions/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md) | `Pending` | `Pending` |
| `TASK-08` | Post Lifecycle and Merge Engine Backend Services | `backend` | [post-lifecycle-merge/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md) | [post-lifecycle-merge/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md) | `Pending` | `Pending` |
| `TASK-09` | Post Lifecycle and Merge Engine API and UI Components | `frontend` | [post-lifecycle-merge/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md) | [post-lifecycle-merge/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md) | `Pending` | `Pending` |
| `TASK-10` | Interactive Roadmap and Release Versions Backend Services | `backend` | [roadmap-and-releases/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md) | [roadmap-and-releases/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md) | `Pending` | `Pending` |
| `TASK-11` | Interactive Roadmap and Release Versions API and UI Components | `frontend` | [roadmap-and-releases/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md) | [roadmap-and-releases/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md) | `Pending` | `Pending` |
| `TASK-12` | Notifications, Subscriptions and Webhooks Backend Services | `backend` | [notifications-and-webhooks/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md) | [notifications-and-webhooks/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/specs/v1.md) | `Pending` | `Pending` |
| `TASK-13` | Notifications, Webhooks and Audit API and UI Components | `frontend` | [notifications-and-webhooks/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md) | [notifications-and-webhooks/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/specs/v1.md) | `Pending` | `Pending` |
| `TASK-14` | System Integration and Full Verification Gate | `shared` | All 6 Operational Flows | All 6 Technical Specifications | `Pending` | `Pending` |
