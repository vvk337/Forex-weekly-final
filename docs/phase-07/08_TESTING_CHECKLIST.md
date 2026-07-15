# 08 Testing Checklist - Phase 7

This document logs validation procedures for audit logs features.

---

## 1. Login Auditing checks
* [ ] Attempt to login with an invalid password. Verify a `Failed Login Attempt` record is created in the global log.
* [ ] Login successfully. Verify a `Logged In` record is created with the user's details and IP address.

---

## 2. Article Actions Timeline checks
* [ ] Create a draft article. Expand its row and verify `Created` is logged in its timeline history.
* [ ] Transition its status (Submit, Return, Publish). Expand the row and verify the status transitions are appended.

---

## 3. Global Audit Filters checks
* [ ] Navigate to the Audit Logs tab as Owner.
* [ ] Enter a username in the search input and verify filter criteria matches.
* [ ] Choose a Module option and verify the log list filters.
