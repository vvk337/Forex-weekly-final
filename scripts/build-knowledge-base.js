const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "../Project Documentation");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const docs = {};

docs["01_Project_Overview.md"] = `# Document 01: Project Overview

## 1. Executive Summary
**Forex Weekly CMS** is a dual-domain Enterprise Content Management System (CMS) and financial news publishing platform. The system combines a public-facing reader portal for financial market news, technical analyses, and educational guides with an isolated, multi-tenant administrative engine called the **Control Room**.

## 2. Business Goals
- **Editorial Workflow Governance**: Enforce structured publication pipelines (Draft -> Pending Review -> Scheduled -> Published -> Archived / Trash) controlled by department boundaries and assigned roles.
- **Role-Based Access Control (RBAC)**: Protect platform configurations under Owner accounts while delegating operational tasks (articles, sponsors, user management, breaking news) to Admins and Supervisors.
- **Dynamic Content & Advertising**: Stream real-time financial market headlines from Yahoo Finance RSS alongside manual admin breaking news overrides and sponsor banner placements.
- **Audit & Compliance**: Maintain immutable records of system events, logins, state changes, and account modifications.

## 3. System Architecture
The application uses Next.js 16 (App Router) with path-based middleware header injection (\`x-pathname\`). Control Room backend screens bypass all public website headers, footers, and sidebars.

\`\`\`
+-------------------------------------------------------------------+
|                        Next.js Middleware                         |
|                 (x-pathname header injection)                     |
+---------------------------------+---------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|   Public Storefront   |                   |     Control Room      |
|  (Anonymous Readers)  |                   |   (Authenticated)     |
+-----------------------+                   +-----------------------+
| - Hero & Categories   |                   | - ControlRoomLayout   |
| - RSS Breaking Ticker |                   | - ControlRoomHeader   |
| - Sponsor Placements  |                   | - ControlRoomSidebar  |
+-----------------------+                   +-----------------------+
                                                        |
                                                        v
                                            +-----------------------+
                                            |     Prisma ORM        |
                                            |   SQLite (dev.db)     |
                                            +-----------------------+
\`\`\`

## 4. Folder Structure
\`\`\`
forex-weekly/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma         # Prisma schema and database relations
│   └── dev.db                # SQLite database storage
├── scripts/                  # Maintenance, reset, and utility scripts
├── Project Documentation/    # Permanent technical knowledge base
└── src/
    ├── middleware.ts         # Route protection and header injection
    ├── app/                  # Storefront & Admin App Router pages & APIs
    ├── components/           # UI components (admin/ and storefront)
    └── lib/                  # Core helpers (auth, DB, audit, notifications)
\`\`\`

## 5. Technology Stack & Runtime
- **Framework**: Next.js 16.2.10 (App Router with Turbopack)
- **UI & Styling**: React 19.2.4, TailwindCSS v4
- **Language**: TypeScript 5.x
- **ORM & Database**: Prisma 6.19.3 with SQLite (\`prisma/dev.db\`)
- **Authentication**: JWT (\`jose\` 6.2.3), Bcryptjs (3.0.3)
- **Runtime & Server**: Node.js (v20+ / v25+) running production server bound to \`0.0.0.0:3000\`.
`;

