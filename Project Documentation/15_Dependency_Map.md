# Document 15: Dependency Map

## Architectural Data Flow
```
[User Request] 
      │
      ▼
[src/middleware.ts] (Injects x-pathname header & verifies admin_token)
      │
      ▼
[src/lib/auth-helpers.ts] (Validates session role & Acting Supervisor status)
      │
      ▼
[API Route Handlers / Page Views]
      │
      ├───> [prisma/schema.prisma] (Reads/Writes to SQLite dev.db)
      │
      ├───> [src/lib/audit-helper.ts] (Appends activity to AuditLog)
      │
      └───> [src/lib/notification-helper.ts] (Dispatches alerts to Notification)
```
