# Tech Deals Forum Single Execution Plan

This execution plan turns the project plans and curated team roster into one ordered delivery path. It is designed to get the monorepo from empty workspace to a tested MVP first, then layer in community depth, monetization, and scale without losing local reproducibility.

## 1. Execution Principles

- Deliver a runnable system at the end of every phase.
- Keep the architecture as a modular monolith inside the monorepo until extraction is justified.
- Prefer SSR-first SvelteKit flows and form actions over unnecessary client-side APIs.
- Treat search indexing, notifications, cache invalidation, and score recomputation as async concerns.
- No phase is complete without tests, docs, and explicit operational notes.

## 2. Team Operating Model

### Core ownership pattern
1. Product Sprint Prioritizer defines the slice and acceptance criteria.
2. Software Architect confirms boundaries and key trade-offs.
3. UX Architect defines the screen and interaction shape.
4. Backend Architect, Frontend Developer, and Database Optimizer implement the slice.
5. DevOps Automator and Security Engineer harden delivery and defaults.
6. API Tester and Performance Benchmarker verify behavior and budgets.
7. Code Reviewer performs final risk review.
8. Technical Writer updates project docs and runbooks.

### Definition of done for every milestone
- Feature works locally through the root monorepo commands.
- Required schema, migrations, and environment variables are documented.
- Unit and integration tests cover the core path and the main failure path.
- Security review has no unresolved critical issues.
- Performance on the affected user path stays within the current budget.

## 3. Phase Plan

## Phase 0: Architecture Freeze and Workspace Bootstrap

### Goal
Create the monorepo foundation, root developer workflow, initial ADRs, and local infrastructure baseline.

### Primary owners
- Product Sprint Prioritizer
- Software Architect
- DevOps Automator
- Technical Writer

### Supporting owners
- Security Engineer
- Database Optimizer

### Work items
- Finalize monorepo structure: `apps/web`, `services/worker`, `services/search-sync`, `packages/db`, `packages/auth`, and shared utilities.
- Create the root workspace manifest and Bun scripts for `dev`, `build`, `test`, `test:e2e`, `lint`, `db:migrate`, `db:seed`, `compose:up`, and `compose:down`.
- Create root Compose definitions for PostgreSQL, Redis, and the selected search engine with health checks.
- Decide and document early ADRs: modular monolith stance, search engine choice, Redis role, worker responsibilities, and auth/session strategy.
- Add baseline docs for setup, environment variables, and contributor workflow.

### Dependencies
- None. This is the foundation.

### Exit criteria
- A new developer can install dependencies, run Compose, and invoke root scripts without undocumented steps.
- The repo structure matches the architecture plan.
- ADRs exist for the highest-risk system decisions.

## Phase 1: Identity, Data Model, and Deal Engine MVP

### Goal
Ship the first end-to-end product loop: authentication, deal submission, `New` feed, `Hot` feed, and voting.

### Primary owners
- Backend Architect
- Frontend Developer
- Database Optimizer

### Supporting owners
- UX Architect
- Security Engineer
- API Tester
- Code Reviewer
- Technical Writer

### Work items
- Define initial Drizzle schema for users, sessions, deals, categories, and votes.
- Implement Lucia auth integration in shared auth package and `hooks.server.ts`.
- Build login and registration pages and actions.
- Build deal submission form and server action.
- Build homepage feeds for `New` and `Hot` with initial score calculation logic.
- Implement secure voting with one vote per user per deal and immediate UI update.
- Establish initial test coverage for auth, submission, feed reads, and votes.

### Dependencies
- Phase 0 complete.

### Exit criteria
- A user can sign up, log in, post a deal, view it in the feed, and vote on it.
- Root tests cover the critical flow: Signup -> Post Deal -> Upvote.
- Local Compose-backed services are sufficient for the MVP stack.

## Phase 2: Deal Detail, Threaded Comments, and Taxonomy Expansion

### Goal
Make the forum behave like a real community product with deal detail pages, threaded discussion, and hardware-aware categorization.