docs["02_Feature_Inventory.md"] = `# Document 02: Feature Inventory

## Feature Inventory Matrix

| Feature Name | Purpose | Status | UI Location | Backend Files | APIs Responsible | Database Tables | Dependencies | Permissions | Known Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Storefront** | Displays news, analysis, and guides to readers | Complete | \`/\`, \`/[category]/[id]\` | \`src/app/page.tsx\` | \`GET /api/articles\` | \`Article\` | Prisma DB | Public | Static pagination |
| **Breaking News Ticker** | Streams RSS feeds or manual custom alerts | Complete | Storefront Top Bar & Control Room | \`api/breaking-news/route.ts\` | \`GET/PUT /api/breaking-news\` | \`TickerConfig\` | Yahoo Finance RSS | \`breaking-news:create/manage\` | In-memory RSS cache |
| **Sponsor Placements** | Manages ad banners (leaderboard, square, inline) | Complete | Storefront & Control Room | \`api/sponsors/route.ts\` | \`GET/PUT /api/sponsors\` | \`Sponsor\` | File Uploader | \`sponsors:view/manage\` | 1 ad per placement key |
| **Editorial Workflow** | Article creation, review, schedule, and publish | Complete | Control Room & \`/create\` | \`api/articles/route.ts\` | \`GET/POST/PUT/DELETE /api/articles\` | \`Article\`, \`AuditLog\` | Auth/Audit Helpers | \`articles:*\` | No workspace column on Article |
| **User Management** | Provision users with roles and temporary credentials | Complete | Control Room Users Tab | \`api/users/route.ts\` | \`GET/POST/PUT /api/users\` | \`User\`, \`Role\` | Bcryptjs | \`users:manage\` | Admins cannot assign OWNER |
| **Acting Supervisor** | Temporary supervisor role escalation | Complete | Control Room Dashboard | \`api/departments/acting\` | \`POST /api/departments/acting\` | \`Department\` | Date Evaluator | \`users:manage:dept\` | \`/me\` API sync mismatch |
| **Internal Messaging** | DMs and Group chats with attachments | Complete | Control Room Inbox | \`api/inbox/*\` | \`GET/POST /api/inbox/*\` | \`ChatConversation\` | File Uploader | \`messaging:use\` | HTTP Polling |
| **System Announcements** | Broadcast pinned announcements to team | Complete | Control Room Inbox | \`api/inbox/announcements\` | \`GET/POST /api/inbox/announcements\` | \`SystemAnnouncement\` | Notification Engine | \`users:manage\` | User fetch polling |
| **Notifications** | Target alerts for articles and system updates | Complete | Control Room Header & Profile | \`api/notifications/*\` | \`GET/PUT /api/notifications/*\` | \`Notification\` | Notification Helper | Authenticated User | No external email delivery |
| **Audit Logging** | Activity recording with IP & result flags | Complete | Control Room Audit Logs | \`api/audit-logs/route.ts\` | \`GET /api/audit-logs\` | \`AuditLog\` | Request IP Parser | \`reports:view\` | Immutable logs |
| **Account Impersonation** | Allows Owners to log in as another user | Complete | Control Room Users Row | \`api/auth/impersonate\` | \`POST /api/auth/impersonate\` | \`User\`, \`Role\` | JWT signing | \`OWNER\` strictly | Cannot impersonate Owners |
`;

