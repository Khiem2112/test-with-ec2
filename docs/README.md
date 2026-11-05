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
