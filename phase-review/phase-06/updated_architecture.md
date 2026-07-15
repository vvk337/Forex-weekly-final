# Updated Architecture & File Tree - Phase 6

## 1. Updated Backend Layout Architecture

```
┌───────────────────────────────────────────────┐
│              Browser Session Cookie           │
│                  (admin_token)                │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│            src/lib/auth-helpers.ts            │
│  - Decodes and validates JWT claims           │
│  - Queries Role/Dept/Workspace databases      │
│  - Enforces Temporary Escalation ranges       │
└───────────────────────┬───────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          src/app/admin/dashboard/page.tsx                   │
│  - Left responsive Sidebar (Role + Workspace links)         │
│  - Top Navbar (Global Search, Breadcrumbs, Profile menu)    │
│  - Filtered status tabs (Draft, Pending, Published...)      │
│  - Metadata Expandable Info Panels (Auditing & Comments)    │
└─────────────────────────────────────────────────────────────┘
```

## 2. Project File Tree after Phase 6

```
C:\Users\MODERN 15\.gemini\antigravity\scratch\forex-weekly\
├── docs\
│   ├── phase-05\
│   └── phase-06\
│       ├── 01_EDITORIAL_WORKFLOW.md
│       ├── 02_ARTICLE_LIFECYCLE.md
│       ├── 03_EDITORIAL_NAVIGATION.md
│       ├── 04_REVISION_SYSTEM.md
│       ├── 05_DATABASE_CHANGES.md
│       ├── 06_IMPLEMENTATION_SUMMARY.md
│       ├── 07_TESTING_CHECKLIST.md
│       └── 08_PHASE_07_PREPARATION.md
├── prisma\
│   ├── dev.db
│   └── schema.prisma (Modified)
├── src\
│   ├── app\
│   │   ├── admin\
│   │   │   └── dashboard\
│   │   │       └── page.tsx (Modified)
│   │   ├── api\
│   │   │   └── articles\
│   │   │       ├── [id]\
│   │   │       │   └── route.ts (Modified)
│   │   │       └── route.ts (Modified)
│   │   ├── page.tsx (Modified)
│   │   ├── daily-feed\page.tsx (Modified)
│   │   ├── learn-forex\page.tsx (Modified)
│   │   └── weekly-updates\page.tsx (Modified)
│   └── lib\
│       └── auth-helpers.ts
└── phase-06-review.zip
```
