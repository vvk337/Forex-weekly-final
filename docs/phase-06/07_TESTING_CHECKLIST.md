# 07 Testing Checklist - Phase 6

This document outlines the testing checklists to verify the editorial workflow and lifecycle transitions.

---

## 1. Employee Gating checks
* [ ] Log in as an Employee. Verify you can only edit or delete your own drafts.
* [ ] Click "Submit for Review". Verify the article status transitions to `Pending Review`.
* [ ] Verify that published articles are read-only for employees.

---

## 2. Supervisor Approval & Revision checks
* [ ] Log in as a Supervisor. Verify you can see pending articles from your department.
* [ ] Select "Approve & Publish" and verify the status updates to `Published`.
* [ ] Select "Return for Revision" with feedback. Log back in as the authoring Employee and confirm the draft shows a `Needs Revision` comment.

---

## 3. Scheduling checks
* [ ] Log in as a Supervisor. Select "Schedule" and set a time in the future. Verify status updates to `Scheduled`.
* [ ] Change system time or verify that querying the articles list once the date is past automatically publishes the article.
