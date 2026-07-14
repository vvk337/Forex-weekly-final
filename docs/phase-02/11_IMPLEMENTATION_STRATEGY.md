# 11 Implementation Strategy

This document details the rollout plan, dependencies, and risks for implementing the Enterprise CMS backend.

---

## 1. Phased Rollout Plan

We recommend implementing the Enterprise CMS in 4 distinct steps:

### Step 1: Database Migration & Scopes Setup
* **Actions**:
  1. Change the Prisma database provider to PostgreSQL.
  2. Add `workspaceId` column parameters to the `Article`, `Sponsor`, and `TickerConfig` schemas.
  3. Update backend API endpoints to filter queries by workspace context.
* **Dependencies**: Provisioning PostgreSQL database instances.

### Step 2: Session & RBAC Integration
* **Actions**:
  1. Add a `role` enum field to the `Admin` database schema.
  2. Implement fine-grained permission tags and update the centralized authentication validator (`validatePermissions`).
  3. Create backend invitation pathways and login session logs.
* **Dependencies**: Centralized authorization helpers completed in Phase 1.

### Step 3: Admin Console Redesign
* **Actions**:
  1. Add the Workspace Selector dropdown to the dashboard topbar.
  2. Split the monolithic dashboard page into separate components.
  3. Integrate the new role-specific layout widgets and metric cards.
* **Dependencies**: Step 2 (RBAC session information) completed.

### Step 4: System Audit Logging
* **Actions**:
  1. Create the `AuditLog` database entity.
  2. Add logging triggers to update, creation, and deletion events in API endpoints.
  3. Build an audit log viewer inside the Owner control dashboard.
* **Dependencies**: Step 1 database migration completed.

---

## 2. High-Risk Changes & Mitigations
* **Risk**: Database query errors due to missing `workspaceId` values on older records.
  * **Mitigation**: Configure database migrations to default to a fallback workspace ID (e.g., `default-workspace`) for all existing records.
* **Risk**: High PostgreSQL connection counts exceeding limits on serverless runtimes.
  * **Mitigation**: Implement a connection pool manager (such as Prisma Accelerate or pg-pool) to reuse connections.
