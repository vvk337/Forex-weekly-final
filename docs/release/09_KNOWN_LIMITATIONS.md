# Known Limitations

- **Concurrent DB Access**: Local SQLite database storage can lock under highly concurrent write-heavy environments. SWAP to PostgreSQL or MySQL for production environments.
- **Debounced Polling in Inbox**: Inbox chats and system notifications alerts retrieve messages using debounced HTTP request loops rather than WebSockets. Websocket integrations recommended for immediate real-time chat updates under high traffic.
- **Attachment Upload Limits**: Inbox schema exposes attachment url links, but frontend composers do not support direct file uploads. Attachment uploads must be handled via third-party object storages.
