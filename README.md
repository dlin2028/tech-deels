# TechDeels Forum

A community-powered tech deals forum built with SvelteKit, Bun, PostgreSQL, and Drizzle ORM.

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 + Tailwind CSS
- **Runtime**: Bun
- **Database**: PostgreSQL 16 via Drizzle ORM
- **Auth**: Lucia v3 with Drizzle adapter
- **Infrastructure**: Docker Compose

## Monorepo Structure

```
apps/
  web/              SvelteKit web application
services/
  worker/           Background job worker (hot score updates, expiry)
  search-sync/      Search index synchronization service
packages/
  db/               Drizzle schema, migrations, seed data
  auth/             Lucia auth configuration
docker-compose.yml  PostgreSQL + Redis
```

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Start infrastructure

```bash
bun compose:up
# or: docker compose up -d
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed (defaults work with Docker Compose)
```

### 4. Set up database

```bash
# Generate migrations (first time or after schema changes)
bun db:generate

# Apply migrations
bun db:migrate
# or push schema directly (dev only):
bun db:push

# Seed with sample data
bun db:seed
```

### 5. Run the development server

```bash
bun dev
# Open http://localhost:5173
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start web app in dev mode |
| `bun build` | Build web app for production |
| `bun preview` | Preview production build |
| `bun db:generate` | Generate Drizzle migrations |
| `bun db:migrate` | Apply pending migrations |
| `bun db:push` | Push schema to DB (dev) |
| `bun db:seed` | Seed database with sample data |
| `bun compose:up` | Start Docker services |
| `bun compose:down` | Stop Docker services |

## Features

- 🔥 **Hot/New/Top** deal feeds with Reddit-style hot scoring
- 🗳️ **Voting** — upvote/downvote deals and comments
- 💬 **Threaded comments** on every deal
- 🔐 **Auth** — register, login, sessions via Lucia
- 📂 **Categories** — Components, Laptops, Monitors, Storage, etc.
- 🔍 **Search** — full-text search across deals
- ⭐ **Save deals** to your personal list
- 📊 **Deal stats** — view counts, click tracking, scores
- 🚩 **Flag/Report** system for moderation

## Database Schema

Key tables:
- `users` — user accounts and profiles
- `sessions` — Lucia auth sessions
- `deals` — deal submissions with pricing, voting, metadata
- `categories` — deal categories
- `votes` — per-user deal votes
- `comments` — threaded comments with votes
- `saved_deals` — user bookmarks
- `flags` — community reports

## Production Deployment

1. Set `NODE_ENV=production` and a real `DATABASE_URL`
2. Build: `bun build`
3. Start: `node build` (adapter-node output)
4. Run worker: `bun --cwd services/worker start`

## Demo Account

After seeding, a demo account is available:
- **Email**: `demo@techdeels.com`
- **Password**: `password123`
