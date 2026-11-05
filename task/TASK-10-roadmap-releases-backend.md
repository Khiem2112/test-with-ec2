# Task: TASK-10 - Interactive Roadmap and Release Versions Backend Services

- Feature: Interactive Roadmap, Release Versions and Changelog
- Governing Operational Flow: [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md)
- Governing Technical Spec: [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md)
- Implementation Plan: [implementation-plans/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/implementation-plans/v1.md)
- Scope: backend
- Status: Pending

## Flow & Spec Traceability

- Governing Invariants:
  - Roadmap Visibility Invariant: The public roadmap Kanban view must only expose columns for statuses where showOnRoadmap = true.
  - Score-based Ranking Invariant: Cards within each Kanban column must be ordered descending by totalScoreWeight.
  - Release-Changelog Synchronization Invariant: Publishing a changelog updates release_versions.isPublished and dispatches notification events to all subscribers of linked release_items.
- Flow Journeys Implemented:
  - Flow Primary Path 1: Luong Dieu Phoi Tien Do Tren Bang Kanban Lo Trinh - Retrieving column structure, grouping cards by status, and synchronizing status mutations.
  - Flow Primary Path 2: Luong Dong Goi Phien Ban Va Xuat Ban Changelog - Creating ReleaseVersion with targetDate, linking completed posts via release_items, and publishing markdown changelog entries.
- Spec Acceptance Criteria Mapped:
  - AC-01: Endpoint GET /api/v1/roadmap returns Kanban columns filtered by showOnRoadmap = true and sorted by totalScoreWeight descending.
  - AC-02: Kanban card movement triggers status synchronization via PATCH /api/v1/posts/[id]/status and appends to post_status_histories.
  - AC-03: Manage ReleaseVersion with uniqueness constraint @@unique([workspaceId, versionName]).
  - AC-04: Attach completed posts to release versions via ReleaseItem.
  - AC-05: Compose and publish Changelog with markdown body, setting isPublished = true and dispatching subscriber notifications.

## Objective

Build backend types, Zod validation schemas, Kanban column grouping services, release packaging logic, and changelog publishing services.

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

- [ ] Create `src/types/roadmap.ts` defining types for RoadmapView, RoadmapColumn, ReleaseVersion, ReleaseItem, and Changelog according to Spec Section 2.
- [ ] Create `src/schemas/roadmap.schema.ts` defining Zod validation schemas for roadmap query filters, release version payload, and changelog markdown submission.
- [ ] Implement `src/services/roadmap.service.ts` with getRoadmapColumns retrieving active statuses where showOnRoadmap = true and fetching posts ordered by totalScoreWeight descending (Spec AC-01, Flow Primary Path 1).
- [ ] Implement `src/services/release.service.ts` supporting createReleaseVersion with unique versionName per workspace, and attachCompletedPosts to link posts via release_items (Spec AC-03, AC-04, Flow Primary Path 2).
- [ ] Implement `src/services/changelog.service.ts` supporting draft creation, markdown rendering, and publishing with publishedAt timestamp (Spec AC-05).
- [ ] Ensure all exported functions contain explicit return type annotations and zero any types.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1 (AC-01): Roadmap columns contain only statuses with showOnRoadmap = true, and cards are sorted by totalScoreWeight descending.
- Criterion 2 (AC-03): Release version names enforce uniqueness within workspace scope.
- Criterion 3 (AC-05): Publishing a changelog marks release_versions.is_published = true.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check:be`
- Command 2: `npm run typecheck`
