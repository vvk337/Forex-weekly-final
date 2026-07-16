# Deployment Guide

Follow these steps to deploy the Forex Weekly CMS to production.

## 1. Environmental Variables Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db" # Or PostgreSQL connection string
JWT_SECRET="YOUR_RANDOM_LONG_SECRET_HEX"
```

## 2. Seed Database
Install dependencies, generate the Prisma schema client, run SQLite migrations, and seed initial database elements (roles, departments, owner accounts):
```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

## 3. Production Compilation
Build and start the application node processes:
```bash
npm run build
npm run start
```
By default, the server binds to `localhost:3000`. To serve on Wi-Fi/local networks, run:
```bash
npx next start --hostname 0.0.0.0
```
