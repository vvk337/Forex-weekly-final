# 06 User Management

This document outlines the user schema, account lifecycle, reporting relationships, and session management models.

---

## 1. User Account Lifecycle

```text
  [Invited] ──► [Active] ──► [Suspended/Archived]
                  │ ▲
                  ▼ │
              [Locked Out]
```

* **Invited**: An administrator sends an invitation email. The user record is created with a `PENDING_INVITE` status.
* **Active**: The user accepts the invite, sets their password, and logs in.
* **Locked Out**: Multiple failed login attempts temporarily lock the account. A password reset email must be sent to unlock it.
* **Suspended/Archived**: Administrators can revoke access immediately. Active sessions are invalidated, and the user cannot log in.

---

## 2. Teams, Departments, and Reporting Hierarchy
* **Departments**: Users are assigned to a primary department (e.g. Editorial, Marketing, Support, IT) to organize permissions.
* **Teams**: Departments are broken down into teams (e.g. Daily Feed Team, Weekly Intelligence Team).
* **Reporting Lines**: Every Employee is assigned to a Supervisor, who reviews and approves their drafts.

---

## 3. Session & Profile Management
* **JWT Session Expiration**: Session tokens expire after 6 hours.
* **Database Session Cache**: A database table (`UserSession`) maps active JWT identifiers to user records, allowing administrators to force-logout active sessions.
* **User Profile Page**: Allows users to update their details, upload an avatar, view their assigned workspace roles, and reset their password.