docs["03_Page_Inventory.md"] = `# Document 03: Page Inventory

## 1. Public Storefront Pages

### 1.1 Homepage (\`/\`)
- **Purpose**: Main landing portal displaying featured articles, category feeds, breaking news, and sponsor banners.
- **Roles**: Public (Unauthenticated)
- **Components**: \`Header\`, \`Navbar\`, \`BreakingNewsTicker\`, \`SponsorBanner\`, \`FeaturedHero\`, \`ArticleGrid\`, \`Footer\`
- **Actions**: Read articles, filter categories, click sponsor links, navigate to login.
- **APIs**: \`GET /api/articles?isFeatured=true\`, \`GET /api/breaking-news\`, \`GET /api/sponsors\`

### 1.2 Category Feeds (\`/weekly-updates\`, \`/daily-feed\`, \`/global-events\`, \`/forex\`, \`/learn-forex\`)
- **Purpose**: Category-specific article archives.
- **Roles**: Public (Unauthenticated)
- **Components**: \`Header\`, \`Navbar\`, \`BreakingNewsTicker\`, \`ArticleList\`, \`Footer\`
- **Actions**: Browse category articles, paginate.
- **APIs**: \`GET /api/articles?category=[category]\`

### 1.3 Article Detail View (\`/[category]/[id]\`)
- **Purpose**: Full article view with content, metadata, and sidebar ads.
- **Roles**: Public (Unauthenticated)
- **Components**: \`Header\`, \`Navbar\`, \`BreakingNewsTicker\`, \`ArticleBody\`, \`SidebarSponsor\`, \`Footer\`
- **Actions**: Read full content, navigate related topics.
- **APIs**: \`GET /api/articles/[id]\`, \`GET /api/sponsors\`

---

## 2. Control Room Backend Pages

### 2.1 Login Page (\`/admin/login\`)
- **Purpose**: Authenticates team members into Control Room.
- **Roles**: Unauthenticated Users
- **Components**: \`LoginForm\`, \`InputControls\`, \`BrandLogo\`
- **Actions**: Input credentials, submit authentication.
- **APIs**: \`POST /api/auth/login\`

### 2.2 Control Room Console (\`/admin/dashboard\`)
- **Purpose**: Main operational workspace for managing publications, users, sponsors, tickers, inbox, notifications, and audit trails.
- **Roles**: \`OWNER\`, \`ADMIN\`, \`SUPERVISOR\`, \`EMPLOYEE\`
- **Components**: \`ControlRoomLayout\`, \`ControlRoomHeader\`, \`ControlRoomSidebar\`, \`EditorialTable\`, \`UsersTable\`, \`InboxPanel\`, \`AuditLogsTable\`
- **Actions**: State transitions (Submit/Approve/Return/Schedule/Archive/Trash), manage users, toggle ticker modes, edit sponsors, chat, inspect audit logs, impersonate.
- **APIs**: \`/api/users/me\`, \`/api/articles\`, \`/api/users\`, \`/api/sponsors\`, \`/api/breaking-news\`, \`/api/inbox/*\`, \`/api/notifications/*\`, \`/api/audit-logs\`, \`/api/auth/impersonate\`

### 2.3 Article Creator Console (\`/admin/dashboard/create\`)
- **Purpose**: Publication authoring console. Auto-locks author field to the logged-in user handle.
- **Roles**: \`OWNER\`, \`ADMIN\`, \`SUPERVISOR\`, \`EMPLOYEE\`
- **Components**: \`CreatorForm\`, \`CategorySelect\`, \`ImageUploader\`, \`BodyTextArea\`
- **Actions**: Upload cover image, input metadata and content, publish as draft.
- **APIs**: \`GET /api/users/me\`, \`POST /api/upload\`, \`POST /api/articles\`
`;

docs["04_Component_Inventory.md"] = `# Document 04: Component Inventory

## 1. Reusable Control Room Layout Components

### 1.1 \`ControlRoomLayout\`
- **File**: \`src/components/admin/ControlRoomLayout.tsx\`
- **Purpose**: Outer container for Control Room screens. Manages responsive width metrics, collapsible desktop sidebar offsets, and mobile drawer overlays.
- **Props**:
  - \`children\`: \`React.ReactNode\`
  - \`sidebar\`: \`React.ReactNode\`
  - \`header\`: \`React.ReactNode\`
  - \`isSidebarCollapsed\`: \`boolean\`
  - \`showMobileSidebar\`: \`boolean\`
  - \`setShowMobileSidebar\`: \`(show: boolean) => void\`
- **Used By**: \`/admin/dashboard\`, \`/admin/dashboard/create\`, \`/admin/dashboard/profile\`
- **Dependencies**: React

### 1.2 \`ControlRoomHeader\`
- **File**: \`src/components/admin/ControlRoomHeader.tsx\`
- **Purpose**: Top horizontal bar containing logo, Workspace Selector dropdown, global search console input, notification bell with unread badge, and profile menu.
- **Props**:
  - \`currentUser\`: \`DbUser | null\`
  - \`activeWorkspace\`: \`string\`
  - \`setActiveWorkspace\`: \`(ws: string) => void\`
  - \`searchQuery\`: \`string\`
  - \`setSearchQuery\`: \`(q: string) => void\`
  - \`showProfileMenu\`: \`boolean\`
  - \`setShowProfileMenu\`: \`(show: boolean) => void\`
  - \`handleLogout\`: \`() => void\`
  - \`setShowMobileSidebar\`: \`(show: boolean) => void\`
- **Used By**: \`ControlRoomLayout\`
- **Dependencies**: React, Next.js Link/Router

### 1.3 \`ControlRoomSidebar\`
- **File**: \`src/components/admin/ControlRoomSidebar.tsx\`
- **Purpose**: Vertical navigation menu with collapsible state persistence via \`localStorage\`. Renders active tab highlights filtered by user role.
- **Props**:
  - \`activeTab\`: \`string\`
  - \`setActiveTab\`: \`(tab: any) => void\`
  - \`currentUser\`: \`DbUser | null\`
  - \`isCollapsed\`: \`boolean\`
  - \`setIsCollapsed\`: \`(collapsed: boolean) => void\`
- **Used By**: \`ControlRoomLayout\`
- **Dependencies**: React, \`localStorage\`
`;

