# Tech Deals Forum Web Pages Plan

This document describes every planned web page in detail, including audience, content, interactions, data requirements, permissions, and success criteria.

## 1. Global UX Rules

- SSR-first rendering for all indexable pages.
- Consistent header, search bar, category navigation, and footer.
- Primary states on every page: loading, empty, error, unauthorized (where relevant).
- Accessibility baseline: keyboard-first navigation, semantic landmarks, visible focus states.
- Analytics baseline: page_view, primary CTA clicks, conversion events.

## 1.1 Hardware Attribute Model (Required)

All hardware deal pages, forms, and search facets must support normalized specs.

Core attributes across categories:

- Brand
- CPU model
- CPU architecture (x86-64, ARM64)
- GPU model
- RAM capacity (GB)
- Storage type (NVMe SSD, SATA SSD, HDD)
- Storage capacity (GB/TB)
- Condition (new, refurb, used, open-box)

Laptop-specific attributes:

- Screen size (inches)
- Screen resolution
- Refresh rate
- Panel type (IPS, OLED, VA, TN)
- Battery capacity or rated battery life
- Weight

Monitor-specific attributes:

- Screen size (inches)
- Resolution
- Refresh rate
- Panel type
- Response time
- Aspect ratio
- Adaptive sync support (G-Sync, FreeSync)

Desktop component attributes (when applicable):

- CPU socket and chipset
- GPU VRAM capacity
- Memory type and speed (DDR4/DDR5, MT/s)
- PSU wattage and efficiency rating

## 2. Public and Core User Pages

### 2.1 Home Page (/)

Purpose:

- Primary discovery surface for current deals.

Audience:

- Guests and authenticated users.

Sections:

- Hero/search row with quick category chips.
- Feed tabs: Hot and New.
- Filter bar (price range, merchant, category, condition, CPU, GPU, RAM, screen size).
- Deal list cards with score, price, discount, merchant, posted time.
- Right rail (desktop): trending tags, top contributors, policy shortcuts.

Interactions:

- Switch feed tab.
- Apply/clear filters.
- Save deal (auth required).
- Upvote/downvote (auth required).

Data dependencies:

- feed API, filter aggregations, user vote/saved state.

SEO:

- Canonical URL, dynamic title/description by tab/filter context.

Success metrics:

- Scroll depth, deal click-through rate, vote/save conversion.

### 2.2 Authentication: Sign Up (/signup)

Purpose:

- Create account and establish trust onboarding.

Sections:

- Email/password form.
- OAuth buttons (Google, Apple, Discord).
- Terms/privacy acknowledgement.

Interactions:

- Client-side field validation plus server validation.

Data dependencies:

- auth provider config, anti-bot/rate limits.

Success metrics:

- Registration completion rate.

### 2.3 Authentication: Login (/login)

Purpose:

- Return users to active sessions quickly.

Sections:

- Email/password form.
- OAuth entry points.
- Forgot password entry.

Success metrics:

- Login success rate, auth error rate.

### 2.4 Logout Endpoint (/logout)

Purpose:

- Session termination and safe redirect.

Behavior:

- Invalidates current session server-side and clears cookie.

### 2.5 User Profile (/u/[username])

Purpose:

- Public reputation and contribution history.

Sections:

- Profile header: avatar, join date, reputation, badges.
- Tabs: Deals, Comments, Saved (private to owner), Activity.

Permissions:

- Saved tab visible only to profile owner.

Success metrics:

- Profile views, follow-through to posted deals.

### 2.6 Account Settings (/settings)

Purpose:

- User self-service for account and preference controls.

Sections:

- Profile edit.
- Notification preferences.
- Connected OAuth providers.
- Security actions (password reset, session list).

Permissions:

- Authenticated user only.

### 2.7 New Deal Submission (/deals/new)

Purpose:

- Structured creation of high-quality deal posts.

Sections:

- Core deal form: title, URL, merchant, price, original price, shipping.
- Taxonomy fields by category.
- Hardware spec fields by category:
	- Laptops: CPU, CPU architecture, GPU, RAM, storage, screen size, resolution, refresh rate, panel type.
	- Monitors: screen size, resolution, refresh rate, panel type, response time, adaptive sync.
	- Components/systems: CPU, CPU architecture, GPU, RAM, storage, form factor, socket/chipset where relevant.
- Description editor with sanitization-safe formatting.
- Preview panel.

Interactions:

- URL metadata prefill.
- Validation feedback and draft preservation.

Success metrics:

- Submission completion, validation error frequency, moderation rejection rate.

### 2.8 Deal Detail (/deals/[id])

Purpose:

- Single source of truth for a deal and its discussion.

Sections:

- Deal header: title, pricing block, merchant, status, timestamps.
- Action row: outbound click, vote, save, report, share.
- Specs panel with normalized hardware attributes and tag chips.
- Discussion section with threaded comments.
- Similar deals module.

Interactions:

- Vote.
- Save.
- Comment/reply/edit (policy constrained).
- Report deal/comment.

