# 03 Sidebar Architecture - Phase 5

This document details the dynamicLeft Sidebar structure.

---

## 1. Sidebar Composition
- Generated based on **User Role** + **Active Workspace**.
- Sidebar includes:
  - Header (app logo & workspace selector)
  - Navigation menu list of module tabs
  - Bottom Profile menu (displays user avatar, role description, and a configuration popover)

---

## 2. Dynamic Gating
- **Employee**: Dashboard, Publications, Breaking News, Inbox, Profile.
- **Supervisor**: Dashboard, Publications, Breaking News, Sponsors, Team, Inbox, Profile.
- **Admin & Owner**: Full access to all tabs across all workspaces.
