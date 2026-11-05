# Task: TASK-06 - Smart Voting and Nested Discussions Backend Services

- Feature: Smart Voting and Nested Discussions
- Governing Spec: docs/smart-voting-discussions/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Implement atomic transactional voting with tier weight calculations, anti-fraud audit logging, recursive comment tree structuring, and confidential internal notes filtering.

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

- [ ] Create `src/types/discussion.ts` declaring types for Vote, VoteActivityLog, Comment, CommentReaction, and CommentTreeNode.
- [ ] Create `src/schemas/vote.schema.ts` and `src/schemas/comment.schema.ts` defining validation contracts for votes, comments, and reactions.
- [ ] Implement `src/services/voting.service.ts` executing atomic transactions to toggle vote/unvote, update post vote count and total score weight based on voter tier.
- [ ] Implement fraud prevention in `voting.service.ts` recording IP address hash and user agent into vote_activity_logs.
- [ ] Implement `src/services/comment.service.ts` supporting nested reply hierarchy through parentId linking.
- [ ] Enforce security boundary in `comment.service.ts` strictly stripping out internal notes (isInternalNote = true) when requested by non-team members.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Toggling vote operates inside an isolated database transaction ensuring post vote counts match active vote records.
- Criterion 2: Public API queries never expose internal team notes to unauthenticated or external voter profiles.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
