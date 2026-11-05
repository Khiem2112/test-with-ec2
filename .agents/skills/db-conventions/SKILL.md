---
name: db-conventions
description: >
  Database schema conventions and field rules for PostgreSQL and Prisma ORM. Load whenever adding, modifying, or reviewing database models, writing migrations, or generating seed data.
---

# Database Schema & Persistence Conventions

This skill governs database modeling, schema design, and persistence rules using PostgreSQL and Prisma ORM.

## Schema Modeling Rules

1. Entity & Table Naming:
   - Prisma models use singular PascalCase (`model OrderItem`).
   - Mapped explicitly to plural snake_case table names via `@@map("order_items")`.
   - Fields use camelCase mapped to snake_case column names when necessary via `@map("column_name")`.

2. Primary & Foreign Keys:
   - Primary key is always named `id`. Use UUID or autoincrement integer.
   - Foreign key fields must explicitly follow the related entity name (e.g. `userId` referencing `User.id`).

3. Mandatory Audit Columns:
   - Every mutable entity table must include:
     - `createdAt DateTime @default(now()) @map("created_at")`
     - `updatedAt DateTime @updatedAt @map("updated_at")`
     - `isActive Boolean @default(true) @map("is_active")`

4. Financial & Monetary Precision:
   - Never represent money, prices, or currency with `Float`.
   - Always use `Decimal` with explicit precision and scale (e.g., `@db.Decimal(12, 2)`).

5. Soft Deletes & Active Records:
   - Use `isActive = false` for soft deletion of business-critical entities.
   - All query services must filter active records unless specifically performing administrative audits.
