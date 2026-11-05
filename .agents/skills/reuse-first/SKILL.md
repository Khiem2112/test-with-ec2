---
name: reuse-first
description: >
  Verifies repository reuse before adding or duplicating services, utilities, schemas, types, models, or UI components. Load when implementation or review introduces a new abstraction or file.
---

# Reuse-First Discipline

Before creating any new file, abstraction, utility function, or schema, inspect existing codebase precedents to prevent duplication and fragmentation.

## Inspection Checklist

1. Data Schemas & Validation:
   - Check existing validation schemas and types before defining new models.
   - Reuse shared DTOs and discriminated unions across client and server boundaries.

2. Business Services & Utilities:
   - Check if an existing service or helper already implements the required calculation, formatting, or transformation.
   - Extend existing utility modules with pure functions rather than creating isolated helper scripts.

3. UI & Design Elements:
   - Inspect existing component catalogs and design tokens before styling new components.
   - Reuse standard buttons, inputs, modals, and layout containers.

## Review Gate

During convention review, reject new utility functions or duplicate schemas if identical logic already exists within the repository.
