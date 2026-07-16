# 03 Database Changes - Phase 8

This document records the SQLite schema migrations for Phase 8.

---

## 1. Schema Upgrades (`prisma/schema.prisma`)

### Notification Model
- `id`: String (UUID primary key).
- `timestamp`: DateTime (defaults to now).
- `title`: String.
- `description`: String.
- `module`: String (ARTICLE, BREAKING_NEWS, SYSTEM, ANNOUNCEMENT).
- `objectId`: String? (reference reference).
- `status`: String (defaults to UNREAD; transitions to READ or ARCHIVED).
- `username`: String (target recipient).

### NotificationSetting Model
- `id`: String (UUID primary key).
- `userId`: String (Unique reference mapping to User profile).
- `articlesEnabled`: Boolean (defaults to true).
- `breakingNewsEnabled`: Boolean (defaults to true).
- `announcementsEnabled`: Boolean (defaults to true).
- `systemEnabled`: Boolean (defaults to true).