docs["05_Database_Documentation.md"] = `# Document 05: Database Documentation

## 1. Overview
The database uses SQLite (\`prisma/dev.db\`) accessed via Prisma ORM.

## 2. Table Definitions & Schemas

### Table: \`User\`
- **Purpose**: Platform user profiles, credentials, role references, and status metrics.
- **Fields**:
  - \`id\`: \`String\` (PK, UUID)
  - \`fullName\`: \`String\`
  - \`username\`: \`String\` (Unique)
  - \`email\`: \`String\` (Unique)
  - \`password\`: \`String\` (Bcrypt Hash)
  - \`roleId\`: \`String?\` (FK -> \`Role.id\`)
  - \`status\`: \`String\` (Default: \`"ACTIVE"\`)
  - \`profilePhoto\`: \`String\` (Default: \`"/images/default-avatar.png"\`)
  - \`activeSince\`: \`DateTime\` (Default: \`now()\`)
  - \`isOnline\`: \`Boolean\` (Default: \`false\`)
  - \`isArchived\`: \`Boolean\` (Default: \`false\`)

### Table: \`Role\`
- **Purpose**: Role definitions (\`OWNER\`, \`ADMIN\`, \`SUPERVISOR\`, \`EMPLOYEE\`).
- **Fields**:
  - \`id\`: \`String\` (PK, UUID)
  - \`name\`: \`String\` (Unique)

### Table: \`Department\` & \`Workspace\`
- **Purpose**: Department boundaries and workspace scopes.
- **Fields (\`Department\`)**: \`id\`, \`name\`, \`supervisorId\` (FK), \`actingSupervisorId\` (FK), \`actingStart\`, \`actingEnd\`.
- **Fields (\`Workspace\`)**: \`id\`, \`name\`.

### Table: \`Article\`
- **Purpose**: Content storage for articles.
- **Fields**: \`id\`, \`title\`, \`excerpt\`, \`content\`, \`category\`, \`author\`, \`imageUrl\`, \`status\`, \`scheduledAt\`, \`revisionComment\`, \`department\`.

### Table: \`Sponsor\` & \`TickerConfig\`
- **Fields (\`Sponsor\`)**: \`id\` (placement key), \`title\`, \`description\`, \`linkUrl\`, \`buttonText\`, \`imageUrl\`.
- **Fields (\`TickerConfig\`)**: \`id\` (\`"ticker"\`), \`mode\` (\`"auto"\`/\`"manual"\`), \`manualText\`.

### Table: \`AuditLog\` & \`Notification\`
- **Fields (\`AuditLog\`)**: \`id\`, \`timestamp\`, \`username\`, \`action\`, \`module\`, \`objectId\`, \`result\`, \`ipAddress\`.
- **Fields (\`Notification\`)**: \`id\`, \`timestamp\`, \`title\`, \`description\`, \`module\`, \`status\`, \`username\`.
`;

