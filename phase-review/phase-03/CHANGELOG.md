# Changelog - Phase 3 Review

This document logs all modifications, file creations, and database structural changes completed for Phase 3.

---

## 1. Files Created
* **API Endpoints**:
  - `src/app/api/users/route.ts` (GET / POST)
  - `src/app/api/users/[id]/route.ts` (GET / PUT)
  - `src/app/api/users/me/route.ts` (GET session details)
* **Frontend Pages**:
  - `src/app/admin/dashboard/users/create/page.tsx` (Invite User form)
  - `src/app/admin/dashboard/users/[id]/page.tsx` (Edit & Details)
  - `src/app/admin/dashboard/profile/page.tsx` (Personal Profile page)

---

## 2. Files Modified
* `prisma/schema.prisma` (Added `User` and `UserSession` models)
* `src/app/api/auth/login/route.ts` (Updated lookup logic, added legacy fallback, and created auto-seeding hooks)
* `src/app/admin/dashboard/page.tsx` (Added the Users tab, table listing, search, filters, sorting, and pagination)

---

## 3. Database Changes
* **`User` Table**: Added to store full profile details, roles, archived states, and online indicators.
* **`UserSession` Table**: Added to support session history and token revocations.
* **Database Sync**: Ran `npx prisma db push` to synchronize SQLite tables, and `npx prisma generate` to rebuild client bindings.

---

## 4. Dependencies Added
* None (utilized existing `bcryptjs` and `jose` libraries).
