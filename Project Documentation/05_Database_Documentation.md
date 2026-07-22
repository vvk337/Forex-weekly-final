# Document 05: Database Documentation

## 1. Overview
The database uses SQLite (`prisma/dev.db`) accessed via Prisma ORM.

## 2. Table Definitions & Schemas

### Table: `User`
- **Purpose**: Platform user profiles, credentials, role references, and status metrics.
- **Fields**:
  - `id`: `String` (PK, UUID)
  - `fullName`: `String`
  - `username`: `String` (Unique)
  - `email`: `String` (Unique)
  - `password`: `String` (Bcrypt Hash)
  - `roleId`: `String?` (FK -> `Role.id`)
  - `status`: `String` (Default: `"ACTIVE"`)
  - `profilePhoto`: `String` (Default: `"/images/default-avatar.png"`)
  - `activeSince`: `DateTime` (Default: `now()`)
  - `isOnline`: `Boolean` (Default: `false`)
  - `isArchived`: `Boolean` (Default: `false`)

### Table: `Role`
- **Purpose**: Role definitions (`OWNER`, `ADMIN`, `SUPERVISOR`, `EMPLOYEE`).
- **Fields**:
  - `id`: `String` (PK, UUID)
  - `name`: `String` (Unique)

### Table: `Department` & `Workspace`
- **Purpose**: Department boundaries and workspace scopes.
- **Fields (`Department`)**: `id`, `name`, `supervisorId` (FK), `actingSupervisorId` (FK), `actingStart`, `actingEnd`.
- **Fields (`Workspace`)**: `id`, `name`.

### Table: `Article`
- **Purpose**: Content storage for articles.
- **Fields**: `id`, `title`, `excerpt`, `content`, `category`, `author`, `imageUrl`, `status`, `scheduledAt`, `revisionComment`, `department`.

### Table: `Sponsor` & `TickerConfig`
- **Fields (`Sponsor`)**: `id` (placement key), `title`, `description`, `linkUrl`, `buttonText`, `imageUrl`.
- **Fields (`TickerConfig`)**: `id` (`"ticker"`), `mode` (`"auto"`/`"manual"`), `manualText`.

### Table: `AuditLog` & `Notification`
- **Fields (`AuditLog`)**: `id`, `timestamp`, `username`, `action`, `module`, `objectId`, `result`, `ipAddress`.
- **Fields (`Notification`)**: `id`, `timestamp`, `title`, `description`, `module`, `status`, `username`.
