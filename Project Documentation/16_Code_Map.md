# Document 16: Code Map

## Primary Codebase Map

| Directory / File | Primary Responsibility |
| :--- | :--- |
| `src/middleware.ts` | Header injection, path filtering, and route protection |
| `src/lib/auth.ts` | Cryptographic JWT signing and verification |
| `src/lib/auth-helpers.ts` | Session resolution, RBAC matrix, and acting supervisor checks |
| `src/lib/db-seed.ts` | System roles, departments, workspaces, and system user seeder |
| `src/lib/audit-helper.ts` | Audit logging utility |
| `src/components/admin/` | Control Room isolated layout components |
| `src/app/api/` | RESTful API handlers for all platform domain modules |
| `src/app/admin/dashboard/page.tsx` | Main Control Room workspace console |
