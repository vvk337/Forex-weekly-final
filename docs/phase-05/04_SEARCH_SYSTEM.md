# 04 Search System - Phase 5

This document details the Global Search implementation.

---

## 1. Scope
A simple, fast search index is loaded directly in the top navigation header bar. Matches query terms against:
- **Articles**: matching titles or authors.
- **Users**: matching names or usernames.
- **Sponsors**: matching titles.
- **Navigation Shortcuts**: matching page terms.

---

## 2. Floating Popover UI
- Search matching happens instantly on key presses without layout shift.
- Results appear in a floating list popover. Clicking a matching item navigates to the target tab or edit view.
