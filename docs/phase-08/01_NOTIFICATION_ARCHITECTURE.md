# 01 Notification Architecture - Phase 8

This document details the architectural design of the notification subsystem.

---

## 1. Dispatch Sequence Flow

```
                      ┌──────────────────────────────────────┐
                      │          System Action Trigger       │
                      │  (Article Pub, Password Change, etc) │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │  src/lib/notification-helper.ts      │
                      │  - Resolves active recipients        │
                      │  - Filters target user settings      │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        SQLite DB Notification        │
                      │  - Status set to append-only UNREAD  │
                      └──────────────────────────────────────┘
```

## 2. Retention and Auto-Expiry Rules
- Notifications are strictly append-only; update/delete operations from the frontend are prohibited.
- A background worker simulation (`autoArchiveOldNotifications`) updates all logs older than 90 days to status `ARCHIVED` whenever a user fetches their list, maintaining a lightweight runtime state.
