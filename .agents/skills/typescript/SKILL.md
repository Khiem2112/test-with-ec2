---
name: typescript
description: >
  Pure TypeScript coding standards and type-safety rules. Covers types vs interfaces, no any, explicit returns, naming conventions, immutability, and barrel imports.
---

# TypeScript Standards & Conventions

This skill defines the technical standards for all TypeScript source code in this project.

## Core Rules

1. Types over Interfaces:
   - Always declare object shapes, unions, and mappers using `type`.
   - Avoid `interface` unless required for external library module augmentation.

2. Zero Any:
   - Never use the `any` type under any circumstance.
   - Use `unknown` when incoming data structure is not yet validated, and narrow via type guards, Zod schemas, or discriminated unions.

3. Explicit Return Types:
   - Every function, method, arrow function export, and hook must explicitly declare its return type.
   - Prevents unintended type widening and accidental API signature breakage.

4. Immutability & Readonly:
   - Mark configuration and baseline reference arrays and objects as `readonly` or with `as const`.
   - Prefer pure transformations (`map`, `filter`, `reduce`) over in-place array mutations.

5. Nullish Coalescing & Optional Chaining:
   - Use `??` instead of `||` when evaluating default values for numbers, strings, or booleans to preserve falsy values (`0`, `""`, `false`).
   - Use `?.` to safely traverse nested properties.
