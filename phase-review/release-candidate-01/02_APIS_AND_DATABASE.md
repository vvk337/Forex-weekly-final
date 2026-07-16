# APIs and Database Model

## 1. List of All REST APIs

### Authentication APIs
- `POST /api/auth/login`: Authenticates system credentials and issues JWT token session.
- `POST /api/auth/logout`: Clears session token.
- `POST /api/auth/impersonate`: Admin tool to impersonate another team member profile.

### Editorial & Article APIs
- `GET /api/articles`: Searches and lists active articles with filters.
- `POST /api/articles`: Creates new draft article.
- `GET /api/articles/[id]`: Loads single article body and timeline logs.
- `PUT /api/articles/[id]`: Modifies status (DRAFT, PENDING, PUBLISHED, SCHEDULED, ARCHIVED, TRASH), scheduled date, content, category, or review revision comment.
- `DELETE /api/articles/[id]`: Trashes article (status to TRASH).

### Sponsors Placement APIs
- `GET /api/sponsors`: Retrieves active sponsor placements configuration.
- `PUT /api/sponsors`: Updates sponsor spots titles, images, and button links.

### Users Management APIs
- `GET /api/users`: Queries and lists paginated users with filters.
- `POST /api/users`: Invites a new team member and configures credentials.
- `GET /api/users/[id]`: Retrieves user profile, departments, role status.
- `PUT /api/users/[id]`: Modifies user settings, resets password, toggles suspension.
- `GET /api/users/me`: Loads current logged-in user profile details.
- `GET /api/departments/acting`: Retrieves list of acting departments.

### Breaking News Ticker APIs
- `GET /api/breaking-news`: Fetches live ticker headlines (free feed auto mode or manual overrides list).
- `PUT /api/breaking-news`: Saves breaking manual headlines config, mode toggles, and item expiry date limits.

### Notifications & Preferences APIs
- `GET /api/notifications`: Retrieves active user alerts list (includes unread counts).
- `PUT /api/notifications`: Marks alerts as read or clears all list.
- `GET /api/notifications/settings`: Retrieves user-specific settings configuration.
- `PUT /api/notifications/settings`: Updates notification preferences toggles.

### Internal Inbox & Communication APIs
- `GET /api/inbox/users`: Searches active team members list for starting conversations.
- `GET /api/inbox/conversations`: Retrieves DM rooms list.
- `POST /api/inbox/conversations`: Starts new direct conversation with peer user.
- `GET /api/inbox/conversations/[id]`: Loads conversation messages and updates unread flags.
- `POST /api/inbox/conversations/[id]`: Exposes message sending capabilities and fires notifications.
- `PUT /api/inbox/conversations/[id]`: Handles DM archiving and soft deletion from list view.
- `GET /api/inbox/groups`: Retrieves active group conversation list.
- `POST /api/inbox/groups`: Builds new group chat space.
- `GET /api/inbox/announcements`: Retrieves active broadcast notices board.
- `POST /api/inbox/announcements`: Publishes new announcement notice.

### Audit & Security Logs APIs
- `GET /api/audit-logs`: Retrieves system activity logs history with department filters.

### Miscellaneous APIs
- `GET /api/time`: System time checking route.
- `POST /api/upload`: Handles profile photo and article images upload assets.
- `POST /api/contact`: Accepts public frontpage contact inquiry submissions.

---

## 2. Current Database Model (Prisma Schema)
- **`Admin`**: Hashed administrative login details.
- **`User`**: Core user accounts, profile details, active statuses, roles, workspaces, and soft archivals.
- **`Role`**: Access permissions profiles.
- **`Department`**: Organizational department nodes.
- **`Workspace`**: Platform workspace scopes (Marketing, Research, Publication).
- **`Article`**: Master article publishing model, review timelines, status indicators, and department nodes.
- **`Sponsor`**: Placement spots configurations.
- **`ContactMessage`**: Public frontpage inquiries log.
- **`TickerConfig`**: Breaking news ticker settings.
- **`AuditLog`**: System activity audit logs tracker.
- **`Notification`**: System notification event log.
- **`NotificationSetting`**: User-specific category alert preferences toggles.
- **`ChatConversation`**: Direct messaging and group room setups.
- **`ChatMessage`**: Chat thread message logs.
- **`SystemAnnouncement`**: System-wide announcements board.
