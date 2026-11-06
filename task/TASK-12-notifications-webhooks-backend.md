# Task: TASK-12 - Notifications, Subscriptions and Webhooks Backend Services

- Feature: Notifications, Subscriptions, Webhooks and Audit Logging
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/implementation-plans/v1.md)
- Scope: backend
- Status: Completed

## Flow & Spec Traceability

- Governing Invariants:
  - Asynchronous Dispatch Invariant: High-volume notifications and webhook dispatches must run asynchronously without causing API latency.
  - HMAC SHA-256 Webhook Integrity Invariant: All outbound webhook payloads must be authenticated via header X-RoadmapHub-Signature: sha256=<hex> generated with subscription secretKey.
  - Immutable Audit Log Invariant: Entries in audit_logs are append-only; update and delete operations are prohibited.
- Flow Journeys Implemented:
  - Flow Primary Path 1: Luong Tu Dong Theo Doi Va Phat Thong Bao Tien Do - Auto-subscribe post creators, voters, and commenters; notify subscribers upon status changes and release publications.
  - Flow Primary Path 2: Luong Phat Su Kien Webhook Toi Doi Tac Ben Ngoai - Webhook registration with 32-character secretKey, HMAC SHA-256 signing, event filtering, and exponential backoff retry scheduling.
- Spec Acceptance Criteria Mapped:
  - AC-01: Auto-subscription registers records in post_subscriptions with configurable notifyEmail and notifyInApp flags.
  - AC-02: Endpoint GET /api/v1/notifications returns user inbox with unread count; PATCH /api/v1/notifications/[id]/read marks item read.
  - AC-03: Webhook registration generates 32-char random secretKey and validates event array.
  - AC-04: Webhook dispatcher attaches X-RoadmapHub-Signature HMAC SHA-256 header and handles retries.
  - AC-05: Immutable audit logging records actor, entity, action, IP address, and JSON diff details.

## Objective

Build backend types, Zod validation schemas, auto-subscription triggers, in-app notification inbox services, HMAC SHA-256 webhook dispatchers, and immutable audit logging.

## Technical Context And Dependencies

- Pre-requisites: TASK-10 completed and verified.
- Reusable Assets: src/types/roadmap.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/notification.ts`
  - `src/schemas/notification.schema.ts`
  - `src/schemas/webhook.schema.ts`
  - `src/services/subscription.service.ts`
  - `src/services/notification.service.ts`
  - `src/services/webhook.service.ts`
  - `src/services/audit.service.ts`

## Checklist

- [x] Create `src/types/notification.ts` defining types for PostSubscription, Notification, WebhookSubscription, and AuditLog according to Spec Section 2.
- [x] Create `src/schemas/notification.schema.ts` and `src/schemas/webhook.schema.ts` defining Zod validation schemas.
- [x] Implement `src/services/subscription.service.ts` managing auto-subscription on post creation, voting, and commenting with independent channel toggles (Spec AC-01, Flow Primary Path 1).
- [x] Implement `src/services/notification.service.ts` generating notifications by type (STATUS_CHANGED, NEW_COMMENT, OFFICIAL_RESPONSE, FEATURE_RELEASED, MENTIONED) and tracking read state (Spec AC-02).
- [x] Implement `src/services/webhook.service.ts` generating crypto-secure 32-character secretKey, computing HMAC SHA-256 hex digest header, and queueing webhook deliveries (Spec AC-03, AC-04, Flow Primary Path 2).
- [x] Implement `src/services/audit.service.ts` providing append-only audit logging with actor userId, workspaceId, entityType, entityId, IP address, and details JSON (Spec AC-05).
- [x] Ensure all exported functions contain explicit return type annotations and zero any types.
- [x] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-01): Creators, voters, and commenters are automatically registered in post_subscriptions.
- Criterion 2 (AC-04): Outbound webhooks include X-RoadmapHub-Signature computed with HMAC SHA-256 and secretKey.
- Criterion 3 (AC-05): Audit log records cannot be updated or deleted.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
