# Document 02: Feature Inventory

## Feature Inventory Matrix

| Feature Name | Purpose | Status | UI Location | Backend Files | APIs Responsible | Database Tables | Dependencies | Permissions | Known Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Storefront** | Displays news, analysis, and guides to readers | Complete | `/`, `/[category]/[id]` | `src/app/page.tsx` | `GET /api/articles` | `Article` | Prisma DB | Public | Static pagination |
| **Breaking News Ticker** | Streams RSS feeds or manual custom alerts | Complete | Storefront Top Bar & Control Room | `api/breaking-news/route.ts` | `GET/PUT /api/breaking-news` | `TickerConfig` | Yahoo Finance RSS | `breaking-news:create/manage` | In-memory RSS cache |
| **Sponsor Placements** | Manages ad banners (leaderboard, square, inline) | Complete | Storefront & Control Room | `api/sponsors/route.ts` | `GET/PUT /api/sponsors` | `Sponsor` | File Uploader | `sponsors:view/manage` | 1 ad per placement key |
| **Editorial Workflow** | Article creation, review, schedule, and publish | Complete | Control Room & `/create` | `api/articles/route.ts` | `GET/POST/PUT/DELETE /api/articles` | `Article`, `AuditLog` | Auth/Audit Helpers | `articles:*` | No workspace column on Article |
| **User Management** | Provision users with roles and temporary credentials | Complete | Control Room Users Tab | `api/users/route.ts` | `GET/POST/PUT /api/users` | `User`, `Role` | Bcryptjs | `users:manage` | Admins cannot assign OWNER |
| **Acting Supervisor** | Temporary supervisor role escalation | Complete | Control Room Dashboard | `api/departments/acting` | `POST /api/departments/acting` | `Department` | Date Evaluator | `users:manage:dept` | `/me` API sync mismatch |
| **Internal Messaging** | DMs and Group chats with attachments | Complete | Control Room Inbox | `api/inbox/*` | `GET/POST /api/inbox/*` | `ChatConversation` | File Uploader | `messaging:use` | HTTP Polling |
| **System Announcements** | Broadcast pinned announcements to team | Complete | Control Room Inbox | `api/inbox/announcements` | `GET/POST /api/inbox/announcements` | `SystemAnnouncement` | Notification Engine | `users:manage` | User fetch polling |
| **Notifications** | Target alerts for articles and system updates | Complete | Control Room Header & Profile | `api/notifications/*` | `GET/PUT /api/notifications/*` | `Notification` | Notification Helper | Authenticated User | No external email delivery |
| **Audit Logging** | Activity recording with IP & result flags | Complete | Control Room Audit Logs | `api/audit-logs/route.ts` | `GET /api/audit-logs` | `AuditLog` | Request IP Parser | `reports:view` | Immutable logs |
| **Account Impersonation** | Allows Owners to log in as another user | Complete | Control Room Users Row | `api/auth/impersonate` | `POST /api/auth/impersonate` | `User`, `Role` | JWT signing | `OWNER` strictly | Cannot impersonate Owners |
