# Task: TASK-04 - Feedback Posts and Deduplication Backend Services

- Feature: Feedback Collection, Deduplication and Categorization
- Governing Spec: docs/feedback-posts/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Build domain types, Zod schemas, board management, live deduplication text similarity engine, and post persistence services with automatic subscriber tracking.

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

- [ ] Create `src/types/post.ts` with strict type definitions for Board, Category, Tag, Post, PostTag, and PostAttachment.
- [ ] Create `src/schemas/post.schema.ts` defining Zod schemas for post submission, attachment metadata (max 10MB), and search query params.
- [ ] Implement `src/services/board.service.ts` providing hierarchical retrieval of boards, categories, and tags scoped by workspace.
- [ ] Implement `src/services/deduplication.service.ts` providing fast similarity calculation (Levenshtein distance, token overlap) against existing post titles.
- [ ] Implement `src/services/post.service.ts` creating posts, linking tags and attachments, handling moderation flags, and auto-subscribing the author.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Deduplication query returns similar posts within 200ms when title length is at least 3 characters.
- Criterion 2: Creating a post automatically creates an active record in post_subscriptions for the post author.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
