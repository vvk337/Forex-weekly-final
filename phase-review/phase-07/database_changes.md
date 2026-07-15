# Database Changes - Phase 7

## 1. Schema Upgrades (`prisma/schema.prisma`)
Modified the database schema to add the `AuditLog` model:
- `id`: String (UUID primary key).
- `timestamp`: DateTime (defaults to now).
- `username`: String (actor username).
- `action`: String (e.g. Created, Edited, Published, Logged In).
- `module`: String (ARTICLE, USER, SPONSOR, BREAKING_NEWS, AUTH, SYSTEM).
- `objectId`: String? (target reference id).
- `objectName`: String? (target title/name).
- `result`: String (SUCCESS / FAILURE).
- `ipAddress`: String? (IP mapping).
- `details`: String? (JSON logs string).

## 2. Syncing Changes
Executed schema migration command:
- `npx prisma db push`
Successfully synchronized the SQLite `dev.db` database.
