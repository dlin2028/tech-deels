# Tech Deals Forum Implementation Plan

This document outlines the detailed plan to implement the Tech Deals Forum using the updated technology stack: **SvelteKit, Bun, and PostgreSQL**.

## Goal Description
Build a specialized tech deals forum focused on computer hardware, featuring user authentication, deal posting, voting engine, nested comments, and advanced search filtering. The application must be fast and SEO-friendly, leveraging SvelteKit's Server-Side Rendering (SSR) capabilities.

## Technical Decisions
- **Authentication Strategy**: Lucia Auth (Valio) for secure session management and simple OAuth flows.
- **Database ORM**: Drizzle ORM, for its native Bun compatibility and zero-dependency edge performance.
- **UI Framework**: Plain Tailwind CSS without pre-built component libraries for maximum customization.

## Proposed Changes

### Setup & Infrastructure
#### [NEW] `package.json`
- Initialize SvelteKit project.
- Configure Bun as the package manager and runtime.
- Add core dependencies (`svelte`, `@sveltejs/kit`, `tailwindcss`, `drizzle-orm`, `lucia`, `@lucia-auth/adapter-drizzle`).
#### [NEW] `svelte.config.js` & `vite.config.js`
- Set up SvelteKit and Vite configuration to run smoothly on Bun.
- Configure appropriate Tailwind plugins.
#### [NEW] `.env`
- Set required environment variables (Database URL, Auth secrets).

### Authentication & Users
#### [NEW] `src/lib/server/db/schema.ts`
- Define User and Session models in the database using Drizzle ORM schemas.
#### [NEW] `src/lib/server/auth.ts`
- Initialize Lucia Auth instance with the Drizzle ORM adapter.
#### [NEW] `src/hooks.server.ts`
- Implement server-side hooks to validate user sessions using Lucia Auth on every request globally.
#### [NEW] `src/routes/login/+page.svelte` & `+page.server.ts`
- UI form for user login/registration.
- Server actions to handle authentication state using Lucia's secure cookies.

### Deal Posting & Management
#### [MODIFY] `src/lib/server/db/schema.ts`
- Add schemas for `deals` and `categories`.
#### [NEW] `src/routes/deals/new/+page.svelte`
- Create the submission form with Markdown/Rich-Text editor for descriptions.
- Dynamic fields for condition, form-factor, and other taxonomy rules.
#### [NEW] `src/routes/deals/new/+page.server.ts`
- Server action to parse submitted data, validate it, and persist it to PostgreSQL.

### Deal Feed & Voting
#### [NEW] `src/routes/+page.svelte` & `+page.server.ts`
- Homepage displaying the "New" and "Hot" deal feeds.
- Server load function fetching deals from the database, sorted chronologically and by a calculated score.
#### [MODIFY] `src/lib/server/db/schema.ts`
- Add `votes` schema tracking user ID, deal ID, and vote value (1, -1).
#### [NEW] `src/routes/deals/[id]/vote/+server.ts`
- API Endpoint to securely handle upvoting/downvoting, ensuring users only vote once per deal.

### Discussion & Comments
#### [MODIFY] `src/lib/server/db/schema.ts`
- Add `comments` table supporting nested self-referencing relationships (Threaded discussions).
#### [NEW] `src/routes/deals/[id]/+page.svelte` & `+page.server.ts`
- Detailed Deal Page.
- Load function rendering the deal, along with its specific comment tree.
- Server action to handle submitting new comments and replies.

## Verification Plan

### Automated Tests
- Setup unit test suite using `bun test` for calculating deal scores and link rewriting mechanics.
- Develop Playwright E2E tests simulating the user flow: Signup -> Post Deal -> Upvote.

### Manual Verification
- Run local dev server via `bun run dev`.
- Visually test responsive design and Tailwind layouts.
- Test form validation mechanisms (e.g. attempting to submit without a required retail price).
- Confirm accurate Session rendering natively on Bun server.
