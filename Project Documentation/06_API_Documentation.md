# Document 06: API Documentation

## REST Endpoints Specification

| Endpoint | Method | Auth | Permission | Inputs | Outputs | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | None | `{ username, password }` | `{ success: true }` | Sets `admin_token` cookie |
| `/api/auth/logout` | POST | Session | Authenticated | None | `{ success: true }` | Clears `admin_token` cookie |
| `/api/auth/impersonate` | POST | Session | `OWNER` | `{ targetUserId }` | `{ success: true }` | Issues token for target user |
| `/api/users/me` | GET | Session | Authenticated | None | `DbUser` Object | Returns active session profile |
| `/api/users` | GET/POST | Session | `users:manage` | `{ fullName, username, email, role, ... }` | User DTO / List | User management API |
| `/api/articles` | GET/POST | Mixed | `articles:create` | `{ title, excerpt, content, category, ... }` | Article DTO / List | Articles CRUD API |
| `/api/articles/[id]` | PUT/DELETE | Session | `articles:*` | `{ status, revisionComment, ... }` | Article DTO | Updates article status/delete |
| `/api/breaking-news` | GET/PUT | Mixed | `breaking-news:*` | `{ mode, manualText }` | Ticker DTO | RSS and manual news ticker |
| `/api/sponsors` | GET/PUT | Mixed | `sponsors:manage` | `{ id, title, linkUrl, ... }` | Sponsor DTO | Banners placement API |
| `/api/inbox/*` | GET/POST | Session | `messaging:use` | `{ content, recipient, ... }` | Chat DTO | DM, Groups, Announcements |
| `/api/notifications` | GET/PUT | Session | Authenticated | `{ status }` | Notifications List | User alerts management |
| `/api/audit-logs` | GET | Session | `reports:view` | Filter params | Audit Logs List | System activity trail |
| `/api/upload` | POST | Session | Authenticated | FormData `file` | `{ url }` | Disk image upload API |
