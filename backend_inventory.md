# Complete Backend Inventory - Forex Weekly CMS

This document provides a comprehensive technical inventory of the current backend architecture, including database schemas, authentication systems, API endpoints, and admin dashboard pages.

---

## 1. Core Services & Middleware

### Database layer
* **Name**: Prisma Client & SQLite Database
* **Purpose**: Manages connections, queries, and data persistence for all content and settings.
* **Current Functionality**: 
  - Standard Prisma setup using SQLite (`prisma/schema.prisma` mapping to `prisma/dev.db`).
  - Utilizes a singleton client wrapper (`src/lib/db.ts`) to avoid socket exhaustion.
* **Dependencies**: `@prisma/client`, `prisma` ORM.
* **Existing Limitations**: Built on SQLite (`file:./dev.db`), which does not support concurrently writing connections (can cause write-lock blocks under heavy loads) and is not suited for multi-server replication.

### Authentication & Route Security
* **Name**: custom JWT Cookie Authentication & Next.js Middleware
* **Purpose**: Protects private admin dashboard directories and modifications endpoints from unauthenticated clients.
* **Current Functionality**:
  - Middleware ([middleware.ts](file:///C:/Users/MODERN%2015/.gemini/antigravity/scratch/forex-weekly/src/middleware.ts)) checks for the presence of the `admin_token` cookie.
  - Verifies cookie authenticity using `jose` JWT checks. Redirects unauthenticated requests trying to access `/admin/dashboard/*` to `/admin/login`.
* **Dependencies**: `jose` (JWT verification), `next/server` middleware.
* **Existing Limitations**: Standard JWT payload parsing is in-memory on each edge request; does not support token revocation lists (sessions cannot be force-invalidated until their JWT expiry date passes unless a database check is added).

---

## 2. API Router Endpoints (`src/app/api/*`)

### Authentication endpoints
* **Name**: `/api/auth/login` and `/api/auth/logout`
* **Purpose**: Processes admin dashboard login credentials and logs out sessions.
* **Current Functionality**:
  - `POST (login)`: Compares inputs against `Admin` database records using `bcryptjs`. If correct, creates a secure, HTTP-only `admin_token` session cookie.
  - `POST (logout)`: Overwrites the client's `admin_token` cookie value with an empty string and sets it to expire immediately.
* **Dependencies**: `bcryptjs` (password comparisons), `jose` (JWT signatures), `prisma`.
* **Existing Limitations**: Single admin credentials design. No rate limiting or brute-force lockouts implemented on the login route.

### Articles Management API
* **Name**: `/api/articles` and `/api/articles/[id]`
* **Purpose**: Coordinates article data queries, publications creation, updates, and deletions.
* **Current Functionality**:
  - `GET`: Retrieves all published articles sorted by date. If the database count is 0, it dynamically seeds initial mock articles.
  - `POST`: Saves a new article publication in the database (admin auth required).
  - `PUT`: Updates an existing article's title, excerpt, content, category, author, and imageUrl (admin auth required).
  - `DELETE`: Deletes an article by ID from the database (admin auth required).
* **Dependencies**: `prisma`, custom JWT checker.
* **Existing Limitations**: Lacks content pagination on `GET` requests (retrieves all records in one go, which can slow down as the database grows).

### Sponsored Placements API
* **Name**: `/api/sponsors`
* **Purpose**: Manages sponsored placement properties for the website banners.
* **Current Functionality**:
  - `GET`: Fetches current banner records (leaderboard, square, inline). Seeds default text configurations if database records are empty.
  - `PUT`: Updates details of a banner (headline title, description, linkUrl, CTA buttonText, logo imageUrl, and bgImageUrl) (admin auth required).
* **Dependencies**: `prisma`, custom JWT checker.
* **Existing Limitations**: Placements are hardcoded to three slots (`leaderboard`, `square`, `inline`); new slots cannot be created dynamically from the backend dashboard.

### Breaking News Ticker API
* **Name**: `/api/breaking-news`
* **Purpose**: Scrapes Yahoo Finance RSS feeds or returns custom manually locked alerts.
* **Current Functionality**:
  - `GET`: Returns the active scrolling headlines list:
    - In **Automatic Mode**: Fetches the Yahoo Finance RSS feed (`https://finance.yahoo.com/news/rss`), parses item headlines via server-side Regex extraction, and implements a 5-minute memory cache.
    - In **Manual Mode**: Parses and returns active custom manual headlines (excluding any items whose dynamic timer has expired).
  - `PUT`: Saves chosen ticker mode ("auto" / "manual") and serializes the list of manual override text entries and their expiration relative timestamps as a JSON array (admin auth required).
* **Dependencies**: `prisma`, server-side native HTTP requests, custom JWT checker.
* **Existing Limitations**: Memory-based caching is wiped if the Node server restarts or recycles.

### Contact Inbox API
* **Name**: `/api/contact`
* **Purpose**: Receives client contact messages and allows admins to track them.
* **Current Functionality**:
  - `POST`: Validates inputs and saves incoming name, email, subject, and message in the `ContactMessage` table.
  - `GET`: Retrieves all submitted contact entries, ordered by date (admin auth required).
  - `DELETE`: Deletes a support message by its ID from the inbox (admin auth required).
* **Dependencies**: `prisma`, custom JWT checker.
* **Existing Limitations**: No automated email notifications are dispatched to staff or clients when a query is submitted; messages are only reviewable via dashboard query logs.

### Media Upload API
* **Name**: `/api/upload`
* **Purpose**: Writes uploaded file binaries directly to local disk storage.
* **Current Functionality**:
  - `POST`: Receives multipart form data payloads, generates a unique prefix timestamp, and writes the image file to the static asset directory (`public/uploads/`).
* **Dependencies**: Node.js `fs` module, custom JWT checker.
* **Existing Limitations**: Writes files locally to the server's hard drive. In serverless or containerized environments (like AWS Lambda or Vercel), local files are ephemeral and get deleted when instances recycle. (Requires S3 or other cloud asset stores for permanent persistence).

### Server Time Synchronizer
* **Name**: `/api/time`
* **Purpose**: Provides UTC server time to coordinate client clocks.
* **Current Functionality**:
  - `GET`: Returns `{ datetime: string }` representing the current UTC time.
* **Dependencies**: Standard JavaScript `Date` API.
* **Existing Limitations**: None (simple server utility).

---

## 3. Admin Dashboard Frontend Pages (`src/app/admin/*`)

### Admin Login Screen
* **Name**: `/admin/login`
* **Purpose**: Interface for logging into the dashboard.
* **Current Functionality**: Collects Username and Password inputs, handles fetch validation requests to `/api/auth/login`, and redirects to `/admin/dashboard` upon success.
* **Dependencies**: Client-side Next.js hooks.

### Dashboard Console
* **Name**: `/admin/dashboard`
* **Purpose**: Central control panel for all CMS operations.
* **Current Functionality**:
  - Displays a tabbed interface containing:
    1. **Publications**: Grid list showing all articles with delete options.
    2. **Sponsored Placements**: Lists banner spots with edit links.
    3. **Breaking News**: Radio triggers to select feed mode. Toggles a dynamic manual list editor supporting addition/deletion of up to 11 headline boxes with individual expiration selectors (10 min to 1 day).
    4. **Inbox Messages**: Table displaying user inquiry logs and emails, with message deletion tools.
* **Dependencies**: API connectors.
* **Existing Limitations**: Performs bulk loading of data on tab changes without pagination.

### Article Creation Editor
* **Name**: `/admin/dashboard/create`
* **Purpose**: Form to write and publish news articles.
* **Current Functionality**:
  - Collects title, category selection, excerpt summary, and body text.
  - Hosts a local image file selector connected to `/api/upload`, displaying real-time upload progress indicators.
* **Dependencies**: Upload connectors.
* **Existing Limitations**: Plain text/textarea body editor. No Rich Text Editor (WYSIWYG/Markdown) interface for text styling.

### Sponsored Placements Editor
* **Name**: `/admin/dashboard/sponsors/[id]`
* **Purpose**: Editing form for ad spots.
* **Current Functionality**:
  - Modifies Headline, Target Link, and CTA texts.
  - Features dual file upload input elements for both the Sponsor Logo and the Banner Background Image.
  - Displays ideal pixel sizing hints based on the target slot configuration.
* **Dependencies**: API upload connectors.
* **Existing Limitations**: Background settings apply globally without user device scaling triggers.
