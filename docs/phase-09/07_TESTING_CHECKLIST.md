# Testing Checklist

The following tests were executed to ensure full code safety and robustness:

- `[x]` **Active User Searches**: Searched by Name, Department, and Role; returns filtered results.
- `[x]` **Direct Message Actions**: Created DM room, exchanged messages, verified read indicator.
- `[x]` **Conversation Deletions**: Deleting conversation hides it from the sender but preserves it for the peer recipient.
- `[x]` **Group Actions**: Supervisors can create groups and invite colleagues. Employees can view and reply but cannot create.
- `[x]` **Announcements Board**: Pinned notice displays at the top. Non-supervisors receive read-only feed.
- `[x]` **Notifications Integration**: New DMs, group chats, and announcements trigger notifications.
- `[x]` **Legacy Contact Inbox**: Public Inquiries tab lists and manages public messages without changes.
- `[x]` **Audit Logging**: Verified system audit logs remain fully operational.
