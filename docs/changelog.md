# Changelog - Master

All significant changes to the Befach project are documented here.

## [0.9.0] - Feb 18, 2026 (Mobile UI Fixes & Nav Polish)

### Fixed
- **My Orders submit button invisible** — globals.css `.btn-primary` with `var(--accent-gradient)` was overriding the page's button background to transparent; fixed with explicit `#f97316 !important` in my-orders page styles
- **Feedback & AI chat FAB overlap on mobile** — FeedbackWidget repositioned from `bottom: 100px` to `bottom: 155px` on mobile to separate from AI chatbot FAB at `bottom: 90px`
- **Our Vendors "Add Supplier" modal cut off on mobile** — added `max-height: calc(100vh - 40px)` and `overflow-y: auto` to `.modal-container` in globals.css mobile breakpoint so close button and submit button are accessible
- **Mobile nav "Start Free Trial" unstyled** — `<Link>` component doesn't receive styled-jsx scoping; converted to native `<button>` with `router.push('/onboarding')` so styles apply correctly
- **Mobile nav button text alignment** — Login button text was left-aligned due to `.btn` class setting `display: inline-flex`; overridden with `display: flex; justify-content: center` on `.mobile-login`

### Changed
- Mobile nav "Start Free Trial" button: solid `#f97316` orange background, white bold centered text with `→` arrow, `border-radius: 10px`
- Mobile nav "Login" button: clean centered ghost button with `#d1d5db` border

---

## [0.8.0] - Feb 18, 2026 (Data Cleanup & Orange Rebrand)

### Changed
- **Orange rebrand** — replaced all blue (`#2563eb`) branding with Befach orange (`#f97316`) across Cost Calculator, EXIM Data, and other feature pages
- **Layout redesign** — improved alignment, spacing, and responsive behavior across multiple pages

### Removed
- **Auto-init demo data removed from all transactional features** — users now start with clean empty states:
  - `savedSuppliers.ts` — removed `DEMO_SUPPLIERS` array (15 records) and `generateDemoSuppliers()` function
  - `conversations.ts` — removed `DEMO_SUPPLIERS`, `DEMO_MESSAGES` arrays and `initializeDemoData()` function
  - `payments.ts` — removed `DEMO_PAYMENTS` (12 records), `DEMO_SOURCES` (3 accounts), `DEMO_GATEWAYS` (5 gateways), and `initializeDemoPayments()` function
  - `orders.ts` — removed `DEMO_ORDERS` array (6 orders)
  - `bookingStorage.ts` — removed `generateDemoBookings()` function
  - `feedback.ts` — removed `generateDemoFeedback()` (25 entries) and `initializeFeedback()` function
- Removed `initializeDemo*()` calls from 7 page/component files:
  - `book-shipment/page.tsx`, `supplier-matches/page.tsx`, `our-vendors/page.tsx`
  - `payments/history/page.tsx`, `payments/new/page.tsx`, `payments/methods/page.tsx`
  - `FeedbackDashboard.tsx`

### Not Changed (kept for demo/showcase)
- Dashboard hardcoded metrics and chart data
- Market Insights mock commodity prices and opportunity cards
- Compliance Tools mock BOE records and metrics
- Reports mock report list and summary stats
- Documents mock document list
- Smart Sourcing 100-supplier search database

---

## [0.7.0] - Feb 13, 2026 (Header Enhancements — Notifications, Profile & Logo)

### Added
- **Notification dropdown panel** (`NotificationPanel.tsx`) — bell icon in TopBar now opens a functional panel showing:
  - Feature exploration progress bar (X/17 features explored)
  - "Recently Used" section with features the user has visited
  - "Discover" section with unexplored features and "Try it" CTAs
  - Desktop: positioned dropdown; Mobile: BottomSheet
- **Profile dropdown menu** (`ProfileMenu.tsx`) — user avatar in TopBar now opens a menu with:
  - Organization name and user role display
  - "My Profile" and "Settings" links (→ `/settings`)
  - "Logout" button with red styling
  - Desktop: positioned dropdown; Mobile: BottomSheet
- `getAllFeatureStatus()` export in `walkthroughStorage.ts` for reading all feature visit data
- Exported `FeatureStatus` and `WalkthroughStatus` types from `walkthroughStorage.ts`

### Changed
- **Logo component** (`Logo.tsx`) — replaced inline SVG 3D box + text with actual company logo image (`/logo.png`) using Next.js `<Image>`
  - `showText={true}` (default): full logo with "BEFACH INTERNATIONAL" text
  - `showText={false}`: cropped to just the diamond icon mark
