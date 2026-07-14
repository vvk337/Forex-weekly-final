# 01 User Model - Phase 3 Foundation

This document defines the properties and attributes of the unified `User` data model designed for the Forex Weekly Enterprise CMS database.

---

## 1. Schema Specifications (`User` model)

Each user account stores the following attributes:

* **`id`** (String / UUID): Primary key uniquely identifying the user.
* **`fullName`** (String): The user's first and last name.
* **`username`** (String / Unique): Unique slug used for login identification.
* **`email`** (String / Unique): The user's primary contact email.
* **`password`** (String): Cryptographically hashed password bytes (`bcryptjs` with 10 salt rounds).
* **`role`** (String / default: "EMPLOYEE"): The user's primary administrative tier (`OWNER` | `ADMIN` | `SUPERVISOR` | `EMPLOYEE`).
* **`status`** (String / default: "ACTIVE"): The user's current status (`ACTIVE` | `INACTIVE` | `SUSPENDED`).
* **`profilePhoto`** (String / default: "/images/default-avatar.png"): Relative URL path to the profile photo.
* **`departments`** (String / default: "[]"): Serialized JSON array of assigned departments (e.g. `["Editorial", "Research"]`).
* **`workspaces`** (String / default: "[]"): Serialized JSON array of authorized workspaces (e.g. `["Publication", "Marketing"]`).
* **`permissions`** (String / default: "[]"): Serialized JSON array of specific permission tags (future RBAC preparation).
* **`phone`** (String / default: ""): Optional contact phone number.
* **`dob`** (String / default: ""): Optional date of birth.
* **`activeSince`** (DateTime / default: `now()`): Timestamp representing account creation.
* **`lastLogin`** (DateTime?): Optional timestamp of the last successful authentication.
* **`lastActivity`** (DateTime?): Optional timestamp of the last active HTTP request.
* **`isOnline`** (Boolean / default: `false`): Real-time online/offline status tracker.
* **`isArchived`** (Boolean / default: `false`): Archive flag to deactivate accounts without deleting their history.
* **`createdBy`** (String / default: "System"): Identity of the administrator who created the account.
* **`updatedAt`** (DateTime): Timestamp of the last model edit.
* **`forcePasswordChange`** (Boolean / default: `false`): Flag requiring a password update upon next login.
* **`tempPassword`** (String / default: ""): Holds generated temporary credentials if set.
