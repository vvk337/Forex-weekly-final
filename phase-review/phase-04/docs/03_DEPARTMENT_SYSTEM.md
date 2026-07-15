# 03 Department System - Phase 4

This document explains the organization and temporary supervisor assignment rules for departments.

---

## 1. Structure

The system defines 4 default departments:
- **Publication**
- **Marketing**
- **Research**
- **Support**

Each department contains:
- One **Primary Supervisor** (User relation)
- Multiple **Members** (Employees / Users)
- Optional **Acting Supervisor** (Temporary user delegation)

---

## 2. Temporary Supervisor Escalation (Acting Supervisors)

- **Delegation Settings**: Admins and Owners can delegate a temporary supervisor to any department via `/api/departments/acting`.
- **Validation Gates**: The centralized permission validator (`validatePermissions`) fetches active acting assignments. If the current timestamp `now()` falls within the delegated `Start Date` and `End Date` ranges, the user is temporarily granted `SUPERVISOR` role capabilities.
- **Auto-Expiration**: Privilege escalation resolves dynamically using server-side query range validations on the `Department` model, removing the need for manual cron jobs or task sweeps.
