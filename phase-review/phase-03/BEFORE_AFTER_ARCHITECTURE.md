# Before/After Architecture - Phase 3 Review

This document explains what changed structurally and architecturally during Phase 3.

---

## 1. Before Phase 3

### Database Layout:
* Single `Admin` credentials table.
* Monolithic data structures with no user identity associations.

### Authentication & Routing:
* Login checked only the `Admin` table.
* Endpoints performed inline authorization checks by checking JWT cookies directly in the router files.

---

## 2. After Phase 3

### Database Layout:
* Added the `User` table to hold full metadata (names, roles, status, departments, workspaces, online indicators) for multiple users.
* Added the `UserSession` table (scaffolded to support multiple concurrent sessions and revocations).

### Authentication & Routing:
* **Decoupled Validation**: Authorization checks are routed through a centralized helper (`src/lib/auth-helpers.ts`), separating session decoding from route controllers.
* **Dual Login Validation**: The login endpoint queries both the `User` and `Admin` legacy tables, guaranteeing 100% backward compatibility for existing administrative accounts.
* **Archiving Checks**: The authentication gateway intercepts logins to block archived accounts.
* **Session Telemetry**: Successful logins update the user's online indicators and last login timestamps in the database.
