# Tech Deals Forum Architecture Plan

This document describes the high-level architecture and system design for the Tech Deals Forum, aligning with the planned implementation stack of SvelteKit, Bun, PostgreSQL, Drizzle ORM, and Lucia Auth.

## 1. High-Level System Architecture

The application follows a monolithic, SSR-first web architecture centered around SvelteKit running natively on the Bun runtime.

```mermaid
graph TD
    Client[Web Browser / Client]
    
    subgraph SvelteKit Environment (Bun Runtime)
        Router[SvelteKit Router]
        Pages[Svelte Pages UI]
        ServerLoad[Server Load Functions +page.server.ts]
        ServerActions[Form Actions +page.server.ts]
        APIEndpoints[API Endpoints +server.ts]
        Hooks[Server Hooks hooks.server.ts]
    end
    
    subgraph Services & Auth
        LuciaAuth[Lucia Auth Engine]
        DrizzleORM[Drizzle ORM]
    end
    
    subgraph Data Stores
        PgDB[(PostgreSQL Database)]
        RedisCache[(Redis Cache - Upstash)]
        SearchExternal[External Search Engine]
    end

    Client -->|HTTP GET / Pages| Router
    Client -->|Form Submissions| ServerActions
    Client -->|API Calls (Client-side logic)| APIEndpoints
    
    Router --> Pages
    Router --> ServerLoad
    
    Hooks --> LuciaAuth
    ServerLoad --> Hooks
    ServerActions --> Hooks
    
    ServerLoad --> RedisCache
    ServerLoad --> DrizzleORM
    
    ServerActions --> DrizzleORM
    ServerActions --> SearchExternal
    
    APIEndpoints --> DrizzleORM
    
    LuciaAuth -->|Adapter| DrizzleORM
    DrizzleORM --> PgDB
```

## 2. Component Layers & Responsibilities

### 2.1 The Client Layer (Frontend)
- **Framework:** Svelte components styled with plain Tailwind CSS.
- **Role:** Render UI sent from the server, handle client-side interactivity (like upvoting or expanding comment trees), and submit data via progressive enhancement (SvelteKit Form Actions).
- **SEO/Metadata:** Fully server-side rendered for SEO crawling and rich OpenGraph cards when deals are shared on social media.

### 2.2 The Web Server Layer (SvelteKit on Bun)
- **Runtime:** Bun provides an ultra-fast JavaScript execution environment, bypassing Node.js overhead.
- **Hooks (`hooks.server.ts`):** 
  - Intercepts all incoming requests explicitly.
  - Validates the session cookie via Lucia Auth.
  - Injects `user` and `session` objects into `event.locals` for downstream use in load functions and actions.
- **Load Functions (`+page.server.ts`):** Fetches deal data, user profiles, and comments from the database before the page renders. Relies heavily on Drizzle ORM queries.
- **Form Actions (`+page.server.ts`):** Replaces traditional REST APIs for form submissions. When a user submits a deal or posts a comment, standard `FormData` is sent to these actions, validated, and inserted into the database via Drizzle.

### 2.3 The Authentication Layer (Lucia Auth)
- **Session Strategy:** Cookie-based session tracking mapped directly to the database. No JWTs.
- **Workflow:**
  1. User authenticates via credentials or OAuth (e.g., Google/Discord).
  2. Lucia creates a robust session record in PostgreSQL (via the Drizzle adapter).
  3. A secure HTTP-only cookie containing the session ID is passed to the browser.
  4. Subsequent requests are validated against the database session table via `hooks.server.ts`.

### 2.4 The Data Access Layer (Drizzle ORM & PostgreSQL)
- **Relational Model:** Core mapping of `users`, `sessions`, `deals`, `votes`, `comments`, and `categories`.
- **Reasoning for Drizzle:** Drizzle ensures zero-dependency TypeScript safety and high performance on the edge/Bun runtime. It generates extremely efficient SQL tailored for the underlying PostgreSQL adapter (e.g., `postgres.js`).

### 2.5 Caching & Search Extensions
- **Caching (Redis/Upstash):** High-traffic feeds (e.g., the front page "Hot Deals") are cached in Redis to prevent excessive database hits. Cache is invalidated selectively when significant upvote thresholds are met or a new deal shifts the rankings.
- **Search (Typesense/Algolia):** While basic queries hit Postgres, deep filtering (e.g., matching a laptop by specific RAM size, GPU series, and price) is offloaded to a dedicated search engine. Deal creation actions mirror metadata to the search engine index asynchronously.

## 3. Request Lifecycle Examples

### 3.1 Viewing the Homepage (GET)
1. User requests `/`.
2. `hooks.server.ts` intercepts, checks cookies, and sets `event.locals.user` to null (guest) or the user profile.
3. `+page.server.ts` Server Load function executes.
4. It queries Redis for the "Hot Deals" feed snippet. If a cache miss occurs, Drizzle queries PostgreSQL, calculates scores, and caches the result.
5. The Svelte page is compiled to HTML using the loaded data and sent to the client.

### 3.2 Upvoting a Deal (POST)
1. Authenticated user clicks "Upvote" on `/deals/123`.
2. A client-side fetch request or progressively enhanced form submits to `/deals/123/vote/+server.ts` (or form action).
3. Server validates authentication in `event.locals`.
4. Drizzle ORM executes an `UPSERT` into the `votes` table to ensure one vote per user per deal.
5. A background task or database trigger recalculates the deal's hotness score based on time decay. 
6. Server responds with the updated deal score to immediately reflect on the client UI.
