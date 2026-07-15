# 04 Workspace System - Phase 4

This document details workspace awareness rules and layout visibility controls.

---

## 1. Workspaces Defined

Three workspaces partition navigation structures:
- **Publication Workspace**: Encompasses article lists, inbox logs, and RSS breaking news configuration tools.
- **Marketing Workspace**: Contains the Sponsor Manager dashboard.
- **Research Workspace**: Displays content statistics, platform activity events, and logs.

---

## 2. Visibilities Gates

- **Workspace Selector**: Rendered in the sidebar. Displays only workspaces assigned to the logged-in user. Owners and Admins can view and switch between all workspaces.
- **Dynamic Sidebar Tabs**: Selecting a workspace switches navigation sidebars and redirects users to authorized tabs.
- **Dynamic Buttons Security**: Buttons and links (like `Delete` or `+ Add User`) disappear completely from user views if their active role lacks matching permission tags.
