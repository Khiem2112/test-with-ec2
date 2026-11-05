# Task: TASK-08 - Post Lifecycle and Merge Engine Backend Services

- Feature: Post Lifecycle and Merge Engine
- Governing Spec: docs/post-lifecycle-merge/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Build custom post status lifecycle management, audit history logging, and atomic post merge engine with non-duplicate vote transfer, subscriber migration, and circular merge detection.

## Technical Context And Dependencies

- Pre-requisites: TASK-06 completed and verified.
- Reusable Assets: src/types/discussion.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/lifecycle.ts`
  - `src/schemas/lifecycle.schema.ts`
  - `src/services/status.service.ts`
  - `src/services/merge-engine.service.ts`

## Checklist

- [ ] Create `src/types/lifecycle.ts` defining types for PostStatus, PostStatusHistory, PostMergeHistory, and MergePreviewResult.
- [ ] Create `src/schemas/lifecycle.schema.ts` defining validation schemas for status transition payloads and merge actions.
- [ ] Implement `src/services/status.service.ts` managing custom status lifecycle and recording every status mutation into post_status_histories.
- [ ] Implement merge preview calculations in `src/services/merge-engine.service.ts` evaluating distinct voters, duplicate votes to discard, and subscriber transfers.
- [ ] Implement atomic execution in `merge-engine.service.ts` to transfer votes, recalculate destination score, lock source post with mergedIntoPostId, and write post_merge_histories.
- [ ] Add cycle detection in `merge-engine.service.ts` preventing self-merges and circular merge references.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Merging post B into post A never deletes post B and locks it with mergedIntoPostId = A.id.
- Criterion 2: Voters who voted on both post A and post B have duplicate votes safely discarded, preserving accurate totalScoreWeight.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
