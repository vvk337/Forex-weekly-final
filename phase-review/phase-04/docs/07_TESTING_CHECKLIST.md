# 07 Testing Checklist - Phase 4

This document outlines the validation tests to verify that the RBAC and database changes are functioning correctly.

---

## 1. Authentication & Backward Compatibility Tests
* [ ] Verify that existing admin login still works.
* [ ] Check that default Owner/Admin/Supervisor/Employee Roles are seeded successfully.
* [ ] Verify that the Owner account is excluded from normal directory listings.

---

## 2. Workspace & Sidebar Navigation Tests
* [ ] Log in as an Employee and verify that only assigned workspaces and modules are visible.
* [ ] Log in as an Admin/Owner and verify that all workspaces (Publication, Marketing, Research) are available for selection.
* [ ] Verify that changing active workspaces updates the sidebar options and redirects pages correctly.
* [ ] Verify that restricted action buttons (such as article deletions for employees) disappear completely.

---

## 3. Temporary Acting Supervisor Tests
* [ ] Log in as an Admin or Owner, navigate to `/admin/dashboard/users/[id]` for a Supervisor, and delegate a temporary supervisor.
* [ ] Set the delegation start date to the past and the end date to the future. Verify that the temporary supervisor gains Supervisor access.
* [ ] Set the delegation end date to the past. Verify that the temporary supervisor's escalated permissions expire automatically.
