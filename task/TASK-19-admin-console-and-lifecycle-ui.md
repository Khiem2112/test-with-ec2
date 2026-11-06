# Task: TASK-19 - Admin Console Shell and Feature Lifecycle Operations

- Feature: Admin Management and Feature Lifecycle Operations
- Governing Flow: [docs/workspace-identity/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md), [docs/post-lifecycle-merge/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md)
- Governing Spec: [docs/post-lifecycle-merge/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md)
- Scope: frontend
- Status: Completed

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Admin Layout Shell (`src/app/admin/workspaces/[slug]/layout.tsx`).
  - Workspace Settings Page (`src/app/admin/workspaces/[slug]/settings/page.tsx`).
  - Team Members Management Page (`src/app/admin/workspaces/[slug]/members/page.tsx`).
  - Moderator Review Queue (`src/app/admin/workspaces/[slug]/moderation/page.tsx`).
  - Post Admin Operations View with StatusTransitionDialog and MergeDrawer.
  - Audit Log Explorer (`src/app/admin/workspaces/[slug]/audit/page.tsx`).
- Flow Journeys:
  - Administrator enters `/admin/workspaces/[slug]/settings` to update workspace branding, logo, and custom domain.
  - Administrator navigates to `/admin/workspaces/[slug]/members` to invite colleagues by email and configure RBAC roles.
  - Moderator opens `/admin/workspaces/[slug]/moderation` to approve or reject pending posts.
  - Product Manager transitions a post status via StatusTransitionDialog, which automatically records status history and notifies subscribers.
  - Product Manager opens MergeDrawer to find duplicate posts and merge secondary post into primary post, transferring subscribers and votes.
  - Administrator visits `/admin/workspaces/[slug]/audit` to inspect immutable audit events.

## Objective

Build the Admin Console layout and administrative operation screens, wiring workspace settings, staff member management, post moderation, status transitions, duplicate merging, and audit log exploration.

## Technical Context And Dependencies

- Pre-requisites: TASK-15 completed and verified.
- Reusable Assets: src/services/status.service.ts, src/services/merge-engine.service.ts, src/services/audit.service.ts, src/components/lifecycle/status-transition-dialog.tsx, src/components/lifecycle/merge-drawer.tsx, src/components/audit/audit-log-table.tsx.
- Target Files:
  - `src/app/admin/workspaces/[slug]/layout.tsx`
  - `src/app/admin/workspaces/[slug]/settings/page.tsx`
  - `src/app/admin/workspaces/[slug]/members/page.tsx`
  - `src/app/admin/workspaces/[slug]/moderation/page.tsx`
  - `src/app/admin/workspaces/[slug]/audit/page.tsx`
  - `src/components/lifecycle/status-transition-dialog.tsx`
  - `src/components/lifecycle/merge-drawer.tsx`

## Checklist

- [x] Implement `src/app/admin/workspaces/[slug]/layout.tsx` embedding AdminSidebar, checking administrative authorization, and providing workspace context.
- [x] Implement `src/app/admin/workspaces/[slug]/settings/page.tsx` with forms for workspace name, custom domain, branding color, and public portal visibility toggle.
- [x] Implement `src/app/admin/workspaces/[slug]/members/page.tsx` embedding TeamMembersDrawer and staff members listing.
- [x] Implement `src/app/admin/workspaces/[slug]/moderation/page.tsx` displaying pending posts on moderated boards with single-click approve and reject actions.
- [x] Connect `StatusTransitionDialog` and `MergeDrawer` into admin post actions, wiring `/api/v1/posts/[id]/status` and `/api/v1/posts/[id]/merge`.
- [x] Implement `src/app/admin/workspaces/[slug]/audit/page.tsx` embedding AuditLogTable with event filtering and actor identification.
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Admin layout secures management routes and provides consistent navigation across settings, members, moderation, and audit.
- Criterion 2: Status transition dialog triggers backend status change, creating PostStatusHistory entry and activating subscriber notifications.
- Criterion 3: Merge drawer validates target post, executes atomic merge transaction, and leaves target post with consolidated votes.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run typecheck`
- Command 2: `npm run lint`

