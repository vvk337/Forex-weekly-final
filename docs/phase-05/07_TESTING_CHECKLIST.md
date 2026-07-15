# 07 Testing Checklist - Phase 5

This document outlines the testing checks to verify that the dashboard and workspace UI enhancements operate correctly.

---

## 1. Sidebar & Workspace Switcher Checks
* [ ] Log in with a single workspace user and verify that the workspace dropdown switcher is hidden.
* [ ] Log in with a multi-workspace user (e.g. Owner) and verify that the workspace dropdown is visible.
* [ ] Verify that changing active workspace updates the sidebar navigation links and active modules inline.

---

## 2. Dynamic Dashboard & Widgets Checks
* [ ] Log in as an Employee. Verify that the Dashboard widget displays "My Drafts" and "My Published Articles".
* [ ] Log in as a Supervisor. Verify that the Dashboard displays "Pending Reviews" and "Department Scope".
* [ ] Confirm that clicking "Review" or navigation shortcuts changes tab views correctly.

---

## 3. Global Search & UI Checks
* [ ] Type a search query inside the top search bar. Verify that results popover lists matches instantly.
* [ ] Click a matching search result and verify that the tab switches.
* [ ] Inspect the breadcrumbs at the top of the header. Verify it tracks active tab changes.
* [ ] Check responsiveness on tablet sizes, confirming sidebar toggle overlays function correctly.
