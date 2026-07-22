# Document 07: RBAC Documentation

## 1. Role Definitions
- **Owner**: Platform superuser. Full operational access, platform config overrides, impersonation.
- **Admin**: Operational superuser. Full access to articles, users, tickers, sponsors, messaging, and logs. Restricted from Owner account updates.
- **Supervisor**: Department manager. Authorized to review, approve, return, schedule, or trash articles within their department.
- **Employee**: Content creator. Authorized to write drafts, submit for review, and manage their own publications.

## 2. Permissions Matrix

| Permission String | Owner | Admin | Supervisor | Employee |
| :--- | :---: | :---: | :---: | :---: |
| `users:manage` | Yes | Yes | No | No |
| `users:view` | Yes | Yes | Yes | No |
| `users:manage:dept` | Yes | Yes | Yes | No |
| `articles:create` | Yes | Yes | Yes | Yes |
| `articles:edit:own` | Yes | Yes | Yes | Yes |
| `articles:submit` | Yes | Yes | Yes | Yes |
| `articles:approve` | Yes | Yes | Yes | No |
| `articles:publish` | Yes | Yes | Yes | No |
| `articles:delete` | Yes | Yes | Yes | No |
| `breaking-news:create` | Yes | Yes | Yes | Yes |
| `breaking-news:manage` | Yes | Yes | Yes | No |
| `sponsors:manage` | Yes | Yes | Yes | No |
| `messaging:use` | Yes | Yes | Yes | Yes |
| `reports:view` | Yes | Yes | No | No |
