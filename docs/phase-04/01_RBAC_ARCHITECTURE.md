# 01 RBAC Architecture - Phase 4

This document defines the Role-Based Access Control (RBAC) architecture for the Forex Weekly Enterprise CMS platform.

---

## 1. Architectural Philosophy

The CMS transition splits authorization checks into two boundaries:
1. **Relational Database Tiers**: User authorization level is determined by the linked `Role` model ID in the SQLite database, removing legacy JSON string columns in favor of strict normalized relationships.
2. **Centralized Middleware Gates**: Decoupled helpers in `src/lib/auth-helpers.ts` parse user session tokens, read database relational constraints, handle temporary Acting Supervisor escalations, and return Boolean gates.

---

## 2. Token Security

- All authenticated dashboard requests decode the `admin_token` cookie signed using the `jose` JWT library.
- Session payloads store the user's database ID, username, assigned role name, and the active workspace token.
