# Task: TASK-05 - Feedback Posts API Handlers and UI Components

- Feature: Feedback Collection, Deduplication and Categorization
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/implementation-plans/v1.md)
- Scope: frontend
- Status: Pending

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Board Feedback Explorer (`/[workspaceSlug]/boards/[boardSlug]` - Master-Detail Page with sorting by Most Popular, Newest, Trending, and Category/Tag filters).
  - Create Feedback Dialog (Modal Dialog with side panel for live deduplication suggestions).
  - Similar Post Suggestion Card (Card Atom showing title, vote count, roadmap status badge, and "Bo Phieu Cho Bai Nay" action).
  - Post Detail View (`/[workspaceSlug]/posts/[slug]` - Full Page displaying markdown, attachments, status, and discussion).
  - Moderator Review Queue (`/admin/workspaces/[slug]/moderation` - Table of pending posts on moderated boards).
- Flow Journeys Implemented:
  - Flow Primary Path Branch 1: Upvote existing post directly from similar suggestions card and dismiss modal.
  - Flow Primary Path Branch 2: Continue submitting new idea with markdown description, category select, and image attachments.
  - Flow Exception Path 1: Exact Duplicate Title Warning modal when title matches an existing post 100%.
  - Flow Exception Path 2: Attachment validation error display for files exceeding 10MB or invalid mime types.
- Spec Contracts Mapped:
  - Spec Section 4.1: GET /api/v1/posts/search-similar?boardId=...&q=... (200 OK with ranked list).
  - Spec Section 4.2: POST /api/v1/posts (201 Created vs 413 ATTACHMENT_TOO_LARGE).

## Objective

Deliver API route handlers for live similarity search and post ingestion, alongside interactive frontend components for debounced deduplication warnings, feedback drafting, and board browsing.

## Technical Context And Dependencies

- Pre-requisites: TASK-04 completed and verified.
- Reusable Assets: src/services/deduplication.service.ts, src/services/post.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/post.actions.ts`
  - `src/app/api/v1/posts/search-similar/route.ts`
  - `src/app/api/v1/posts/route.ts`
  - `src/components/posts/post-submission-dialog.tsx`
  - `src/components/posts/similar-posts-panel.tsx`
  - `src/components/posts/board-feed-view.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/posts/search-similar/route.ts` fulfilling Spec Section 4.1 contract with minimum 3-character query threshold and ranked results.
- [ ] Implement `src/app/api/v1/posts/route.ts` fulfilling Spec Section 4.2 contract handling post creation and attachment bounds.
- [ ] Implement Server Actions in `src/actions/post.actions.ts` for post submission, tag mutation, and moderator approval.
- [ ] Create `src/components/posts/post-submission-dialog.tsx` implementing the modal dialog with 300ms debounced similarity triggers.
- [ ] Create `src/components/posts/similar-posts-panel.tsx` implementing Branch 1 (instant upvote of existing thread) and Branch 2 (continue new post submission).
- [ ] Create `src/components/posts/board-feed-view.tsx` supporting category filtering, tag selection, and sorting options (Most Popular, Newest, Trending).
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Spec 4.1 & Flow Branch 1): Selecting an existing post from suggestions allows one-click upvoting and closes modal with confirmation.
- Criterion 2 (Spec 4.2 & Flow Exception Path 2): Client and server reject attachments > 10MB with ATTACHMENT_TOO_LARGE error code without data loss.
- Criterion 3 (Flow Touchpoint): Board feed renders tags with custom colorHex and displays post status pills.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
