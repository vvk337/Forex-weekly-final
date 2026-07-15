# 05 Database Changes - Phase 6

This document details the SQLite database schema changes completed in Phase 6.

---

## 1. Schema Modifications (`schema.prisma`)

Added the following fields to the `Article` model:
- `status`: String (defaults to `"DRAFT"`). Tracks the article lifecycle status.
- `scheduledAt`: DateTime (optional). Tracks the future publishing timestamp.
- `publishedBy`: String (optional). Stores the username of the supervisor who approved publication.
- `editedBy`: String (optional). Stores the username of the user who performed the last update.
- `revisionComment`: String (optional). Stores feedback comments for returned revisions.
- `department`: String (defaults to `"Publications"`). Stores the author's department context.

---

## 2. Seed Migration
A one-time initialization script updated all existing database articles to `"PUBLISHED"` status, preserving compatibility.
