# 04 Permission System

This document outlines the fine-grained permission tags, inheritance models, and conflict resolution rules for the Enterprise CMS.

---

## 1. Role Permissions vs. Permission Tags

Instead of checking user roles directly inside endpoints (e.g. `if (role === 'ADMIN')`), the system uses granular **Permission Tags** assigned to roles. 

### Core Permission Tags:
- `articles:create` (Create new drafts)
- `articles:publish` (Approve and push articles live)
- `articles:edit-all` (Modify other writers' content)
- `sponsors:write` (Edit ad spots and upload banner images)
- `ticker:write` (Toggle ticker mode and edit manual alerts)
- `inbox:read` (View support inquiries)
- `inbox:resolve` (Mark support tickets as resolved or delete them)
- `users:manage` (Invite, edit, or archive team members)

---

## 2. Workspace & Department Permissions
* **Workspace Scoping**: Permissions are limited to the user's active workspace context. For example, a user with `articles:publish` in *Workspace A* cannot publish articles in *Workspace B* unless explicitly granted access.
* **Department Filtering**: Content access can be restricted by department (e.g., Editorial, Marketing, Support), filtering user actions within a workspace.

---

## 3. Inheritance, Priority Rules, and Conflict Resolution

```text
Inherited Base Permissions (Roles)
             │
             ▼
      Explicit Grants (+)  ───► Overwrites Role defaults
             │
             ▼
      Explicit Denials (-) ───► Overwrites all grants (Highest Priority)
```

### Hierarchy Rules:
1. **Explicit Denial (Deny Override)**: If a permission tag is explicitly denied for a user, they are blocked from performing that action, even if their role would normally allow it.
2. **Explicit Grant**: If a user is explicitly granted a permission tag, they can perform that action, even if their role would normally block it.
3. **Role Inherited**: If no explicit grant or denial exists, the user inherits the default permissions of their assigned role.

### Resolution Example:
- **User**: John Doe (Role: `EMPLOYEE`, which defaults to no approval rights).
- **Explicit Setup**: Granted `articles:publish` for the *Research Workspace* to cover a supervisor's leave.
- **Result**: John can publish research articles but remains blocked from publishing in the main publication workspace.
