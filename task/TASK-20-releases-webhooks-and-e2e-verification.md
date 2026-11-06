# Task: TASK-20 - Release Publishing, Webhooks Console and End-to-End Flow Verification

- Feature: Release Publishing, Webhook Management and End-to-End Verification
- Governing Flow: All 6 Operational Flows in [docs/](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs)
- Governing Spec: All 6 Technical Specifications in [docs/](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs)
- Scope: shared
- Status: Completed

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Release Management and Changelog Editor Page (`src/app/admin/workspaces/[slug]/releases/page.tsx`).
  - Webhooks Configuration Console (`src/app/admin/workspaces/[slug]/webhooks/page.tsx`).
  - End-to-end customer journey testing across Public Portal, Board, Post Detail, Roadmap, Changelog, and Admin.
- Flow Journeys:
  - PM creates a new release version (e.g. v1.2.0), attaches completed roadmap posts as ReleaseItems, drafts changelog notes via ChangelogEditor, and publishes the release.
  - Publishing release triggers webhooks with HMAC signature and dispatches FEATURE_RELEASED notifications to subscribers.
  - Admin configures outbound webhook endpoints, subscribes to event types, and triggers test delivery pings.

## Objective

Deliver the Release Management and Webhook configuration pages, update Task Queue progress documentation, and execute full end-to-end verification across both frontend and backend compilation gates.

## Technical Context And Dependencies

- Pre-requisites: TASK-15 through TASK-19 completed.
- Reusable Assets: src/services/release.service.ts, src/services/changelog.service.ts, src/services/webhook.service.ts, src/components/changelog/changelog-editor.tsx.
- Target Files:
  - `src/app/admin/workspaces/[slug]/releases/page.tsx`
  - `src/app/admin/workspaces/[slug]/webhooks/page.tsx`
  - `task/README.md`
  - `package.json`

## Checklist

- [x] Implement `src/app/admin/workspaces/[slug]/releases/page.tsx` displaying existing release versions, modal to create new release version, and embedding ChangelogEditor for drafting notes.
- [x] Implement `src/app/admin/workspaces/[slug]/webhooks/page.tsx` displaying registered webhook subscriptions, secret generator, event checkboxes, and manual ping test button.
- [x] Update `task/README.md` adding TASK-15 through TASK-20 to the progress tracking table with accurate scope and links.
- [x] Execute `npm run check:be` (typecheck) and verify exit code 0.
- [x] Execute `npm run check:fe` (build and lint) and verify exit code 0.
- [x] Audit repository files ensuring zero icons, emojis, and numbered comments are present.
- [x] Run overall `npm run check` and confirm complete verification gate passes with exit code 0.

## Acceptance Criteria

- Criterion 1: Admin release screen allows selecting completed posts, drafting markdown notes in ChangelogEditor, and setting status to PUBLISHED.
- Criterion 2: Webhooks screen allows managing endpoints and verifying HMAC signatures.
- Criterion 3: Next.js production build (`next build`) compiles without missing layout, page, or type declaration errors.
- Criterion 4: All 6 user journeys operate continuously without manual URL hacking or unhandled client exceptions.
- Criterion 5: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run build`

