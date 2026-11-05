# Implementation Plan: <Feature Name> v1

- Governing Spec: <docs/<feature>/specs/v1.md>
- Owner: <name or role>
- Status: Draft | In progress | Complete

## Phase Gates

| Phase | Scope | Changes | Dependencies | Review Mode & Scope | Validation Command | Exit Criteria | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Phase 1` | `backend` | `<Deliverable files>` | `None` | `mode=both scope=backend` | `npm run check` | `Exit code 0, AC-01 verified` | `Pending` |
| `Phase 2` | `frontend` | `<Deliverable files>` | `Phase 1` | `mode=both scope=frontend` | `npm run check` | `Exit code 0, AC-02 verified` | `Pending` |

## Review & Fix Log

| Phase Checkpoint | Finding Description | Severity | Remediation Applied | Automated Verification | Re-Review Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<Phase ID>` | `<None or issue>` | `Critical / High / Medium / Low` | `<Remediation>` | `npm run check exit 0` | `PASS / FAIL` |

## Delivery Verification Checklist

- [ ] All phases verified with explicit exit criteria and evidence.
- [ ] Functional review traces back to approved flow and spec.
- [ ] Convention review verifies strict typing, architectural layering, zero emojis, and zero numbered comments.
- [ ] All Critical and High findings remediated and re-reviewed.
- [ ] Automated verification gate exits with code 0 on final consolidated codebase.
