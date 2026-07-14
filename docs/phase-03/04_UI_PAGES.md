# 04 UI Pages

This document details the user interfaces, views, and navigation flows added for User Management in Phase 3.

---

## 1. User Directory List (`Users` Tab)
* **Access Path**: Dashboard -> click "Users" tab.
* **Layout**: Complete list showing name, avatar, email, role badge, online status, departments, and last activity timestamps.
* **Features**:
  - Live Search field for finding names/emails.
  - Dropdown filters for role and account status.
  - "Show Archived" checkbox to view inactive accounts.
  - Sorting controls by name, role, and registration date.
  - Pagination controls.

---

## 2. Invite User Screen (`/admin/dashboard/users/create`)
* **Access Path**: Click the "+ Add User" button in the dashboard topbar (available when the Users tab is active).
* **Layout**: Form fields matching the CMS design language.
* **Features**:
  - Inputs for name, username, email, and password.
  - Dropdown role selection (Owner, Admin, Supervisor, Employee).
  - Multi-select checkboxes for departments and workspaces.
  - "Generate Temp Password" and "Force Password Change" options.

---

## 3. Edit & Details Screen (`/admin/dashboard/users/[id]`)
* **Access Path**: Click "Edit/Details" next to any user in the directory list.
* **Layout**: Dynamic two-column layout:
  - Left panel: Renders the user's avatar, username, role badge, email, and active status.
  - Right panel: Form to update account details, change passwords, and configure role/workspace settings.
  - Header actions: Archive/Restore button.

---

## 4. Personal Profile Screen (`/admin/dashboard/profile`)
* **Access Path**: Click "My Profile" in the dashboard topbar.
* **Layout**: Interface matching the CMS design language, allowing the active logged-in user to update their full name, phone number, date of birth, profile photo, and password credentials.
