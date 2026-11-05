# Command Whitelist & Execution Policy

This policy governs which terminal commands agents are authorized to execute directly without triggering security prompts.

## Allowed Commands

The following commands are considered read-only, local static analysis, or standard repository inspection:

- Automated Verification & Testing:
  - `npm run check`
  - `npm run check:fe`
  - `npm run check:be`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test`
  - `npx tsc --noEmit`
- Repository Inspection:
  - `git status`
  - `git diff`
  - `git log`
  - `git branch`
- File System Navigation:
  - `ls`, `dir`, `Get-ChildItem`
  - `cat`, `Get-Content`

## Prohibited Without Explicit Approval

- Network commands making arbitrary outbound HTTP requests outside designated test APIs.
- Destructive git commands (`git reset --hard`, `git clean -f -d`, `git push --force`).
- Execution of foreign binary executables or unverified remote scripts.
- Bypass flags (`--dangerously-skip-permissions` is forbidden unless explicitly configured in local settings).
