# Express Realty Prime

A modern, dynamic real estate website built with **Node.js + TypeScript + Express + EJS**, containerized with Docker. Includes a full admin backend to manage properties, agents, and blog posts.

## Features

- 🏠 Property listings with search & filtering (type, status, location, price)
- 👤 Agent directory with profiles, WhatsApp contact & verified badges
- 📝 Blog with articles
- 💎 Modern UI: animations, hover effects, responsive design
- 🔐 Admin panel with authentication (session-based)
  - CRUD for Properties, Agents, and Blog Posts
  - Image upload support
- 🐳 Dockerized for easy deployment

## Tech Stack

- Node.js 20, TypeScript, Express 4
- EJS templating
- express-session + bcrypt for auth
- multer for uploads
- File-based JSON store (no external DB required)
- Docker + Docker Compose

## Getting Started

### With Docker (recommended)

```bash
docker compose up -d
```

Visit http://localhost:3000 — admin panel at http://localhost:3000/admin

**Default admin login:** `admin` / `admin123`
(change via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars in `docker-compose.yml`)

### Local development

```bash
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
  server.ts            # Express app entry
  data/                # JSON store + seed data
  models/              # TypeScript types
  repositories/        # CRUD data layer
  middleware/          # auth + upload
  routes/              # public + admin routes
  views/               # EJS templates (public + admin)
  public/              # CSS, JS, uploads
```

## Data Persistence

Data lives in `src/data/*.json` and uploaded images in `src/public/uploads/`.
In Docker, named volumes keep `data/` and `uploads/` persistent across restarts.
On first run the container seeds demo data automatically.
