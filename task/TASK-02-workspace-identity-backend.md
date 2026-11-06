# Task: TASK-02 - Workspace and Identity Backend Services

- Feature: Workspace and Identity Management
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/implementation-plans/v1.md)
- Scope: backend
- Status: Completed

## Flow & Spec Traceability

- Governing Invariant: Tenant Isolation Invariant (Every query and administrative mutation must be strictly scoped by workspace_id).
- Flow Journeys Implemented:
  - Flow Primary Path 1: Luong Khoi Tao Khong Gian Lam Viec Va Thiet Lap Nhan Dien Thuong Hieu (Step Initiation, Step Configuration, Step Confirmation).
  - Flow Primary Path 2: Luong Moi Thanh Vien Noi Bo Va Phan Quyen RBAC (Role assignment for Owner, Admin, Product Manager, Developer, Moderator).
  - Flow Primary Path 3: Luong Dinh Danh Khach Hang - Voter Profile Resolution (Registered User, SSO JWT, Anonymous Device Fingerprint).
  - Flow Exception Path: Validation Error Path (slug collision) and Unauthorized Access Path (RBAC forbidden).
- Spec Acceptance Criteria Mapped:
  - AC-01: Unique workspace slug enforcement and automatic creator OWNER membership assignment.
  - AC-02: Support for customDomain and brandingConfig JSON.
  - AC-03: Strict multi-tenant RBAC access controls.
  - AC-04: VoterProfile resolution via (workspaceId, externalUserId) or (workspaceId, fingerprintHash) with default voteWeight 1.00.
  - AC-05: UserSession persistence with tokenHash and expiration timestamps.

## Objective

Build strict domain types, Zod schemas, and core backend services for multi-tenant workspace management, role-based access control, session validation, and unified voter profile resolution.

## Technical Context And Dependencies

- Pre-requisites: prisma/schema.prisma generated client in src/generated/prisma.
- Reusable Assets: src/types/index.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/workspace.ts`
  - `src/schemas/workspace.schema.ts`
  - `src/services/workspace.service.ts`
  - `src/services/identity.service.ts`

## Checklist

- [x] Create `src/types/workspace.ts` defining strict type models for Workspace, WorkspaceMember, UserSession, and VoterProfile according to Spec Section 2.
- [x] Create `src/schemas/workspace.schema.ts` defining Zod validation schemas for workspace creation, brandingConfig JSON, member invitation, role mutation, and voter resolution payloads.
- [x] Implement `src/services/workspace.service.ts` with createWorkspace, getWorkspaceBySlug, updateWorkspaceBranding, and inviteMember ensuring all queries strictly enforce the Tenant Isolation Invariant.
- [x] Enforce automated OWNER role assignment in `workspace.service.ts` when a workspace is created (Spec AC-01, Flow Step Confirmation).
- [x] Implement `src/services/identity.service.ts` providing resolveVoterProfile supporting Registered accounts, SSO JWT decoding, and device fingerprint SHA-256 hashing with default voteWeight 1.00 (Spec AC-04, Flow Primary Path 3).
- [x] Implement session validation and expiry check in `identity.service.ts` (Spec AC-05).
- [x] Ensure all exported functions contain explicit return type annotations and zero any types.
- [x] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-01): Workspace creation generates unique kebab-case slug and assigns creator as OWNER.
- Criterion 2 (AC-04): Voter resolution correctly retrieves existing or persists new VoterProfile without duplicates.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
