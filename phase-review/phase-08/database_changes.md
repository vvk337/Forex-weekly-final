# Database Changes - Phase 8

## 1. Schema Upgrades (`prisma/schema.prisma`)
Modified database schema to add:
- `Notification` model: `id`, `timestamp`, `title`, `description`, `module`, `objectId`, `status` (UNREAD / READ / ARCHIVED), `username`.
- `NotificationSetting` model: `id`, `userId`, `articlesEnabled`, `breakingNewsEnabled`, `announcementsEnabled`, `systemEnabled`.

## 2. Syncing Changes
Executed schema migration command:
- `npx prisma db push`
Successfully synchronized the SQLite `dev.db` database.
