# Tech Deals Forum Implementation Plan

This implementation plan translates product and architecture goals into delivery phases, ownership, and acceptance criteria.

## 1. Delivery Strategy

- Delivery model: vertical slices across web app, data, and background services.
- Cadence: 2-week sprints with explicit quality gates.
- Branch strategy: short-lived feature branches with mandatory review and automated checks.
- Release policy: milestone-based releases, with no production promotion unless all gates pass.

## 2. Phase Plan

### Phase 0: Foundation and Workspace Bootstrap

Goals:

- Initialize monorepo and shared package boundaries.
- Bring up local infrastructure and baseline CI.

Changes:

- Root workspace configuration (Bun workspaces, scripts).
- apps/web, services/worker, services/search-sync, packages/db, packages/auth, packages/shared.
- docker-compose.yml for PostgreSQL, Redis, and search.
- .env.example and secret conventions.

Acceptance criteria:

- New contributor can run install, compose:up, dev, and test from root.
- CI validates lint and test on pull requests.

Owners:

- Primary: DevOps Automator, Software Architect.
- Supporting: Project Shepherd.

### Phase 1: Identity and Profile Baseline

Goals:

- Implement secure auth and profile scaffolding.

Changes:

- packages/db schema for users, sessions, oauth accounts.
- packages/auth Lucia setup with cookie session strategy.
- apps/web hooks.server.ts auth hydration.
- routes for signup, login, logout, profile.

Acceptance criteria:

- Session lifecycle works across browser restarts and logout.
- Protected routes enforce auth and role checks.
- Security review has no high-severity auth findings.

Owners:

- Primary: Backend Architect, Security Engineer.
- Supporting: Frontend Developer, API Tester.

### Phase 2: Deal Submission and Feed Baseline

Goals:

- Enable deal creation and public browsing.

Changes:

- Schema: categories, merchants, deals, deal states.
- Add normalized hardware-spec schema and validators for category-specific attributes (CPU, CPU architecture, GPU, RAM, storage, laptop/monitor display specs).
- New deal form with validation and metadata extraction.
- Homepage feed with New and Hot tabs.
- Deal detail page shell with structured metadata.

Acceptance criteria:

- Authenticated users can submit deals with validated fields.
- Hardware spec validation enforces required attributes by category with canonical value mapping.
- Guest users can browse feeds and deal detail pages.
- SEO metadata is present for indexable pages.

Owners:

- Primary: Frontend Developer, Backend Architect.
- Supporting: UI Designer, UX Architect.

### Phase 3: Community Interactions

Goals:

- Add voting, comments, mentions, and notifications baseline.

Changes:

- Schema: votes, comments, comment votes, notifications.
- Vote endpoint with upsert behavior and anti-abuse controls.
- Threaded comments with reply depth constraints.
- Mentions parsing and notification fan-out job.

Acceptance criteria:

- One active vote per user per deal enforced.
- Threaded comments render reliably on large discussions.
- Mention notifications are delivered idempotently.

Owners:

- Primary: Backend Architect, Frontend Developer.
- Supporting: Database Optimizer, API Tester.

### Phase 4: Discovery, Filters, and Search Sync

Goals:

- Deliver deep search and category-aware faceting.

Changes:

- Search document projection and sync pipeline.
- Faceted filter UI and query composition, including CPU, CPU architecture, GPU, RAM, storage, screen size, resolution, refresh rate, and panel type.
- Sort modes: newest, hottest, most discussed, lowest price.

Acceptance criteria:

- Search index freshness lag remains within agreed threshold.
- Category-specific filters return accurate, paginated results.
- Hardware-spec facets return consistent results with canonicalized values across merchants.
- Filter state is shareable via URL params.

Owners:

- Primary: Backend Architect, Frontend Developer.
- Supporting: Search Sync service owner, Performance Benchmarker.

### Phase 5: Moderation and Admin Tooling

Goals:

- Add moderation workflows and platform safety controls.

Changes:

- Schema: reports, moderation actions, audit logs.
- Report flow for spam, expired deals, abusive behavior.
- Admin interfaces for bans, removals, merge/close actions.
- Policy enforcement checks and reason codes.

Acceptance criteria:

- Moderators can triage and resolve reports end-to-end.
- Every admin action is audit logged.
- Abuse-control tests pass for common attack paths.

Owners:

- Primary: Security Engineer, Backend Architect.
- Supporting: Frontend Developer, Reality Checker.

### Phase 6: Monetization and Analytics

Goals:

- Instrument outbound monetization while preserving trust.

Changes:

- Affiliate link rewrite service and attribution model.
- Outbound click tracking and conversion event ingestion.
- Category-level monetization dashboards.

Acceptance criteria:

- Rewriting rules are deterministic and test-covered.
- Tracking pipeline reports reliable click and conversion metrics.
- Disclosure and policy pages are live and linked.

Owners:

- Primary: Backend Architect, Growth Hacker.
- Supporting: Product Manager, Analytics stakeholder.

### Phase 7: Hardening and Launch Readiness

Goals:

- Certify reliability, accessibility, and release readiness.

Changes:

- Load and stress tests for feed and deal detail endpoints.
- Accessibility audit and remediation sprint.
- Error monitoring, alerting, and runbook completion.
- Final code review and release checklist.

Acceptance criteria:

- Performance targets met for key pages.
- Accessibility critical/serious issues resolved.
- Reality Checker returns evidence-based GO decision.

Owners:

- Primary: Performance Benchmarker, Accessibility Auditor, Reality Checker.
- Supporting: Code Reviewer, DevOps Automator.

## 3. Detailed Workstreams

### 3.1 Data and Migration Workstream

- Drizzle migrations for each phase with rollback notes.
- Safe migration patterns for large tables (expand, backfill, contract).
- Seed data for categories, merchants, and test fixtures.

### 3.2 API and Contract Workstream

- Typed request/response schemas in shared package.
- Contract tests for high-risk endpoints.
- Versioning strategy for future non-breaking evolution.

### 3.3 Frontend and UX Workstream

- SSR-first route design with progressive enhancement.
- Reusable UI primitives for cards, voting, comments, filter chips.
- Empty/loading/error states for all major pages.

### 3.4 Reliability and Operations Workstream

- Structured logs with correlation IDs.
- Queue lag and cache hit metrics.
- On-call runbook for incident response and rollback.

## 4. Team Responsibility Matrix

- Product scope and priorities: Product Manager, Sprint Prioritizer.
- Architecture and data model: Software Architect, Backend Architect, Database Optimizer.
- UI and implementation: UX Architect, UI Designer, Frontend Developer.
- Security and operations: Security Engineer, DevOps Automator.
- Validation and release gate: API Tester, Performance Benchmarker, Accessibility Auditor, Code Reviewer, Reality Checker.
- Launch and growth: Growth Hacker.

## 5. Verification Plan

### Automated

- Unit tests for ranking, validation, and rewrite rules.
- Integration tests for auth, voting, comments, and moderation flows.
- E2E tests for signup -> submit -> vote -> comment -> report.

### Manual

- Responsive checks on desktop/tablet/mobile.
- Moderator workflow drills.
- Recovery drills for queue and cache failure scenarios.

## 6. Exit Criteria for MVP

MVP is release-ready when all are true:

- Core user journeys pass automated and manual checks.
- No open high-severity security issues.
- No unresolved critical accessibility failures.
- Production observability and rollback procedures are documented.
- Post-launch metrics dashboard is operational.
