# System Reset Implementation Plan

This plan details the implementation steps to prepare the CMS for production by removing all non-system users, eliminating the legacy Admin authentication table, and securing the user creation workflow under a unified user model.

## Architecture Refactoring & Cleanup

### 1. Unified User Authentication Model
- **Remove legacy `Admin` model**: Remove the `Admin` model completely from `prisma/schema.prisma`.
- **Remove legacy fallback code**:
  - `src/app/api/auth/login/route.ts`: Remove legacy table verification and seeder.
  - `src/app/api/users/me/route.ts`: Remove the `"admin-legacy"` session fallback.
  - `src/lib/auth-helpers.ts`: Remove the legacy administrator authorization bypass.
- **Run migrations**: Run Prisma migrations to drop the `Admin` table in the database.

### 2. Database Seeding & User Reset
- **Modify seeder (`src/lib/db-seed.ts`)**:
  - Seed `OWNER` role user: `admin` (password: `admin123`).
  - Seed `ADMIN` role user: `administrator` (password: `admin123`).
  - Do not auto-seed legacy table.
- **One-off Cleanup Script**:
  - Write and execute a node script (`scripts/production-reset.js`) to:
    - Set all supervisor/acting supervisor relations in `Department` to `null`.
    - Delete all `User` records whose username is not `admin` and not `administrator`.
    - Clean up dangling sessions and notifications.
    - Run the seeder to restore/confirm Owner and Admin accounts.

### 3. User Creation RBAC Gates
- **Owner & Admin Access**: Able to invite or create users with roles: `ADMIN`, `SUPERVISOR`, `EMPLOYEE`. Checked via `"users:manage"` permission.
- **Supervisor & Employee Gates**: Blocked from user creation.
- **Owner Protection**: Non-owner roles are blocked from assigning or updating a user to the `OWNER` role.

---

## Proposed Changes

### [MODIFY] [schema.prisma](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/prisma/schema.prisma)
- Delete `model Admin { ... }`.

### [MODIFY] [db-seed.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/lib/db-seed.ts)
- Update seeder to seed both `admin` (Owner) and `administrator` (Admin). Remove legacy seed statements.

### [MODIFY] [login/route.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/app/api/auth/login/route.ts)
- Remove `legacyAdmin` fallback checks and database auto-seeding.

### [MODIFY] [me/route.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/app/api/users/me/route.ts)
- Remove `admin-legacy` session fallback.

### [MODIFY] [auth-helpers.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/lib/auth-helpers.ts)
- Remove legacy administrator bypass.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type-safety.
- Run database cleanup script: `node scripts/production-reset.js`.

### Manual Verification
- Confirm that database contains exactly two users: `admin` (Owner) and `administrator` (Admin).
- Verify that attempting to login using legacy admin account fails.
- Login as `admin` and verify User Management Add User wizard continues to work correctly.
