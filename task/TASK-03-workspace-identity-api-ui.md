# Task: TASK-03 - Workspace and Identity API Handlers and UI Components

- Feature: Workspace and Identity Management
- Governing Spec: docs/workspace-identity/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Deliver Next.js App Router API route handlers, Server Actions, and user-facing onboarding and voter profile resolution interfaces according to the approved design contracts.

## Technical Context And Dependencies

- Pre-requisites: TASK-02 completed and verified.
- Reusable Assets: src/services/workspace.service.ts, src/services/identity.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/workspace.actions.ts`
  - `src/app/api/v1/workspaces/route.ts`
  - `src/app/api/v1/voter-profiles/resolve/route.ts`
  - `src/components/workspace/workspace-onboarding-form.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/workspaces/route.ts` handling POST requests to register workspaces with slug uniqueness checking.
- [ ] Implement `src/app/api/v1/voter-profiles/resolve/route.ts` handling POST requests for voter identity resolution.
- [ ] Implement `src/actions/workspace.actions.ts` providing type-safe Server Actions for workspace settings and member role updates.
- [ ] Create `src/components/workspace/workspace-onboarding-form.tsx` providing form inputs for workspace name, slug, domain, and branding colors.
- [ ] Ensure non-member access to protected administrative actions returns HTTP 403 Forbidden.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: API returns HTTP 201 on valid workspace creation and HTTP 409 on duplicate slug collision.
- Criterion 2: Onboarding form provides real-time slug formatting and client-side validation errors before submission.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
