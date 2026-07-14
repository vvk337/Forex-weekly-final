# 03 Database Changes

This document details the schema changes and migration steps executed for the database in Phase 3.

---

## 1. Schema Additions (`prisma/schema.prisma`)

Two new tables were added to the SQLite database layout:
1. **`User` Table**: Stores metadata, hashed credentials, role identifiers, online status indicators, and tracking timestamps for CMS administrators.
2. **`UserSession` Table**: Scaffolded model prepared to track session tokens, browser headers, expiration ranges, and revocation flags.

---

## 2. Migration Notes

* **Prisma db push**: Database tables were synced utilizing the `npx prisma db push` command. This synced the SQLite `dev.db` file in 181ms without modifying existing data.
* **Prisma Generate**: Regenerated the Prisma Client (`npx prisma generate`) to enable TypeScript auto-completion for `prisma.user` and `prisma.userSession` operations.
* **Legacy Admin Table Preserved**: The legacy `Admin` database table remains fully active to ensure previous login records continue to function.