Success metrics:

- Outbound click-through, comment depth, time on page.

### 2.9 Search Results (/search)

Purpose:

- Full-text and faceted discovery across inventory.

Sections:

- Query box with recent searches.
- Facets panel including merchant, category, price, condition, CPU, CPU architecture, GPU, RAM, storage, screen size, resolution, refresh rate, panel type.
- Sort selector.
- Result list with pagination/infinite loading.

URL model:

- Query and all facet states encoded in URL params.

Success metrics:

- Search-to-click conversion, filter engagement, zero-result rate.

### 2.10 Saved Deals (/saved)

Purpose:

- Personal watchlist for deal tracking.

Permissions:

- Authenticated users only.

Sections:

- Saved list with status badges.
- Alerts toggle by item/category.

Success metrics:

- Weekly return usage, alert enable rate.

### 2.11 Notifications (/notifications)

Purpose:

- Surface mentions, replies, and state-change updates.

Sections:

- Notification feed grouped by type and recency.
- Mark read/unread controls.

Success metrics:

- Notification open rate and return sessions.

### 2.12 Deal Alerts Management (/alerts)

Purpose:

- Configure keyword/category/price-triggered notifications.

Sections:

- Create alert form.
- Existing alerts list with pause/delete.

Success metrics:

- Alert creation and retention.

## 3. Moderation and Admin Pages

### 3.1 Report Submission (inline modal + /report/[targetType]/[targetId])

Purpose:

- Standardized reporting for abuse, spam, or stale content.

Fields:

- Reason code, optional details, evidence link.

### 3.2 Moderation Queue (/mod/queue)

Purpose:

- Central triage workflow for moderators.

Permissions:

- Moderator and admin roles.

Sections:

- Queue filters by severity, type, age.
- Side-by-side content + report context.
- Action controls: dismiss, warn, remove, expire deal, ban user.

Success metrics:

- Median report resolution time, false-positive rate.

### 3.3 Moderation Case Detail (/mod/cases/[id])

Purpose:

- Full case timeline and action history.

Sections:

- Event timeline.
- Prior user incidents.
- Internal notes and final disposition.

### 3.4 Admin Dashboard (/admin)

Purpose:

- High-level platform operations and health.

Permissions:

- Admin only.

Sections:

- Core KPIs: active users, posts, flags, conversion metrics.
- Queue health: jobs pending, indexing lag, cache hit.
- Quick links to policy and infrastructure runbooks.

### 3.5 Taxonomy Management (/admin/taxonomy)

Purpose:

- Maintain categories, tags, and spec schema definitions.

Includes:

- Hardware attribute schema versioning by category.
- Allowed value sets for CPU architecture, panel type, memory type, and other canonical specs.

### 3.6 Merchant Management (/admin/merchants)

Purpose:

- Curate merchant metadata and trust scores.

### 3.7 User Management (/admin/users)

Purpose:

- Account-level moderation and role management.

## 4. Marketing, Legal, and Utility Pages

### 4.1 About (/about)

Purpose:

- Explain mission and trust model.

### 4.2 Guidelines (/guidelines)

Purpose:

- Community rules and quality expectations.

### 4.3 Affiliate Disclosure (/affiliate-disclosure)

Purpose:

- Explain monetization model transparently.

### 4.4 Privacy Policy (/privacy)

Purpose:

- Legal policy and data handling commitments.

### 4.5 Terms of Service (/terms)

Purpose:

- Platform terms and moderation policy framework.

### 4.6 Contact/Support (/support)

Purpose:

- User support intake and issue routing.

### 4.7 Status Page (/status)

Purpose:

- Communicate incidents and uptime summaries.

### 4.8 Not Found (/404)

Purpose:

- Recovery route for invalid URLs, with popular links.

### 4.9 Server Error (/500)

Purpose:

- Graceful failure state with retry and support options.

## 5. Page-Level Analytics Checklist

Track on every major route:

- page_view
- primary_action_click
- auth_prompt_shown
- conversion_event (vote, save, submit, outbound_click)
- error_event with category and severity

Track additionally by route:

- home: feed_tab_switch, filter_apply
- deal detail: outbound_click, comment_posted, report_submitted
- search: query_submitted, facet_toggle, zero_results
- moderation queue: action_taken, action_reverted

## 6. Accessibility and Performance Expectations by Page Type

- Feed and list pages: virtualization/pagination strategy and landmark navigation.
- Form pages: inline validation with aria-live error announcements.
- Comment-heavy pages: heading hierarchy and skip links.
- Admin pages: keyboard-operable tables and focus-managed dialogs.

## 7. Release Priority by Route

### Must-Have for MVP

- /, /login, /signup, /deals/new, /deals/[id], /search, /u/[username], /saved, /notifications, /mod/queue, /admin, /guidelines, /affiliate-disclosure, /privacy, /terms, /404, /500

### Can Follow Shortly After MVP

- /alerts, /mod/cases/[id], /admin/taxonomy, /admin/merchants, /admin/users, /about, /support, /status
