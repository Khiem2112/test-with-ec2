# Task: TASK-03 - Workspace and Identity API Handlers and UI Components

- Feature: Workspace and Identity Management
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/implementation-plans/v1.md)
- Scope: frontend
- Status: Completed

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Workspace Creation Page (Flow Section: UI Surfaces & Touchpoints - Standalone Onboarding Page).
  - Workspace Settings Shell (`/admin/workspaces/[slug]/settings` - Master-Detail Page for logo, color hex, custom domain).
  - Team Members Management Drawer (`/admin/workspaces/[slug]/members` - Table with Drawer to invite staff and assign RBAC roles).
  - Public Portal Header (`/[workspaceSlug]` - Sticky Header displaying logo and current voter identity).
  - Voter Profile Identification Modal (Dialog prompting guests to identify before voting/commenting).
- Flow Journeys Implemented:
  - Flow Primary Path 1: Live branding preview and kebab-case slug generation during workspace onboarding.
  - Flow Primary Path 2: Team member invitation via email and role mutation.
  - Flow Primary Path 3: Voter profile identification modal workflow.
  - Flow Exception Path 1: Validation Error Path - Display inline red error "Duong dan dinh danh da duoc su dung, vui long chon ten khac" on slug conflict without clearing form inputs.
  - Flow Exception Path 2: Unauthorized Access Path - Block Developer role from system configuration routes with HTTP 403 Forbidden.
- Spec Contracts Mapped:
  - Spec Section 4.1: POST /api/v1/workspaces (201 Created vs 409 Conflict).
  - Spec Section 4.2: POST /api/v1/voter-profiles/resolve (200 OK with voter resolution payload).

## Objective

Deliver Next.js App Router API route handlers, Server Actions, and user-facing onboarding and member management interfaces adhering strictly to the approved flow and design touchpoints.

## Technical Context And Dependencies

- Pre-requisites: TASK-02 completed and verified.
- Reusable Assets: src/services/workspace.service.ts, src/services/identity.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/workspace.actions.ts`
  - `src/app/api/v1/workspaces/route.ts`
  - `src/app/api/v1/voter-profiles/resolve/route.ts`
  - `src/components/workspace/workspace-onboarding-form.tsx`
  - `src/components/workspace/team-members-drawer.tsx`
  - `src/components/workspace/voter-identity-modal.tsx`

## Checklist

- [x] Implement `src/app/api/v1/workspaces/route.ts` handling POST requests conforming to Spec Section 4.1 contract with HTTP 201/409 responses.
- [x] Implement `src/app/api/v1/voter-profiles/resolve/route.ts` conforming to Spec Section 4.2 contract.
- [x] Implement Server Actions in `src/actions/workspace.actions.ts` with RBAC permission validation checking for OWNER and ADMIN roles.
- [x] Create `src/components/workspace/workspace-onboarding-form.tsx` featuring kebab-case auto-slug formatting, real-time slug collision check, branding color pickers, and live branding preview.
- [x] Create `src/components/workspace/team-members-drawer.tsx` supporting staff invitation by email and role assignment (Product Manager, Developer, Moderator).
- [x] Create `src/components/workspace/voter-identity-modal.tsx` implementing the Voter Profile Identification touchpoint.
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-01 & Spec 4.1): Creating a workspace returns 201 with created record; duplicate slug returns 409 with SLUG_ALREADY_EXISTS.
- Criterion 2 (Flow Exception Path): Inline validation displays error without resetting form state when slug already exists.
- Criterion 3 (Flow Touchpoints): Voter identification modal allows toggling between system login and anonymous guest mode.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
