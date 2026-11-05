# Task: TASK-06 - Smart Voting and Nested Discussions Backend Services

- Feature: Smart Voting and Nested Discussions
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/implementation-plans/v1.md)
- Scope: backend
- Status: Completed

## Flow & Spec Traceability

- Governing Invariants:
  - Single Vote Invariant: Each VoterProfile can hold at most one active vote per post, guaranteed by database constraint @@unique([postId, voterProfileId]).
  - Public vs Internal Note Invariant: Comments marked with isInternalNote = true must never be serialized or leaked to public or non-member queries.
  - Atomic Transaction Invariant: Vote toggling must execute within an isolated database transaction simultaneously mutating Vote records, posts.totalVotesCount, and posts.totalScoreWeight.
- Flow Journeys Implemented:
  - Flow Primary Path 1: Luong Bo Phieu Thong Minh - Toggle vote/unvote, evaluate tier weight (Standard: 1.00, Pro: 3.00, Enterprise: 10.00), write audit record to vote_activity_logs with IP hash and User Agent, and auto-subscribe voter.
  - Flow Primary Path 2: Luong Trao Doi Cong Khai Va Phan Hoi Phan Cap - Threaded nested comments via parentId, character length bounds (3 to 5000 chars), and updating posts.commentsCount.
  - Flow Exception Path: Locked Post Rejection - Return error POST_LOCKED when user attempts to vote or comment on a post where is_locked = true.
- Spec Acceptance Criteria Mapped:
  - AC-01: Endpoint POST /api/v1/posts/[id]/vote handles atomic toggle vote and score weight recalculation.
  - AC-02: Record vote action in VoteActivityLog with IP hash and handle concurrency via unique index.
  - AC-03: Multi-level threaded comment retrieval and commentsCount maintenance.
  - AC-04: Strict RBAC check ensuring internal notes (isInternalNote = true) are visible only to verified WorkspaceMembers.
  - AC-05: Automatic subscriber enrollment into post_subscriptions for voters and commenters.

## Objective

Build strict domain models, Zod validation schemas, atomic voting transaction services with tier weight calculation, anti-fraud logging, and hierarchical nested comments services with internal note security guards.

## Technical Context And Dependencies

- Pre-requisites: TASK-04 completed and verified.
- Reusable Assets: src/types/post.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/discussion.ts`
  - `src/schemas/vote.schema.ts`
  - `src/schemas/comment.schema.ts`
  - `src/services/voting.service.ts`
  - `src/services/comment.service.ts`

## Checklist

- [x] Create `src/types/discussion.ts` defining types for Vote, VoteActivityLog, Comment, CommentReaction, and CommentTreeNode according to Spec Section 2.
- [x] Create `src/schemas/vote.schema.ts` and `src/schemas/comment.schema.ts` validating vote toggling, reaction types, and comment content (3 to 5000 characters).
- [x] Implement `src/services/voting.service.ts` executing atomic transaction: check post lock status, toggle vote insertion or deletion, apply voterProfile.voteWeight to post totalScoreWeight, update totalVotesCount, and insert vote_activity_logs (Spec AC-01, AC-02, Flow Primary Path 1).
- [x] Auto-subscribe voter in `voting.service.ts` by creating post_subscriptions record if not present (Spec AC-05).
- [x] Implement `src/services/comment.service.ts` supporting recursive threaded tree building through parentId references (Spec AC-03, Flow Primary Path 2).
- [x] Implement internal note authorization guard in `comment.service.ts` filtering out isInternalNote = true comments whenever requester is not an active WorkspaceMember (Spec AC-04).
- [x] Ensure all exported functions contain explicit return type annotations and zero any types.
- [x] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-01): Voting toggles atomically; duplicate vote attempts trigger safe withdrawal (unvote) and decrement weight.
- Criterion 2 (AC-04): Public comment queries never return internal notes to unauthenticated or external voter profiles.
- Criterion 3 (Flow Exception Path): Voting or commenting on locked posts throws POST_LOCKED error.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
