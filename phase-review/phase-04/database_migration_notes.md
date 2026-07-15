# Database Migration Notes - Phase 4

## 1. Migration Overview
- The database schema transitioned from a single-admin system using flat text columns to a fully normalized Relational Database structure in SQLite.
- Relational tables `Role`, `Department`, and `Workspace` were created to replace serializations.

## 2. Database Sync
- Changes synced using Prisma command:
  `npx prisma db push --accept-data-loss`
- Bindings updated:
  `npx prisma generate`

## 3. Data Integrity & Auto-Seeding
- A database seeder script in `src/lib/db-seed.ts` automatically runs on startup.
- Automatically populates the default Roles (`OWNER`, `ADMIN`, `SUPERVISOR`, `EMPLOYEE`), Departments (`Publication`, `Marketing`, `Research`, `Support`), and Workspaces (`Publication`, `Marketing`, `Research`).
- Imports legacy SQLite user accounts, converting them to the new schema relations.
