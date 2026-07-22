# Document 09: Background Services

## Automated Services & Polling Architecture
- **Scheduled Articles Auto-Publisher**: Evaluated on incoming `GET /api/articles` requests. Checks if any article has `status: "SCHEDULED"` and `scheduledAt <= now()`. Auto-promotes matches to `PUBLISHED`.
- **Yahoo Finance RSS Feed Caching**: `/api/breaking-news` fetches and parses external RSS feeds, caching results in memory for 5 minutes (`CACHE_DURATION = 300000ms`).
- **Database Seeder (`db-seed.ts`)**: Triggered during authentication to self-heal default roles, departments, workspaces, and system accounts.
