# Task: TASK-11 - Interactive Roadmap and Release Versions API and UI Components

- Feature: Interactive Roadmap, Release Versions and Changelog
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/implementation-plans/v1.md)
- Scope: frontend
- Status: Pending

## Flow & Spec Traceability

- UI Surfaces & Touchpoints Implemented:
  - Public Roadmap Kanban Page (`/[workspaceSlug]/roadmap` - Full Width Page displaying columns, category filter chips, search input, and card summary badges).
  - Admin Kanban Board (`/admin/workspaces/[slug]/roadmap` - Interactive screen with full drag-and-drop capability between status columns).
  - Release Management Console (`/admin/workspaces/[slug]/releases` - Master-Detail Table to package completed posts into ReleaseItems).
  - Changelog Markdown Editor (Two-column Page with split-screen editing: left input, right live Markdown preview and attached feature list).
  - Public Changelog Archive (`/[workspaceSlug]/changelog` - Public feed with release notes, date badges, and direct links to original feedback posts).
- Flow Journeys Implemented:
  - Flow Primary Path 1: Product Manager drags cards across Kanban columns, triggering immediate post status updates with optional progress note popovers.
  - Flow Primary Path 2: PM packages completed features into a new release version and publishes the changelog, notifying feature subscribers.
- Spec Contracts Mapped:
  - Spec Section 4.1: GET /api/v1/roadmap?workspaceId=... (returns columns with statusId, name, colorHex, and posts array).
  - Spec Section 4.2: POST /api/v1/changelogs (creates and publishes changelog entry).

## Objective

Deliver API route handlers for roadmap cards, releases, and changelogs, alongside Kanban board drag-and-drop interfaces and a two-column markdown changelog editor.

## Technical Context And Dependencies

- Pre-requisites: TASK-10 completed and verified.
- Reusable Assets: src/services/roadmap.service.ts, src/services/release.service.ts, src/services/changelog.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/roadmap.actions.ts`
  - `src/actions/release.actions.ts`
  - `src/app/api/v1/roadmap/route.ts`
  - `src/app/api/v1/releases/route.ts`
  - `src/app/api/v1/changelogs/route.ts`
  - `src/components/roadmap/kanban-board.tsx`
  - `src/components/roadmap/kanban-card.tsx`
  - `src/components/changelog/changelog-editor.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/roadmap/route.ts` adhering to Spec Section 4.1 contract returning column groupings.
- [ ] Implement `src/app/api/v1/releases/route.ts` and `src/app/api/v1/changelogs/route.ts` conforming to Spec Section 4.2.
- [ ] Implement Server Actions in `src/actions/roadmap.actions.ts` and `src/actions/release.actions.ts`.
- [ ] Create `src/components/roadmap/kanban-card.tsx` rendering title, vote count pill, category chip, and comments count.
- [ ] Create `src/components/roadmap/kanban-board.tsx` supporting fluid drag-and-drop operations and category/tag filtering (Flow Touchpoints 1 & 2).
- [ ] Create `src/components/changelog/changelog-editor.tsx` providing split-screen markdown input with real-time preview (Flow Touchpoint 4).
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Spec 4.1 & Flow Path 1): Dragging a card between columns triggers status update and writes to post_status_histories.
- Criterion 2 (Flow Touchpoint 4): Changelog editor provides synchronized preview of headings, lists, and code blocks.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
