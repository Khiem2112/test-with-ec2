# Task: TASK-07 - Smart Voting and Nested Discussions API and UI Components

- Feature: Smart Voting and Nested Discussions
- Governing Spec: docs/smart-voting-discussions/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Build API route handlers for vote toggling and threaded discussions, alongside high-density UI components for optimistic upvoting and nested comment feeds with internal note indicators.

## Technical Context And Dependencies

- Pre-requisites: TASK-06 completed and verified.
- Reusable Assets: src/services/voting.service.ts, src/services/comment.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/vote.actions.ts`
  - `src/actions/comment.actions.ts`
  - `src/app/api/v1/posts/[id]/vote/route.ts`
  - `src/app/api/v1/posts/[id]/comments/route.ts`
  - `src/components/discussions/vote-button.tsx`
  - `src/components/discussions/comment-thread.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/posts/[id]/vote/route.ts` handling POST requests with optimistic result contracts.
- [ ] Implement `src/app/api/v1/posts/[id]/comments/route.ts` handling GET (hierarchical list) and POST (new comment or reply).
- [ ] Implement Server Actions in `src/actions/vote.actions.ts` and `src/actions/comment.actions.ts`.
- [ ] Create `src/components/discussions/vote-button.tsx` providing optimistic count increment, active state styling, and rapid-click debounce protection.
- [ ] Create `src/components/discussions/comment-thread.tsx` rendering recursive reply threads and highlighted amber/yellow container cards for internal notes.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Vote button reflects state change immediately on click before backend roundtrip completes.
- Criterion 2: Internal notes are clearly marked with distinctive UI badges and visible only to verified workspace staff.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
