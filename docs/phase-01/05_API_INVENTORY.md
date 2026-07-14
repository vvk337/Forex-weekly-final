# 05 API Inventory

This document details every API route currently implemented in the Forex Weekly CMS backend.

---

## 1. Authentication Router

### `POST /api/auth/login`
* **Purpose**: Authenticates admin dashboard credentials and sets the session cookie.
* **Authentication**: None (Public).
* **Request Payload**:
  ```json
  { "username": "admin_username", "password": "plain_password" }
  ```
* **Response (Success - 200)**:
  - Header: `Set-Cookie: admin_token=jwt_string; HttpOnly; Path=/; Max-Age=21600`
  ```json
  { "success": true, "message": "Logged in successfully" }
  ```
* **Dependencies**: `prisma`, `bcryptjs`, `jose`.

### `POST /api/auth/logout`
* **Purpose**: Clear the admin session.
* **Authentication**: None (Public).
* **Request Payload**: None.
* **Response (Success - 200)**:
  - Header: `Set-Cookie: admin_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ```json
  { "success": true }
  ```

---

## 2. Articles API

### `GET /api/articles`
* **Purpose**: Retrieves all articles, filtered by query parameters.
* **Authentication**: None (Public).
* **Query Parameters**:
  - `category` (optional): `weekly-updates` | `daily-feed` | `forex` | `learn-forex`
  - `isFeatured` (optional): `true` | `false`
* **Response (200)**: Array of article objects.
* **Dependencies**: `prisma`, `mockData` (for fallback seeding).

### `POST /api/articles`
* **Purpose**: Publishes a new article.
* **Authentication**: Token JWT Check (`articles:write`).
* **Request Payload**:
  ```json
  {
    "title": "Article Title",
    "excerpt": "Excerpt Summary",
    "content": "Full Markdown/Text Body",
    "category": "forex",
    "author": "Author Name",
    "imageUrl": "/uploads/image.png",
    "isFeatured": false
  }
  ```
* **Response (201)**: Created article object.

### `PUT /api/articles/[id]`
* **Purpose**: Updates an existing article's properties.
* **Authentication**: Token JWT Check (`articles:write`).
* **Request Payload**: Same as POST (partial fields accepted).
* **Response (200)**: Updated article object.

### `DELETE /api/articles/[id]`
* **Purpose**: Removes an article from the database.
* **Authentication**: Token JWT Check (`articles:write`).
* **Response (200)**:
  ```json
  { "success": true, "message": "Article deleted successfully" }
  ```

---

## 3. Sponsored Placements API

### `GET /api/sponsors`
* **Purpose**: Fetches active banner advertisements.
* **Authentication**: None (Public).
* **Response (200)**: Array of three sponsor objects (`leaderboard`, `square`, `inline`).

### `PUT /api/sponsors`
* **Purpose**: Updates banner details.
* **Authentication**: Token JWT Check (`sponsors:write`).
* **Request Payload**:
  ```json
  {
    "id": "leaderboard",
    "title": "Headline",
    "description": "Subtext",
    "linkUrl": "https://target.com",
    "buttonText": "Start",
    "imageUrl": "/logo.png",
    "bgImageUrl": "/bg.jpg"
  }
  ```
* **Response (200)**: Updated sponsor object.

---

## 4. Breaking News Ticker API

### `GET /api/breaking-news`
* **Purpose**: Returns headlines to render in the scroll bar.
* **Authentication**: None (Public).
* **Response (200)**:
  - In auto mode: Yahoo Finance RSS titles array (cached for 5 minutes).
  - In manual mode: Array of manually entered titles that have not expired.

### `PUT /api/breaking-news`
* **Purpose**: Saves ticker modes and custom manual alerts.
* **Authentication**: Token JWT Check (`ticker:write`).
* **Request Payload**:
  ```json
  {
    "mode": "manual",
    "manualText": "[{\"text\":\"Alert 1\",\"expiryOption\":\"10min\",\"expiresAt\":\"2026-07-15T02:40:00.000Z\"}]"
  }
  ```
* **Response (200)**: Updated configuration object.

---

## 5. Contact Inbox API

### `POST /api/contact`
* **Purpose**: Receives client contact messages.
* **Authentication**: None (Public).
* **Request Payload**:
  ```json
  { "name": "Name", "email": "email@mail.com", "subject": "Subject", "message": "Message content" }
  ```
* **Response (210)**: Success confirmation.

### `GET /api/contact`
* **Purpose**: Returns all support submissions.
* **Authentication**: Token JWT Check (`inbox:read`).
* **Response (200)**: Array of messages.

### `DELETE /api/contact?id=[message_id]`
* **Purpose**: Deletes a support message.
* **Authentication**: Token JWT Check (`inbox:read`).
* **Response (200)**: Success message.

---

## 6. Media Upload API

### `POST /api/upload`
* **Purpose**: Writes uploaded file binary payloads to disk.
* **Authentication**: Token JWT Check (`assets:write`).
* **Request Payload**: Multipart Form Data holding a `file` binary object.
* **Response (200)**:
  ```json
  { "url": "/uploads/1784039800000-filename.jpg" }
  ```
