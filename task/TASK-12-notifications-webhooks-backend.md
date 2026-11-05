# Task: TASK-12 - Notifications, Subscriptions and Webhooks Backend Services

- Feature: Notifications, Subscriptions, Webhooks and Audit Logging
- Governing Spec: docs/notifications-and-webhooks/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Build backend types, Zod schemas, auto-subscription lifecycle triggers, in-app notification inbox services, HMAC SHA-256 webhook dispatchers, and immutable audit logging.

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

- [ ] Create `src/types/notification.ts` declaring types for PostSubscription, Notification, WebhookSubscription, and AuditLog.
- [ ] Create `src/schemas/notification.schema.ts` and `src/schemas/webhook.schema.ts` with Zod validation contracts.
- [ ] Implement `src/services/subscription.service.ts` managing auto-subscription on post creation, voting, and commenting.
- [ ] Implement `src/services/notification.service.ts` dispatching in-app notifications and tracking read receipts.
- [ ] Implement `src/services/webhook.service.ts` generating 32-character secret keys and creating HMAC SHA-256 signatures in X-RoadmapHub-Signature headers.
- [ ] Implement `src/services/audit.service.ts` providing immutable append-only records with actor, action, IP address, and JSON diff details.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Webhook dispatch signs request payloads with valid HMAC SHA-256 hex digest using the subscription secretKey.
- Criterion 2: Audit log records cannot be updated or deleted through the service interface.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
