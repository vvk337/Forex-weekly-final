# Complete Changelog - Phase 4

## 1. Files Created
- `src/lib/db-seed.ts`
- `src/app/api/auth/impersonate/route.ts`
- `src/app/api/departments/acting/route.ts`
- `docs/phase-04/01_RBAC_ARCHITECTURE.md`
- `docs/phase-04/02_ROLE_MATRIX.md`
- `docs/phase-04/03_DEPARTMENT_SYSTEM.md`
- `docs/phase-04/04_WORKSPACE_SYSTEM.md`
- `docs/phase-04/05_DATABASE_CHANGES.md`
- `docs/phase-04/06_IMPLEMENTATION_SUMMARY.md`
- `docs/phase-04/07_TESTING_CHECKLIST.md`
- `docs/phase-04/08_PHASE_05_PREPARATION.md`

## 2. Files Modified
- `prisma/schema.prisma`
- `src/lib/auth.ts`
- `src/lib/auth-helpers.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/[id]/route.ts`
- `src/app/api/users/me/route.ts`
- `src/app/api/articles/route.ts`
- `src/app/api/articles/[id]/route.ts`
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/users/[id]/page.tsx`

## 3. Database Changes
- Dropped legacy string-based columns (`role`, `departments`, `workspaces`) from the `User` model.
- Added `Role`, `Department`, and `Workspace` tables as normalized models.
- Set up implicit many-to-many relationship tables between Users and Departments, and Users and Workspaces.
