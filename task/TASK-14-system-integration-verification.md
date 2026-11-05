# Task: TASK-14 - System Integration and Full Verification Gate

- Feature: System Foundation & End-to-End Delivery Gate
- Governing Spec: All Active Feature Specifications
- Scope: shared
- Status: Pending

## Objective

Consolidate barrel exports across types, schemas, services, actions, and components; verify database seed data across all 20 Prisma models; and execute full pre-commit verification pipelines.

## Technical Context And Dependencies

- Pre-requisites: TASK-01 through TASK-13 completed.
- Reusable Assets: Entire codebase in src/, prisma/seed.ts.
- Target Files:
  - `src/index.ts`
  - `src/types/index.ts`
  - `src/services/index.ts`
  - `src/actions/index.ts`
  - `src/components/index.ts`

## Checklist

- [ ] Export all feature types cleanly in `src/types/index.ts` without circular dependencies.
- [ ] Export all domain services cleanly in `src/services/index.ts`.
- [ ] Export all server actions in `src/actions/index.ts`.
- [ ] Export reusable UI components in `src/components/index.ts`.
- [ ] Run `npx tsx prisma/seed.ts` to verify seed data integrity and foreign key cascades.
- [ ] Run automated gate `npm run check:be` (typecheck) and verify exit code 0.
- [ ] Run automated gate `npm run check:fe` (build and lint) and verify exit code 0.
- [ ] Audit repository files to confirm zero emojis, zero icons, and zero numbered comments.
- [ ] Run `npm run check` and verify overall exit code 0.

## Acceptance Criteria

- Criterion 1: All barrel files export their respective modules without namespace collision or build errors.
- Criterion 2: Database seed script executes cleanly and populates sample records across all 6 features without relation violations.
- Criterion 3: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run check`
- Command 2: `npm run test`
