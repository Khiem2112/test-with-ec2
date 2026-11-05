# Task: TASK-02 - Workspace and Identity Backend Services

- Feature: Workspace and Identity Management
- Governing Spec: docs/workspace-identity/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Implement strict TypeScript type definitions, Zod validation schemas, and core backend services for multi-tenant workspace management, role-based access control, and unified voter profile resolution.

## Technical Context And Dependencies

- Pre-requisites: prisma/schema.prisma generated client, src/lib/prisma.ts.
- Reusable Assets: src/types/index.ts, src/services/config.service.ts.
- Target Files:
  - `src/types/workspace.ts`
  - `src/schemas/workspace.schema.ts`
  - `src/services/workspace.service.ts`
  - `src/services/identity.service.ts`

## Checklist

- [ ] Create `src/types/workspace.ts` declaring strict type models for Workspace, WorkspaceMember, UserSession, and VoterProfile.
- [ ] Create `src/schemas/workspace.schema.ts` with Zod validation schemas for workspace creation, member invitation, role mutation, and voter resolution.
- [ ] Implement `src/services/workspace.service.ts` ensuring all queries enforce workspace isolation invariants.
- [ ] Implement `src/services/identity.service.ts` supporting Registered users, SSO JWT token validation, and SHA-256 device fingerprint resolution with default voteWeight of 1.00.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Ensure code comments explain business logic directly without sequential numbered steps.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Workspace creation enforces unique slug constraints and assigns OWNER role to the creator.
- Criterion 2: Voter profile resolution correctly resolves or creates voter profiles based on externalUserId or fingerprintHash.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
