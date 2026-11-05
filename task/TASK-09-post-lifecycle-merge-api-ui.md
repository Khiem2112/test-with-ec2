# Task: TASK-09 - Post Lifecycle and Merge Engine API and UI Components

- Feature: Post Lifecycle and Merge Engine
- Governing Spec: docs/post-lifecycle-merge/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Build API route handlers for status transitions and post merging, alongside administrative UI dialogs and slide-over preview drawers for managing feedback lifecycles.

## Technical Context And Dependencies

- Pre-requisites: TASK-08 completed and verified.
- Reusable Assets: src/services/status.service.ts, src/services/merge-engine.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/status.actions.ts`
  - `src/actions/merge.actions.ts`
  - `src/app/api/v1/posts/[id]/status/route.ts`
  - `src/app/api/v1/posts/[id]/merge/route.ts`
  - `src/components/lifecycle/status-transition-dialog.tsx`
  - `src/components/lifecycle/merge-drawer.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/posts/[id]/status/route.ts` handling PATCH requests to update post status and log change notes.
- [ ] Implement `src/app/api/v1/posts/[id]/merge/route.ts` handling POST requests for merge preview evaluation and final atomic execution.
- [ ] Implement Server Actions in `src/actions/status.actions.ts` and `src/actions/merge.actions.ts`.
- [ ] Create `src/components/lifecycle/status-transition-dialog.tsx` with status selection dropdown, public change note input, and notify subscriber toggle.
- [ ] Create `src/components/lifecycle/merge-drawer.tsx` displaying side-by-side post comparisons, transferred vote breakdown, and confirmation challenge.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Status transition requires Product Manager or Admin role and validates status category transitions.
- Criterion 2: Merge drawer displays clear visual warning of irreversible source post closure before executing merge.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
