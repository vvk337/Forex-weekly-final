# 02 Global Audit Log - Phase 7

This document logs the Global Audit Log portal features.

---

## 1. Access Constraints
- Restructured inside `/api/audit-logs/route.ts` to gate global audit logs access exclusively to Owner and Admin roles.
- Non-administrative roles attempting global queries receive a `403 Forbidden` response.

---

## 2. Advanced Filters
- The control room Audit Logs tab renders search input controllers for:
  - **User**: Matches actor usernames.
  - **Module**: Selects target system modules (AUTH, ARTICLE, USER, SPONSOR, SYSTEM).
  - **Action**: Matches transition codes.
  - **Date Range**: Standard start and end calendars.
