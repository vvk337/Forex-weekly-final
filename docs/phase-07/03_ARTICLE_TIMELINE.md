# 03 Article Timeline - Phase 7

This document logs the article publishing timeline tracking details.

---

## 1. Tracked Transitions
Every state change on an article generates an audit trail log:
- **Created**: Initial article draft creation.
- **Edited**: Article content updates.
- **Submitted for Review**: Draft sent to Pending.
- **Returned for Revision**: supervisor revision comments returns.
- **Approved / Published**: supervisor approval actions.
- **Scheduled**: future schedule timestamp locks.
- **Archived**: archived articles.
- **Moved to Trash / Restored / Deleted Permanently**: Trashing and deletion cycles.

---

## 2. Inline rendering
- Expanding any article row in the Publications table triggers a lazy API fetch to load that specific article's timeline history.
- Displays: Date, Time, User, Action, and Optional Comment (e.g. revision feedback or schedule times).
