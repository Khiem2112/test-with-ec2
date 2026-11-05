# UI Design Contract: <Feature Name> v1

Create this document after the governing flow is approved. This contract defines layout, surface inventory, interaction patterns, and responsive behavior. It does not define API endpoints, DB schemas, or implementation code.

## Document Meta

| Property | Value |
| :--- | :--- |
| Status | `Draft \| In review \| Approved \| Superseded` |
| Owner | `<name or role>` |
| Last updated | `<YYYY-MM-DD>` |
| Governing Flow | `<link to approved flow document>` |

## Approval Record

- Status: `Pending | Approved`
- Approver: `<name or role>`
- Approval date: `<YYYY-MM-DD>`
- Decision notes: `<approval comments or constraints>`

## 1. Design Outcome & Scope

- User outcome: `<derived from approved flow>`
- Surfaces in scope: `<screens, drawers, modals, tables>`
- Out of scope: `<deferred design surfaces>`
- Nearest UI precedents: `<reusable components or existing views>`

## 2. Screen & Surface Inventory

| Surface | Entry Point | Form Factor | Primary Action | Exit / Recovery |
| :--- | :--- | :--- | :--- | :--- |
| `<Surface Name>` | `<Route or trigger>` | `<Page / Dialog / Drawer / Toast>` | `<Submit / Save / Confirm>` | `<Cancel / Back / Close>` |

## 3. Pattern Selections

| Decision Area | Pattern Selected | Rationale | Approved Deviation |
| :--- | :--- | :--- | :--- |
| `Selection Controls` | `<Single / Multi / Radio / Checkbox>` | `<Requirement context>` | `<None or explicit>` |
| `Filter / Search` | `<Inline Filter / Faceted Drawer>` | `<Requirement context>` | `<None or explicit>` |
| `Pagination` | `<Numbered Pages / Infinite / Load More>` | `<Dataset size & use case>` | `<None or explicit>` |
| `Destructive Actions` | `<Confirmation Dialog / Undo Window>` | `<Consequence level>` | `<None or explicit>` |

## 4. Responsive Layout Contract

### Desktop Layout
```text
+--------------------------------------------------------------+
| Header / Navigation Bar                                      |
+-------------------+------------------------------------------+
| Left Filter / Nav | Main Content / Master List               |
|                   |                                          |
+-------------------+------------------------------------------+
| Footer / Status Bar                                          |
+--------------------------------------------------------------+
```

### Mobile Layout
```text
+----------------------------------+
| Header & Hamburger Menu          |
+----------------------------------+
| Search & Filter Drawer Trigger   |
+----------------------------------+
| Stacked Cards / List View        |
+----------------------------------+
| Sticky Bottom Action Bar         |
+----------------------------------+
```

- Reading Order: `<Logical focus sequence>`
- Scroll Ownership: `<Window scroll vs container scroll>`
- Sticky Regions: `<Fixed headers or action bars>`
- Responsive Transformation: `<How tables become stacked cards on mobile>`
