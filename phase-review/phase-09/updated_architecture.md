# Updated Architecture - Phase 9

## Conceptual Overview
The Inbox system acts as a work-focused platform hub for team members. It is not an active real-time socket-based chat system, but a database-driven, secure Inbox optimized for performance.

## Architectural Flow
```mermaid
graph TD
  UserA[User A] -->|1. HTTP POST Message| API[API Route: /api/inbox/conversations/:id]
  API -->|2. Save Message| DB[(SQLite: ChatMessage)]
  API -->|3. Restore View for Members| DB
  API -->|4. Push Notification event| Notif[Notification Engine]
  Notif -->|5. Insert Notification| NTable[(SQLite: Notification)]
  UserB[User B] -->|6. Periodic Poll| API
  UserB -->|7. Pull Notifications| Notif
```

## Universal Routing & Side Menu
To keep all modules distinct, the sidebar has been enhanced to group sub-elements:
- **Inbox**
  - **Direct Messages**: Private 1-to-1 conversation rooms between active team members.
  - **Groups**: Collaboration channels managed by administrative levels.
  - **Announcements**: Platform-wide notice board for broadcasts.
  - **Public Inquiries**: Legacy Contact Inbox preserving public visitor inquiries.
