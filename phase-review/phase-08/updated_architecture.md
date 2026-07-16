# Updated Architecture - Phase 8

## 1. Notification Subsystem Architectural Flow

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

## 2. Updated Project File Tree after Phase 8

```
C:\Users\MODERN 15\.gemini\antigravity\scratch\forex-weekly\
├── docs\
│   ├── phase-07\
│   └── phase-08\
│       ├── 01_NOTIFICATION_ARCHITECTURE.md
│       ├── ...
│       └── 07_PHASE_09_PREPARATION.md
├── prisma\
│   ├── dev.db
│   └── schema.prisma (Modified)
├── src\
│   ├── app\
│   │   ├── admin\
│   │   │   └── dashboard\
│   │   │       ├── page.tsx (Modified)
│   │   │       └── profile\
│   │   │           └── page.tsx (Modified)
│   │   └── api\
│   │       ├── notifications\
│   │       │   ├── settings\route.ts (New)
│   │       │   └── route.ts (New)
│   │       ├── articles\
│   │       │   ├── [id]\route.ts (Modified)
│   │       │   └── route.ts (Modified)
│   │       ├── breaking-news\
│   │       │   └── route.ts (Modified)
│   │       └── users\
│   │           ├── [id]\route.ts (Modified)
│   │           └── route.ts (Modified)
│   └── lib\
│       ├── db-seed.ts (Modified)
│       └── notification-helper.ts (New)
└── phase-08-review.zip
```