docs["06_API_Documentation.md"] = `# Document 06: API Documentation

## REST Endpoints Specification

| Endpoint | Method | Auth | Permission | Inputs | Outputs | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| \`/api/auth/login\` | POST | Public | None | \`{ username, password }\` | \`{ success: true }\` | Sets \`admin_token\` cookie |
| \`/api/auth/logout\` | POST | Session | Authenticated | None | \`{ success: true }\` | Clears \`admin_token\` cookie |
| \`/api/auth/impersonate\` | POST | Session | \`OWNER\` | \`{ targetUserId }\` | \`{ success: true }\` | Issues token for target user |
| \`/api/users/me\` | GET | Session | Authenticated | None | \`DbUser\` Object | Returns active session profile |
| \`/api/users\` | GET/POST | Session | \`users:manage\` | \`{ fullName, username, email, role, ... }\` | User DTO / List | User management API |
| \`/api/articles\` | GET/POST | Mixed | \`articles:create\` | \`{ title, excerpt, content, category, ... }\` | Article DTO / List | Articles CRUD API |
| \`/api/articles/[id]\` | PUT/DELETE | Session | \`articles:*\` | \`{ status, revisionComment, ... }\` | Article DTO | Updates article status/delete |
| \`/api/breaking-news\` | GET/PUT | Mixed | \`breaking-news:*\` | \`{ mode, manualText }\` | Ticker DTO | RSS and manual news ticker |
| \`/api/sponsors\` | GET/PUT | Mixed | \`sponsors:manage\` | \`{ id, title, linkUrl, ... }\` | Sponsor DTO | Banners placement API |
| \`/api/inbox/*\` | GET/POST | Session | \`messaging:use\` | \`{ content, recipient, ... }\` | Chat DTO | DM, Groups, Announcements |
| \`/api/notifications\` | GET/PUT | Session | Authenticated | \`{ status }\` | Notifications List | User alerts management |
| \`/api/audit-logs\` | GET | Session | \`reports:view\` | Filter params | Audit Logs List | System activity trail |
| \`/api/upload\` | POST | Session | Authenticated | FormData \`file\` | \`{ url }\` | Disk image upload API |
`;

docs["07_RBAC_Documentation.md"] = `# Document 07: RBAC Documentation

## 1. Role Definitions
- **Owner**: Platform superuser. Full operational access, platform config overrides, impersonation.
- **Admin**: Operational superuser. Full access to articles, users, tickers, sponsors, messaging, and logs. Restricted from Owner account updates.
- **Supervisor**: Department manager. Authorized to review, approve, return, schedule, or trash articles within their department.
- **Employee**: Content creator. Authorized to write drafts, submit for review, and manage their own publications.

## 2. Permissions Matrix

| Permission String | Owner | Admin | Supervisor | Employee |
| :--- | :---: | :---: | :---: | :---: |
| \`users:manage\` | Yes | Yes | No | No |
| \`users:view\` | Yes | Yes | Yes | No |
| \`users:manage:dept\` | Yes | Yes | Yes | No |
| \`articles:create\` | Yes | Yes | Yes | Yes |
| \`articles:edit:own\` | Yes | Yes | Yes | Yes |
| \`articles:submit\` | Yes | Yes | Yes | Yes |
| \`articles:approve\` | Yes | Yes | Yes | No |
| \`articles:publish\` | Yes | Yes | Yes | No |
| \`articles:delete\` | Yes | Yes | Yes | No |
| \`breaking-news:create\` | Yes | Yes | Yes | Yes |
| \`breaking-news:manage\` | Yes | Yes | Yes | No |
| \`sponsors:manage\` | Yes | Yes | Yes | No |
| \`messaging:use\` | Yes | Yes | Yes | Yes |
| \`reports:view\` | Yes | Yes | No | No |
`;

