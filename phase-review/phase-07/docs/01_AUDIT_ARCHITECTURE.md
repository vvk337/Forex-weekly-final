# 01 Audit Architecture - Phase 7

This document logs the audit activity system architecture.

---

## 1. Architectural Flow
- **Audit Helper**: A central helper module `src/lib/audit-helper.ts` exposes the `createAuditLog` method.
- **SQLite Database**: Every action writes a structured record to the `AuditLog` database model.
- **Context details**: Request objects pass headers to automatically resolve client IPs.

---

## 2. Retention Policy
- Audit log records are strictly append-only.
- No update (PUT) or delete (DELETE) API endpoints exist for the `AuditLog` model, preventing UI tampering.
