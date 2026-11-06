# Task: TASK-04 - Feedback Posts and Deduplication Backend Services

- Feature: Feedback Collection, Deduplication and Categorization
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/implementation-plans/v1.md)
- Scope: backend
- Status: Completed

## Flow & Spec Traceability

- Governing Invariant: Every post must be strictly bound to a single Board within the Workspace; creating a post must atomically register the author in `post_subscriptions`.
- Flow Journeys Implemented:
  - Flow Primary Path: Luong Nguoi Dung Gui Gop Y Va Kiem Tra Trung Lap Tu Dong.
    - Step Initiation: User triggers new feedback dialog within board scope.
    - Step Configuration: Debounced live similarity query against existing post titles.
    - Step Confirmation & Completion: Persist Post, PostAttachment, initial Status (Backlog/Under Review), and auto-create PostSubscription.
  - Flow Exception Path 1: Exact Duplicate Title Warning Path (100% string match detection).
  - Flow Exception Path 2: Attachment Size Exceeded Path (Max 10MB limit and mime type validation).
  - Flow Exception Path 3: Moderated Board Pending Approval Path (Set is_active = false or pending flag when board has isModerated = true).
- Spec Acceptance Criteria Mapped:
  - AC-01: Query boards and categories by workspace with displayOrder and isPublic flags.
  - AC-02: Endpoint GET /api/v1/posts/search-similar responds in under 200ms with ranked similarity scores.
  - AC-03: Post creation supports Markdown, category association, tag linking, and attachments up to 10MB (PNG, JPG, WEBP, PDF).
  - AC-04: Automated creation of author record in post_subscriptions upon post creation.
  - AC-05: Moderated board submission lifecycle handling.

## Objective

Implement strict domain models, Zod validation schemas, board hierarchy querying, live deduplication text similarity engine, and feedback post persistence services with automatic subscriber tracking.

## Technical Context And Dependencies

- Pre-requisites: TASK-02 completed and verified.
- Reusable Assets: src/types/workspace.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/post.ts`
  - `src/schemas/post.schema.ts`
  - `src/services/board.service.ts`
  - `src/services/deduplication.service.ts`
  - `src/services/post.service.ts`

## Checklist

- [x] Create `src/types/post.ts` defining strict types for Board, Category, Tag, PostTag, Post, and PostAttachment according to Spec Section 2.
- [x] Create `src/schemas/post.schema.ts` defining Zod validation schemas for post submission, attachment metadata (validating mime types PNG, JPG, WEBP, PDF and fileSize <= 10MB), and similarity search query params.
- [x] Implement `src/services/board.service.ts` providing hierarchical retrieval of active boards, categories, and tags scoped by workspaceId.
- [x] Implement `src/services/deduplication.service.ts` calculating text similarity (Levenshtein distance and token match) against post titles within the same board, returning similarityScore in under 200ms (Spec AC-02, Flow Step Configuration).
- [x] Implement `src/services/post.service.ts` with createPost handling tag associations, attachment persistence, and moderation status based on board.isModerated (Spec AC-03, AC-05).
- [x] Implement atomic auto-subscription in `post.service.ts` registering the author into `post_subscriptions` with notifyInApp = true and notifyEmail = true (Spec AC-04, Flow Step Confirmation).
- [x] Ensure all exported functions contain explicit return type annotations and zero any types.
- [x] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-02): Similarity calculation executes in under 200ms and filters by boardId.
- Criterion 2 (AC-04): Creating a post automatically creates an active record in post_subscriptions for the post author.
- Criterion 3 (AC-05): Posts created on moderated boards are flagged as pending moderation and excluded from public listings.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
