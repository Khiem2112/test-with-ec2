# Task: TASK-15 - Design System Foundation, CSS Theme Tokens and Root App Shell

- Feature: Design System and Root Navigation Shell
- Governing Flow: [docs/workspace-identity/flows/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/flows/v1.md)
- Governing Spec: [docs/workspace-identity/specs/v1.md](file:///c:/University/Study/Programming/auto-flow/mock-projects/proj-1/docs/workspace-identity/specs/v1.md)
- Scope: frontend
- Status: Pending

## Flow and Spec Traceability

- UI Surfaces and Touchpoints:
  - Root Application Shell (`src/app/layout.tsx` and `src/app/page.tsx`).
  - Global CSS Theme Tokens (`src/app/globals.css` adhering to DESIGN.md dark palette).
  - Public Portal Navigation Header (`src/components/layout/public-header.tsx`).
  - Admin Console Navigation Sidebar (`src/components/layout/admin-sidebar.tsx`).
  - Client Voter and Session Context (`src/context/voter-context.tsx`).
- Flow Journeys:
  - Root landing page checks existing workspaces or redirects to workspace onboarding wizard.
  - Public portal header displays workspace branding, navigation tabs (Boards, Roadmap, Changelog), Notification Bell, and Voter identity trigger.
  - Admin sidebar renders workspace switcher, navigation links (Moderation, Members, Releases, Webhooks, Audit Logs, Settings) with active state indicators.
- Design System Mapping:
  - Background Canvas: #010102.
  - Surface Panels: #0f1011 (surface-1), #141516 (surface-2), #18191a (surface-3).
  - Hairline Borders: #23252a, #34343a.
  - Primary Accent: #5e6ad2 (Linear lavender-blue), hover #828fff.
  - Typography: SF Pro Display / Inter fallback with negative tracking on headings.

## Objective

Establish the global design system tokens, CSS stylesheet, Root Layout, Root Landing redirect page, and common navigation shells (Public Header, Admin Sidebar, Voter Context Provider) so that the application renders cleanly in the browser and satisfies baseline typecheck and build requirements.

## Technical Context And Dependencies

- Pre-requisites: TASK-01 through TASK-14 completed.
- Reusable Assets: DESIGN.md, src/lib/cn.ts, src/types/workspace.ts.
- Target Files:
  - `src/app/globals.css`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/context/voter-context.tsx`
  - `src/components/layout/public-header.tsx`
  - `src/components/layout/admin-sidebar.tsx`

## Checklist

- [ ] Create `src/app/globals.css` declaring CSS variables for canvas (#010102), surface panels (#0f1011, #141516), hairline borders (#23252a), and primary accent (#5e6ad2).
- [ ] Create `src/context/voter-context.tsx` managing active voter profile (registered or anonymous fingerprint stored in browser local state / cookies).
- [ ] Create `src/components/layout/public-header.tsx` with workspace branding, navigation links, notification popover integration, and voter identity badge.
- [ ] Create `src/components/layout/admin-sidebar.tsx` with collapsable navigation links for management views.
- [ ] Create `src/app/layout.tsx` defining standard HTML and body tags, font declarations, metadata, and wrapping the application in VoterProvider.
- [ ] Create `src/app/page.tsx` acting as root landing page showing available active workspaces or a link to create a new workspace.
- [ ] Run `npm run check:be` and verify exit code 0.

## Acceptance Criteria

- Criterion 1: Root layout resolves Next.js App Router compile errors and imports globals.css with complete DESIGN.md theme tokens.
- Criterion 2: Accessing the root route (/) renders the landing page without 404 or runtime errors.
- Criterion 3: VoterContext provides voter profile resolution and persists identifier across client navigation.
- Criterion 4: Zero icons, emojis, and numbered comments present across all touched files.

## Verification Commands

- Command 1: `npm run typecheck`
- Command 2: `npm run check:fe`

