---
name: functional-review
description: >
  Verifies implementation behavior against approved flows, specifications, business rules, and acceptance criteria without applying coding-convention rules. Use through code-review when mode=functional or mode=both.
---

# Functional Review Protocol

This skill focuses exclusively on verifying observable behavioral correctness, business logic, state transitions, and error recovery against governing specifications.

## Review Dimensions

1. Acceptance Criteria Traceability:
   - Map every criterion from the spec or task definition to code lines.
   - Confirm that all criteria are fully satisfied under both happy path and failure scenarios.

2. State & Boundary Handling:
   - Initial & Empty States: Verify how the system handles empty collections or zero search results.
   - Loading & Pending States: Confirm asynchronous operations correctly manage intermediate states.
   - Error Recovery: Verify that network timeouts, bad inputs, and server errors surface helpful messages and allow retry.

3. Consequential Actions & Data Integrity:
   - Ensure critical mutations require explicit confirmation.
   - Verify that database transactions are atomic where multiple mutations occur.
   - Ensure state updates preserve prior user inputs upon validation errors.

4. Defect Reporting:
   - Record exact file path and line numbers.
   - Explain the divergence between expected behavior and actual implementation.
   - Suggest concrete functional remediations.

