# 01 Editorial Workflow - Phase 6

This document details the editorial workflow transitions and gating rules implemented on the CMS platform.

---

## 1. Editorial Workflow Stages & Transitions

```
 ┌───────────┐    Submit     ┌────────────────┐    Approve     ┌─────────────┐
 │   DRAFT   ├──────────────►│ PENDING REVIEW ├───────────────►│  PUBLISHED  │
 └─────▲─────┘               └───────┬────────┘                └──────┬──────┘
       │                             │ Return                         │
       └─────────────────────────────┘                                │ Archive
                                                                      ▼
                                                               ┌─────────────┐
                                                               │  ARCHIVED   │
                                                               └─────────────┘
```

---

## 2. Dynamic Gating by Role

### Employee
- Can create, edit, delete, and resubmit their own Draft publications.
- Published and Pending articles are read-only.

### Supervisor
- Sees pending articles submitted by members of their assigned department.
- Can edit, approve, schedule, move to trash, or return pending articles to revision drafts.

### Admin & Owner
- Bypasses department constraints.
- Can restore or delete permanently articles in the Trash status.
