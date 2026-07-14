# 07 Dashboard Blueprint

This document specifies the dashboard layouts, widget configurations, and quick actions for each user role in the Enterprise CMS.

---

## 1. Owner (System Owner)
* **Topbar**: Workspace dropdown selector, notification bell, user profile menu, and database health indicator.
* **Metrics Cards**: Active Workspaces, Total Users, Platform Views (24h), Ad Placements Status.
* **Widgets**:
  - **Platform Activity Feed**: System-wide audit log showing recent admin actions and edits.
  - **Billing & Resource Usage**: CPU/memory usage, database query response times, and storage metrics.
* **Quick Actions**: "Provision Workspace", "Add Workspace Admin", "View Audit Logs".

---

## 2. Admin (Workspace Administrator)
* **Topbar**: Workspace selector, notification bell, and user profile menu.
* **Metrics Cards**: Workspace Members, Articles Published (Monthly), Ad Click Rates, Open Inquiries.
* **Widgets**:
  - **Active Campaigns**: List of current sponsorship campaigns, click rates, and expiration dates.
  - **Approval Queue**: Articles, sponsored banners, and ticker alerts awaiting review.
* **Quick Actions**: "Invite Team Member", "Edit Placements", "Write Article".

---

## 3. Supervisor (Content Supervisor)
* **Topbar**: Workspace selector, notification bell, and user profile menu.
* **Metrics Cards**: Pending Reviews, Active Headlines, Open Support Inquiries.
* **Widgets**:
  - **Review Queue**: Articles submitted by editors, with options to approve or request edits.
  - **Recent Inquiries**: Support messages awaiting response, sorted by date.
* **Quick Actions**: "Write Article", "Post Alert", "Open Support Inbox".

---

## 4. Employee (General Employee / Editor)
* **Topbar**: Workspace selector, notification bell, and user profile menu.
* **Metrics Cards**: Drafts in Progress, Articles Published, My Article Views.
* **Widgets**:
  - **My Drafts**: List of current drafts, review status, and feedback from supervisors.
  - **Live Ticker Monitor**: Read-only feed showing the active scrolling ticker.
* **Quick Actions**: "Create Draft", "Edit Draft".
