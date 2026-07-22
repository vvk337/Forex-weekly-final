# Document 03: Page Inventory

## 1. Public Storefront Pages

### 1.1 Homepage (`/`)
- **Purpose**: Main landing portal displaying featured articles, category feeds, breaking news, and sponsor banners.
- **Roles**: Public (Unauthenticated)
- **Components**: `Header`, `Navbar`, `BreakingNewsTicker`, `SponsorBanner`, `FeaturedHero`, `ArticleGrid`, `Footer`
- **Actions**: Read articles, filter categories, click sponsor links, navigate to login.
- **APIs**: `GET /api/articles?isFeatured=true`, `GET /api/breaking-news`, `GET /api/sponsors`

### 1.2 Category Feeds (`/weekly-updates`, `/daily-feed`, `/global-events`, `/forex`, `/learn-forex`)
- **Purpose**: Category-specific article archives.
- **Roles**: Public (Unauthenticated)
- **Components**: `Header`, `Navbar`, `BreakingNewsTicker`, `ArticleList`, `Footer`
- **Actions**: Browse category articles, paginate.
- **APIs**: `GET /api/articles?category=[category]`

### 1.3 Article Detail View (`/[category]/[id]`)
- **Purpose**: Full article view with content, metadata, and sidebar ads.
- **Roles**: Public (Unauthenticated)
- **Components**: `Header`, `Navbar`, `BreakingNewsTicker`, `ArticleBody`, `SidebarSponsor`, `Footer`
- **Actions**: Read full content, navigate related topics.
- **APIs**: `GET /api/articles/[id]`, `GET /api/sponsors`

---

## 2. Control Room Backend Pages

### 2.1 Login Page (`/admin/login`)
- **Purpose**: Authenticates team members into Control Room.
- **Roles**: Unauthenticated Users
- **Components**: `LoginForm`, `InputControls`, `BrandLogo`
- **Actions**: Input credentials, submit authentication.
- **APIs**: `POST /api/auth/login`

### 2.2 Control Room Console (`/admin/dashboard`)
- **Purpose**: Main operational workspace for managing publications, users, sponsors, tickers, inbox, notifications, and audit trails.
- **Roles**: `OWNER`, `ADMIN`, `SUPERVISOR`, `EMPLOYEE`
- **Components**: `ControlRoomLayout`, `ControlRoomHeader`, `ControlRoomSidebar`, `EditorialTable`, `UsersTable`, `InboxPanel`, `AuditLogsTable`
- **Actions**: State transitions (Submit/Approve/Return/Schedule/Archive/Trash), manage users, toggle ticker modes, edit sponsors, chat, inspect audit logs, impersonate.
- **APIs**: `/api/users/me`, `/api/articles`, `/api/users`, `/api/sponsors`, `/api/breaking-news`, `/api/inbox/*`, `/api/notifications/*`, `/api/audit-logs`, `/api/auth/impersonate`

### 2.3 Article Creator Console (`/admin/dashboard/create`)
- **Purpose**: Publication authoring console. Auto-locks author field to the logged-in user handle.
- **Roles**: `OWNER`, `ADMIN`, `SUPERVISOR`, `EMPLOYEE`
- **Components**: `CreatorForm`, `CategorySelect`, `ImageUploader`, `BodyTextArea`
- **Actions**: Upload cover image, input metadata and content, publish as draft.
- **APIs**: `GET /api/users/me`, `POST /api/upload`, `POST /api/articles`
