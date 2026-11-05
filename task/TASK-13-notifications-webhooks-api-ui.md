# Task: TASK-13 - Notifications, Webhooks and Audit API and UI Components

- Feature: Notifications, Subscriptions, Webhooks and Audit Logging
- Governing Spec: docs/notifications-and-webhooks/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Build API route handlers for in-app notifications, webhooks registration, and audit logs, alongside notification bell popovers, webhook subscription managers, and audit trail tables.

## Technical Context And Dependencies

- Pre-requisites: TASK-12 completed and verified.
- Reusable Assets: src/services/notification.service.ts, src/services/webhook.service.ts, src/services/audit.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/notification.actions.ts`
  - `src/app/api/v1/notifications/route.ts`
  - `src/app/api/v1/webhooks/route.ts`
  - `src/app/api/v1/audit-logs/route.ts`
  - `src/components/notifications/notification-bell.tsx`
  - `src/components/audit/audit-log-table.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/notifications/route.ts` handling GET (inbox query with unread count) and PATCH (mark as read).
- [ ] Implement `src/app/api/v1/webhooks/route.ts` handling webhook registration and event subscription filters.
- [ ] Implement `src/app/api/v1/audit-logs/route.ts` handling administrative queries with date and entity filters.
- [ ] Implement Server Actions in `src/actions/notification.actions.ts`.
- [ ] Create `src/components/notifications/notification-bell.tsx` with dynamic unread count pill badge and dropdown notification list.
- [ ] Create `src/components/audit/audit-log-table.tsx` rendering searchable, filterable administrative history with expandable JSON payload view.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Unread notification count badge updates immediately when user marks items as read.
- Criterion 2: Audit log table provides filter by entity type (Workspace, Post, User) and displays actor and IP address cleanly.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
