# Task: TASK-16 - Workspace Public Portal Shell and Board Feedback Flow Pages

- Feature: Feedback Collection and Board Navigation
- Governing Flow: [docs/feedback-posts/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md)
- Governing Spec: [docs/feedback-posts/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md)
- Scope: frontend
- Status: Completed

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Workspace Public Portal Layout (`src/app/[workspaceSlug]/layout.tsx`).
  - Workspace Home Page (`src/app/[workspaceSlug]/page.tsx`).
  - Board Feedback Explorer Page (`src/app/[workspaceSlug]/boards/[boardSlug]/page.tsx`).
  - Post Submission Modal integration with live deduplication panel.
- Flow Journeys:
  - End user lands on `/[workspaceSlug]` and sees workspace title, description, and list of available boards with post counts.
  - End user clicks a board card to enter `/[workspaceSlug]/boards/[boardSlug]`.
  - Board page loads categories, tags, and posts, rendering BoardFeedView with sorting (Popular, Newest, Trending) and filtering.
  - End user clicks "Dong Gop Y Kien", opening PostSubmissionDialog.
  - Typing a title triggers debounced similarity search showing SimilarPostsPanel. User can either upvote an existing post or complete the new submission.
- Spec Contracts:
  - Spec Section 4.1: Live similarity search query.
  - Spec Section 4.2: Post creation with category, tags, and attachments.

## Objective

Build the App Router layout and pages for the public feedback portal, wiring the workspace overview, board explorer, and post submission dialog with real server-side data loading and client interactions.

## Technical Context And Dependencies

- Pre-requisites: TASK-15 completed and verified.
- Reusable Assets: src/services/board.service.ts, src/services/post.service.ts, src/components/posts/board-feed-view.tsx, src/components/posts/post-submission-dialog.tsx.
- Target Files:
  - `src/app/[workspaceSlug]/layout.tsx`
  - `src/app/[workspaceSlug]/page.tsx`
  - `src/app/[workspaceSlug]/boards/[boardSlug]/page.tsx`
  - `src/components/posts/board-feed-view.tsx`
  - `src/components/posts/post-submission-dialog.tsx`

## Checklist

- [x] Implement `src/app/[workspaceSlug]/layout.tsx` fetching workspace data by slug, rendering PublicHeader with workspace branding, and handling 404 for invalid slugs.
- [x] Implement `src/app/[workspaceSlug]/page.tsx` displaying the workspace portal welcome banner, search bar, and grid of active boards.
- [x] Implement `src/app/[workspaceSlug]/boards/[boardSlug]/page.tsx` as a Server Component fetching board details, categories, tags, and initial posts, rendering BoardFeedView.
- [x] Update `src/components/posts/board-feed-view.tsx` to match the Linear dark design system tokens (dark panels, hairline borders, lavender accents).
- [x] Wire `PostSubmissionDialog` within the board page, triggering real-time `/api/v1/posts/search-similar` and submitting to `/api/v1/posts` or Server Action.
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Flow Primary Path 1): Navigating to `/[workspaceSlug]/boards/[boardSlug]` renders the board title, categories, tags, and posts feed with sorting tabs.
- Criterion 2 (Flow Primary Path 2): Clicking "Dong Gop Y Kien" opens the dialog, typing more than 3 characters renders similarity suggestions, and submitting persists a new post.
- Criterion 3: Non-existent workspace slug or board slug renders clean not-found boundary without uncaught exceptions.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run typecheck`
- Command 2: `npm run lint`