docs["08_Workflow_Documentation.md"] = `# Document 08: Workflow Documentation

## Key Business Workflows

### 1. User Provisioning Workflow
1. Admin clicks **Add User** in Control Room.
2. Fills in Name, Username, Email, Role, Department, and Workspace.
3. Selects password mode (**Invitation** vs. **Temporary Password**).
4. System hashes password via Bcryptjs, saves user to DB, and logs event in \`AuditLog\`.

### 2. Editorial Publishing Workflow
1. **Drafting**: Author writes content in \`/admin/dashboard/create\`. Article saved with status \`DRAFT\`.
2. **Submission**: Author clicks **Submit**. Status updates to \`PENDING\`. Notification sent to department Supervisor.
3. **Review**: Supervisor inspects article.
   - If changes required: Clicks **Return**, inputs comment. Status reverts to \`DRAFT\` with \`revisionComment\`.
   - If approved: Clicks **Publish** (status \`PUBLISHED\`) or **Schedule** (status \`SCHEDULED\` with timestamp).
4. **Auto-Publishing**: On subsequent GET requests, overdue scheduled articles auto-transition to \`PUBLISHED\`.
`;

docs["09_Background_Services.md"] = `# Document 09: Background Services

## Automated Services & Polling Architecture
- **Scheduled Articles Auto-Publisher**: Evaluated on incoming \`GET /api/articles\` requests. Checks if any article has \`status: "SCHEDULED"\` and \`scheduledAt <= now()\`. Auto-promotes matches to \`PUBLISHED\`.
- **Yahoo Finance RSS Feed Caching**: \`/api/breaking-news\` fetches and parses external RSS feeds, caching results in memory for 5 minutes (\`CACHE_DURATION = 300000ms\`).
- **Database Seeder (\`db-seed.ts\`)**: Triggered during authentication to self-heal default roles, departments, workspaces, and system accounts.
`;

docs["10_Integrations.md"] = `# Document 10: Integrations

## External Dependencies & Services
- **Yahoo Finance RSS**: Consumed via HTTPS GET (\`https://finance.yahoo.com/news/rss\`) and parsed via custom regex to stream headlines.
- **Local File System Storage**: Uploaded files written to \`/public/uploads/\` using Node.js \`fs\` streams.
- **Jose JWT Library**: Used for cryptographic signing and verification of session tokens.
- **Bcryptjs**: Used for password hashing (10 salt rounds).
`;

docs["11_Configuration.md"] = `# Document 11: Configuration

## Environment & Server Variables
- \`JWT_SECRET\`: Cryptographic key for JWT signatures (Defaults to \`"forex-weekly-super-secure-secret-key-2026-xyz"\`).
- \`NODE_ENV\`: Environment flag (\`development\` or \`production\`).
- \`PORT\`: Web server port (Default: \`3000\`).
- \`HOST\`: Network interface binding (Default: \`0.0.0.0\` for local Wi-Fi access).
`;

docs["12_Known_Limitations.md"] = `# Document 12: Known Limitations

## Technical & Architectural Limitations
1. **SQLite Concurrency**: SQLite locks the database file on write operations (\`SQLITE_BUSY\` risks under heavy concurrency).
2. **Local File Storage**: File uploads are stored on local disk, making them non-persistent across ephemeral cloud server restarts.
3. **HTTP Cookie Configuration**: \`secure: false\` is set to permit local network Wi-Fi testing over HTTP IP addresses. Must be set to \`true\` before HTTPS domain deployment.
`;

docs["13_Technical_Debt.md"] = `# Document 13: Technical Debt

## Identified Technical Debt
1. **Single Large Dashboard Component**: \`src/app/admin/dashboard/page.tsx\` contains over 3,400 lines managing multiple tab views and modals.
2. **Lack of Dynamic Department/Workspace UI**: Departments and Workspaces are seeded via code without a web UI for dynamic creation.
3. **HTTP Polling Messaging**: Inbox DMs and Announcements rely on polling rather than WebSockets.
`;

