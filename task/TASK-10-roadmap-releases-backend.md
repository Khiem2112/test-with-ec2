# Task: TASK-10 - Interactive Roadmap and Release Versions Backend Services

- Feature: Interactive Roadmap, Release Versions and Changelog
- Governing Spec: docs/roadmap-and-releases/specs/v1.md
- Scope: backend
- Status: Pending

## Objective

Implement backend domain types, Zod schemas, Kanban column grouping logic, release packaging, and changelog publishing services.

## Technical Context And Dependencies

- Pre-requisites: TASK-08 completed and verified.
- Reusable Assets: src/types/lifecycle.ts, src/lib/prisma.ts.
- Target Files:
  - `src/types/roadmap.ts`
  - `src/schemas/roadmap.schema.ts`
  - `src/services/roadmap.service.ts`
  - `src/services/release.service.ts`
  - `src/services/changelog.service.ts`

## Checklist

- [ ] Create `src/types/roadmap.ts` defining types for RoadmapView, RoadmapColumn, ReleaseVersion, ReleaseItem, and Changelog.
- [ ] Create `src/schemas/roadmap.schema.ts` defining Zod validation schemas for roadmap column query filters, release version dates, and changelog markdown bodies.
- [ ] Implement `src/services/roadmap.service.ts` retrieving posts grouped by statuses with showOnRoadmap = true and sorted descending by totalScoreWeight.
- [ ] Implement `src/services/release.service.ts` handling CRUD for release versions and linking completed posts via release items.
- [ ] Implement `src/services/changelog.service.ts` supporting markdown rendering, draft state toggling, and publishing triggers.
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Roadmap service returns only statuses configured with showOnRoadmap = true.
- Criterion 2: Publishing a changelog links release version items and marks publishedAt timestamp.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
