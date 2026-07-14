# 01 System Overview - Enterprise CMS Blueprint

This document details the architectural philosophy, design guidelines, and system goals for the future Enterprise edition of the Forex Weekly CMS.

---

## 1. Design Goals
* **Modular Interface**: Unified dashboard widget layers that render depending on active workspace categories and user credentials.
* **Typographic Symmetry**: Editorial presentation combining classic serif display titles (Times New Roman style) with highly legible geometric sans-serif tables, forms, and alerts (Inter/Roboto styled).
* **Frictionless Workspace Switching**: Single-page navigation that lets users switch between Publication, Marketing, and Research contexts without page reloads.

---

## 2. Scalability Goals
* **Stateless API Handlers**: Decouple Node.js routers from local environment dependencies (like folder uploads and local database locks) to enable seamless multi-server cloud clustering.
* **Database Connection Pools**: Transition from SQLite to PostgreSQL, implementing partition pruning on workspace scopes.
* **Distributed Asset Uploads**: Store files directly in cloud buckets (e.g. S3) via signed pre-authorized upload URLs, removing disk write loads from API workers.

---

## 3. Security Goals
* **Fine-Grained RBAC & Tags**: Restrict write access to specific sections, ensuring actions are validated against role claims (Owner, Admin, Supervisor, Employee).
* **Audit Trails**: Capture details for all administrative modifications, deletions, and publishing actions in an immutable db log.
* **Session Lifecycle Control**: Enforce JWT revocation via database blocklists, session expirations, and secure HTTP-only configurations.

---

## 4. Usability Goals
* **Real-Time Context Views**: Action centers displaying tasks awaiting approval, new contact submissions, and active system alerts in a consolidated topbar.
* **Consistent State Feedbacks**: Standardized skeleton screen loaders, error boundary states, and instant interactive feedback for all CMS modifications.
