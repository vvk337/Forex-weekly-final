# 06 Database Changes - Phase 7

This document logs database schema modifications.

---

## 1. Schema Upgrades (`schema.prisma`)
Added the `AuditLog` model to sync security logs:
- `id`: String (UUID key)
- `timestamp`: DateTime (defaults to now)
- `username`: String (actor username)
- `action`: String (e.g. Created, Edited, Approved...)
- `module`: String (ARTICLE, USER, SPONSOR, BREAKING_NEWS, AUTH, SYSTEM)
- `objectId`: String? (target reference id)
- `objectName`: String? (target title/name)
- `result`: String (SUCCESS / FAILURE)
- `ipAddress`: String? (IP mapping)
- `details`: String? (JSON logs string)
