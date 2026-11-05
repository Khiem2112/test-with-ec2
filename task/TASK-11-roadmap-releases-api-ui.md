# Task: TASK-11 - Interactive Roadmap and Release Versions API and UI Components

- Feature: Interactive Roadmap, Release Versions and Changelog
- Governing Spec: docs/roadmap-and-releases/specs/v1.md
- Scope: frontend
- Status: Pending

## Objective

Deliver API route handlers for roadmap cards, releases, and changelogs, alongside Kanban board drag-and-drop interfaces and a two-column markdown changelog editor.

## Technical Context And Dependencies

- Pre-requisites: TASK-10 completed and verified.
- Reusable Assets: src/services/roadmap.service.ts, src/services/release.service.ts, src/components/atoms/button.tsx.
- Target Files:
  - `src/actions/roadmap.actions.ts`
  - `src/actions/release.actions.ts`
  - `src/app/api/v1/roadmap/route.ts`
  - `src/app/api/v1/releases/route.ts`
  - `src/app/api/v1/changelogs/route.ts`
  - `src/components/roadmap/kanban-board.tsx`
  - `src/components/changelog/changelog-editor.tsx`

## Checklist

- [ ] Implement `src/app/api/v1/roadmap/route.ts` handling public GET queries for Kanban columns and cards.
- [ ] Implement `src/app/api/v1/releases/route.ts` handling GET and POST for version tracking.
- [ ] Implement `src/app/api/v1/changelogs/route.ts` handling public changelog feed and administrative publishing.
- [ ] Implement Server Actions in `src/actions/roadmap.actions.ts` and `src/actions/release.actions.ts`.
- [ ] Create `src/components/roadmap/kanban-board.tsx` providing drag-and-drop cards between columns that synchronizes status mutations.
- [ ] Create `src/components/changelog/changelog-editor.tsx` with split-screen Markdown input and real-time rendered preview.
- [ ] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Dragging a card across columns updates the post status and automatically appends to post status history.
- Criterion 2: Public roadmap page is responsive across mobile, tablet, and desktop breakpoints without horizontal overflow.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run check:fe`
