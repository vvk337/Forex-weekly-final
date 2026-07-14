# 03 Role Blueprint

This document specifies the permissions, access rights, and management responsibilities for each user role in the Enterprise CMS.

---

## 1. Owner (System Owner)
* **Responsibilities**: Ultimate system control, workspace provisioning, licensing, billing configurations, and database management.
* **Accessible Modules**: All modules across all workspaces without restriction (Publications, Sponsors, Ticker, Inbox, System Config).
* **Dashboard View**: Full platform analytics: active workspaces, total articles published, ad click metrics, support ticket resolution volumes, audit logs, and resource utilization graphs.
* **Restrictions**: None.
* **Approval Rights**: Direct override capability for all content workflows; bypasses all approval steps.
* **User Management Rights**: Can create, delete, and configure roles for Workspace Admins, Content Supervisors, and General Employees.

---

## 2. Admin (Workspace Administrator)
* **Responsibilities**: Managing specific workspace tenants, assigning supervisors, reviewing reports, and setting up ad configurations.
* **Accessible Modules**: All modules within their assigned workspace.
* **Dashboard View**: Workspace-specific analytics: active publications, pending approvals, team performance metrics, and ad revenue charts.
* **Restrictions**: Cannot create new workspaces, access system-level settings, or edit other workspaces' data.
* **Approval Rights**: Can approve or reject any changes submitted within their workspace (articles, sponsorships, tickers).
* **User Management Rights**: Can invite, archive, and manage roles for Supervisors and Employees within their assigned workspace.

---

## 3. Supervisor (Content Supervisor)
* **Responsibilities**: Editorial leadership, reviewing drafts, updating news tickers, and managing support inquiries.
* **Accessible Modules**: Publications, Breaking News, Inbox.
* **Dashboard View**: Content queue dashboard, showing articles pending review, active ticker alerts, and open support messages.
* **Restrictions**: Cannot modify ad placements (`Sponsor` configurations), change workspace settings, or manage user roles.
* **Approval Rights**: Can review, request revisions for, and approve articles written by Employees.
* **User Management Rights**: None.

---

## 4. Employee (General Employee / Editor)
* **Responsibilities**: Writing and draft creation, local content generation, and initial uploads.
* **Accessible Modules**: Publications (Draft Create & Edit only), Breaking News (View Only).
* **Dashboard View**: Personal writing queue, showing recent drafts, comments/feedback from supervisors, and public viewer count stats.
* **Restrictions**: Cannot publish content directly (must submit for approval), edit other writers' articles, modify ad spaces, access support inboxes, or access system configurations.
* **Approval Rights**: None.
* **User Management Rights**: None.
