# Flow: <Feature Name> v1

Copy this file to `docs/<feature-name>/flows/v1.md`. For a later material revision, preserve this baseline and create `v<N>-diff.md` from `docs/templates/version-diff.md`.

- Status: Draft | In review | Approved | Superseded
- Owner: <name or role>
- Last updated: <YYYY-MM-DD>

## Approval Record

- Status: Pending | Approved
- Approver: <name or role>
- Approval date: <YYYY-MM-DD>
- Decision and constraints: <Explicit approval notes or business constraints>

## Outcome & Scope

- Actor: <Primary user or operator role>
- Trigger: <Event or user intent that initiates the flow>
- Job to be done: <Core objective the actor needs to achieve>
- Successful outcome: <Observable state upon successful completion>
- In scope: <Supported scenarios and use cases>
- Out of scope: <Deliberately excluded scenarios or future phases>

## UI Surfaces & Touchpoints

| Surface / Screen | Form Factor (Page / Drawer / Modal / Banner) | Entry Point | User Visibility & Available Actions |
| :--- | :--- | :--- | :--- |
| `<Primary Surface>` | `Page / Master-Detail` | `<Sidebar / Navigation>` | `<View list, search, filter, trigger primary action>` |
| `<Action Surface>` | `Drawer / Modal` | `<Action button>` | `<Configure parameters, view preview, confirm submit>` |
| `<Progress Surface>` | `Banner / Floating Bar` | `<Async start>` | `<Monitor progress, minimize without losing work>` |
| `<Verification Surface>` | `Detail Page / Table` | `<Row click>` | `<Review detailed outcome, inspect diff, retry errors>` |

## Context & Constraints

- Preconditions: <Required data, permissions, or system state>
- Source of truth: <System of record or authoritative database entity>
- Permissions & ownership: <Roles allowed to view, modify, or approve>
- Consequential actions: <Actions requiring confirmation, deduplication, or audit logging>

## State Model

| State | Meaning | Permitted Operator Actions | Terminal / Exit Condition |
| :--- | :--- | :--- | :--- |
| `<State Name>` | `<Business meaning>` | `<Actions allowed or blocked>` | `<Transition trigger to next state>` |

## Primary Path (Happy Path)

Describe the step-by-step canonical user journey from initiation to success:

- Step Initiation:
  - User Action: <Specific user interaction>
  - System Response: <Immediate UI and data response>
  - Available Choices: <Permitted and disabled actions>

- Step Configuration:
  - User Action: <Inputs entered or selections made>
  - System Response: <Validation feedback and state changes>

- Step Confirmation & Completion:
  - User Action: <Confirmation action>
  - System Response: <Final state update, notifications, persistence>

## Exception & Recovery Paths

- Validation Error Path:
  - Trigger: <Invalid input or missing precondition>
  - System Behavior: <Inline error message, input preservation, retry guidance>

- Failure & Timeout Path:
  - Trigger: <Network failure, external service error, timeout>
  - System Behavior: <Graceful error state, non-destructive fallback, retry button>
