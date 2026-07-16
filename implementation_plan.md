# Control Room Refinement & Separation Plan

This plan details the architectural refactoring to separate the **Control Room (Backend)** from the **Forex Weekly Storefront (Frontend)** into two independent layouts sharing the same database, while preserving all existing functionality and workflows.

## Architecture Analysis

### 1. Root Layout Separation (Investigation Summary)
We investigated using Next.js route groups (`(public)` vs `(admin)`) to separate layouts. 
- **Route Groups Option**: Moving public routes (12 direct child directories: `[category]`, `about`, `contact`, `daily-feed`, `forex`, `free-assessment`, `global-events`, `learn-forex`, `privacy`, `terms`, `weekly-updates`, and `page.tsx`) would require updating all relative imports inside these files, introducing a high risk of import resolving failures and breaking existing links.
- **Path-Based Header Conditional Option (Recommended)**: Configuring `src/middleware.ts` to attach an `x-pathname` header and reading it inside `src/app/layout.tsx` dynamically swaps layouts at full performance with **zero file restructuring**.

We will proceed with the **Path-Based Header Conditional** approach as the safest and most scalable fallback.

### 2. Layout Logic Decoupling
To prevent layout logic from cluttering the core page view, we will extract the Control Room shell into dedicated, reusable layout components inside `src/components/admin/`:
- `ControlRoomLayout`: Wraps the admin panels, manages collapsed sidebar states.
- `ControlRoomHeader`: Horizontal top bar (Logo, Workspace dropdown selector, Search, Notifications, Profile avatar menu).
- `ControlRoomSidebar`: Vertical collapsible sidebar for navigation.

---

## Proposed Changes

### Core Separation & Layouts

#### [layout.tsx](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/app/layout.tsx)
- Dynamically read `x-pathname` from request headers.
- If path starts with `/admin`, bypass public wrappers (`TopBar`, `Header`, `Navbar`, `Footer`) and render children directly at full screen width.

#### [middleware.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/middleware.ts)
- Pass pathname context to request headers as `x-pathname`.
- Match all pages except static assets.

---

### Dedicated Layout Components

#### [NEW] [ControlRoomLayout.tsx](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/components/admin/ControlRoomLayout.tsx)
- Outer layout structure managing screen layout, collapsible sidebar state, and laptop spacing.

#### [NEW] [ControlRoomHeader.tsx](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/components/admin/ControlRoomHeader.tsx)
- Renders Weekly Control brand logo, Workspace selectors, global search bar, alerts bell dropdown, and profile menu.

#### [NEW] [ControlRoomSidebar.tsx](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/components/admin/ControlRoomSidebar.tsx)
- Collapsible sidebar with high-contrast active state styling links.

---

### Dashboard Page Refinement

#### [MODIFY] [page.tsx](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/app/admin/dashboard/page.tsx)
- Clean up inlined HTML layout frames in the main return statement.
- Import and wrap view states using `<ControlRoomLayout>`, `<ControlRoomHeader>`, and `<ControlRoomSidebar>`.
- Remove secondary search boxes.
- Expand empty state screens (announcements, DMs, groups) to render active calls to action buttons.
- Implement **Add User** trigger buttons and invite/create wizard modal overlay supporting departments, workspaces, and role assignments (Send Invitation or Create Temporary Password).

---

### Permissions Refinement

#### [MODIFY] [auth-helpers.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/lib/auth-helpers.ts)
- Expand the ADMIN role permissions array to grant access to:
  - Drafting, editing, approving, scheduling, archiving, and trashing articles.
  - Custom breaking news ticker overrides.
  - User details editing, password resets, suspension toggling, and archivals.
  - Creating DMs/groups and publishing broadcast notices.
- Keep ONLY owner account settings, impersonation overrides, and config overrides as Owner-only.

---

## Verification Plan

### Automated Tests
- Run production build command: `npm run build` to verify type-safety.

### Manual Verification
- Log in as `admin` (Owner) and verify the clean Control Room shell layout.
- Verify collapsing/expanding the sidebar.
- Open the Users panel, click "Add User", verify invitation flows.
- Log in as a newly created Administrator and confirm access to article editing/user invitation.
