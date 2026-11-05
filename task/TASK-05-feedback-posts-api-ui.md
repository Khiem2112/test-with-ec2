# Task: TASK-05 - Feedback Posts API Handlers and UI Components

- Feature: Feedback Collection, Deduplication and Categorization
- Governing Spec: docs/feedback-posts/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Deliver API route handlers for live similarity search and post submission, alongside interactive frontend components for debounced deduplication warnings and feedback drafting.

## Technical Context And Dependencies

- Pre-requisites: TASK-04 completed and verified.
- Reusable Assets: src/services/deduplication.service.ts, src/services/post.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/post.actions.ts`
  - `src/app/api/v1/posts/search-similar/route.ts`
  - `src/app/api/v1/posts/route.ts`
  - `src/components/posts/post-submission-form.tsx`
  - `src/components/posts/similar-posts-modal.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/posts/search-similar/route.ts` handling debounced similarity queries and returning ranked suggestions.
- [ ] Implement `src/app/api/v1/posts/route.ts` handling POST requests to ingest feedback with attachment validation.
- [ ] Implement `src/actions/post.actions.ts` providing Server Actions for submitting feedback and managing moderation status.
- [ ] Create `src/components/posts/post-submission-form.tsx` supporting Markdown description, category select, tag chips, and file attachments.
- [ ] Create `src/components/posts/similar-posts-modal.tsx` presenting found duplicate posts with vote buttons to steer voters toward existing threads.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Live similarity suggestions trigger only after 300ms debounce when user stops typing title.
- Criterion 2: File attachments exceeding 10MB or invalid mime types trigger immediate validation error without server crash.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
