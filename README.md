# Express Realty Prime

A modern, dynamic real estate website built with **Node.js + TypeScript + NestJS + PostgreSQL (TypeORM) + EJS**, containerized with Docker. Includes a full admin backend to manage properties, agents, and blog posts.

## Features

- 🏠 Property listings with search & filtering (type, status, location, price)
- 👤 Agent directory with profiles, WhatsApp contact & verified badges
- 📝 Blog with articles
- 💎 Modern UI: animations, hover effects, responsive design
- 🔐 Admin panel with authentication (session-based)
  - CRUD for Properties, Agents, and Blog Posts
  - Image upload support
- 🐳 Dockerized with PostgreSQL for real persistence
- ▲ Vercel-ready (serverless handler in `api/index.ts`)

## Tech Stack

- Node.js 20, TypeScript, NestJS 10
- EJS templating (NestExpressApplication)
- PostgreSQL + TypeORM
- express-session + bcrypt for auth
- multer for uploads
- Docker + Docker Compose
- Vercel serverless

## Getting Started

### With Docker (recommended)

```bash
cp .env.example .env   # adjust DATABASE_URL / secrets if needed
docker compose up -d
```

Visit http://localhost:3000 — admin panel at http://localhost:3000/admin

**Default admin login:** `admin` / `admin123`
(change via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars in `docker-compose.yml` or `.env`)

The database is seeded automatically on first run (16 properties, 6 agents, 8 blog posts).

### Local development

```bash
cp .env.example .env
# make sure a PostgreSQL instance is reachable at DATABASE_URL
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
src/
  main.ts              # app entry (listens on PORT)
  app.factory.ts       # builds/configures the NestExpressApplication
  app.module.ts        # root module (TypeORM + feature modules)
  paths.ts             # resolves views / public / uploads dirs
  entities/            # TypeORM entities (Property, Agent, Post, User)
  seed/               # embedded seed data + SeedService
  common/             # slug util, upload (multer) util, auth guards
  modules/
    site/             # home + contact pages
    properties/       # public property listing + detail
    agents/           # public agent listing + detail
    blog/             # public blog listing + detail
    admin/            # admin auth + CRUD
    users/            # user service (auth)
    fallback/         # 404 catch-all
  views/               # EJS templates (public + admin)
  public/              # CSS, JS, uploads
api/
  index.ts            # Vercel serverless handler
```

## Data Persistence

Data is stored in **PostgreSQL** via TypeORM. On first run the app seeds demo data
automatically. Uploaded images live in `src/public/uploads/` (or `/tmp/uploads` on Vercel's read-only FS).
