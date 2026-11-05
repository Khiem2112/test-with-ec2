# Specification: <Feature Name> v1

Copy this file to `docs/<feature-name>/specs/v1.md`. Inspect the actual codebase before declaring models, components, or API endpoints.

## Document Meta

| Property | Value |
| :--- | :--- |
| Feature Name | `<Feature Name>` |
| Spec Identifier | `SPEC_<FeatureName>` |
| Status | `Draft \| In review \| Approved \| Implemented` |
| Owner | `<name or role>` |
| Approver | `<name or role>` |
| Last Updated | `<YYYY-MM-DD>` |
| Governing Flow | `<link to docs/<feature>/flows/v1.md>` |
| Governing UI Design | `<link to docs/<feature>/designs/v1.md>` |

## Approval Record

- Status: `Pending | Approved`
- Approver: `<name or role>`
- Approval Date: `<YYYY-MM-DD>`
- Decision Notes: `<explicit constraints>`

## 1. Overview & Acceptance Criteria

- Objective: `<Problem solved and business value>`
- Target Actors: `<User roles using this feature>`
- Key Scenarios:
  - Scenario 1: `<Actor does action to achieve result>`
  - Scenario 2: `<Edge case or error recovery>`
- Observable Acceptance Criteria:
  - AC-01: `<Concrete testable requirement>`
  - AC-02: `<Concrete testable requirement>`
  - AC-03: `<Concrete testable requirement>`

## 2. Domain Entities & Persistence

- Primary Entities: `<Entity names and roles>`
- Related Entities: `<Foreign relations and cardinality>`
- Schema Changes:
  - `<Database table or Prisma model adjustments>`
  - `<Audit columns: createdAt, updatedAt, isActive>`
  - `<Migration and rollback strategy>`

## 3. Architecture & File Inventory

Inspect existing repository modules before defining changes:

| Action | File Path | Layer / Responsibility | Reused Precedents |
| :--- | :--- | :--- | :--- |
| `Create / Modify` | `<src/.../file.ts>` | `<Route / Controller / Service / Component>` | `<Reused helper or N/A>` |
| `Create / Modify` | `<src/.../file.ts>` | `<Data validation schema>` | `<Zod schema precedent>` |

## 4. API & Data Flow Contracts

### 4.1 Request & Response Contract

- Endpoint: `METHOD /api/v1/<resource>`
- Authentication: `<Required role or session>`
- Request Payload:
  ```json
  {
    "field": "value"
  }
  ```
- Success Response (200 / 201):
  ```json
  {
    "success": true,
    "data": {}
  }
  ```
- Error Responses (400 / 404 / 500):
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Descriptive message"
    }
  }
  ```

## 5. Implementation Phases & Review Checkpoints

| Phase | Deliverable | Scope | Dependencies | Review Mode | Validation Command | Exit Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `<Data layer & schema>` | `database` | `None` | `both` | `npm run check` | `Schema migrated, models valid` |
| `2` | `<Core business service>` | `backend` | `Phase 1` | `both` | `npm run check` | `Unit tests pass, typecheck 0` |
| `3` | `<UI component & wiring>` | `frontend` | `Phase 2` | `both` | `npm run check` | `Component renders, forms validate` |

