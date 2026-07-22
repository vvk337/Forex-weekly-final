# Document 08: Workflow Documentation

## Key Business Workflows

### 1. User Provisioning Workflow
1. Admin clicks **Add User** in Control Room.
2. Fills in Name, Username, Email, Role, Department, and Workspace.
3. Selects password mode (**Invitation** vs. **Temporary Password**).
4. System hashes password via Bcryptjs, saves user to DB, and logs event in `AuditLog`.

### 2. Editorial Publishing Workflow
1. **Drafting**: Author writes content in `/admin/dashboard/create`. Article saved with status `DRAFT`.
2. **Submission**: Author clicks **Submit**. Status updates to `PENDING`. Notification sent to department Supervisor.
3. **Review**: Supervisor inspects article.
   - If changes required: Clicks **Return**, inputs comment. Status reverts to `DRAFT` with `revisionComment`.
   - If approved: Clicks **Publish** (status `PUBLISHED`) or **Schedule** (status `SCHEDULED` with timestamp).
4. **Auto-Publishing**: On subsequent GET requests, overdue scheduled articles auto-transition to `PUBLISHED`.
