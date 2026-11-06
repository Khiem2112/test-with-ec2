# Task: TASK-09 - Post Lifecycle and Merge Engine API and UI Components

- Feature: Post Lifecycle and Merge Engine
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/implementation-plans/v1.md)
- Scope: frontend
- Status: Completed

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Post Management Table (`/admin/workspaces/[slug]/posts` - Full Page Table with filters by status and quick status updater).
  - Post Status Transition Modal (Modal Dialog triggered from post detail page with status select, public change note input, and notify subscriber toggle).
  - Post Merge Drawer (Slide-over Drawer from three-dot action menu with target search, side-by-side diff preview, transferred vote breakdown, and confirmation challenge).
  - Merged Post Public Notice (Prominent Banner at top of merged post detail page displaying "Bai viet nay da duoc gop vao [Tieu De Bai Chinh]" with instant redirect button).
  - Custom Status Settings (`/admin/workspaces/[slug]/settings/statuses` - Master-detail settings for hex colors, display orders, and roadmap visibility).
- Flow Journeys Implemented:
  - Flow Primary Path 1: PM updates post status to In Progress, enters change note, previews subscriber notification count, and saves.
  - Flow Primary Path 2: PM initiates post merge, inspects vote transfer preview, confirms merge, and locks source post.
- Spec Contracts Mapped:
  - Spec Section 4.1: PATCH /api/v1/posts/[id]/status (returns updated status, oldStatusId, newStatusId, historyId).
  - Spec Section 4.2: POST /api/v1/posts/[id]/merge (returns sourcePostId, targetPostId, votesTransferred, subscribersTransferred, targetNewTotalVotes).

## Objective

Build API route handlers for status transitions and post merging, alongside administrative UI dialogs, status transition modals, and merge slide-over drawers.

## Technical Context And Dependencies

- Pre-requisites: TASK-08 completed and verified.
- Reusable Assets: src/services/status.service.ts, src/services/merge-engine.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/status.actions.ts`
  - `src/actions/merge.actions.ts`
  - `src/app/api/v1/posts/[id]/status/route.ts`
  - `src/app/api/v1/posts/[id]/merge/route.ts`
  - `src/components/lifecycle/status-transition-dialog.tsx`
  - `src/components/lifecycle/merge-drawer.tsx`
  - `src/components/lifecycle/merged-notice-banner.tsx`

## Checklist

- [x] Implement `src/app/api/v1/posts/[id]/status/route.ts` adhering to Spec Section 4.1 with Admin/PM authorization check.
- [x] Implement `src/app/api/v1/posts/[id]/merge/route.ts` adhering to Spec Section 4.2 handling merge execution and error responses.
- [x] Implement Server Actions in `src/actions/status.actions.ts` and `src/actions/merge.actions.ts`.
- [x] Create `src/components/lifecycle/status-transition-dialog.tsx` with status select dropdown, change note textarea, and subscriber recipient count preview (Flow Touchpoint 2).
- [x] Create `src/components/lifecycle/merge-drawer.tsx` providing live target post search, transferred votes diff preview, and confirmation challenge (Flow Touchpoint 3).
- [x] Create `src/components/lifecycle/merged-notice-banner.tsx` rendering redirect banner on merged posts (Flow Touchpoint 4).
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Spec 4.1 & Flow Path 1): Status transition requires change note and verifies actor role before mutating database.
- Criterion 2 (Spec 4.2 & Flow Path 2): Merge drawer displays side-by-side comparison of source and target post metrics before user confirmation.
- Criterion 3 (Flow Touchpoint 4): Merged posts display prominent notice banner with clickable redirect link to target post.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
