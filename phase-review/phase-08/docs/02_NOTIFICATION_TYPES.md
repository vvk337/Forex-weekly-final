# 02 Notification Types - Phase 8

This document lists all the custom notification scopes supported across the CMS.

---

## 1. Supported Notification Actions

- **Article Submissions**: Dispatched to Supervisors and Owner when an Employee sends an article for review (`status === "PENDING"`).
- **Article Approvals**: Dispatched to the author when an article is published (`status === "PUBLISHED"`).
- **Article Revisions**: Dispatched to the author when returned for revisions (`status === "DRAFT"` with comments).
- **Scheduled Article Publications**: Dispatched to authors when system auto-publishes.
- **Breaking News overrides**: Dispatched to all active users when manual override ticker alerts go live.
- **User Invitations**: Dispatched to new employees upon creation.
- **Password Updates**: Dispatched to employees on reset or changes.
- **Workspace assignments**: Dispatched to employees when roles, departments, or workspace access scopes change.
- **Direct Message Stubs**: Direct Message triggers prepared for future integration.
