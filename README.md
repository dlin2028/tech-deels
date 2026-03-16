# TechDeels

A hardware deals community forum built with SvelteKit 2, Svelte 5, Drizzle ORM, Lucia Auth v3, and PostgreSQL.

## Stack

- **Frontend/Backend**: SvelteKit 2 + Svelte 5
- **Runtime/Package Manager**: Bun
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: Drizzle ORM
- **Auth**: Lucia Auth v3
- **Styling**: Tailwind CSS 3

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://docker.com) + Docker Compose

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo>
cd tech-deels
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set a strong SESSION_SECRET
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Push the schema and seed data

```bash
bun db:push
bun db:seed
```

### 5. Start the dev server

```bash
bun dev
```

Open [http://localhost:5173](http://localhost:5173).

## Default credentials (after seeding)

- **Admin**: `admin@techdeels.com` / `admin123`

## Project Structure

```
/
├── apps/
│   └── web/          # SvelteKit app
├── packages/
│   ├── db/           # Drizzle schema + migrations + seed
│   └── shared/       # Shared types and validators (Zod)
├── docker-compose.yml
├── package.json      # Root workspace
└── .env.example
```

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun db:push` | Push schema to database |
| `bun db:seed` | Seed the database with sample data |
| `bun db:studio` | Open Drizzle Studio |
