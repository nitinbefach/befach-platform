# BEFACH International — Complete Codebase Structure & Architecture

> **Last updated:** February 20, 2026
> An exhaustive guide covering every aspect of the Befach codebase: tech stack, high-level design, low-level design, API calls, app flow, data models, and module-by-module breakdown.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Deep Dive](#2-tech-stack-deep-dive)
3. [Repository Structure](#3-repository-structure)
4. [High-Level Design (HLD)](#4-high-level-design-hld)
5. [Low-Level Design (LLD)](#5-low-level-design-lld)
6. [Database Schema & Data Layer](#6-database-schema--data-layer)
7. [Backend Architecture](#7-backend-architecture)
8. [Frontend Architecture](#8-frontend-architecture)
9. [API Reference (All Endpoints)](#9-api-reference-all-endpoints)
10. [App Flow — User Journeys](#10-app-flow--user-journeys)
11. [State Management & Data Persistence](#11-state-management--data-persistence)
12. [Component Library & UI System](#12-component-library--ui-system)
13. [Services & Business Logic](#13-services--business-logic)
14. [Styling Architecture](#14-styling-architecture)
15. [Deployment & Infrastructure](#15-deployment--infrastructure)
16. [Security & Configuration](#16-security--configuration)
17. [Known Issues & Technical Debt](#17-known-issues--technical-debt)
18. [File-by-File Reference](#18-file-by-file-reference)

---

## 1. Project Overview

**Befach International** is an **AI-powered B2B trade intelligence platform** designed for Indian importers and exporters. It serves as a unified command center where businesses can:

- **Track import orders** end-to-end (creation → shipping → customs → delivery)
- **Calculate landed costs** (FOB + freight + insurance + customs duty + GST)
- **Find & manage suppliers** from China, Vietnam, Bangladesh, etc.
- **Handle customs compliance** (Bill of Entry filing, HSN code lookup, license management)
- **View market insights** (commodity prices, trending products)
- **Browse EXIM trade data** (real import/export shipment records)
- **Book shipments** (international freight + domestic logistics)
- **Process payments** (FX rates, payment methods, payment history)
- **Chat with AI assistant** for trade queries
- **Manage teams** with role-based access (owner, admin, member, viewer)
- **Collect feedback** (NPS surveys, micro-feedback, feature ratings)

**Target Audience:** Indian SMEs engaged in international trade — importers of electronics, textiles, raw materials, and exporters of manufactured goods.

---

## 2. Tech Stack Deep Dive

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.0.4 | React meta-framework with App Router, SSR, file-based routing |
| **React** | 18.2.0 | Component-based UI library |
| **TypeScript** | 5.3+ | Static type checking for frontend code |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework for global styles |
| **styled-jsx** | (built-in) | Scoped per-component CSS via `<style jsx>` blocks |
| **Radix UI** | Various | Accessible, unstyled UI primitives (dialogs, dropdowns, tabs, select, etc.) |
| **class-variance-authority** | 0.7.1 | Variant-based component styling (buttons, inputs, cards) |
| **Framer Motion** | 12.31.0 | Declarative animations and page transitions |
| **Recharts** | 3.5.1 | React charting library (bar, pie, line, waterfall charts) |
| **Lucide React** | 0.555.0 | Icon library (all icons throughout the UI) |
| **jsPDF + autoTable** | 3.0.4 | Client-side PDF generation for reports/calculations |
| **date-fns** | 4.1.0 | Date formatting and manipulation |
| **react-swipeable** | 7.0.2 | Touch swipe gestures for mobile |
| **tailwind-merge** | 3.4.0 | Intelligent Tailwind class merging |
| **clsx** | 2.1.1 | Conditional className utility |
| **Inter** (Google Font) | — | Primary typeface via `next/font/google` |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime for server |
| **Express.js** | 4.18.2 | HTTP server framework, routing, middleware |
| **Prisma ORM** | Latest | Database access layer (schema-driven, type-safe queries) |
| **PostgreSQL** | (Supabase) | Relational database (cloud-hosted) |
| **googleapis** | 171.4.0 | Google Sheets API for feedback sync |
| **Helmet** | 7.1.0 | HTTP security headers middleware |
| **Morgan** | 1.10.0 | HTTP request logging middleware |
| **CORS** | 2.8.5 | Cross-origin resource sharing middleware |
| **dotenv** | 16.6.1 | Environment variable management |
| **nodemon** | 3.0.2 | Auto-restart on file changes (dev only) |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Vercel** | Hosting & deployment (both frontend and backend) |
| **Supabase** | Managed PostgreSQL database |
| **Google Sheets** | Feedback data sync (via service account) |
| **Git** | Version control |

---

## 3. Repository Structure

```
befach/
├── .gitignore                  # Git ignore rules
├── README.md                   # Quick-start README
├── HOW-IT-WORKS.md             # Detailed how-it-works guide
├── structure.md                # THIS FILE
│
├── backend/                    # Express.js API Server
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Dependencies & scripts
│   ├── vercel.json             # Vercel deployment config (rewrites all to /api)
│   ├── prisma.config.ts        # Prisma configuration
│   ├── prisma/
│   │   └── schema.prisma       # Database schema (5 models, 3 enums)
│   ├── api/
│   │   └── index.js            # Vercel serverless entry point
│   ├── src/
│   │   ├── index.js            # Express app setup, middleware, route mounting
│   │   ├── config/
│   │   │   └── index.js        # Port, CORS, JWT, rate limit config
│   │   ├── lib/
│   │   │   └── googleSheets.js # Google Sheets API client for feedback sync
│   │   ├── data/
│   │   │   ├── calculations.json  # File-based calculator storage
│   │   │   └── feedback.json      # File-based feedback storage
│   │   └── routes/             # 15 Express route files
│   │       ├── auth.js         # Login/Register (mock)
│   │       ├── orders.js       # Order CRUD (in-memory with demo data)
│   │       ├── suppliers.js    # Supplier CRUD (in-memory with demo data)
│   │       ├── calculator.js   # Landed cost calc + file-based history CRUD
│   │       ├── shipments.js    # Shipment tracking (mock data)
│   │       ├── compliance.js   # BOE & regulations (mock data)
│   │       ├── market.js       # Market insights (mock data)
│   │       ├── ai.js           # AI assistant (keyword-matched responses)
│   │       ├── user.js         # User profile & prefs (in-memory)
│   │       ├── requirements.js # Sourcing requirements (in-memory)
│   │       ├── chat.js         # Chat support (in-memory)
│   │       ├── team.js         # Team management (in-memory)
│   │       ├── reports.js      # Report generation (in-memory)
│   │       ├── apikeys.js      # API key management (in-memory)
│   │       └── feedback.js     # Feedback (file + Google Sheets)
│   └── node_modules/
│
├── frontend/                   # Next.js 14 Application
│   ├── package.json            # Dependencies & scripts
│   ├── next.config.js          # Next.js config (TS/ESLint errors ignored)
│   ├── tailwind.config.js      # Tailwind theme (HSL CSS vars, custom animations)
│   ├── postcss.config.js       # PostCSS config
│   ├── tsconfig.json           # TypeScript config
│   ├── vercel.json             # Vercel deployment (framework: nextjs)
│   ├── .env.example            # Frontend env template
│   ├── src/
│   │   ├── app/                # 35+ page routes (Next.js App Router)
│   │   │   ├── layout.tsx      # Root layout (Inter font, UserProvider)
│   │   │   ├── page.tsx        # Landing page (public homepage)
│   │   │   ├── globals.css     # Global styles (~50KB, design tokens, utilities)
│   │   │   ├── dashboard/      # Main dashboard (15 sub-files)
│   │   │   ├── my-orders/      # Order management
│   │   │   ├── cost-calculator/# Landed cost calculator + history + results
│   │   │   ├── our-vendors/    # Saved supplier directory
│   │   │   ├── smart-sourcing/ # AI-powered supplier search
│   │   │   ├── track-shipment/ # Shipment tracking
│   │   │   ├── book-shipment/  # International & local freight booking
│   │   │   ├── compliance-tools/# Customs & regulatory tools
│   │   │   ├── market-insights/# Market trends and prices
│   │   │   ├── exim-data/      # Import/export trade data browser
│   │   │   ├── payments/       # Payments (new, history, fx-rates, methods)
│   │   │   ├── chat-support/   # Chat with support
│   │   │   ├── ai-assistant/   # AI trade Q&A
│   │   │   ├── team-management/# Team & roles
│   │   │   ├── settings/       # Account settings
│   │   │   ├── reports/        # Generate & download reports
│   │   │   ├── onboarding/     # New user setup flow (5 sub-files)
│   │   │   ├── feedback/       # Feedback dashboard
│   │   │   ├── about/          # About page (public)
│   │   │   ├── contact/        # Contact page (public)
│   │   │   ├── services/       # Services overview (public)
│   │   │   └── ... (15+ more routes)
│   │   │
│   │   ├── components/         # 113+ reusable components
│   │   │   ├── layout/         # AppLayout, Sidebar, Header, Footer, etc. (12 files)
│   │   │   ├── ui/             # Design system primitives (32 files)
│   │   │   ├── calculator/     # Cost calculator forms & charts (12 files)
│   │   │   ├── search/         # Supplier search cards & filters (10 files)
│   │   │   ├── suppliers/      # Supplier management (5 files)
│   │   │   ├── market/         # Market data charts & tables (5 files)
│   │   │   ├── compliance/     # Compliance search & result cards (5 files)
│   │   │   ├── exim/           # EXIM data tables & filters (9 files)
│   │   │   ├── chat/           # AI Chatbot widget (2 files)
│   │   │   ├── feedback/       # Feedback forms & NPS surveys (7 files)
│   │   │   ├── landing/        # Landing page components (5 files)
│   │   │   ├── onboarding/     # Guided tour (2 files)
│   │   │   ├── requirements/   # Sourcing requirements (5 files)
│   │   │   ├── common/         # Shared utilities (1 file)
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── context/            # React Context providers
│   │   │   ├── UserModeContext.tsx  # Auth, org, sidebar, onboarding state
│   │   │   └── MarketContext.tsx    # Market data, watchlist, alerts, filters
│   │   │
│   │   ├── services/           # API communication & business logic
│   │   │   ├── calculatorService.ts  # Calculator API + localStorage fallback
│   │   │   ├── marketData.ts         # Market data (mock, client-side)
│   │   │   ├── complianceService.ts  # Compliance data (localStorage)
│   │   │   └── eximDataService.ts    # EXIM trade data (50 mock records)
│   │   │
│   │   ├── lib/                # Utility libraries (24 files)
│   │   │   ├── safeStorage.ts       # SSR-safe localStorage/sessionStorage
│   │   │   ├── suppliers.ts         # 100 mock suppliers + search algorithm
│   │   │   ├── orders.ts            # Order types, CRUD, filtering
│   │   │   ├── payments.ts          # Payment CRUD, FX rates, CSV export
│   │   │   ├── tracking.ts          # Shipment tracking types & mock data
│   │   │   ├── feedback.ts          # Feedback system, surveys, analytics
│   │   │   ├── bookingConstants.ts  # Carriers, ports, cities, quote generator
│   │   │   ├── bookingStorage.ts    # Booking localStorage persistence
│   │   │   ├── aiChat.ts            # AI chat logic & responses
│   │   │   ├── conversations.ts     # Chat conversation management
│   │   │   ├── requirements.ts      # Sourcing requirement management
│   │   │   ├── savedSuppliers.ts    # Saved supplier management
│   │   │   ├── animations.ts        # Framer Motion animation presets
│   │   │   ├── healthScore.ts       # Business health score calculator
│   │   │   ├── walkthroughSteps.ts  # Guided tour step definitions
│   │   │   ├── walkthroughStorage.ts# Tour progress persistence
│   │   │   ├── feedbackTriggers.ts  # Feedback prompt trigger logic
│   │   │   ├── historyStorage.ts    # Calculator history storage
│   │   │   ├── calculatorConstants.ts# Calculator constants
│   │   │   ├── eximConstants.ts     # EXIM data constants
│   │   │   ├── paymentConstants.ts  # Payment constants
│   │   │   ├── recycle-bin.ts       # Soft-delete / recycle bin
│   │   │   ├── aiNudge.ts           # AI nudge suggestions
│   │   │   └── utils.ts             # General utilities (cn helper)
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useMobile.ts         # Breakpoint detection (mobile/tablet/desktop)
│   │   │   ├── useFeedbackTrigger.tsx# Feedback prompt triggers
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── types/              # TypeScript type definitions (7 files)
│   │   │   ├── calculator.ts, market.ts, compliance.ts, exim.ts
│   │   │   ├── booking.ts, chat.ts, payments.ts
│   │   │
│   │   ├── utils/              # Utility functions (5 files)
│   │   │   ├── calculatorUtils.ts   # Calculation formulas & formatting
│   │   │   ├── pdfExport.ts         # PDF generation for reports
│   │   │   ├── routeGuards.ts       # Route access control per user mode
│   │   │   ├── iconMappings.ts      # Icon name → component mappings
│   │   │   └── marketHelpers.ts     # Market data processing helpers
│   │   │
│   │   ├── data/               # Static data files
│   │   │   └── complianceDatabase.ts # HSN codes, duty rates, rules
│   │   │
│   │   ├── styles/             # Additional CSS
│   │   │   ├── market-insights.css
│   │   │   └── market-insights.module.css
│   │   │
│   │   └── config/             # Frontend configuration (empty)
│   │
│   ├── prototypes/             # UI prototypes & experiments (9 files)
│   ├── public/                 # Static assets (images, fonts)
│   └── node_modules/
│
└── docs/                       # Documentation (8 files)
    ├── api-reference.md         # API endpoint documentation
    ├── backend-architecture.md  # Backend design docs
    ├── frontend-architecture.md # Frontend design docs
    ├── database-schema.md       # Database schema docs
    ├── calculator-features.md   # Calculator feature spec
    ├── product-details.md       # Product spec (~40KB)
    ├── setup-guide.md           # Setup & deployment guide
    └── changelog.md             # Change history
```

---

## 4. High-Level Design (HLD)

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │               NEXT.JS 14 FRONTEND (Port 3000)                │  │
│  │                                                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │  │
│  │  │  Pages   │  │Components│  │ Services │  │   Context     │ │  │
│  │  │ (App     │  │ (113+    │  │ (API     │  │ (UserMode,   │ │  │
│  │  │  Router) │  │  reusable│  │  calls + │  │  Market)     │ │  │
│  │  │ 35+routes│  │  UI parts│  │  fallback│  │              │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │  │
│  │                      │                                        │  │
│  │              ┌───────┴───────┐                                │  │
│  │              │  localStorage │  (session, orders, feedback,   │  │
│  │              │  + sessionStr │   calculator, compliance, etc.)│  │
│  │              └───────────────┘                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    HTTP (fetch API)
                    REST JSON over CORS
                              │
┌─────────────────────────────┴───────────────────────────────────────┐
│                  EXPRESS.JS BACKEND (Port 5000)                     │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │Middleware │  │  Routes  │  │   Data   │  │   External APIs    │ │
│  │ Helmet   │  │ 15 route │  │ In-memory│  │ • Google Sheets    │ │
│  │ CORS     │  │ files    │  │ JSON file│  │   (feedback sync)  │ │
│  │ Morgan   │  │          │  │ Mock data│  │ • Supabase (DB)    │ │
│  │ JSON     │  │          │  │          │  │                    │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                       Prisma ORM (TCP)
                              │
┌─────────────────────────────┴───────────────────────────────────────┐
│                 POSTGRESQL (Supabase Cloud)                         │
│   Tables: organizations, users, suppliers, orders, calculations     │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern

- **Monorepo** with two independent applications (`frontend/` and `backend/`) sharing no code
- **REST API** architecture — resources at URLs, CRUD via HTTP methods, JSON payloads
- **Service Layer Pattern** — frontend services abstract API calls with localStorage fallback
- **Context-based State** — React Context for global auth/market state; `useState` for local
- **Graceful Degradation** — if backend is unreachable, frontend falls back to localStorage/mock data

### Key Design Decisions

1. **Separate frontend & backend** — deployed independently on Vercel (two projects)
2. **No Redux/Zustand** — React Context + localStorage is sufficient for current scale
3. **Mock-heavy backend** — most routes return hardcoded/in-memory data for rapid prototyping
4. **TypeScript frontend, JavaScript backend** — backend is simpler, TS not yet needed
5. **File-based storage for calculator** — `data/calculations.json` as intermediate step before full DB migration
6. **Google Sheets integration** — feedback data synced to a spreadsheet for easy non-technical access

---

## 5. Low-Level Design (LLD)

### 5.1 Frontend Component Hierarchy

```
RootLayout (app/layout.tsx)
├── <html> with Inter font CSS variable
├── UserProvider (context/UserModeContext.tsx)
│   │   Manages: isAuthenticated, organization, subscription,
│   │            sidebarPreferences, onboarding/tour state
│   │
│   ├── PUBLIC PAGES (when !isAuthenticated or public routes)
│   │   └── PublicLayout (components/layout/PublicLayout.tsx)
│   │       ├── LandingHeader
│   │       ├── Page Content (landing, about, contact, services)
│   │       └── LandingFooter
│   │
│   └── AUTHENTICATED PAGES (when isAuthenticated)
│       └── AppLayout (components/layout/AppLayout.tsx)
│           ├── Sidebar (desktop ≥1024px, collapsible, pinnable)
│           ├── TopBar (breadcrumb + search + actions)
│           ├── Page Content (dashboard, orders, calculator, etc.)
│           ├── MobileDrawer (768px–1024px, slide-out menu)
│           ├── BottomNav (<768px, fixed bottom navigation)
│           └── NotificationPanel (slide-out notifications)
```

### 5.2 Landed Cost Calculation Logic

```
INPUT: productName, hsnCode, fobValue (USD), originCountry, shippingMethod

1.  Lookup duty rates from HSN database:
    dutyRates[hsnCode] → { bcd: %, igst: %, description }
    (7 specific HSN codes + default 10%/18% for unknown codes)

2.  Calculate freight:
    if shippingMethod === 'sea': freight = fobValue × 0.08 (8%)
    if shippingMethod === 'air': freight = fobValue × 0.15 (15%)

3.  Calculate insurance:
    insurance = (fobValue + freight) × 0.0125 (1.25%)

4.  CIF Value:
    cifValue = fobValue + freight + insurance

5.  Basic Customs Duty (BCD):
    basicDuty = cifValue × (bcdRate / 100)

6.  Social Welfare Surcharge (SWS):
    socialWelfare = basicDuty × 0.10 (10% of BCD)

7.  IGST:
    igst = (cifValue + basicDuty + socialWelfare) × (igstRate / 100)

8.  Total Duty:
    totalDuty = basicDuty + socialWelfare + igst

9.  Landed Cost:
    landedCost = cifValue + totalDuty

OUTPUT: { cifValue, basicDuty, socialWelfare, igst, totalDuty, landedCost, rates }
```

### 5.3 Supplier Search Algorithm

Located in `lib/suppliers.ts`, the search scores 100 mock suppliers:

```
1.  For each supplier, calculate a matchScore (0–100):
    a. Keyword match against company name, product names, descriptions
    b. Category match (exact match = high score)
    c. Country filter match
    d. Certification requirements match
    e. Rating threshold check
    f. Lead time filter
    g. Price range filter with quantity-based pricing

2.  For each matching product, calculate a relevanceScore:
    a. Name similarity (keyword overlap)
    b. HSN code match
    c. Price within range consideration
    d. Quantity availability (vs MOQ)

3.  Sort results by matchScore descending
4.  Return: { supplier, matchScore, matchedProducts[] }
```

### 5.4 Route Guard Logic

```
Route Categories:
├── publicRoutes: ['/', '/mode-selection']
├── serviceOnlyRoutes: ['/submit-requirement', '/chat-support', '/track-simple', ...]
├── platformOnlyRoutes: ['/market-insights', '/exim-data', '/smart-sourcing', ...]
└── sharedRoutes: ['/dashboard', '/my-orders', '/settings', '/track-shipment', ...]

Access Logic:
  if (publicRoute) → always allow
  if (no userMode) → redirect to /mode-selection
  if (service user + platform route) → redirect to service equivalent
  if (platform user + service route) → redirect to platform equivalent
```

### 5.5 Responsive Breakpoint System

```
Breakpoints (matching Tailwind):
  sm:  640px   │
  md:  768px   │ ← isMobile threshold
  lg:  1024px  │ ← isTablet/isDesktop threshold
  xl:  1280px  │
  2xl: 1536px  │

Layout Behavior:
  ≥1024px (Desktop):  Full sidebar visible, multi-column layouts
  768–1024px (Tablet): Sidebar hidden → MobileDrawer, adapted grid
  <768px (Mobile):     BottomNav shown, single-column, compact cards
  <480px (Small):      Extra compact, reduced padding/margins
```

---

## 6. Database Schema & Data Layer

### 6.1 Prisma Schema (5 Models, 3 Enums)

**Enums:**
- `OrgType`: `company` | `individual`
- `UserRole`: `owner` | `admin` | `member` | `viewer`
- `OrderStatus`: `processing` | `confirmed` | `in_transit` | `customs` | `delivered` | `cancelled`

**Models & Relationships:**

```
Organization (1) ──── has many ──→ User (∞)
Organization (1) ──── has many ──→ Order (∞)
Organization (1) ──── has many ──→ Supplier (∞)
Organization (1) ──── has many ──→ Calculation (∞)

User (1) ──── has many ──→ Order (∞)
User (1) ──── has many ──→ Calculation (∞)

Supplier (1) ──── has many ──→ Order (∞)
```

**Table Details:**

| Table | Key Columns | Indexes |
|---|---|---|
| `organizations` | id (UUID), name, type (OrgType), industry, website | — |
| `users` | id (UUID), email (unique), name, role (UserRole), phone, organization_id | — |
| `suppliers` | id (UUID), name, contact_person, email, country, specialization, rating (Decimal 2,1), total_orders, verified | — |
| `orders` | id (UUID), order_number (unique), product, hsn_code, quantity, unit, fob_value (Decimal 12,2), landed_cost, currency, status (OrderStatus), origin_country, destination_port, supplier_id, user_id, organization_id | organization_id, status, order_number |
| `calculations` | id (UUID), product_name, hsn_code, origin_country, shipping_method, fob_value, freight, insurance, cif_value, basic_duty, social_welfare, igst, total_duty, landed_cost, duty_rates (JSON), user_id, organization_id | user_id |

### 6.2 Storage Strategy Matrix

| Feature | Storage | Persistence | Migration Plan |
|---|---|---|---|
| Orders | In-memory array (backend) | Lost on restart | TODO: Prisma |
| Suppliers | In-memory array (backend) | Lost on restart | TODO: Prisma |
| Calculator History | JSON file (`data/calculations.json`) | Survives restart, not deploy | TODO: Prisma |
| Feedback | JSON file + Google Sheets | File survives restart; Sheets permanent | — |
| User Profile | In-memory (backend) + localStorage (frontend) | Mixed | TODO: Prisma |
| Chat Messages | In-memory (backend) | Lost on restart | TODO: Prisma |
| Team Data | In-memory (backend) | Lost on restart | TODO: Prisma |
| Reports | In-memory (backend) | Lost on restart | TODO: Prisma |
| API Keys | In-memory (backend) | Lost on restart | TODO: Prisma |
| Requirements | In-memory (backend) | Lost on restart | TODO: Prisma |
| Compliance (BOE) | localStorage (frontend) | Per-browser | TODO: Backend |
| Market Data | Hardcoded mock (frontend) | Static | TODO: Real API |
| EXIM Data | Hardcoded mock (frontend) | Static | TODO: Real API |
| Payments | localStorage (frontend) | Per-browser | TODO: Backend |

---

## 7. Backend Architecture

### 7.1 Server Bootstrap (`src/index.js`)

```
1. Load environment variables (dotenv)
2. Create Express app
3. Attach middleware (in order):
   ├── helmet()           → Security HTTP headers
   ├── cors()             → Allow frontend origin (localhost:3000)
   ├── morgan('dev')      → Request logging
   ├── express.json()     → Parse JSON bodies
   └── express.urlencoded()→ Parse form data
4. Mount health check: GET /api/health
5. Mount 15 route modules at /api/*
6. Add 404 handler
7. Add global error handler (500)
8. Listen on PORT (default 5000)
9. Initialize Google Sheets header row (non-blocking)
```

### 7.2 Middleware Pipeline

```
Request → Helmet → CORS → Morgan → JSON Parser → Route Handler → Error Handler → Response
```

### 7.3 Route Module Patterns

All route files follow the same pattern:
```javascript
const express = require('express');
const router = express.Router();
// ... mock data / storage
// GET, POST, PUT, DELETE handlers
module.exports = router;
```

**Data storage per route:**
- `orders.js`, `suppliers.js`, `shipments.js`, `compliance.js`, `market.js`, `ai.js`: In-memory arrays
- `calculator.js`, `feedback.js`: File-based JSON (`data/*.json`)
- `user.js`, `requirements.js`, `chat.js`, `team.js`, `reports.js`, `apikeys.js`: In-memory objects

### 7.4 Vercel Deployment

Backend deploys as a **serverless function** via `api/index.js` which re-exports the Express app. `vercel.json` rewrites all requests to `/api`.

---

## 8. Frontend Architecture

### 8.1 Next.js App Router

Every folder in `src/app/` with a `page.tsx` becomes a route. Key routes:

| Route | Page | Data Source |
|---|---|---|
| `/` | Landing page | Static |
| `/dashboard` | Main dashboard | Mixed (multiple APIs) |
| `/my-orders` | Order management | Backend API + localStorage |
| `/cost-calculator` | Landed cost form | Frontend calculation + backend save |
| `/cost-calculator/history` | Calculation history | Backend API + localStorage fallback |
| `/cost-calculator/results/[id]` | Single result | Backend API + localStorage |
| `/our-vendors` | Saved suppliers | Backend API |
| `/smart-sourcing` | Supplier search | Frontend mock (100 suppliers) |
| `/track-shipment` | Shipment tracking | Frontend mock data |
| `/book-shipment/*` | Booking wizard | Frontend mock + localStorage |
| `/compliance-tools` | Compliance dashboard | localStorage + static DB |
| `/market-insights` | Market trends | Frontend mock data |
| `/exim-data` | EXIM trade data | Frontend mock (50 records) |
| `/payments/*` | Payment management | localStorage |
| `/chat-support` | Chat support | Backend in-memory |
| `/ai-assistant` | AI trade Q&A | Backend mock responses |
| `/team-management` | Team & roles | Backend in-memory |
| `/settings` | Account settings | localStorage |
| `/reports` | Reports | Backend in-memory |
| `/onboarding` | New user setup | localStorage |
| `/feedback` | Feedback dashboard | localStorage + backend |

### 8.2 Layout System

```
app/layout.tsx (Root)
  → Inter font loaded via next/font/google (variable: --font-inter)
  → UserProvider wraps all children
  → react-grab DevTools in development mode

Public pages → PublicLayout (Header + content + Footer)
Auth pages   → AppLayout (Sidebar + TopBar + content + BottomNav + MobileDrawer)
```

### 8.3 Context Providers

**UserModeContext** — Global authentication & preferences:
- `isAuthenticated` (boolean), `organization` (name, type, teamSize, goals)
- `userRole` ('owner'), `subscription` (plan, seats)
- `sidebarPreferences` (pinned, collapsed, hidden items)
- `hasCompletedOnboarding`, `hasCompletedTour`
- Methods: `login()`, `logout()`, `updateOrganization()`, `updateSidebarPreferences()`, etc.
- Persists to localStorage keys: `befach-user`, `befach-sidebar-prefs`, `befach-onboarding`, `befach-tour`

**MarketContext** — Market data state:
- `commodities`, `marketOverview`, `loading`, `error`
- `filters` (timeRange, categories, origins, sortBy)
- `watchlist` + CRUD, `alerts` + CRUD
- `selectedCommodities` for comparison (max 5)
- Persists watchlist, alerts, filters, timeRange to localStorage

---

## 9. API Reference (All Endpoints)

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server status + timestamp |

### Authentication (`/api/auth`) — MOCK
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register (returns mock user + JWT) |
| POST | `/api/auth/login` | Login (returns mock user + JWT) |
| POST | `/api/auth/logout` | Logout (clears mock session) |
| GET | `/api/auth/me` | Get current user (mock) |

### Orders (`/api/orders`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List all + stats (total, by status, value) |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create (requires: product, quantity) |
| PUT | `/api/orders/:id` | Update any fields |
| DELETE | `/api/orders/:id` | Delete order |

### Suppliers (`/api/suppliers`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/suppliers` | List all (sorted by rating) + stats |
| GET | `/api/suppliers/:id` | Get supplier + recent orders |
| POST | `/api/suppliers` | Add (requires: name) |
| PUT | `/api/suppliers/:id` | Update details |
| DELETE | `/api/suppliers/:id` | Delete supplier |
| POST | `/api/suppliers/match` | Find matches by product/category/countries |

### Calculator (`/api/calculator`) — FILE-BASED
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/calculator/landed-cost` | Calculate landed cost |
| GET | `/api/calculator/duty-rates/:hsnCode` | Get duty rates for HSN |
| GET | `/api/calculator/stats` | Usage statistics |
| POST | `/api/calculator/calculations` | Save a calculation |
| GET | `/api/calculator/calculations` | List (paginated, searchable, sortable) |
| GET | `/api/calculator/calculations/:id` | Get single |
| PUT | `/api/calculator/calculations/:id` | Update |
| DELETE | `/api/calculator/calculations/:id` | Delete |
| GET | `/api/calculator/recent` | Recent calculations |
| GET | `/api/calculator/dashboard-stats` | Dashboard summary |
| POST | `/api/calculator/calculations/sync` | Sync localStorage → backend |

### Shipments (`/api/shipments`) — MOCK
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shipments` | List all + stats |
| GET | `/api/shipments/:id` | Get single |
| POST | `/api/shipments/track` | Track by tracking number |

### Compliance (`/api/compliance`) — MOCK
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compliance/boe` | List BOE records |
| GET | `/api/compliance/boe/:id` | Get single BOE |
| POST | `/api/compliance/boe` | File new Bill of Entry |
| GET | `/api/compliance/regulations` | Regulatory alerts |

### Market (`/api/market`) — MOCK
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/insights` | Market insights + trending |
| GET | `/api/market/products/:hsn` | Product market data |
| GET | `/api/market/opportunities` | Opportunities & alerts |

### AI Assistant (`/api/ai`) — MOCK
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Ask trade question (keyword-matched) |
| GET | `/api/ai/recent` | Recent queries |
| GET | `/api/ai/stats` | Usage stats |
| GET | `/api/ai/popular` | Popular questions |

### User (`/api/user`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get profile |
| POST | `/api/user/login` | Simplified login |
| POST | `/api/user/logout` | Logout |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/organization` | Update org details |
| GET | `/api/user/preferences` | Get preferences |
| PUT | `/api/user/preferences/sidebar` | Update sidebar prefs |
| PUT | `/api/user/preferences/notifications` | Update notification prefs |
| POST | `/api/user/onboarding/complete` | Mark onboarding done |
| POST | `/api/user/onboarding/complete-tour` | Mark tour done |
| GET | `/api/user/subscription` | Subscription details |
| POST | `/api/user/subscription/upgrade` | Upgrade plan |

### Requirements (`/api/requirements`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requirements` | Submit requirement |
| GET | `/api/requirements` | List (filterable, paginated) |
| GET | `/api/requirements/:id` | Get with quotes |
| POST | `/api/requirements/:id/quotes/:quoteId/accept` | Accept quote |
| DELETE | `/api/requirements/:id` | Cancel |

### Chat (`/api/chat`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/messages` | Send message (returns bot response) |
| GET | `/api/chat/messages` | Get history |
| GET | `/api/chat/quick-actions` | Available quick actions |
| DELETE | `/api/chat/messages` | Clear history |
| POST | `/api/chat/request-agent` | Request human agent |

### Team (`/api/team`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/team/members` | List members |
| POST | `/api/team/invite` | Invite member |
| GET | `/api/team/invitations` | Pending invitations |
| PUT | `/api/team/members/:id/role` | Change role |
| DELETE | `/api/team/members/:id` | Remove member |
| DELETE | `/api/team/invitations/:id` | Cancel invitation |
| POST | `/api/team/invitations/:id/resend` | Resend invitation |

### Reports (`/api/reports`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports` | List saved reports |
| GET | `/api/reports/summary` | Summary stats |
| POST | `/api/reports/generate` | Generate report |
| GET | `/api/reports/:id` | Report status |
| GET | `/api/reports/:id/download` | Download CSV |
| DELETE | `/api/reports/:id` | Delete report |

### API Keys (`/api/api-keys`) — IN-MEMORY
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/api-keys` | Create key |
| GET | `/api/api-keys` | List (masked) |
| DELETE | `/api/api-keys/:id` | Revoke |
| POST | `/api/api-keys/:id/regenerate` | Regenerate |
| GET | `/api/api-keys/webhooks` | Webhook settings |
| PUT | `/api/api-keys/webhooks` | Update webhooks |
| POST | `/api/api-keys/webhooks/test` | Test webhook |
| POST | `/api/api-keys/webhooks/reveal-secret` | Reveal secret |

### Feedback (`/api/feedback`) — FILE + GOOGLE SHEETS
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/feedback` | Submit entry (saves to JSON + Sheets) |
| GET | `/api/feedback` | List all entries |

---

## 10. App Flow — User Journeys

### 10.1 First-Time User Flow
```
Landing Page (/) → Click "Get Started" → /onboarding
  → Step 1: Company name + type (individual/company)
  → Step 2: Team size selection
  → Step 3: Primary goals (source products, track shipments, etc.)
  → Submit: login() stores org to localStorage, completeOnboarding()
  → Redirect to /dashboard
```

### 10.2 Cost Calculator Flow
```
/cost-calculator → Fill form (product, HSN, FOB, country, shipping)
  → Click "Calculate" → Frontend calculates locally using duty rate DB
  → Redirect to /cost-calculator/results/[id]
  → Display: waterfall chart, pie chart, cost breakdown table
  → calculatorService.saveCalculation() → POST /api/calculator/calculations
  → Also saves to localStorage as backup
  → History available at /cost-calculator/history
```

### 10.3 Supplier Search Flow
```
/smart-sourcing → Enter query + select filters
  → Frontend searches 100 mock suppliers in lib/suppliers.ts
  → Display ranked results with match scores
  → Click "Save Supplier" → POST /api/suppliers
  → Supplier appears in /our-vendors
```

### 10.4 Order Management Flow
```
/my-orders → View existing orders (fetched from backend)
  → Click "Create Order" → Modal form
  → Submit → POST /api/orders → Added to in-memory array
  → Order appears with status "Processing"
  → Click order → Update status via PUT /api/orders/:id
```

### 10.5 Authentication Flow
```
Login: UserModeContext.login(org) → stores to localStorage
  → isAuthenticated = true → AppLayout renders
  → All authenticated routes accessible

Logout: UserModeContext.logout()
  → Clears all befach-* localStorage keys
  → isAuthenticated = false → Redirect to /
```

---

## 11. State Management & Data Persistence

### localStorage Keys Used

| Key | Purpose | Module |
|---|---|---|
| `befach-user` | Auth + org data | UserModeContext |
| `befach-sidebar-prefs` | Sidebar pin/collapse state | UserModeContext |
| `befach-onboarding` | Onboarding completion flag | UserModeContext |
| `befach-tour` | Guided tour completion flag | UserModeContext |
| `befach-orders` | Client-side order cache | lib/orders.ts |
| `befach-calculations-v2` | Calculator history backup | calculatorService |
| `befach_feedback` | Feedback entries | lib/feedback.ts |
| `befach-saved-suppliers` | Saved supplier list | lib/savedSuppliers.ts |
| `befach_bookings` | Shipment bookings | lib/bookingStorage.ts |
| `befach_payments` | Payment records | lib/payments.ts |
| `befach_payment_sources` | Payment methods | lib/payments.ts |
| `befach_gateways` | Payment gateways | lib/payments.ts |
| `befach_rate_alerts` | FX rate alerts | lib/payments.ts |
| `market_watchlist` | Market watchlist | MarketContext |
| `market_alerts` | Price alerts | MarketContext |
| `market_filters` | Market filter state | MarketContext |
| `market_timerange` | Market time range | MarketContext |
| `befach-compliance-*` | BOE records, licenses, etc. | complianceService |
| `befach-walkthrough-*` | Tour progress | walkthroughStorage |

### SSR-Safe Storage (`lib/safeStorage.ts`)

All localStorage access is wrapped in `safeStorage` which:
- Uses `localStorage` in browser
- Falls back to in-memory `Map` during SSR
- Catches and suppresses quota exceeded errors

---

## 12. Component Library & UI System

### Layout Components (`components/layout/`)

| Component | Size | Purpose |
|---|---|---|
| `AppLayout.tsx` | 8.5KB | Main authenticated layout wrapper |
| `Sidebar.tsx` | 23.5KB | Desktop sidebar (collapsible, pinnable, searchable) |
| `Sidebar.module.css` | 9.9KB | Sidebar CSS modules |
| `MobileDrawer.tsx` | 17.7KB | Mobile/tablet slide-out navigation |
| `Header.tsx` | 17.7KB | Public page header with navigation |
| `TopBar.tsx` | 7.8KB | Authenticated page top bar (breadcrumbs, actions) |
| `BottomNav.tsx` | 6.4KB | Mobile fixed bottom navigation |
| `Footer.tsx` | 7.3KB | Public page footer |
| `NotificationPanel.tsx` | 21.3KB | Slide-out notification center |
| `ProfileMenu.tsx` | 10.1KB | User profile dropdown menu |
| `PublicLayout.tsx` | 1.8KB | Public page layout wrapper |

### UI Primitives (`components/ui/`)

32 components built on Radix UI + CVA pattern:

**Interactive:** AnimatedButton, AnimatedInput, AnimatedCard, AnimatedContainer, BottomSheet, DarkModeToggle, Modal, PageTransition
**Data Display:** DataTable, StatCard, FeatureCard, Skeleton, LoadingIndicator, Logo, badge
**Form Controls:** button, input, label, checkbox, select, slider, toggle, toggle-group
**Layout:** card, table, tabs, scroll-area, popover, dropdown-menu, alert-dialog
**Theme:** ThemeProvider (dark/light mode)

### Feature Components

| Directory | Files | Purpose |
|---|---|---|
| `calculator/` | 12 | Calculator form, results, charts, history cards |
| `search/` | 10 | Supplier search cards, filters, result grid |
| `suppliers/` | 5 | Supplier profile, saved list, invite form |
| `market/` | 5 | Market charts, commodity tables, watchlist |
| `compliance/` | 5 | HSN search, BOE cards, license tracker |
| `exim/` | 9 | EXIM tables, filters, detail modals, charts |
| `feedback/` | 7 | NPS survey, micro-feedback, feedback dashboard |
| `landing/` | 5 | Hero, browser mockup, interactive demo, services bento |
| `chat/` | 2 | Chat widget, message bubbles |
| `onboarding/` | 2 | Guided tour overlay |
| `requirements/` | 5 | Sourcing requirement forms, quote cards |

---

## 13. Services & Business Logic

### calculatorService.ts (359 lines)
- **Class-based** service with backend API + localStorage dual-write
- `saveCalculation()` → POST to backend, backup to localStorage
- `getCalculations()` → GET from backend, fallback to localStorage
- `syncLocalToBackend()` → batch migrate localStorage → backend
- `getDashboardStats()` → aggregate statistics

### marketData.ts (15KB)
- Mock commodity data with simulated API delays
- Generates randomized price history, volume data
- Supports filtering by category, origin, time range

### complianceService.ts (16KB)
- HSN code lookup from static `complianceDatabase.ts`
- BOE record CRUD via localStorage
- License management via localStorage
- Regulatory notification tracking

### eximDataService.ts (53KB)
- 50 hardcoded shipment records with full details
- Filtering: by product, HSN, country, port, date range
- Sorting: by date, value, quantity
- Pagination support

---

## 14. Styling Architecture

### Three-Layer Approach

1. **Tailwind CSS** (`globals.css`, ~50KB) — Global design tokens via CSS custom properties:
   ```css
   :root {
     --background: 0 0% 100%;
     --foreground: 222.2 84% 4.9%;
     --primary: 222.2 47.4% 11.2%;
     /* ... HSL color tokens ... */
     --radius: 0.5rem;
   }
   ```

2. **styled-jsx** — Per-page scoped CSS in `<style jsx>` blocks with media queries

3. **Radix UI + CVA** — Component variants:
   ```tsx
   const buttonVariants = cva("...", {
     variants: { variant: { default, destructive, outline, ... }, size: { sm, default, lg } }
   });
   ```

### Tailwind Config Highlights
- Dark mode via `class` strategy
- HSL-based color system (maps to CSS variables)
- Custom animations: accordion-down/up, slide-in, fade-in
- Plugin: `tailwindcss-animate`
- Max container width: 1400px

---

## 15. Deployment & Infrastructure

### Vercel Deployment (Two Projects)

**Frontend:**
- Framework: Next.js (auto-detected)
- Build: `next build` (TS/ESLint errors ignored via `next.config.js`)
- Output: Static + serverless functions
- Env: `NEXT_PUBLIC_API_URL` → backend Vercel URL

**Backend:**
- Entry: `api/index.js` (re-exports Express app)
- All routes rewritten to `/api` via `vercel.json`
- Env: `DATABASE_URL`, `CORS_ORIGIN`, `JWT_SECRET`, `GOOGLE_*` credentials

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SHEETS_ID=...
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 16. Security & Configuration

### Current Security Measures
- **Helmet.js** — Sets security HTTP headers (X-Frame-Options, CSP, HSTS, etc.)
- **CORS** — Restricted to configured origin (localhost:3000 or production URL)
- **Input validation** — Basic field presence checks on create endpoints

### Security Gaps (Known)
- ❌ No real authentication (mock JWT, no password hashing)
- ❌ No authorization middleware (anyone can access any data)
- ❌ No input sanitization against XSS
- ❌ No rate limiting applied (config exists but unused)
- ❌ No CSRF protection
- ❌ No file upload mechanism
- ❌ No payment gateway integration (UI-only)
- ❌ TypeScript build errors ignored (`ignoreBuildErrors: true`)
- ❌ ESLint errors ignored during builds

---

## 17. Known Issues & Technical Debt

### Production-Ready
- ✅ Landing page and all public pages
- ✅ Onboarding flow
- ✅ Dashboard layout with full responsive design
- ✅ Sidebar (collapsible, pinnable, searchable, responsive drawer)
- ✅ Dark/light theme toggle
- ✅ Cost calculator with backend storage + localStorage fallback
- ✅ EXIM data browser with filtering, sorting, pagination
- ✅ Market insights with charts
- ✅ Compliance tools with HSN lookup
- ✅ Feedback system with Google Sheets sync

### Mock/Demo State
- ⚠️ Authentication (localStorage-based, no real login)
- ⚠️ Shipment tracking (5 hardcoded shipments)
- ⚠️ AI assistant (keyword matching, not real AI)
- ⚠️ Chat support (pre-written bot responses)
- ⚠️ Market data (hardcoded commodities)
- ⚠️ EXIM data (50 hardcoded records)
- ⚠️ Orders & suppliers (in-memory, lost on restart)

### Technical Debt
1. Backend orders/suppliers routes use in-memory arrays instead of Prisma/DB
2. Most features use localStorage — need migration to database
3. No test suite (unit, integration, or E2E)
4. No CI/CD pipeline
5. Calculator has only 7 specific HSN duty rates
6. No email integration (invitations, notifications)
7. No real payment processing
8. `next.config.js` ignores all TS/ESLint errors

---

## 18. File-by-File Reference

### Backend Key Files

| File | Lines | Purpose |
|---|---|---|
| `src/index.js` | 89 | Express app setup, middleware, route mounting |
| `src/config/index.js` | 29 | Port, CORS, JWT, rate limit configuration |
| `src/lib/googleSheets.js` | 118 | Google Sheets API client (auth, append, header) |
| `src/routes/orders.js` | 283 | Order CRUD with 3 demo orders |
| `src/routes/suppliers.js` | ~300 | Supplier CRUD + match endpoint |
| `src/routes/calculator.js` | 429 | Landed cost calc + file-based CRUD |
| `src/routes/feedback.js` | 83 | Feedback save (JSON + Google Sheets) |
| `src/routes/user.js` | ~250 | User profile, preferences, subscription |
| `src/routes/team.js` | ~200 | Team member CRUD + invitations |
| `src/routes/chat.js` | ~150 | Chat messages + bot responses |
| `src/routes/ai.js` | ~120 | AI keyword-matched responses |
| `src/routes/reports.js` | ~180 | Report generation + CSV download |
| `src/routes/apikeys.js` | ~200 | API key CRUD + webhooks |
| `src/routes/requirements.js` | ~160 | Sourcing requirements + quotes |
| `src/routes/shipments.js` | ~90 | Shipment tracking (5 mock shipments) |
| `src/routes/compliance.js` | ~100 | BOE records + regulations |
| `src/routes/market.js` | ~100 | Market insights |
| `src/routes/auth.js` | ~50 | Mock auth endpoints |

### Frontend Key Files

| File | Lines | Purpose |
|---|---|---|
| `app/layout.tsx` | 43 | Root layout (Inter font, UserProvider) |
| `app/page.tsx` | ~500 | Landing page |
| `app/globals.css` | ~1500 | Global styles, design tokens, utilities |
| `context/UserModeContext.tsx` | 203 | Auth state, org, sidebar, onboarding |
| `context/MarketContext.tsx` | 293 | Market data, watchlist, alerts |
| `lib/suppliers.ts` | 1362 | 100 mock suppliers + search algorithm |
| `lib/payments.ts` | 250 | Payment CRUD, FX rates, CSV export |
| `lib/orders.ts` | 121 | Order types, CRUD, filtering |
| `lib/tracking.ts` | 366 | Shipment tracking types & mock data |
| `lib/feedback.ts` | 416 | Feedback system, surveys, analytics |
| `lib/bookingConstants.ts` | 478 | Carriers, ports, cities, quote generator |
| `lib/safeStorage.ts` | 52 | SSR-safe localStorage wrapper |
| `lib/aiChat.ts` | ~500 | AI chat logic & responses |
| `lib/conversations.ts` | ~400 | Chat conversation management |
| `lib/requirements.ts` | ~450 | Sourcing requirement management |
| `lib/savedSuppliers.ts` | ~1000 | Saved supplier management |
| `lib/animations.ts` | ~250 | Framer Motion presets |
| `lib/healthScore.ts` | ~280 | Business health score calculator |
| `lib/walkthroughSteps.ts` | ~550 | Guided tour definitions |
| `services/calculatorService.ts` | 359 | Calculator API + localStorage |
| `services/marketData.ts` | ~450 | Market data service (mock) |
| `services/complianceService.ts` | ~500 | Compliance data service |
| `services/eximDataService.ts` | ~1500 | EXIM data (50 mock records) |
| `hooks/useMobile.ts` | 284 | Responsive breakpoint detection |
| `hooks/useFeedbackTrigger.tsx` | ~130 | Feedback prompt triggers |
| `utils/calculatorUtils.ts` | ~400 | Calculation formulas & formatting |
| `utils/pdfExport.ts` | 415 | PDF generation for reports |
| `utils/routeGuards.ts` | 128 | Route access control |
| `data/complianceDatabase.ts` | ~600 | HSN codes, duty rates, rules |

---

*This document provides a complete reference for the Befach International codebase. For specific implementation details, refer to the source files or the `docs/` directory.*