### Primary owners
- UX Architect
- Frontend Developer
- Backend Architect
- Database Optimizer

### Supporting owners
- Product Sprint Prioritizer
- Security Engineer
- API Tester
- Performance Benchmarker

### Work items
- Add comment schema with nested relationships and moderation-aware fields.
- Build deal detail pages with comment trees and reply submission.
- Expand category and filter taxonomy for key hardware groups.
- Add deal lifecycle states: active, expired, out of stock, and price changed.
- Introduce initial user profile activity surfaces if needed to support navigation and discussion context.
- Add tests for comment creation, nested rendering, and lifecycle state changes.

### Dependencies
- Phase 1 complete.

### Exit criteria
- Users can open a deal, read thread context, and post nested replies.
- Hardware categories and states are visible and queryable.
- Comment and detail-page performance remains acceptable under realistic thread depth.

## Phase 3: Async Services, Search Sync, and Reliability Hardening

### Goal
Move non-critical side effects out of request paths and establish robust service boundaries for cache invalidation, score recomputation, notifications, and search indexing.

### Primary owners
- Backend Architect
- DevOps Automator
- Software Architect

### Supporting owners
- Database Optimizer
- API Tester
- Security Engineer
- Performance Benchmarker
- Technical Writer

### Work items
- Create `services/worker` for async jobs such as score recalculation, notification delivery, and cache refresh.
- Create `services/search-sync` for eventual indexing updates after writes and moderation changes.
- Define shared schemas for job payloads and service contracts.
- Add retry, idempotency, and dead-letter handling strategy where appropriate.
- Add Compose support for running the worker and search-sync service locally.
- Expand integration tests to verify async side effects and stale-state recovery.

### Dependencies
- Phase 2 complete.
- Enough domain models must exist to justify async workflows.

### Exit criteria
- Core request paths no longer perform unnecessary synchronous side effects.
- Search and cache updates can lag safely without corrupting primary product behavior.
- Local and CI environments can run worker-integrated test flows.

## Phase 4: Search, Filters, and Discovery Quality

### Goal
Deliver useful discovery beyond basic feeds through full-text search, facet filters, and better sorting.

### Primary owners
- UX Architect
- Backend Architect
- Frontend Developer
- Performance Benchmarker

### Supporting owners
- Database Optimizer
- API Tester
- Product Sprint Prioritizer
- Code Reviewer

### Work items
- Launch basic search using PostgreSQL full-text search if not already in place.
- Introduce advanced search engine-backed indexing for deeper faceted filtering.
- Build filter UI for store, category, price range, brand, condition, and hardware-specific fields.
- Add sorting by newest, hottest, most discussed, and lowest price where justified.
- Measure search latency, facet usability, and fallback behavior when the search system lags.

### Dependencies
- Phase 3 complete for search-sync reliability.

### Exit criteria
- Users can discover deals beyond simple chronological browsing.
- Search/filter behavior is consistent with the domain taxonomy.
- Search failure or lag degrades gracefully instead of breaking the site.

## Phase 5: Moderation, Abuse Controls, and Admin Operations

### Goal
Add the controls required for a public forum to stay usable and trustworthy.

### Primary owners
- Security Engineer
- Backend Architect
- Frontend Developer

### Supporting owners
- UX Architect
- API Tester
- Code Reviewer
- Technical Writer

### Work items
- Add flagging/report workflows for spam, referral abuse, expired deals, and abusive behavior.
- Add moderation tools for deal state changes, deletion, user restrictions, and category management.
- Add audit trails for admin and moderator actions.
- Add rate limiting, abuse detection hooks, and moderation policy docs.
- Extend tests for permission boundaries, moderation flows, and abuse cases.

### Dependencies
- Phase 2 complete for core community features.
- Phase 3 complete for reliable async handling where moderation changes affect search and cache.

### Exit criteria
- Moderators can manage the most common public-forum failure modes.
- Sensitive actions are auditable and permission-checked.
- Abuse controls exist for auth, posting, voting, and outbound-link misuse.

