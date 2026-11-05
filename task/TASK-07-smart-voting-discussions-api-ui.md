# Task: TASK-07 - Smart Voting and Nested Discussions API and UI Components

- Feature: Smart Voting and Nested Discussions
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/implementation-plans/v1.md)
- Scope: frontend
- Status: Pending

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Upvote Action Button (Flow Section: UI Surfaces & Touchpoints - Interactive Atom Button with Optimistic UI count and active state styling).
  - Public Discussion Thread (Section on Post Detail Page rendering hierarchical nested reply trees).
  - Internal Team Note Switcher (Toggle bar within comment box switching between "Binh Luan Cong Khai" and "Ghi Chu Noi Bo" tabs, visible only to team members).
  - Internal Note Card (Distinct styled container with yellow/amber border and warning pill "Chi thanh vien doi ngu moi nhin thay").
  - Comment Reaction Bar (Floating toolbar for quick reactions: THUMBS_UP, THUMBS_DOWN, HEART, ROCKET, INSIGHTFUL).
- Flow Journeys Implemented:
  - Flow Primary Path 1: Optimistic UI toggle on upvote button; rapid click debounce protection.
  - Flow Primary Path 2: In-line reply accordion opening under specific comment with parentId binding.
  - Flow Primary Path 3: Staff member toggles internal note mode to submit technical review notes directly on feedback threads.
- Spec Contracts Mapped:
  - Spec Section 4.1: POST /api/v1/posts/[id]/vote (returns action UPVOTED/UNVOTED, totalVotesCount, totalScoreWeight, userHasVoted).
  - Spec Section 4.2: POST /api/v1/posts/[id]/comments (returns created comment or internal note).

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
  - `src/components/discussions/comment-composer.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/posts/[id]/vote/route.ts` adhering to Spec Section 4.1 contract with lock verification and error handling.
- [ ] Implement `src/app/api/v1/posts/[id]/comments/route.ts` adhering to Spec Section 4.2 contract for public discussions and staff notes.
- [ ] Implement Server Actions in `src/actions/vote.actions.ts` and `src/actions/comment.actions.ts`.
- [ ] Create `src/components/discussions/vote-button.tsx` providing instant Optimistic UI state toggling and click debounce (Flow Primary Path 1).
- [ ] Create `src/components/discussions/comment-composer.tsx` with Markdown toolbar and staff-only internal note switcher tab (Flow Touchpoint 3).
- [ ] Create `src/components/discussions/comment-thread.tsx` rendering recursive reply trees with distinct yellow/amber styling for internal notes (Flow Touchpoint 4).
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Spec 4.1 & Flow Path 1): Clicking upvote updates button state and score counter instantaneously before API response.
- Criterion 2 (Spec AC-04 & Flow Touchpoint 4): Internal notes display with prominent yellow warning header and are hidden from guest users.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
