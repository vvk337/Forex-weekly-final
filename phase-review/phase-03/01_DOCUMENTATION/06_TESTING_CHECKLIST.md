# 06 Testing Checklist

This document details the tests and verification steps to confirm that all Phase 3 features are functioning correctly.

---

## 1. Authentication Parity Tests
* [ ] Log in with existing `admin` credentials to verify that backward compatibility with the legacy `Admin` table is active.
* [ ] Verify that the self-healing database seed creates a default `OWNER` user (`admin` / `admin123`) in the new `User` table when empty.
* [ ] Verify that archived users are blocked from logging in (returns `403 Forbidden`).

---

## 2. User Directory Tests
* [ ] Open the "Users" tab in the dashboard and verify that the user table loads correctly.
* [ ] Test the search bar with usernames, emails, and names.
* [ ] Verify that filters for role, status, and archiving function as expected.
* [ ] Test sorting by name, role, and registration date.
* [ ] Test pagination to ensure lists are split into pages of 10 items.

---

## 3. Account Editing & Reset Tests
* [ ] Navigate to `users/create` and invite a new user. Verify that validation checks trigger on duplicate emails or usernames.
* [ ] Use "Generate Temp Password" and check that it sets the password field.
* [ ] Navigate to `users/[id]` for a user, update their details, and verify that changes are saved.
* [ ] Test the archive/restore buttons to verify that status codes change.
* [ ] Log in as a user and navigate to `admin/dashboard/profile` to update personal details and change passwords.
