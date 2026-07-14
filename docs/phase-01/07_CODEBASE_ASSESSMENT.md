# 07 Codebase Assessment

This document assesses technical debt, tight coupling, and architectural issues in the Forex Weekly codebase.

---

## 1. Technical Debt & Code Quality

### Monolithic Dashboard Component
- **Issue**: `src/app/admin/dashboard/page.tsx` is an oversized file (~800 lines of code) containing state management for all 4 admin tabs (publications list, sponsors list, breaking news modes, and inbox logs).
- **Impact**: Code reading is slow; adding logic to a single tab can break unrelated states.
- **Resolution**: Refactor tab contents into independent components (e.g. `PublicationsTab.tsx`, `SponsorsTab.tsx`, `BreakingNewsTab.tsx`, `InboxTab.tsx`).

### Local Hard Drive File Writing
- **Issue**: The `/api/upload` router uses local filesystem methods (`fs/promises` and `process.cwd()`) to write uploaded files to `public/uploads/`.
- **Impact**: If the project is deployed on serverless cloud containers (like Vercel, AWS Lambda), local file modifications are temporary and will vanish when instances recycle.
- **Resolution**: Abstract media storage into a provider service layer, allowing S3, Cloudinary, or local disk uploads depending on environment variables.

---

## 2. Tight Coupling

### Inline Authentication Logic
- **Issue**: Previously, each API route endpoint read request cookie headers and validated JWT tokens inline.
- **Resolution (Phase 1 Refactored)**: Successfully decoupled. Decoded session parsing and permission checks are now delegated to `src/lib/auth-helpers.ts`.

### Fixed Sponsorship Banners
- **Issue**: Page components and database models are tightly coupled to three hardcoded sponsorship placements (`leaderboard`, `square`, `inline`).
- **Impact**: Adding a new banner spot (e.g. "mobile-sticky") requires modifying DB seeds, typescript interfaces, layouts, and API routers.
- **Resolution**: Transition the database structure to a flexible metadata scheme or let administrators create custom placements dynamically.

---

## 3. Areas That Should Remain Untouched

To maintain platform stability, the following areas must remain unmodified in terms of user experience:
* **TradingView Chart Widgets**: The embedded iframe scripts (e.g., Economic Calendar, Technical Analysis Gauge, Forex Rates) are provided directly by TradingView and function perfectly.
* **Public Category Feeds**: Public routing patterns (`/daily-feed/*`, `/weekly-updates/*`) are indexed and stable; their URLs must not change to preserve SEO indexing.
* **Database Models (Prisma Schema)**: The schema is currently clean and supports full database seeding. Do not refactor columns until the database migration to PostgreSQL occurs in Phase 2.
