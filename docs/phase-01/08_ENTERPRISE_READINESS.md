# 08 Enterprise Readiness

This document assesses the readiness of the Forex Weekly CMS codebase for enterprise requirements and outlines transition strategies.

---

## 1. Role-Based Access Control (RBAC)
* **Readiness Score**: **8 / 10 (High)**
* **Current State**: Decoupled. API endpoints now route all authorization queries through the centralized `validatePermissions(request, permission)` controller.
* **Risks**: Storing multiple roles or fine-grained permissions on JWT payloads might exceed standard browser cookie size limitations (4KB max).
* **Required Preparation**:
  - Add a `role` field (Enum: `ADMIN`, `EDITOR`, `SUPPORT`, `VIEWER`) to the `Admin` database model.
  - Implement a session database cache if JWT cookie payloads grow too large.

---

## 2. Multi-Tenant Workspaces
* **Readiness Score**: **5 / 10 (Moderate)**
* **Current State**: Session data interfaces have placeholder `workspaceId` variables. API and database layers do not check or partition queries by tenant.
* **Risks**: Risk of data leaks if an API route forgets to scope database queries (e.g. returning articles from Workspace B to a user logged into Workspace A).
* **Required Preparation**:
  - Add `workspaceId` relationship fields to the `Article`, `Sponsor`, and `TickerConfig` database schemas.
  - Update `validatePermissions` to return the client's authorized workspace context, forcing Prisma queries to append `.findMany({ where: { workspaceId } })` parameters.

---

## 3. Audit Logs
* **Readiness Score**: **4 / 10 (Low)**
* **Current State**: No logging mechanism exists. Actions (such as deletions, configurations modifications) are executed silently.
* **Risks**: Difficulty tracking down unauthorized changes, accidental deletes, or configuration alterations.
* **Required Preparation**:
  - Create an `AuditLog` database model:
    ```prisma
    model AuditLog {
      id        String   @id @default(uuid())
      userId    String
      username  String
      action    String   // e.g. "article:delete"
      details   String   // JSON string of changes
      ipAddress String?
      createdAt DateTime @default(now())
    }
    ```
  - Integrate a logging handler into `validatePermissions` to save entries in the database.

---

## 4. Notifications & Messaging
* **Readiness Score**: **3 / 10 (Low)**
* **Current State**: Platform is completely stateless in terms of real-time messaging and dispatch services.
* **Risks**: Slow client response times due to missing real-time notification pathways (e.g., admins not knowing when new inquiries arrive in the inbox).
* **Required Preparation**:
  - Set up a background worker queue or integrate server-sent events (SSE) for real-time inbox telemetry updates.
  - Set up API integrations with transactional email services (like SendGrid or Mailgun).
