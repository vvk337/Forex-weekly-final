# 04 Database Overview

This document reviews the schema structure, entity models, database relationships, and scalability constraints of the Forex Weekly CMS storage layer.

---

## 1. Schema Definition (`prisma/schema.prisma`)

The database consists of 5 main entities:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Admin {
  id       String @id @default(uuid())
  username String @unique
  password String // Hashed using bcryptjs
}

model Article {
  id          String   @id @default(uuid())
  title       String
  excerpt     String
  content     String
  category    String   // weekly-updates | daily-feed | forex | learn-forex
  publishedAt DateTime @default(now())
  author      String
  imageUrl    String   @default("/images/placeholder.jpg")
  isFeatured  Boolean  @default(false)
  updatedAt   DateTime @updatedAt
}

model Sponsor {
  id          String   @id // leaderboard | square | inline
  title       String
  description String
  linkUrl     String
  buttonText  String
  imageUrl    String   @default("")
  bgImageUrl  String   @default("")
  updatedAt   DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  subject   String
  message   String
  createdAt DateTime @default(now())
}

model TickerConfig {
  id         String   @id @default("ticker")
  mode       String   @default("auto") // auto | manual
  manualText String   @default("[]")   // Serialized JSON array of headlines
  updatedAt  DateTime @updatedAt
}
```

---

## 2. Relationships Model
* **Flat Topology**: Currently, the models have **no foreign-key relationships** or joins defined. All structures are independent tables:
  - `Admin` is isolated for auth verification.
  - `Article` instances are stored as independent blocks.
  - `Sponsor` entities are queried using hardcoded identifiers (`leaderboard`, `square`, `inline`).
  - `ContactMessage` logs submissions.
  - `TickerConfig` stores global modes.

---

## 3. Scalability Concerns

### Concurrent SQLite Locks
- **Issue**: SQLite relies on file-level locks for write operations. When multiple admin users edit articles or update banner sponsorships concurrently, one of the operations will receive a `Database is locked` error.
- **Mitigation**: Migrate the Prisma datasource provider to a transactional server database (like PostgreSQL or MySQL).

### Lack of Relations
- **Issue**: No links exist between articles and author/admin entities.
- **Mitigation**: Define a `User` model and establish a one-to-many relationship: `Article.authorId -> User.id`.

### Partitioning & Workspaces
- **Issue**: There are no columns to separate data between different workspace accounts.
- **Mitigation**: Introduce a `workspaceId` string column to the `Article`, `Sponsor`, and `TickerConfig` models, creating dynamic tenant-scoping parameters for SQL queries.