- TopBar logo now shows the full company logo image instead of inline SVG
- Notification dot on bell icon is now dynamic — only appears when there are undiscovered features (previously always visible)
- TopBar now manages open/close state for both notification and profile panels with click-outside-to-close behavior

---

## [0.6.0] - Feb 12, 2026 (Mobile Optimization & Onboarding Split)

### Added
- **Mobile/Web component split for Onboarding** — separate `MobileOnboarding.tsx` and `WebOnboarding.tsx` with shared `useOnboarding.ts` hook
  - Mobile version: progress bar, touch-friendly cards, safe area support, `100dvh` layout
  - Web version: verbatim extraction of original desktop UI
  - `page.tsx` is now a thin wrapper using `useMobile()` to conditionally render
- `goalOptions`, `typeOptions`, `tourOptions` exports in `useOnboarding.ts` with Lucide icons (Search, Truck, Calculator, User, Building2, Compass, ArrowRight)
- **Walkthrough system** — 17 feature walkthroughs with glassmorphic overlay, progress tracking, and chained navigation
  - `walkthroughSteps.ts`: configs for all features with titles, highlights, tips, feedback
  - `useFeatureWalkthrough()` hook: auto-triggers on first visit
  - `FeatureWalkthrough.tsx`, `WalkthroughComplete.tsx` components
  - `walkthroughStorage.ts`: persistent completion tracking with visit counts
  - Integrated into all 18 feature pages (dashboard through settings)
- **Google Sheets feedback integration** — `submitFeedback()` sends to backend POST `/api/feedback` which appends to Google Sheet
  - `FeedbackWidget.tsx`: floating button with menu (Give Feedback, Report Bug, Suggest Feature, Rate Befach)
  - `FeedbackPrompt.tsx`, `NPSSurvey.tsx`: contextual feedback prompts
  - `feedbackTriggers.ts`: automatic triggers based on user actions
- Global CSS rule to disable dragging across the entire project (`-webkit-user-drag: none` on `*`, `img`, `a`, `svg`)

### Changed
- **Mobile Dashboard fixes** (`MobileDashboard.tsx`):
  - Removed AI Assist purple button from top-right greeting row
  - Increased Quick Actions BottomSheet snap point from `0.45` to `0.55` for full card visibility
  - Replaced collapsible Analytics section with always-visible stats section
  - Removed `CollapsibleSection` import (no longer used)
- FeedbackWidget mobile positioning adjusted to `calc(100px + env(safe-area-inset-bottom))` for proper clearance above BottomNav

---

## [0.5.0] - Feb 11, 2026 (Login Flow, Dark Mode Removal & Homepage Polish)

### Added
- Smart Login/Dashboard button in landing header — returning users (who completed onboarding) see "Go to Dashboard", new users see "Login" + "Start Free Trial"
- Onboarding page honors `?redirect=` query parameter for post-login navigation to specific feature pages

### Changed
- Interactive demo cards (Cost Calculator, Rate Checker, HS Code Lookup, AI Assistant) now redirect to `/onboarding?redirect=<feature-page>` instead of running inline calculations
- All "Start Free Trial" and "Get Started Free" CTA buttons across the site now link to `/onboarding`
- "Schedule a Walkthrough" CTA links to `/contact`
- Demo card subtitle updated from "No signup needed" to "sign up free to unlock full access"
- Landing header shows conditional buttons: Login + Start Free Trial (new users) or Go to Dashboard (returning users), on both desktop and mobile

### Removed
- **Complete dark mode removal** across 7 files:
  - `globals.css` — removed `[data-theme="dark"]` variables block, `.dark-mode-toggle` styles, dark quick-actions override
  - `layout.tsx` — removed ThemeProvider wrapper, inline dark mode detection script, `suppressHydrationWarning`
  - `TopBar.tsx` — removed DarkModeToggle component
  - `Header.tsx` — removed dark mode state/toggle, Moon/Sun icons, all `.main-header.dark` CSS rules
  - `onboarding/page.tsx` — removed DarkModeToggle from header
  - `ui/index.ts` — removed DarkModeToggle and ThemeProvider exports
- Removed inline calculation logic from InteractiveDemo (dutyRates, taxRates, result states)

---

## [0.4.0] - Feb 10, 2026 (SSR-Safe Storage & Vercel Deployment)

### Added
- `safeStorage.ts` — SSR-safe drop-in replacement for `localStorage`/`sessionStorage` (uses in-memory Map on server, localStorage in browser)
- Vercel deployment pipeline connected to `nitinbefach/befach-platform` repo

