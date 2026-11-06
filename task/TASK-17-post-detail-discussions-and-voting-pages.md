# Task: TASK-17 - Post Detail, Smart Voting, Discussions and Notifications UI

- Feature: Post Detail, Discussions, Smart Voting and Notifications
- Governing Flow: [docs/smart-voting-discussions/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md), [docs/notifications-and-webhooks/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md)
- Governing Spec: [docs/smart-voting-discussions/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md)
- Scope: frontend
- Status: Completed

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Post Detail Page (`src/app/[workspaceSlug]/posts/[id]/page.tsx`).
  - Discussion Section with CommentComposer and CommentThread hierarchy.
  - VoteButton with active voter weight calculation and optimistic toggle.
  - Notification Inbox Page (`src/app/[workspaceSlug]/notifications/page.tsx`).
  - SubscriptionToggle integrated on post detail view.
- Flow Journeys:
  - User visits `/[workspaceSlug]/posts/[id]` to read full markdown content, roadmap status, and attached images.
  - User clicks VoteButton: triggers toggle vote, instantly updates score counter, persists via API.
  - User submits a public comment or reply to an existing comment.
  - Team members with PM or Admin role can toggle "Ghi chu noi bo (Internal note)" when commenting, rendering an amber-tinted internal card invisible to regular voters.
  - User visits `/[workspaceSlug]/notifications` to view all notifications, filter unread, and mark items as read.

## Objective

Deliver the Post Detail page, assembling voting controls, discussion threads (with internal note differentiation), post subscription toggles, and the full-page notification inbox.

## Technical Context And Dependencies

- Pre-requisites: TASK-16 completed and verified.
- Reusable Assets: src/services/post.service.ts, src/services/voting.service.ts, src/services/comment.service.ts, src/components/discussions/vote-button.tsx, src/components/discussions/comment-composer.tsx, src/components/discussions/comment-thread.tsx, src/components/notifications/subscription-toggle.tsx.
- Target Files:
  - `src/app/[workspaceSlug]/posts/[id]/page.tsx`
  - `src/app/[workspaceSlug]/notifications/page.tsx`
  - `src/components/discussions/comment-composer.tsx`
  - `src/components/discussions/comment-thread.tsx`
  - `src/components/discussions/vote-button.tsx`

## Checklist

- [x] Implement `src/app/[workspaceSlug]/posts/[id]/page.tsx` as a Server Component fetching post details, status, author info, vote count, attachments, and comment tree.
- [x] Connect `VoteButton` to `/api/v1/posts/[id]/vote` with optimistic state update and voter identity verification.
- [x] Connect `CommentComposer` and `CommentThread` to `/api/v1/posts/[id]/comments`, supporting nested replies and internal note flag for staff members.
- [x] Connect `SubscriptionToggle` on the post header, querying and toggling subscription status via Server Actions.
- [x] Implement `src/app/[workspaceSlug]/notifications/page.tsx` displaying paginated notifications, filter by unread, and mark-all-read action.
- [x] Restyle discussion components to adhere to the Linear dark theme palette (#0f1011 panels, hairline borders).
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Flow Path 1): Post detail page displays title, markdown body, author badge, roadmap status pill, and full comment tree.
- Criterion 2 (Flow Path 2): Clicking VoteButton updates count in UI and synchronizes with backend atomically.
- Criterion 3 (Flow Path 3): Commenting as guest posts a public comment; internal note checkbox is only accessible to authorized staff roles.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run typecheck`
- Command 2: `npm run lint`