docs["14_Future_Placeholders.md"] = `# Document 14: Future Placeholders

## System Placeholders & Stub Interfaces
- Static legal pages (\`/privacy\`, \`/terms\`) use basic static markdown layouts.
- Standalone sub-routes (\`/admin/dashboard/users/[id]\`, \`/admin/dashboard/sponsors/[id]\`) serve as fallback routes for direct deep-linking while primary editing occurs inside modal overlays.
`;

docs["15_Dependency_Map.md"] = `# Document 15: Dependency Map

## Architectural Data Flow
\`\`\`
[User Request] 
      │
      ▼
[src/middleware.ts] (Injects x-pathname header & verifies admin_token)
      │
      ▼
[src/lib/auth-helpers.ts] (Validates session role & Acting Supervisor status)
      │
      ▼
[API Route Handlers / Page Views]
      │
      ├───> [prisma/schema.prisma] (Reads/Writes to SQLite dev.db)
      │
      ├───> [src/lib/audit-helper.ts] (Appends activity to AuditLog)
      │
      └───> [src/lib/notification-helper.ts] (Dispatches alerts to Notification)
\`\`\`
`;

docs["16_Code_Map.md"] = `# Document 16: Code Map

## Primary Codebase Map

| Directory / File | Primary Responsibility |
| :--- | :--- |
| \`src/middleware.ts\` | Header injection, path filtering, and route protection |
| \`src/lib/auth.ts\` | Cryptographic JWT signing and verification |
| \`src/lib/auth-helpers.ts\` | Session resolution, RBAC matrix, and acting supervisor checks |
| \`src/lib/db-seed.ts\` | System roles, departments, workspaces, and system user seeder |
| \`src/lib/audit-helper.ts\` | Audit logging utility |
| \`src/components/admin/\` | Control Room isolated layout components |
| \`src/app/api/\` | RESTful API handlers for all platform domain modules |
| \`src/app/admin/dashboard/page.tsx\` | Main Control Room workspace console |
`;

docs["README.md"] = `# Forex Weekly CMS Knowledge Base

## Overview
This repository directory contains the official, comprehensive technical and functional knowledge base for **Forex Weekly CMS** (v1.0).

## Document Index
1. \`01_Project_Overview.md\`: High-level architecture, business goals, and tech stack.
2. \`02_Feature_Inventory.md\`: Complete feature inventory matrix.
3. \`03_Page_Inventory.md\`: Storefront and Control Room page documentation.
4. \`04_Component_Inventory.md\`: Reusable layout component specifications.
5. \`05_Database_Documentation.md\`: Complete Prisma database tables and relationships.
6. \`06_API_Documentation.md\`: RESTful API endpoint specifications.
7. \`07_RBAC_Documentation.md\`: Roles, permissions, and permissions matrix.
8. \`08_Workflow_Documentation.md\`: Step-by-step business workflows.
9. \`09_Background_Services.md\`: Auto-publishing, RSS caching, and background services.
10. \`10_Integrations.md\`: External services and package dependencies.
11. \`11_Configuration.md\`: Environment variables and server configurations.
12. \`12_Known_Limitations.md\`: Factual system limitations.
13. \`13_Technical_Debt.md\`: Technical debt inventory.
14. \`14_Future_Placeholders.md\`: Stub routes and placeholders.
15. \`15_Dependency_Map.md\`: Data flow and architectural dependency diagrams.
16. \`16_Code_Map.md\`: Codebase directory responsibility map.

## Recommended Reading Order
For new architects or engineers:
1. Start with \`01_Project_Overview.md\` and \`15_Dependency_Map.md\`.
2. Review \`05_Database_Documentation.md\` and \`07_RBAC_Documentation.md\`.
3. Reference \`06_API_Documentation.md\` and \`08_Workflow_Documentation.md\` for development.

## Metadata
- **Last Updated**: July 21, 2026
- **Project Version**: 1.0 (Release Candidate)
`;

// Write all files
for (const [filename, content] of Object.entries(docs)) {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[KB] Created ${filename}`);
}

console.log("[KB] All 17 documentation files generated successfully!");
