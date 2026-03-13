# Tech Deals Forum Dream Team

This folder contains a curated, project-specific team derived from the closest matching templates in `agency-agents-main` and rewritten for the Tech Deals Forum plans.

## Project Context

- Product: hardware-focused tech deals forum
- Stack: SvelteKit, Bun, PostgreSQL, Drizzle ORM, Lucia Auth, Tailwind CSS
- Runtime shape: monorepo with `apps/web`, `services/worker`, `services/search-sync`, and shared packages
- Local platform: Docker Compose for PostgreSQL, Redis, and search infrastructure
- Product constraints: SSR-first UX, SEO, auth, voting, nested comments, faceted search, moderation, affiliate link rewriting, and strong local testability

## Roster

1. `tech-deals-software-architect.md`
   Base template: `engineering/engineering-software-architect.md`
   Owns monorepo boundaries, ADRs, service seams, and system trade-offs.
2. `tech-deals-backend-architect.md`
   Base template: `engineering/engineering-backend-architect.md`
   Owns server flows, worker/search-sync contracts, auth, and integration patterns.
3. `tech-deals-frontend-developer.md`
   Base template: `engineering/engineering-frontend-developer.md`
   Owns SvelteKit pages, progressive enhancement, accessibility, and responsive UI.
4. `tech-deals-ux-architect.md`
   Base template: `design/design-ux-architect.md`
   Owns IA, feed and deal detail UX, filter ergonomics, and design-system structure.
5. `tech-deals-database-optimizer.md`
   Base template: `engineering/engineering-database-optimizer.md`
   Owns Postgres schema shape, indexes, migrations, and query plans.
6. `tech-deals-devops-automator.md`
   Base template: `engineering/engineering-devops-automator.md`
   Owns Docker Compose, CI, environment parity, and operational automation.
7. `tech-deals-security-engineer.md`
   Base template: `engineering/engineering-security-engineer.md`
   Owns auth hardening, moderation abuse vectors, secrets, and secure defaults.
8. `tech-deals-api-tester.md`
   Base template: `testing/testing-api-tester.md`
   Owns endpoint, action, worker, and search-sync verification.
9. `tech-deals-performance-benchmarker.md`
   Base template: `testing/testing-performance-benchmarker.md`
   Owns feed latency, cache behavior, Bun performance, and Core Web Vitals.
10. `tech-deals-code-reviewer.md`
    Base template: `engineering/engineering-code-reviewer.md`
    Owns change-risk review across auth, data, and performance-sensitive areas.
11. `tech-deals-technical-writer.md`
    Base template: `engineering/engineering-technical-writer.md`
    Owns setup docs, ADR hygiene, runbooks, and contributor guidance.
12. `tech-deals-product-sprint-prioritizer.md`
    Base template: `product/product-sprint-prioritizer.md`
    Owns MVP slicing, roadmap pressure, and business-value sequencing.

## Recommended Working Order

1. Product Sprint Prioritizer sets the current slice.
2. Software Architect confirms the boundary and delivery shape.
3. UX Architect defines flow and information architecture.
4. Backend Architect, Frontend Developer, and Database Optimizer design the implementation.
5. DevOps Automator and Security Engineer harden delivery and defaults.
6. API Tester and Performance Benchmarker verify behavior and budgets.
7. Code Reviewer reviews the integrated change set.
8. Technical Writer updates the docs before the slice is considered done.

## Project-Level Standards

- Prefer a modular monolith inside the monorepo until service extraction is clearly justified.
- Keep SSR-first rendering and SvelteKit form actions as the default interaction model.
- Treat search indexing, score recomputation, notifications, and cache invalidation as async concerns.
- Optimize for local reproducibility: one install, one Compose bootstrap, one root test surface.
- Design for hardware-specific taxonomy and faceted filtering without overcomplicating the MVP.
- No feature is done without tests, docs, and explicit trade-offs.