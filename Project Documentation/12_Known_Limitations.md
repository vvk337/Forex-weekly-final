# Document 12: Known Limitations

## Technical & Architectural Limitations
1. **SQLite Concurrency**: SQLite locks the database file on write operations (`SQLITE_BUSY` risks under heavy concurrency).
2. **Local File Storage**: File uploads are stored on local disk, making them non-persistent across ephemeral cloud server restarts.
3. **HTTP Cookie Configuration**: `secure: false` is set to permit local network Wi-Fi testing over HTTP IP addresses. Must be set to `true` before HTTPS domain deployment.