### Changed
- Replaced all direct `localStorage`/`sessionStorage` calls with `safeStorage` across 29 files
- Removed stale `isBrowser` and `typeof window` SSR guards (now handled by safeStorage)
- Vercel root directory set to `frontend/` for Next.js builds

### Fixed
- Vercel SSR build crash caused by `localStorage` access during static page generation
- `historyStorage.ts` constructor calling `migrateFromLegacyStorage()` at import time during SSR

---

## [0.3.0] - Feb 10, 2026 (Auth Removal & Static Demo Mode)

### Added
- In-memory demo data for orders (3 demo orders) and suppliers (4 demo suppliers)
- Default authenticated state with demo organization and subscription

### Changed
- Removed all authentication gates — pages are freely accessible without login
- Unlinked PostgreSQL/Prisma database — backend uses in-memory arrays
- Removed Prisma dependencies (`@prisma/client`, `@prisma/adapter-pg`, `prisma`, `pg`)
- Deleted `backend/src/lib/prisma.js`
- Backend routes (`orders.js`, `suppliers.js`) rewritten with in-memory CRUD

### Fixed
- Broken navigation links: `/login` → `/onboarding`, `/suppliers` → `/our-vendors`, `/share-requirement` → `/submit-requirement`
- Dashboard redirect loop — was redirecting unauthenticated users back to homepage
- Invalid `title` prop on lucide `Info` icon component

---

## [Unreleased]

### Added
- Project structure and documentation framework (13 main folders)
- Execution tag system for task tracking
- Comprehensive README files for all folders
- Organized existing documentation into new structure

### Changed
- Moved `ABOUT_PROJECT.md` to `ARCHITECTURE/System_Overview.md`
- Moved `PROJECT_DOCUMENTATION.md` to `ARCHITECTURE/Technical_Documentation.md`
- Moved `PROJECT_COMPREHENSIVE_GUIDE.md` to `REFERENCES/Project_Comprehensive_Guide.md`
- Moved `cursor-prompt-dual-mode.md` to `AGENT_USAGE/PROMPT_HISTORY/Initial_Prompt.md`
- Moved `BEFACH_PROJECT_STRUCTURE.md` to `ARCHITECTURE/Project_Structure_Definition.md`
- Moved `EXECUTION_TAGS_AND_WORKFLOW.md` to `EXECUTION/EXECUTION_TAGS/Workflow_Standard.md`
- Moved `QUICK_SETUP_GUIDE.md` to `RESOURCES/DOCUMENTATION/Quick_Setup.md`

---

## [0.2.0] - Nov 27, 2025 (Project Structure)

### Added
- 13 main folders for project organization
- Subdirectories for each main folder
- README.md in each folder
- CHANGELOG_MASTER.md
- EXECUTION_PLAN.md
- Daily execution log template
- Phase 1 Foundation tasks

### Status
- Project Structure: 100% complete
- Documentation: 80% complete
- Frontend: UI Complete
- Backend: API Structure complete, integration pending

---

## [0.1.0] - Nov 26, 2025 (Initial UI)

### Added
- Initial project repository
- UI complete (11+ pages, all components)
- Unified platform architecture (removed dual-mode)
- Dark mode with persistence
- Collapsible sidebar
- Onboarding flow
- Guided tour component
- Inter font with multiple weights

### UI Changes
- Removed all emojis, replaced with SVG icons
- Added sidebar collapse toggle
- Improved spacing and typography
- Removed underlines from links
- Refined color palette

### Backend
- Express.js API structure
- 14 route modules with 40+ endpoints
- Mock data for all endpoints
- Cost calculation logic
- Supplier matching algorithm (basic)

### Status
- UI: 100% complete
- Backend: Structure complete, not connected to frontend
- Database: Not implemented (in-memory storage)
- Authentication: Not implemented

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.9.0 | Feb 18, 2026 | Mobile UI fixes & nav polish |
| 0.8.0 | Feb 18, 2026 | Data cleanup & orange rebrand |
| 0.7.0 | Feb 13, 2026 | Header enhancements — notifications, profile & logo |
| 0.6.0 | Feb 12, 2026 | Mobile optimization & onboarding split |
| 0.5.0 | Feb 11, 2026 | Login flow, dark mode removal & homepage polish |
| 0.4.0 | Feb 10, 2026 | SSR-safe storage & Vercel deployment |
| 0.3.0 | Feb 10, 2026 | Auth removal & static demo mode |
| 0.2.0 | Nov 27, 2025 | Project structure and organization |
| 0.1.0 | Nov 26, 2025 | Initial UI and backend structure |

