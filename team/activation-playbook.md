# Team Activation Playbook

Use these prompts in order. Paste outputs forward to the next specialist so context is preserved.

## 1) Product scope and outcomes

Activate `Product Manager`.

Context:
- Product plan: `product_plan.md`
- Architecture plan: `architecture_plan.md`
- Implementation plan: `implementation_plan.md`

Task:
- Write a milestone brief for "Core Forum MVP".
- Include: goals, non-goals, success metrics, and top 5 risks.
- Keep scope compatible with a monorepo using SvelteKit, Bun, PostgreSQL, Drizzle, Lucia, Redis, and search sync service.

## 2) Sprint slicing

Activate `Sprint Prioritizer`.

Input:
- Product Manager milestone brief.

Task:
- Break work into 3 sprints.
- Include acceptance criteria per story and explicit dependencies.
- Mark what must be done before public beta.

## 3) Architecture decisions

Activate `Software Architect` and `Backend Architect`.

Input:
- Sprint plan and constraints.

Task:
- Produce ADRs for service boundaries, request lifecycle, caching, and search indexing.
- Provide API contract outline and event/job flow.
- Name trade-offs and reversibility.

## 4) UX and UI definition

Activate `UX Architect` and `UI Designer`.

Input:
- PRD and architecture output.

Task:
- Define UX flows for: auth, deal submit, hot feed, deal detail, threaded comments, moderation report.
- Define component inventory and states.
- Include desktop and mobile behavior.

## 5) Implementation execution

Activate `Frontend Developer` and `Backend Architect`.

Input:
- UX/UI output and ADRs.

Task:
- Implement in vertical slices:
  1. Auth and session handling
  2. Deal submission + listing
  3. Voting + score updates
  4. Comments + notifications base
  5. Search filters and sorting

## 6) Hardening pass

Activate `Database Optimizer`, `Security Engineer`, and `DevOps Automator`.

Input:
- Current implementation branch and schema.

Task:
- Database Optimizer: indexes, query plans, migration safety.
- Security Engineer: auth/session hardening, abuse controls, moderation safety checks.
- DevOps Automator: CI workflow, Compose health checks, migration/test automation.

## 7) Verification gates

Activate `API Tester`, `Performance Benchmarker`, and `Accessibility Auditor`.

Input:
- Latest build artifacts and test environment.

Task:
- API Tester: endpoint contract and auth test matrix.
- Performance Benchmarker: feed and deal-page performance report.
- Accessibility Auditor: WCAG findings with severity and fixes.

## 8) Merge and release certification

Activate `Code Reviewer` and `Reality Checker`.

Input:
- QA reports and implementation diff summary.

Task:
- Code Reviewer: block regressions and maintainability issues.
- Reality Checker: issue GO / NO-GO with evidence-based criteria.

## 9) Launch readiness

Activate `Growth Hacker`.

Input:
- Features shipped and target audience (hardware deal hunters).

Task:
- Build 30-day launch and growth plan.
- Include channel mix, referral loops, experiment backlog, and weekly KPI targets.