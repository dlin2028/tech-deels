# Tech Deals Forum Implementation Plan

This document outlines the detailed plan to implement the Tech Deals Forum using the updated technology stack: **SvelteKit, Bun, and PostgreSQL**. The implementation will be delivered as a monorepo containing the web app, background services, shared packages, and local infrastructure configuration.

## Goal Description
Build a specialized tech deals forum focused on computer hardware, featuring user authentication, deal posting, voting engine, nested comments, and advanced search filtering. The application must be fast and SEO-friendly, leveraging SvelteKit's Server-Side Rendering (SSR) capabilities.

## Technical Decisions
- **Authentication Strategy**: Lucia Auth (Valio) for secure session management and simple OAuth flows.
- **Database ORM**: Drizzle ORM, for its native Bun compatibility and zero-dependency edge performance.
- **UI Framework**: Plain Tailwind CSS without pre-built component libraries for maximum customization.
- **Repository Strategy**: Monorepo workspace structure so all apps, services, and shared packages ship together.
- **Local Stack Strategy**: Docker Compose for PostgreSQL, Redis, search infrastructure, and optional app containers so the full stack can be built and tested locally.

## Proposed Changes

### Setup & Infrastructure
#### [NEW] `package.json`
- Convert the root into a workspace manifest for the monorepo.
- Configure Bun as the package manager and runtime.
- Add root scripts for `dev`, `build`, `test`, `test:e2e`, `lint`, `db:migrate`, `db:seed`, and Docker Compose orchestration.
#### [NEW] `svelte.config.js` & `vite.config.js`
- Set up SvelteKit and Vite configuration to run smoothly on Bun.
- Configure appropriate Tailwind plugins.
#### [NEW] `docker-compose.yml`
- Define the local full-stack environment for PostgreSQL, Redis, and the selected search engine.
- Optionally include the web app and worker containers for full clean-room local verification.
#### [NEW] `apps/`, `services/`, and `packages/`
- Create the monorepo directory structure for deployable apps and shared libraries.
#### [NEW] `.env`
- Set required environment variables (Database URL, Auth secrets).

### Authentication & Users
#### [NEW] `packages/db/src/schema.ts`
- Define User and Session models in the database using Drizzle ORM schemas.
#### [NEW] `packages/auth/src/index.ts`
- Initialize Lucia Auth instance with the Drizzle ORM adapter.
#### [NEW] `apps/web/src/hooks.server.ts`
- Implement server-side hooks to validate user sessions using Lucia Auth on every request globally.
#### [NEW] `apps/web/src/routes/login/+page.svelte` & `+page.server.ts`
- UI form for user login/registration.
- Server actions to handle authentication state using Lucia's secure cookies.

### Deal Posting & Management
#### [MODIFY] `packages/db/src/schema.ts`
- Add schemas for `deals` and `categories`.
#### [NEW] `apps/web/src/routes/deals/new/+page.svelte`
- Create the submission form with Markdown/Rich-Text editor for descriptions.
- Dynamic fields for condition, form-factor, and other taxonomy rules.
#### [NEW] `apps/web/src/routes/deals/new/+page.server.ts`
- Server action to parse submitted data, validate it, and persist it to PostgreSQL.

### Deal Feed & Voting
#### [NEW] `apps/web/src/routes/+page.svelte` & `+page.server.ts`
- Homepage displaying the "New" and "Hot" deal feeds.
- Server load function fetching deals from the database, sorted chronologically and by a calculated score.
#### [MODIFY] `packages/db/src/schema.ts`
- Add `votes` schema tracking user ID, deal ID, and vote value (1, -1).
#### [NEW] `apps/web/src/routes/deals/[id]/vote/+server.ts`
- API Endpoint to securely handle upvoting/downvoting, ensuring users only vote once per deal.

### Discussion & Comments
#### [MODIFY] `packages/db/src/schema.ts`
- Add `comments` table supporting nested self-referencing relationships (Threaded discussions).
#### [NEW] `apps/web/src/routes/deals/[id]/+page.svelte` & `+page.server.ts`
- Detailed Deal Page.
- Load function rendering the deal, along with its specific comment tree.
- Server action to handle submitting new comments and replies.

### Supporting Services
#### [NEW] `services/worker/src/index.ts`
- Process asynchronous jobs for cache invalidation, score recomputation, and notifications.
#### [NEW] `services/search-sync/src/index.ts`
- Mirror deal and moderation changes into the search engine without coupling indexing to request latency.

### Workspace Tooling
#### [NEW] Root build and test scripts
- Ensure a single command can build every app and service in the monorepo.
- Ensure a single command can run unit, integration, and end-to-end tests locally.
#### [NEW] Container-aware test flow
- Wire integration and end-to-end test commands to the Docker Compose stack so PostgreSQL, Redis, and search dependencies are consistently available.

## Verification Plan

### Automated Tests
- Setup unit test suite using `bun test` for calculating deal scores, link rewriting mechanics, and shared package behavior.
- Add integration tests for database access, cache flows, and search synchronization against the Compose-backed local stack.
- Develop Playwright E2E tests simulating the user flow: Signup -> Post Deal -> Upvote.

### Manual Verification
- Start the full local stack via Docker Compose.
- Run the root workspace `dev` command for iterative development or full-stack containers for clean-room verification.
- Visually test responsive design and Tailwind layouts.
- Test form validation mechanisms (e.g. attempting to submit without a required retail price).
- Confirm accurate Session rendering natively on Bun server.
