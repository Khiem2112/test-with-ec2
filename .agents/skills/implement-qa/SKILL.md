---
name: implement-qa
description: >
  Q&A workflow when implementing features with ambiguous requirements: write questions into QA/QA-<task-id>.md and wait for user answers before guessing.
---

# Ambiguous Requirements Q&A Workflow

When an agent encounters ambiguous requirements, missing edge-case specifications, or conflicting domain rules during design or implementation:

## Protocol

1. Stop Speculation:
   - Never guess business logic or invent arbitrary default values for domain-critical rules.
   - Halt only the specific branch of work that depends on the unresolved decision.

2. Document Questions:
   - Create or update `QA/QA-<task-id>.md` using the standard Q&A template:
     ```markdown
     # QA: <Task ID or Feature Name>

     - Date: <YYYY-MM-DD>
     - Status: Awaiting User Input

     ## Question 1
     - Context: <Background and code/spec location>
     - Uncertainty: <Exact ambiguity or design choice>
     - Options Considered:
       - Option A: <Description and trade-offs>
       - Option B: <Description and trade-offs>
     - Impact: <What is blocked until this is resolved>
     ```

3. User Resolution:
   - The user records their decision directly into the QA document.
   - The agent reads the answers, marks status `Resolved`, and proceeds with implementation according to the user's decision.

