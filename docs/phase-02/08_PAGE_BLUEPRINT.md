# 08 Page Blueprint

This document details the purpose, UI components, permissions, actions, and dependencies for every page in the Enterprise CMS.

---

## 1. System Login Screen (`/admin/login`)
* **Purpose**: User login and authentication gateway.
* **UI Components**: Login form card, email input, password input, and recovery options.
* **Permissions Required**: None (Public).
* **Primary Actions**: "Sign In", "Recover Password".
* **Dependencies**: `/api/auth/login` endpoint.

---

## 2. Core Dashboard Portal (`/admin/dashboard`)
* **Purpose**: Central hub for CMS operations.
* **UI Components**: Dynamic metrics cards, role-specific widgets, quick action buttons, and recent activity tables.
* **Permissions Required**: Standard authenticated user session.
* **Primary Actions**: "Switch Workspace", "Create Draft", "View Reports".
* **Dependencies**: `/api/auth-helpers` context, workspace state managers.

---

## 3. Article Editor (`/admin/dashboard/create` and `/edit/[id]`)
* **Purpose**: Writing, editing, and publishing news articles.
* **UI Components**: Markdown/WYSIWYG editor pane, meta configuration sidebar, file upload field, and scheduling options.
* **Permissions Required**: `articles:create` (for drafts) or `articles:edit-all`.
* **Primary Actions**: "Save Draft", "Submit for Review", "Approve & Publish".
* **Dependencies**: `/api/articles` router, `/api/upload` media connector.

---

## 4. Sponsored Placements Manager (`/admin/dashboard/sponsors`)
* **Purpose**: Configuring ad placements and banners.
* **UI Components**: Placements list, form inputs (Headline, Target URL, CTA text), file upload fields (Logo, Background Image), and preview cards.
* **Permissions Required**: `sponsors:write`.
* **Primary Actions**: "Save Sponsorship Details", "Preview Banner Layout".
* **Dependencies**: `/api/sponsors` API router.

---

## 5. Breaking News Ticker Console (`/admin/dashboard/ticker`)
* **Purpose**: Managing headlines on the real-time scrolling ticker.
* **UI Components**: Mode toggler (Auto / Manual), list of manual headlines with individual relative timers, and delete buttons.
* **Permissions Required**: `ticker:write`.
* **Primary Actions**: "Save Ticker Configuration", "Add Headline Box", "Delete Box".
* **Dependencies**: `/api/breaking-news` API router.

---

## 6. Inquiry Inbox (`/admin/dashboard/inbox`)
* **Purpose**: Managing client contact messages.
* **UI Components**: Message inbox table, preview drawer showing the message body, and delete buttons.
* **Permissions Required**: `inbox:read` (to view) and `inbox:resolve` (to delete).
* **Primary Actions**: "View Inquiry", "Delete Inquiry".
* **Dependencies**: `/api/contact` API router.

---

## 7. User Manager (`/admin/dashboard/users`)
* **Purpose**: Inviting and managing team members.
* **UI Components**: Members list table, search bar, role assignment fields, department dropdowns, and invite forms.
* **Permissions Required**: `users:manage`.
* **Primary Actions**: "Invite User", "Edit User Roles", "Archive Member".
* **Dependencies**: User management APIs.
