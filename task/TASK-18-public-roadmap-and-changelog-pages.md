# Task: TASK-18 - Public Roadmap Kanban and Release Changelog Pages

- Feature: Roadmap Visualization and Changelog Delivery
- Governing Flow: [docs/roadmap-and-releases/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md)
- Governing Spec: [docs/roadmap-and-releases/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md)
- Scope: frontend
- Status: Completed

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Public Roadmap Kanban Page (`src/app/[workspaceSlug]/roadmap/page.tsx`).
  - Public Changelog Feed Page (`src/app/[workspaceSlug]/changelog/page.tsx`).
  - KanbanBoard and KanbanCard interactive widgets.
- Flow Journeys:
  - Customer navigates to `/[workspaceSlug]/roadmap` to inspect features planned, in development, and recently launched.
  - Kanban board organizes posts into status columns (Backlog, Planned, In Progress, Completed) with live card counts.
  - Customer clicks a card to navigate directly to its post detail page or votes inline.
  - Customer navigates to `/[workspaceSlug]/changelog` to review released versions, release dates, summary release notes, and tagged completed posts.

## Objective

Implement public pages for the Interactive Roadmap Kanban and the Release Changelog feed, hooking up server-side data fetching and responsive column layouts.

## Technical Context And Dependencies

- Pre-requisites: TASK-16 completed and verified.
- Reusable Assets: src/services/roadmap.service.ts, src/services/release.service.ts, src/services/changelog.service.ts, src/components/roadmap/kanban-board.tsx, src/components/roadmap/kanban-card.tsx.
- Target Files:
  - `src/app/[workspaceSlug]/roadmap/page.tsx`
  - `src/app/[workspaceSlug]/changelog/page.tsx`
  - `src/components/roadmap/kanban-board.tsx`
  - `src/components/roadmap/kanban-card.tsx`

## Checklist

- [x] Implement `src/app/[workspaceSlug]/roadmap/page.tsx` fetching roadmap columns and associated posts via roadmap.service.ts.
- [x] Connect `KanbanBoard` and `KanbanCard` rendering columns with custom status colors, item count badges, and click-through navigation to post detail.
- [x] Restyle Kanban board to match the Linear dark design system (horizontal scroll on mobile, charcoal surface columns, hairline borders).
- [x] Implement `src/app/[workspaceSlug]/changelog/page.tsx` fetching published releases and associated changelogs.
- [x] Render changelog feed with version badges, release dates, rendered markdown release notes, and linked feature tags.
- [x] Run `npm run check` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (Flow Path 1): Roadmap page renders columns grouped by status category with post count headers and cards showing votes and titles.
- Criterion 2 (Flow Path 2): Changelog page lists published versions in reverse chronological order with formatted markdown content.
- Criterion 3: Layout scales cleanly across mobile and desktop breakpoints without layout breaks or horizontal overflow bugs.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run typecheck`
- Command 2: `npm run lint`

