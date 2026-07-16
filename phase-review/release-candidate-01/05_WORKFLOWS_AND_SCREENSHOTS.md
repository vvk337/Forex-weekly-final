# Workflows and Screenshots Directory Map

This document lists all generated screenshots and details the key workflows.

## 1. Screens & Modals Directory Map
- **General Dashboards**:
  - `Dashboard Metrics Page`: [dashboard.png](screenshots/dashboard.png)
  - `Research Reports Page`: [reports.png](screenshots/reports.png)
- **Editorial & Publications**:
  - `Publications Feed Page`: [publications.png](screenshots/publications.png)
  - `Editorial Workflow Mockup`: [workflow_editorial.png](screenshots/workflow_editorial.png)
- **Breaking News**:
  - `Ticker Settings Editor`: [breaking_news.png](screenshots/breaking_news.png)
- **Sponsor SpotPlacements**:
  - `Sponsors settings Page`: [sponsors.png](screenshots/sponsors.png)
- **Users Directory & Management**:
  - `Users Directory Table`: [user_directory.png](screenshots/user_directory.png)
  - `New User Invitation Modal`: [invite_user_modal.png](screenshots/invite_user_modal.png)
  - `User Profile details View`: [user_details.png](screenshots/user_details.png)
- **Audit Logging**:
  - `Audit Logs List Page`: [audit_logs.png](screenshots/audit_logs.png)
- **Profile & Notification Settings**:
  - `Profile Manager Screen`: [my_profile.png](screenshots/my_profile.png)
  - `Preferences Checkboxes`: [profile_settings.png](screenshots/profile_settings.png)
- **Internal Inbox**:
  - `Inbox Dashboard View`: [inbox.png](screenshots/inbox.png)
  - `Direct Messages Room`: [direct_messages.png](screenshots/direct_messages.png)
  - `Group Chat room Room`: [groups.png](screenshots/groups.png)
  - `Announcements Notices Feed`: [announcements.png](screenshots/announcements.png)
  - `Active Conversation View`: [conversation_view.png](screenshots/conversation_view.png)

---

## 2. Major Workflow Descriptions

### Editorial Content Lifecycle
1. **Drafting**: Employees create draft posts.
2. **Review Submission**: Changes status to `PENDING` for Supervisors review.
3. **Revisions / Corrections**: Supervisors request edits via revision comments logs, status falls back to `DRAFT`.
4. **Approval & Publication**: Supervisor approves and sets status to `PUBLISHED` or schedules for future publishing (`SCHEDULED`).
5. **Timeline logs**: System audit logs every publication action automatically.

### System Notifications & Settings
1. **Activity Trigger**: A system action occurs (e.g. status change, password reset, announcement publish).
2. **Settings check**: Dispatcher evaluates targets settings toggles (My Profile alert preferences).
3. **Dispatch**: Alert count increments on header bell dropdown list. Unread counts clear on click.
