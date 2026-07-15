# 05 Database Changes - Phase 4

This document logs the database modifications and migrations completed during Phase 4.

---

## 1. Schema Additions & Normalization (`prisma/schema.prisma`)

- Added **`Role`** table to link users to strict role categories, removing the legacy string-based `role` column.
- Added **`Department`** table to represent departments. Tracks the primary supervisor, acting supervisor, and start/end delegation ranges.
- Added **`Workspace`** table to represent workspaces.
- Refactored **`User`** model to connect to these relations:
  - `roleId` links to `Role` table.
  - Many-to-many relationship mappings connect users to multiple `departments` and `workspaces`.

---

## 2. Migration Execution

- Database changes were applied to SQLite using:
  `npx prisma db push --accept-data-loss`
- Pushed client bindings were regenerated using `npx prisma generate`.
- Seeding and automatic migration of legacy records was handled via `ensureDbSeeded()` in `src/lib/db-seed.ts`.
