# 10 Phase 2 Recommendations

This document outlines the recommended roadmap for implementing Phase 2 (Enterprise Features integration) for the Forex Weekly CMS platform.

---

## 1. Database Migration (PostgreSQL / MySQL)
* **Goal**: Move away from SQLite to support high concurrent writes, database connection pooling, and multi-node clusters.
* **Steps**:
  1. Change the Prisma datasource provider configuration:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
  2. Provision a cloud instance (e.g. Supabase, RDS, Neon) and update the local `.env` variables.
  3. Export current SQLite table rows and seed them into the new production database using Prisma migration tools.

---

## 2. Multi-User Authentication & Roles (RBAC)
* **Goal**: Establish a role database system, deprecating the hardcoded single-admin layout.
* **Steps**:
  1. Expand the `Admin` schema to support custom names, emails, and roles (Enum: `ADMIN`, `EDITOR`, `SUPPORT`, `VIEWER`).
  2. Implement a **Password Reset / Invite Flow** for new editors.
  3. Update `validatePermissions` in `src/lib/auth-helpers.ts` to query user tables and confirm access permissions (e.g. check if user has the `articles:write` privilege before updating a post).

---

## 3. Workspace Tenant Partitioning
* **Goal**: Enable independent client workspaces.
* **Steps**:
  1. Add a `Workspace` entity model in the database schema:
     ```prisma
     model Workspace {
       id        String   @id @default(uuid())
       name      String
       subdomain String?  @unique
       createdAt DateTime @default(now())
     }
     ```
  2. Establish relationships linking `Article`, `Sponsor`, and `TickerConfig` to target `Workspace` IDs.
  3. Create an admin workspace selector dropdown in the console, allowing users to toggle between different work contexts dynamically.

---

## 4. Media Storage Services abstraction
* **Goal**: Move uploaded file binaries from the local node container disk to cloud object stores.
* **Steps**:
  1. Set up an AWS S3 Bucket or Cloudinary instance.
  2. Refactor `/api/upload` to pipe binary streams directly to the cloud store instead of writing local files.
  3. Return the cloud URL asset path (e.g. `https://s3.amazonaws.com/...`) for article content rendering.
