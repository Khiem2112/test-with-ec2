# Feature Documentation Standards

Feature documentation is grouped by feature so each operational flow, UI design contract, and technical specification maintains an explicit, append-only version history.

## Document Directory Structure

```text
docs/
  <feature-name>/
    flows/
      v1.md
      v2-diff.md
    designs/
      v1.md
      v2-diff.md
    specs/
      v1.md
      v2-diff.md
    implementation-plans/
      v1.md
  templates/
    flow-v1.md
    ui-design-v1.md
    spec-v1.md
    implementation-plan-v1.md
    version-diff.md
```

- flows/: Contains implementation-neutral, approved user/operator journeys.
- designs/: Contains UI design contracts, screen inventory, and layout behavior.
- specs/: Contains technical specifications mapping flows to domain models, APIs, and file changes.
- implementation-plans/: Contains phase-gated execution plans, review checkpoints, and exit criteria.

## Versioning Rules

- v1.md is the complete baseline. It is never overwritten after approval.
- Every subsequent material revision is a delta-only document named v<N>-diff.md and must declare the prior version it modifies.
- Reconstruct the active requirement by reading the baseline v1.md plus every subsequent diff in ascending numerical order.
- A material flow or spec change must receive explicit approval in its new diff before implementation begins.
- Flow and Spec statuses: Draft, In review, Approved, Superseded.

## Active Feature Specifications Index

| Feature Directory | Operational Flow | Technical Specification | Scope & Core Responsibilities |
| :--- | :--- | :--- | :--- |
| `workspace-identity` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md) | Quan tri khong gian lam viec da to chuc, phan quyen RBAC va dinh danh VoterProfile (Registered, SSO JWT, Anonymous Fingerprint) |
| `feedback-posts` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/feedback-posts/specs/v1.md) | Tiep nhan gop y, tim kiem tuong dong chong trung lap (pg_trgm deduplication), quan ly Board, Category, Tag va tep dinh kem |
| `smart-voting-discussions` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/smart-voting-discussions/specs/v1.md) | Binh chon thong minh voi trong so theo cap bac tai khoan, giao dich nguyen tu toggle vote, thao luan da tang va ghi chu ky thuat noi bo |
| `post-lifecycle-merge` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/post-lifecycle-merge/specs/v1.md) | Vong doi trang thai tuy bien, dong co gop bai trung lap nguyen tu (Post Merge Engine) bao toan du lieu va so nhat ky trang thai |
| `roadmap-and-releases` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/roadmap-and-releases/specs/v1.md) | Bang lo trinh Kanban tuong tac keo tha, quan ly phien ban phat hanh (ReleaseVersion) va xuat ban nhat ky thay doi (Changelog) |
| `notifications-and-webhooks` | [flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/flows/v1.md) | [specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/notifications-and-webhooks/specs/v1.md) | Tu dong dang ky theo doi, thong bao in-app, phat su kien Webhooks co chu ky HMAC SHA-256 va so kiem toan he thong (AuditLog) |


