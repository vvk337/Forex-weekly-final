# Project Architecture - Phase 4

## 1. Centralized Authorization Tiers

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
 ┌──────────────────────┼──────────────────────┐
 ▼                      ▼                      ▼
API Endpoints      Sidebar Layout         Button Control
(HTTP 401/403)     (Filtered tabs)       (Hidden actions)
```

## 2. Workspace awareness
- Workspace selections dynamically govern sidebar layout, routes, and features.
- Switchable modules restrict operations to Publication, Marketing, or Research.
