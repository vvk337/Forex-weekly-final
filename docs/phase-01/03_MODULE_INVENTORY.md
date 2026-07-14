# 03 Module Inventory

This document cataloges every module inside the Forex Weekly CMS codebase, detailing their purpose, dependencies, and future expansion paths.

---

## 1. Authentication & Session Module (`src/lib/auth.ts`, `src/lib/auth-helpers.ts`)
* **Purpose**: Coordinates session JWT operations, cookie parsing, and access authorization checks.
* **Features**:
  - `signJWT`: Generates a signature token holding administrative username claims.
  - `verifyJWT`: Decodes token bytes and checks validity against the cryptographic secret.
  - `validatePermissions`: Centralized checker for checking action rights (e.g. `articles:write`, `inbox:read`).
* **Dependencies**: `jose` library, cookie extraction headers.
* **Limitations**: Stores credentials as a cookie with no session revocation list (cannot revoke token sessions server-side before their natural expiration date).
* **Future Expansion Possibilities**: Connect session claims to a database-backed User role model to support multi-user RBAC.

---

## 2. Database Services Module (`src/lib/db.ts`)
* **Purpose**: Initializes and returns a unified database client pool instance.
* **Features**: Prevents development hot-reload client accumulation using a global namespace cache singleton.
* **Dependencies**: `@prisma/client`.
* **Limitations**: Hardcoded to connect to local SQLite, which is unsuitable for high write concurrency.
* **Future Expansion Possibilities**: Upgrade db connectors to PostgreSQL/MySQL and implement read/write connection pool splitters.

---

## 3. Publications & Article Module
* **Purpose**: Powers news feeds, weekly intelligence analysis posts, and blog uploads.
* **Features**:
  - GET queries to list and filter articles by category.
  - Form editor to post, update, or delete articles.
* **Dependencies**: `prisma` client, React file upload inputs.
* **Limitations**: Lacks text formatting toolbar (raw textarea body input only). No auto-save or draft status support.
* **Future Expansion Possibilities**: Integrate a WYSIWYG Markdown editor, schedule publishing, and categorize by multiple labels.

---

## 4. Sponsor & Advertisement Module
* **Purpose**: Renders banner placements and manages target properties.
* **Features**:
  - GET/PUT routes in `/api/sponsors`.
  - Supports separate fields for background banner graphics and client brand logos.
* **Dependencies**: `prisma`, static media upload directories.
* **Limitations**: Ad slots are static (3 pre-defined items). No analytics (clicks, impressions tracking) are captured.
* **Future Expansion Possibilities**: Introduce campaign schedules, geolocation banners, and click analytics tracking.

---

## 5. Breaking News Ticker Module
* **Purpose**: Drives the real-time scrolling ticker on the viewport header.
* **Features**:
  - **Auto mode**: Fetches RSS XML from Yahoo Finance, caches responses for 5 minutes, and extracts article titles via regex.
  - **Manual mode**: Dynamic list editor with relative timers (10 minutes to 1 day) that automatically purge headlines upon expiration.
* **Dependencies**: Native HTTP fetch utilities, Prisma storage.
* **Limitations**: In-memory cache in auto-mode is lost if the Node process restarts.
* **Future Expansion Possibilities**: Connect to professional financial news wire APIs (e.g. Bloomberg, Reuters) and store multiple manual preset ticker configurations.

---

## 6. Inquiry & Inbox Module
* **Purpose**: Coordinates client contact submissions and displays them to administrators.
* **Features**: Form submission on `/contact`, listing/deleting message records inside the Admin Console inbox tab.
* **Dependencies**: `prisma` client, React table components.
* **Limitations**: Admin has to manually log in to read messages; no notifications are dispatched when new inquiries arrive.
* **Future Expansion Possibilities**: Connect to email dispatchers (like SendGrid or AWS SES) and support email replies directly from the dashboard.
