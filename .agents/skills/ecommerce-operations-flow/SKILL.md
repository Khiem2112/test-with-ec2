---
name: ecommerce-operations-flow
description: >
  Defines implementation-neutral operational flows, durable states, decision branches, and error recovery before technical implementation.
---

# Operational Flow Modeling

This skill guides the creation of durable, implementation-neutral operational flows for web and commerce applications.

## Flow Principles

1. Implementation Neutrality:
   - Flows describe actor motivations, system feedback, decisions, and state transitions.
   - Do not bind flows to specific CSS classes, database tables, or framework APIs.

2. Explicit State Transitions:
   - Model all intermediate and terminal states: Pending, Active, Processing, Suspended, Completed, Failed.
   - Define exact entry and exit conditions for every transition.

3. Consequential Action Protection:
   - Identify destructive actions (deletions, payments, external syncs).
   - Require explicit two-step confirmation or undo time windows.

4. Resilient Error & Recovery Paths:
   - For every primary step, specify what happens when validation fails or connections drop.
   - Ensure the user never loses partially entered data upon an unexpected failure.
