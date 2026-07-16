# Phase 9 Preparation Notes - Phase 8

## 1. Readiness for Phase 9
- In Phase 9, we should introduce database indexes inside `prisma/schema.prisma` for the `username` and `status` fields of `Notification` to keep queries highly efficient as the notification history scales.
- Cache notifications results (e.g. list, unread counts) inside memory or a Redis cache wrapper, invalidating only when a new notification is dispatched, reducing high-frequency database lookups during polling.
