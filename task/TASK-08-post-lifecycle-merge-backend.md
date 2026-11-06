# Task: TASK-08 - Post Lifecycle and Merge Engine Backend Services

- Feature: Post Lifecycle and Merge Engine
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/implementation-plans/v1.md)
- Scope: backend
- Status: Completed

## Flow & Spec Traceability

- Governing Invariants:
  - Immutable Post Merge Invariant: A merged post must never be removed from the database; it must be permanently locked with mergedIntoPostId linking to the target post.
  - Roadmap State-to-Subscriber Sync Invariant: Every status mutation must append to post_status_histories and trigger subscriber event dispatching.
  - Circular Merge Prevention Invariant: Merge operations must reject self-merging and circular reference chains.
- Flow Journeys Implemented:
  - Flow Primary Path 1: Luong Chuyen Doi Trang Thai Tinh Nang - Status transition with changeNote, writing to post_status_histories and audit_logs.
  - Flow Primary Path 2: Luong Gop Bai Viet Trung Lap - Post Merge Engine calculating Merge Preview, transferring non-duplicate votes, recalculating score weights, and migrating subscribers.
  - Flow Exception Path: Circular merge detection and self-merge prevention throwing CIRCULAR_MERGE_DETECTED.
- Spec Acceptance Criteria Mapped:
  - AC-01: Custom post statuses management grouped by categories: BACKLOG, UNSCHEDULED, PLANNED, IN_PROGRESS, COMPLETED, CLOSED, DECLINED.
  - AC-02: Endpoint PATCH /api/v1/posts/[id]/status records post_status_histories and audit_logs in a single transaction.
  - AC-03: Endpoint POST /api/v1/posts/[id]/merge-preview calculates transferable votes, duplicate vote discards, and subscriber migrations.
  - AC-04: Endpoint POST /api/v1/posts/[id]/merge executes atomic merge transaction and locks source post.
  - AC-05: Validation strictly prevents self-merge, circular merges, or merging into an already merged post.

## Objective

Build custom post status lifecycle management, audit history logging, and atomic post merge engine with non-duplicate vote transfer, subscriber migration, and circular merge cycle detection.

## Technical Context And Dependencies

- Pre-requisites: TASK-06 completed and verified.
- Reusable Assets: src/types/discussion.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/lifecycle.ts`
  - `src/schemas/lifecycle.schema.ts`
  - `src/services/status.service.ts`
  - `src/services/merge-engine.service.ts`

## Checklist

- [x] Create `src/types/lifecycle.ts` defining types for PostStatus, PostStatusHistory, PostMergeHistory, and MergePreviewResult according to Spec Section 2.
- [x] Create `src/schemas/lifecycle.schema.ts` defining Zod validation schemas for status transition payloads and merge target validation.
- [x] Implement `src/services/status.service.ts` with updatePostStatus executing database transaction: mutating post.statusId, inserting post_status_histories with changeNote, and writing audit_logs (Spec AC-01, AC-02, Flow Primary Path 1).
- [x] Implement previewMerge in `src/services/merge-engine.service.ts` calculating transferable votes, duplicate votes to discard, and subscriber migrations (Spec AC-03).
- [x] Implement executeMerge in `src/services/merge-engine.service.ts` executing atomic transaction: transfer valid votes, recalculate target post totalVotesCount and totalScoreWeight, migrate subscribers, set source post mergedIntoPostId = target.id, and record post_merge_histories (Spec AC-04, Flow Primary Path 2).
- [x] Implement cycle detection in `merge-engine.service.ts` checking for self-merge or recursive merge chains (Spec AC-05, Flow Exception Path).
- [x] Ensure all exported functions contain explicit return type annotations and zero any types.
- [x] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-02): Status changes atomically write to post_status_histories with old and new status references.
- Criterion 2 (AC-04): Merging preserves source post record without deletion and transfers only non-duplicate votes.
- Criterion 3 (AC-05): Self-merge and circular merge throw CIRCULAR_MERGE_DETECTED error code.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
