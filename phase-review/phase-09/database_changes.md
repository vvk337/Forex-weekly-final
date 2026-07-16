# Database Changes - Phase 9

Added the following models to SQLite:

## 1. `ChatConversation`
- `id` (UUID, primary key)
- `type` ("DIRECT" | "GROUP")
- `name` (nullable Group name)
- `description` (nullable Group description)
- `createdBy` (nullable Creator name)
- `createdDate` (default: now)
- `isArchived` (boolean, default: false)
- `archivedByUsernames` (JSON String array: usernames who archived this conversation)
- `deletedByUsernames` (JSON String array: usernames who deleted this conversation from their view)
- `memberUsernames` (JSON String array: members of the conversation)

## 2. `ChatMessage`
- `id` (UUID, primary key)
- `conversationId` (Foreign Key referencing ChatConversation)
- `senderUsername` (Sender name)
- `content` (Message body)
- `timestamp` (default: now)
- `readByUsernames` (JSON String array: usernames who have read this message)
- `attachmentUrl` (nullable, architecture preparation for file sharing)
- `attachmentName` (nullable, architecture preparation for file sharing)

## 3. `SystemAnnouncement`
- `id` (UUID, primary key)
- `title` (Announcement subject)
- `message` (Announcement body)
- `createdBy` (Publisher name)
- `createdDate` (default: now)
- `expiryDate` (nullable date)
- `isPinned` (boolean, default: false)
