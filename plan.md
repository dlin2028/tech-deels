# Tech Deals Forum Implementation Plan (Hardware Focused)

## Overview
This document outlines the architecture, features, and technical strategy required to build a specialized tech deals forum focused exclusively on computer hardware, systems, laptops, networking gear, and displays.

## 1. Core Features & App Structure

### 1.1 Authentication & User Management
* **Registration & Login**: Email/Password, OAuth (Google, Apple, Discord).
* **User Profiles**: Display username, avatar, join date, reputation score, and recent activity.
* **Activity Tracking**: History of posted deals, comments, saved deals, and active deal alerts.
* **Reputation System**: Users earn reputation points when their deals or comments are upvoted, encouraging high-quality contributions.

### 1.2 Deal Posting & Management
* **Submission Form**:
  * Fields: Title, Deal Link, Price, Original Price, Store/Merchant, Shipping cost.
  * Description: Rich text editor for formatting, inserting images, and tables.
  * Taxonomy (Tech Focused):
    * **Categories**: Components, Systems, Laptops, Peripherals, Networking, Home Entertainment, and other tech hardware categories.
    * **Tags/Filters**: Condition (New, Refurbished, Used, Open Box), Form Factor, Resolution, Panel Type, Screen Size, RAM Capacity, Storage Type, etc.
  * Automation: Auto-fetching metadata (title, image) from the provided URL when possible.
* **Deal Lifecycle**: Active, Expired, Out of Stock, Price Changed states. Post authors and moderators can update the state.

### 1.3 Voting & Deal Scoring
* **Voting System**: Upvote / Downvote buttons on every deal.
* **Deal Score Engine**: Calculates the score based on net votes (Upvotes - Downvotes) and time decay.
* **Deal Feeds**:
  * **New**: Chronological feed of all submitted deals.
  * **Hot/Popular**: Algorithmically promoted based on vote velocity, comment volume, and total score over a specific time window.

### 1.4 Comments & Community
* **Threaded Discussions**: Nested comments on every deal to facilitate discussion about specs, price matching, and merchant reliability.
* **Voting on Comments**: Helpful comments (e.g., instructions on how to replicate a complex coupon deal) can be upvoted.
* **User Mentions & Notifications**: `@username` tagging system to alert other users.

### 1.5 Search & Discovery
* **Robust Search**: Full-text search across deal titles, descriptions, and comments.
* **Deep Faceted Filtering (Tech Specific)**: Filter by exact Store (e.g., Microcenter, Newegg, Amazon), Category, Price Range, Brand, Condition, and Deal Status. Additionally, dynamic category-specific filters (e.g., for Laptops: Screen Resolution, Screen Size, RAM, CPU tier; for Monitors: Refresh Rate, Panel Type).
* **Sorting Capabilities**: Sort by newest, hottest, most discussed, lowest price.

### 1.6 Monetization & Affiliate Integration
* **Link Rewriting Engine**: Automatically intercept and convert outbound deal links into affiliate links (e.g., Skimlinks, Amazon Associates).
* **Analytics**: Track outbound clicks, conversion rates, and revenue per post/category.

### 1.7 Moderation & Administration
* **Flagging System**: Users can report spam, expired deals, referral links, or abusive behavior.
* **Admin Dashboard**: Tools for moderators to ban users, delete spam, merge duplicate deals, and manage categories.

## 2. Recommended Tech Stack

* **Runtime & Package Manager**: Bun. Extremely fast JavaScript runtime, bundler, test runner, and package manager.
* **Repository Layout**: Monorepo containing the web app, worker services, shared packages, and local infrastructure definitions.
* **Full-Stack Framework**: SvelteKit + Tailwind CSS for a fast, SEO-friendly, and highly responsive UI. Server-Side Rendering (SSR) is supported seamlessly to ensure rich link previews (OpenGraph) on social media.
* **Backend API**: SvelteKit Server Endpoints (`+server.js`) & Form Actions running natively on Bun.
* **Database**: PostgreSQL. A relational structure is essential for modelling the complex relationships between users, posts, comments, votes, and categories.
* **ORM**: Prisma or Drizzle ORM (both offer robust support for Bun).
* **Search Engine**: Typesense, Meilisearch, or Algolia for blazing-fast, typo-tolerant deal searches and complex faceted filtering (critical for hardware specs).
* **Caching Layer**: Redis (Upstash). Required to cache high-traffic feeds.
* **Authentication**: Lucia Auth or Auth.js for SvelteKit.
* **Local Infrastructure**: Docker Compose to boot PostgreSQL, Redis, search infrastructure, and optional application containers for full-stack local testing.

## 3. Monorepo Delivery Model

* **Apps**: `apps/web` for the SvelteKit UI and SSR server.
* **Services**: `services/worker` for async jobs and `services/search-sync` for indexing pipelines.
* **Packages**: `packages/db`, `packages/auth`, and shared utility or validation packages.
* **Root Scripts**: one set of workspace commands for `dev`, `build`, `test`, `test:e2e`, and database lifecycle tasks.
* **Compose Workflow**: `docker-compose.yml` should support both infra-only local development and full-stack containerized verification.

## 4. Recommended Development Phases

### Phase 1: Foundation & Deal Engine (MVP)
* User Registration and Authentication.
* Deal Data Model and Submission Pipeline.
* Simple Upvote/Downvote functionality.
* Basic chronological "New Deals" feed and rudimentary score-based "Hot" feed.
* Establish monorepo workspace structure, root scripts, and Docker Compose-backed local infrastructure.

### Phase 2: Community & Deep Taxonomy
* Nested Commenting system.
* Implementation of deep tech categories and tags (Components, Laptops, Condition, Form Factor, etc.).
* Basic postgres full-text search.
* Introduce worker and search-sync services into the shared workspace.

### Phase 3: Engagement & Monetization
* User Profiles and the Reputation scoring system.
* Affiliate link rewriting middleware.
* Expand integration coverage so the full stack can be built and tested locally from the root.

### Phase 4: Scale & Advanced Filtering
* Integrate dedicated Search Engine (Typesense/Algolia) for advanced faceted searching across tech specifications.
* Admin/Moderation dashboards and flagging workflows.
* Implement Redis caching to prevent database melt-down during high-traffic viral deals.
