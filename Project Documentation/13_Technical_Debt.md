# Document 13: Technical Debt

## Identified Technical Debt
1. **Single Large Dashboard Component**: `src/app/admin/dashboard/page.tsx` contains over 3,400 lines managing multiple tab views and modals.
2. **Lack of Dynamic Department/Workspace UI**: Departments and Workspaces are seeded via code without a web UI for dynamic creation.
3. **HTTP Polling Messaging**: Inbox DMs and Announcements rely on polling rather than WebSockets.
