# Document 01: Project Overview

## 1. Executive Summary
**Forex Weekly CMS** is a dual-domain Enterprise Content Management System (CMS) and financial news publishing platform. The system combines a public-facing reader portal for financial market news, technical analyses, and educational guides with an isolated, multi-tenant administrative engine called the **Control Room**.

## 2. Business Goals
- **Editorial Workflow Governance**: Enforce structured publication pipelines (Draft -> Pending Review -> Scheduled -> Published -> Archived / Trash) controlled by department boundaries and assigned roles.
- **Role-Based Access Control (RBAC)**: Protect platform configurations under Owner accounts while delegating operational tasks (articles, sponsors, user management, breaking news) to Admins and Supervisors.
- **Dynamic Content & Advertising**: Stream real-time financial market headlines from Yahoo Finance RSS alongside manual admin breaking news overrides and sponsor banner placements.
- **Audit & Compliance**: Maintain immutable records of system events, logins, state changes, and account modifications.

## 3. System Architecture
The application uses Next.js 16 (App Router) with path-based middleware header injection (`x-pathname`). Control Room backend screens bypass all public website headers, footers, and sidebars.

```
+-------------------------------------------------------------------+
|                        Next.js Middleware                         |
|                 (x-pathname header injection)                     |
+---------------------------------+---------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|   Public Storefront   |                   |     Control Room      |
|  (Anonymous Readers)  |                   |   (Authenticated)     |
+-----------------------+                   +-----------------------+
| - Hero & Categories   |                   | - ControlRoomLayout   |
| - RSS Breaking Ticker |                   | - ControlRoomHeader   |
| - Sponsor Placements  |                   | - ControlRoomSidebar  |
+-----------------------+                   +-----------------------+
                                                        |
                                                        v
                                            +-----------------------+
                                            |     Prisma ORM        |
                                            |   SQLite (dev.db)     |
                                            +-----------------------+
```

## 4. Folder Structure
```
forex-weekly/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma         # Prisma schema and database relations
│   └── dev.db                # SQLite database storage
├── scripts/                  # Maintenance, reset, and utility scripts
├── Project Documentation/    # Permanent technical knowledge base
└── src/
    ├── middleware.ts         # Route protection and header injection
    ├── app/                  # Storefront & Admin App Router pages & APIs
    ├── components/           # UI components (admin/ and storefront)
    └── lib/                  # Core helpers (auth, DB, audit, notifications)
```

## 5. Technology Stack & Runtime
- **Framework**: Next.js 16.2.10 (App Router with Turbopack)
- **UI & Styling**: React 19.2.4, TailwindCSS v4
- **Language**: TypeScript 5.x
- **ORM & Database**: Prisma 6.19.3 with SQLite (`prisma/dev.db`)
- **Authentication**: JWT (`jose` 6.2.3), Bcryptjs (3.0.3)
- **Runtime & Server**: Node.js (v20+ / v25+) running production server bound to `0.0.0.0:3000`.
