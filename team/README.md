# Tech Deals App Superstar Team

This folder contains a curated team assembled from the templates in `agency-agents-main` for building the Tech Deals Forum app (SvelteKit + Bun + PostgreSQL + Drizzle + Lucia + Redis + Search).

## Mission

Ship a production-ready hardware deals forum with strong SEO, fast feed performance, safe moderation, and measurable launch growth.

## Team Roster

### Product and Delivery

- `product/product-manager.md`
  - Owns outcomes, PRDs, scope control, and stakeholder alignment.
- `product/product-sprint-prioritizer.md`
  - Converts roadmap into realistic sprint slices and acceptance criteria.
- `project-management/project-management-project-shepherd.md`
  - Cross-functional execution owner for dependencies, timeline, and risk tracking.

### Architecture and Engineering

- `engineering/engineering-software-architect.md`
  - Defines system boundaries, ADRs, and long-term evolution strategy.
- `engineering/engineering-backend-architect.md`
  - Designs APIs, data flow, async jobs, and reliability patterns.
- `engineering/engineering-database-optimizer.md`
  - Ensures schema and query plans support high-volume deal and comment traffic.
- `engineering/engineering-frontend-developer.md`
  - Builds the SvelteKit UI and SSR-first user flows.
- `engineering/engineering-devops-automator.md`
  - Creates CI/CD, Docker Compose workflows, and deploy guardrails.
- `engineering/engineering-security-engineer.md`
  - Hardens auth, sessions, permissions, and abuse-prevention surfaces.
- `engineering/engineering-code-reviewer.md`
  - Enforces maintainability and catches regressions before merge.

### UX and Visual Quality

- `design/design-ux-architect.md`
  - Shapes IA, interaction design, and UX patterns around forum behavior.
- `design/design-ui-designer.md`
  - Produces polished, consistent visual language for the web experience.

### QA and Release Certification

- `testing/testing-api-tester.md`
  - Validates endpoint correctness, auth checks, and contract stability.
- `testing/testing-performance-benchmarker.md`
  - Verifies page-load and server performance under realistic load.
- `testing/testing-accessibility-auditor.md`
  - Audits WCAG conformance and assistive-technology compatibility.
- `testing/testing-reality-checker.md`
  - Final go/no-go gate requiring evidence, not assumptions.

### Launch and Growth

- `marketing/marketing-growth-hacker.md`
  - Runs launch strategy, activation loops, and early retention experiments.

## Operating Model

Use this sequence for every major milestone:

1. Product Manager drafts outcome, constraints, and success metrics.
2. Sprint Prioritizer converts into sprint plan and acceptance criteria.
3. Software Architect + Backend Architect define design and ADRs.
4. UX Architect + UI Designer produce UX and visual direction.
5. Frontend Developer + Backend Architect implement feature slices.
6. Database Optimizer, Security Engineer, and DevOps Automator harden the slice.
7. API Tester, Performance Benchmarker, and Accessibility Auditor verify quality.
8. Code Reviewer performs final code-level review.
9. Reality Checker issues milestone certification (or sends back for rework).
10. Growth Hacker prepares launch and post-launch experiments.

## Suggested Phase Ownership

- Discovery and prioritization: Product Manager, Sprint Prioritizer
- System design: Software Architect, Backend Architect, Database Optimizer
- Core app build: Frontend Developer, Backend Architect, UX Architect, UI Designer
- Platform hardening: DevOps Automator, Security Engineer, Code Reviewer
- Quality gates: API Tester, Performance Benchmarker, Accessibility Auditor, Reality Checker
- Launch and iteration: Growth Hacker, Product Manager

## Copy-Paste Kickoff Prompt

Use this when you start a new planning session:

"Assemble the Tech Deals App Superstar Team from `/team`. Use the team operating model in `team/README.md`. Build an execution plan for the next milestone using our architecture, implementation, and product plans. For each specialist, return: responsibilities, deliverables, dependencies, and acceptance criteria."