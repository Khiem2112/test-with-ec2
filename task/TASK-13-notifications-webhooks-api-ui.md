# Task: TASK-13 - Notifications, Webhooks and Audit API and UI Components

- Feature: Notifications, Subscriptions, Webhooks and Audit Logging
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/implementation-plans/v1.md)
- Scope: frontend
- Status: Pending

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Notification Bell & Flyout (Flow Section: UI Surfaces & Touchpoints - Header Navbar component with unread counter pill badge, 5 recent notifications dropdown, "Mark all as read" action).
  - Full Notification Inbox (`/[workspaceSlug]/notifications` - Full Page List with "Chua doc" and "Tat ca" tabs, click-to-navigate actionUrls).
  - Post Subscription Toggle (`/[workspaceSlug]/posts/[slug]` - Molecule button showing "Dang Theo Doi" / "Theo Doi", channel select popover for email and in-app).
  - Webhook Configuration Console (`/admin/workspaces/[slug]/settings/webhooks` - Settings page displaying registered endpoints, event checkboxes, secretKey display, and delivery history).
  - Audit Log Explorer (`/admin/workspaces/[slug]/audit-logs` - Filterable table by actor, entityType, and date range, with expandable JSON diff viewer).
- Flow Journeys Implemented:
  - Flow Primary Path 1: Subscriber receives in-app notification when followed feature changes status; clicking bell notification marks record as read and redirects.
  - Flow Primary Path 2: Admin configures outbound Webhook endpoint, receives generated secretKey, and views dispatch records.
- Spec Contracts Mapped:
  - Spec Section 4.1: GET /api/v1/notifications (returns unreadCount and array of notification items).
  - Spec Section 4.2: POST /api/v1/webhooks (registers webhook and returns secretKey).

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
  - `src/components/notifications/subscription-toggle.tsx`
  - `src/components/audit/audit-log-table.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/notifications/route.ts` adhering to Spec Section 4.1 supporting pagination and unreadOnly filters.
- [ ] Implement `src/app/api/v1/webhooks/route.ts` adhering to Spec Section 4.2 with secretKey generation.
- [ ] Implement `src/app/api/v1/audit-logs/route.ts` with date range and entityType filtering.
- [ ] Implement Server Actions in `src/actions/notification.actions.ts` to mark notifications as read and update subscription channels.
- [ ] Create `src/components/notifications/notification-bell.tsx` displaying real-time unread badge and dropdown list (Flow Touchpoint 1).
- [ ] Create `src/components/notifications/subscription-toggle.tsx` for following/unfollowing posts with channel preference modal (Flow Touchpoint 3).
- [ ] Create `src/components/audit/audit-log-table.tsx` providing search and collapsible JSON payload inspector (Flow Touchpoint 5).
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Spec 4.1 & Flow Path 1): Clicking unread notification marks it as read, updates bell counter badge, and routes to actionUrl.
- Criterion 2 (Spec 4.2 & Flow Path 2): Registering a webhook displays the generated secretKey only once with a copy button.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