## Phase 6: Engagement, Monetization, and Product Depth

### Goal
Add stickiness and business value once the core forum loop is stable.

### Primary owners
- Product Sprint Prioritizer
- Backend Architect
- Frontend Developer

### Supporting owners
- Security Engineer
- Performance Benchmarker
- Technical Writer

### Work items
- Add user profiles, reputation scoring, and recent activity views.
- Add saved deals, alerts, or notifications if the product needs stronger return behavior.
- Implement affiliate link rewriting with clear ownership and analytics boundaries.
- Add click and revenue analytics per merchant, category, and post.
- Document policy and compliance implications of affiliate behavior.

### Dependencies
- Core forum experience must already be stable.
- Moderation and abuse controls should be in place before monetization is expanded.

### Exit criteria
- Engagement features reinforce quality participation instead of adding noise.
- Affiliate logic is measurable, testable, and separated from core content integrity.
- Monetization does not weaken trust or moderation standards.

## 4. Cross-Phase Workstreams

### Security workstream
Owner: Security Engineer

- Threat-model auth, comments, moderation, search input, and affiliate flows early.
- Keep CSP, cookie flags, CSRF posture, rate limits, and secret handling aligned with each phase.
- Gate releases on unresolved critical auth, authorization, or injection issues.

### Performance workstream
Owner: Performance Benchmarker

- Establish baseline p95 targets for homepage, deal detail, vote, comment submission, and search.
- Re-benchmark after feed, comment, cache, and search changes.
- Watch for DB hotspots, cache stampedes, and thread-rendering regressions.

### Documentation workstream
Owner: Technical Writer

- Maintain root setup docs, architecture notes, ADRs, and runbooks continuously.
- Update docs as part of each phase rather than after the fact.
- Keep examples and commands aligned with Bun and root workspace scripts.

### Review workstream
Owner: Code Reviewer

- Focus review on behavior and risk, especially around auth, data integrity, async jobs, moderation, and performance.
- Block merges that lack proof for high-risk changes.

## 5. Recommended Sprint Cadence

### Sprint 1
- Phase 0 complete.
- Start Phase 1 with schema, auth, and workspace test setup.

### Sprint 2
- Finish Phase 1.
- Deliver first end-to-end MVP loop.

### Sprint 3
- Execute Phase 2.
- Introduce threaded discussion and hardware taxonomy expansion.

### Sprint 4
- Execute Phase 3.
- Move expensive side effects into worker and search-sync services.

### Sprint 5
- Execute Phase 4.
- Deliver useful search and filters.

### Sprint 6
- Execute Phase 5.
- Add moderation and abuse controls.

### Sprint 7+
- Execute Phase 6 based on product evidence.
- Expand engagement and monetization only after the core forum is healthy.

## 6. Critical Path

The project critical path is:

1. Workspace and Compose foundation.
2. Schema and auth.
3. Deal submission and feeds.
4. Voting.
5. Deal detail and comments.
6. Async worker and search sync.
7. Search and filters.
8. Moderation.
9. Engagement and monetization.

If any step on this chain is unstable, downstream work should pause instead of layering features on top of weak foundations.

## 7. Success Metrics by Stage

### MVP success
- A new user can register, post a deal, browse feeds, and vote without manual system intervention.
- The project boots locally with one install flow and one Compose flow.

### Community success
- Comment participation works without major performance degradation or moderation blind spots.
- Category and state metadata improve discovery rather than confusing it.

### Platform success
- Async jobs reduce request latency and operational fragility.
- Search and caching improve experience without creating integrity problems.

### Product success
- Moderation tools are sufficient for public usage.
- Engagement and monetization features increase value without eroding trust.

## 8. Immediate Next Moves

1. Approve this execution sequence as the canonical delivery order.
2. Convert Phase 0 and Phase 1 into concrete backlog tickets.
3. Start implementation by creating the monorepo structure, root scripts, and Compose baseline.