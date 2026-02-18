# BEFACH International - How It Works

> A complete guide to understanding the Befach codebase, from a basic overview to developer-level details.

---

## Table of Contents

1. [What is Befach?](#1-what-is-befach)
2. [Project Structure (Bird's Eye View)](#2-project-structure-birds-eye-view)
3. [Tech Stack - What Each Technology Does](#3-tech-stack---what-each-technology-does)
4. [The Database](#4-the-database)
5. [Backend - The API Server](#5-backend---the-api-server)
6. [Frontend - The User Interface](#6-frontend---the-user-interface)
7. [How Frontend Talks to Backend (API Calls)](#7-how-frontend-talks-to-backend-api-calls)
8. [What Happens When You Click Things](#8-what-happens-when-you-click-things)
9. [All API Endpoints (Complete List)](#9-all-api-endpoints-complete-list)
10. [Current Status & Known Issues](#10-current-status--known-issues)
11. [How to Run the Project](#11-how-to-run-the-project)

---

## 1. What is Befach?

Befach International is an **AI-powered trade intelligence platform** designed for Indian importers and exporters. Think of it as a command center where businesses can:

- **Track import orders** from creation to delivery
- **Calculate landed costs** (how much an imported product actually costs after shipping, customs duty, taxes)
- **Find and manage suppliers** from countries like China, Vietnam, Bangladesh
- **Handle customs compliance** (Bill of Entry filing, license management)
- **View market insights** (trending products, price changes)
- **Browse EXIM trade data** (real import/export shipment records)
- **Chat with support** and an AI assistant
- **Manage teams** with role-based access

**In simple terms:** If you're a business importing LED bulbs from China to India, Befach helps you find the supplier, calculate how much duty you'll pay, place the order, track the shipment, file customs paperwork, and manage your team - all in one place.

---

## 2. Project Structure (Bird's Eye View)

```
befach/
├── frontend/          <-- The website users see and interact with (Next.js + React + TypeScript)
├── backend/           <-- The server that handles data and business logic (Node.js + Express)
├── docs/              <-- Documentation files
├── README.md          <-- Basic project readme
└── HOW-IT-WORKS.md    <-- This file
```

### Frontend Structure (`frontend/src/`)

```
src/
├── app/                    <-- All the pages (Next.js App Router)
│   ├── page.tsx            <-- Homepage (landing page)
│   ├── layout.tsx          <-- Root layout (wraps all pages)
│   ├── globals.css         <-- Global styles
│   ├── dashboard/          <-- Main dashboard after login
│   ├── my-orders/          <-- View and manage import orders
│   ├── cost-calculator/    <-- Calculate landed costs for imports
│   │   ├── history/        <-- Past calculation history
│   │   └── results/[id]/   <-- Individual calculation result
│   ├── our-vendors/        <-- Saved supplier directory
│   ├── smart-sourcing/     <-- AI-powered supplier search
│   ├── track-shipment/     <-- Shipment tracking
│   ├── compliance-tools/   <-- Customs & regulatory tools
│   ├── market-insights/    <-- Market trends and prices
│   ├── exim-data/          <-- Import/export trade data browser
│   ├── chat-support/       <-- Chat with support
│   ├── ai-assistant/       <-- AI Q&A for trade queries
│   ├── team-management/    <-- Manage team members
│   ├── settings/           <-- Account settings
│   ├── reports/            <-- Generate & download reports
│   ├── onboarding/         <-- New user setup flow
│   └── ... (25+ more pages)
│
├── components/             <-- Reusable UI building blocks
│   ├── layout/             <-- AppLayout, Sidebar, BottomNav, Header, Footer
│   ├── ui/                 <-- Buttons, Cards, Modals, Inputs (Radix UI based)
│   ├── calculator/         <-- Cost calculator forms and charts
│   ├── search/             <-- Supplier search cards, filters
│   ├── suppliers/          <-- Supplier management components
│   ├── market/             <-- Market data charts and tables
│   ├── compliance/         <-- Compliance search and result cards
│   ├── exim/               <-- EXIM data tables, filters, detail modals
│   ├── chat/               <-- AI Chatbot widget
│   ├── feedback/           <-- Feedback forms and NPS surveys
│   └── onboarding/         <-- Guided tour component
│
├── context/                <-- React Context for global state
│   ├── UserModeContext.tsx  <-- Authentication & user state
│   └── MarketContext.tsx    <-- Market data state
│
├── services/               <-- Business logic & API communication
│   ├── calculatorService.ts <-- Calculator API calls + localStorage fallback
│   ├── marketData.ts        <-- Market data (currently mock, client-side)
│   ├── complianceService.ts <-- Compliance data (currently localStorage)
│   └── eximDataService.ts   <-- EXIM trade data (currently mock, client-side)
│
├── hooks/                  <-- Custom React hooks
│   ├── useMobile.ts        <-- Detects mobile/tablet/desktop breakpoints
│   └── useFeedbackTrigger.tsx <-- Triggers feedback prompts
│
├── types/                  <-- TypeScript type definitions
│   ├── calculator.ts
│   ├── market.ts
│   ├── compliance.ts
│   └── exim.ts
│
├── data/                   <-- Static data files
│   └── complianceDatabase.ts <-- HSN codes, duty rates, compliance rules
│
└── lib/                    <-- Utility functions
    └── utils.ts
```

### Backend Structure (`backend/src/`)

```
src/
├── index.js           <-- Server entry point (starts Express)
├── config/
│   └── index.js       <-- Configuration (port, CORS, JWT, rate limits)
├── lib/
│   └── prisma.js      <-- Database connection (Prisma + PostgreSQL)
└── routes/
    ├── auth.js        <-- Login, Register, Logout
    ├── orders.js      <-- CRUD operations for import orders (LIVE DATABASE)
    ├── suppliers.js   <-- CRUD operations for suppliers (LIVE DATABASE)
    ├── calculator.js  <-- Landed cost calculations (FILE-BASED storage)
    ├── shipments.js   <-- Shipment tracking (MOCK DATA)
    ├── compliance.js  <-- BOE records & regulations (MOCK DATA)
    ├── market.js      <-- Market insights (MOCK DATA)
    ├── ai.js          <-- AI assistant chat (MOCK RESPONSES)
    ├── user.js        <-- User profile & preferences (IN-MEMORY)
    ├── requirements.js <-- Submit sourcing requirements (IN-MEMORY)
    ├── chat.js        <-- Chat support (IN-MEMORY)
    ├── team.js        <-- Team management (IN-MEMORY)
    ├── reports.js     <-- Report generation (IN-MEMORY)
    └── apikeys.js     <-- API key management (IN-MEMORY)
```

---

## 3. Tech Stack - What Each Technology Does

### Why Node.js?

**Node.js** is the runtime that lets us run JavaScript on the server (outside the browser). We use it because:

- **Same language everywhere** - Both frontend and backend use JavaScript, so one developer can work on both
- **Fast for I/O operations** - Trade platforms need to handle many simultaneous API calls (checking orders, tracking shipments, querying databases). Node.js's non-blocking architecture handles this efficiently
- **Huge ecosystem** - npm has packages for everything we need (database drivers, authentication, etc.)
- **Easy to deploy** - Runs on any cloud platform (Vercel, AWS, Railway, etc.)

### Why Express.js?

**Express.js** is a web framework for Node.js. Think of it as the traffic controller for our backend:

- **Routing** - Directs incoming requests to the right handler (`/api/orders` goes to the orders handler, `/api/suppliers` goes to the suppliers handler)
- **Middleware** - Processes every request before it reaches our code (security headers via Helmet, request logging via Morgan, JSON parsing, CORS handling)
- **Minimal and flexible** - Doesn't force a specific structure, so we can organize the code how we want
- **Industry standard** - Most Node.js APIs are built with Express, making it easy for new developers to understand

### Why Next.js?

**Next.js 14** is a React framework that adds essential features:

- **App Router** - File-based routing. Each folder in `app/` automatically becomes a URL. `app/dashboard/page.tsx` = `/dashboard`
- **Server-Side Rendering (SSR)** - Pages can be rendered on the server for faster initial load
- **Automatic code splitting** - Only loads JavaScript needed for the current page
- **Built-in optimizations** - Image optimization, font optimization (we use Inter font), automatic bundling
- **API routes** - Can also handle backend logic (though we use a separate Express backend)

### Why React?

**React** is the UI library that makes the interface interactive:

- **Component-based** - Each piece of the UI is a reusable component. A `SupplierCard` component can be used on multiple pages
- **Virtual DOM** - Only updates parts of the page that actually changed, making it fast
- **Huge ecosystem** - Libraries like Radix UI, Recharts, Framer Motion are all React-based

### Why TypeScript?

**TypeScript** adds type safety to JavaScript (used in the frontend):

- **Catches bugs early** - If a function expects a number but receives a string, TypeScript flags it before the code runs
- **Better autocomplete** - IDE knows what properties an `Order` object has
- **Self-documenting** - Type definitions in `types/` folder serve as documentation

**Note:** The backend uses plain JavaScript (`.js` files), while the frontend uses TypeScript (`.tsx`/`.ts` files).

### Why REST API?

Yes, Befach uses a **REST API** architecture. This means:

- **Resources have URLs** - Orders live at `/api/orders`, suppliers at `/api/suppliers`
- **HTTP methods define actions** - `GET` to read, `POST` to create, `PUT` to update, `DELETE` to remove
- **JSON everywhere** - All data is sent and received as JSON
- **Stateless** - Each request contains all information needed to process it

### Other Key Technologies

| Technology | What it does | Where it's used |
|---|---|---|
| **Prisma** | Database ORM - translates JavaScript code into SQL queries | Backend (`prisma/schema.prisma`) |
| **PostgreSQL** (via Supabase) | The actual database that stores orders, suppliers, users | Backend (cloud-hosted) |
| **Tailwind CSS** | Utility-first CSS framework for styling | Frontend (global styles) |
| **styled-jsx** | Inline CSS scoped to individual components | Frontend (most page components) |
| **Radix UI** | Accessible, unstyled UI primitives (modals, dropdowns, tabs) | Frontend (components/ui/) |
| **Recharts** | React charting library | Frontend (market charts, calculator breakdowns) |
| **Framer Motion** | Animation library | Frontend (page transitions, card animations) |
| **Lucide React** | Icon library | Frontend (all icons throughout the UI) |
| **jsPDF** | PDF generation in the browser | Frontend (export reports/calculations to PDF) |
| **date-fns** | Date formatting utility | Frontend (formatting timestamps) |
| **Helmet** | Security middleware (sets HTTP headers) | Backend |
| **Morgan** | HTTP request logger | Backend |
| **CORS** | Cross-Origin Resource Sharing middleware | Backend (allows frontend to call backend) |
| **dotenv** | Loads environment variables from `.env` file | Backend |
| **nodemon** | Auto-restarts server when code changes | Backend (development only) |

---

## 4. The Database

### Overview

Befach uses **PostgreSQL** hosted on **Supabase** (a cloud database platform). The database connection is managed through **Prisma ORM**, which means instead of writing raw SQL, we write JavaScript:

```javascript
// Instead of: SELECT * FROM orders WHERE status = 'processing'
// We write:
const orders = await prisma.order.findMany({ where: { status: 'processing' } });
```

### Database Schema (5 Tables)

#### 1. `organizations` (Companies/Business profiles)

| Column | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| name | String | Company name (e.g., "ElectroMart India") |
| type | Enum | `company` or `individual` |
| industry | String? | Industry sector |
| website | String? | Company website |
| created_at | DateTime | When the org was created |
| updated_at | DateTime | Last update time |

**Relationships:** Has many users, orders, suppliers, calculations

#### 2. `users` (User accounts)

| Column | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| email | String | Unique email address |
| name | String | Full name |
| role | Enum | `owner`, `admin`, `member`, or `viewer` |
| phone | String? | Phone number |
| organization_id | UUID? | Which organization they belong to |
| created_at | DateTime | When the user was created |

**Relationships:** Belongs to one organization, has many orders and calculations

#### 3. `suppliers` (Supplier network)

| Column | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| name | String | Supplier name |
| contact_person | String? | Contact person name |
| email | String? | Supplier email |
| phone | String? | Supplier phone |
| location | String? | City/region |
| country | String? | Country (e.g., "China", "Vietnam") |
| specialization | String? | What they supply (e.g., "Electronics") |
| rating | Decimal | Rating from 0.0 to 5.0 |
| total_orders | Int | Number of orders placed with them |
| verified | Boolean | Whether Befach has verified them |
| organization_id | UUID? | Which organization saved this supplier |

**Relationships:** Belongs to one organization, has many orders

#### 4. `orders` (Import orders)

| Column | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| order_number | String | Human-readable ID like "ORD-4523001" |
| product | String | What's being imported (e.g., "LED Bulbs 9W") |
| hsn_code | String? | HSN/HS code for customs classification |
| quantity | Int | How many units |
| unit | String | Unit type ("pcs", "kg", "meters") |
| fob_value | Decimal? | Free On Board value in foreign currency |
| landed_cost | Decimal? | Total cost after duties and shipping |
| currency | String | Currency code (default: "USD") |
| status | Enum | `processing`, `confirmed`, `in_transit`, `customs`, `delivered`, `cancelled` |
| origin_country | String? | Where it's shipped from |
| destination_port | String? | Indian port of arrival |
| notes | String? | Additional notes |
| supplier_id | UUID? | Which supplier |
| user_id | UUID? | Which user created it |
| organization_id | UUID? | Which organization |

**Indexes on:** organization_id, status, order_number (for fast lookups)

#### 5. `calculations` (Saved cost calculations)

| Column | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| product_name | String | Product being calculated |
| hsn_code | String | HSN code used |
| origin_country | String | Country of origin |
| shipping_method | String | "sea" or "air" |
| fob_value | Decimal | FOB value entered |
| freight | Decimal? | Calculated freight cost |
| insurance | Decimal? | Insurance cost |
| cif_value | Decimal? | CIF = FOB + Freight + Insurance |
| basic_duty | Decimal? | Basic Customs Duty |
| social_welfare | Decimal? | Social Welfare Surcharge |
| igst | Decimal? | Integrated GST |
| total_duty | Decimal? | Total duty payable |
| landed_cost | Decimal? | Final landed cost |
| duty_rates | JSON? | Raw duty rate data used |
| user_id | UUID? | Which user |
| organization_id | UUID? | Which organization |

### How the Database Connects

```
Organization (1) ──── has many ────> Users (many)
Organization (1) ──── has many ────> Orders (many)
Organization (1) ──── has many ────> Suppliers (many)
Organization (1) ──── has many ────> Calculations (many)

User (1) ──── has many ────> Orders (many)
User (1) ──── has many ────> Calculations (many)

Supplier (1) ──── has many ────> Orders (many)
```

### Important Database Note

Currently, **only Orders and Suppliers** fully use the PostgreSQL database via Prisma. Other features use different storage:

| Feature | Storage Method | Persistence |
|---|---|---|
| Orders | PostgreSQL (Prisma) | Permanent |
| Suppliers | PostgreSQL (Prisma) | Permanent |
| Calculator History | JSON file on server | Survives restarts, not deployments |
| User Profiles | In-memory (backend) | Lost on server restart |
| Chat Messages | In-memory (backend) | Lost on server restart |
| Requirements | In-memory (backend) | Lost on server restart |
| Team Data | In-memory (backend) | Lost on server restart |
| Reports | In-memory (backend) | Lost on server restart |
| API Keys | In-memory (backend) | Lost on server restart |
| Compliance (BOE, licenses) | Browser localStorage | Per-browser, per-device |
| Market Data | Mock data (frontend code) | Hardcoded |
| EXIM Data | Mock data (frontend code) | Hardcoded |

---

## 5. Backend - The API Server

### How the Server Starts

1. `node src/index.js` runs (or `nodemon src/index.js` for development)
2. **dotenv** loads environment variables from `.env`
3. **Express app** is created
4. **Middleware** is attached in order:
   - `helmet()` - Sets security HTTP headers (prevents common attacks)
   - `cors()` - Allows the frontend (running on port 3000) to make requests to the backend (port 5000)
   - `morgan('dev')` - Logs every HTTP request to the console (method, URL, status, time)
   - `express.json()` - Parses incoming JSON request bodies
   - `express.urlencoded()` - Parses URL-encoded form data
5. **Routes** are mounted to URL paths (see section 9)
6. **Error handlers** are added (404 for unknown routes, 500 for server errors)
7. Server starts listening on port **5000** (or `PORT` env variable)

### Middleware Flow (What happens to every request)

```
Incoming Request
    │
    ▼
[Helmet] ─── Adds security headers (X-Frame-Options, CSP, etc.)
    │
    ▼
[CORS] ─── Checks if the request origin is allowed (localhost:3000)
    │
    ▼
[Morgan] ─── Logs: "GET /api/orders 200 45ms"
    │
    ▼
[JSON Parser] ─── Converts request body from JSON string to JavaScript object
    │
    ▼
[Route Handler] ─── Your actual business logic
    │
    ▼
[Error Handler] ─── Catches any unhandled errors
    │
    ▼
Response sent back to frontend
```

### Authentication (Current State)

Authentication is **not fully implemented**. The current setup:

- Backend has a `jwt` config placeholder in `config/index.js` with a development secret key
- Auth routes (`/api/auth/login`, `/api/auth/register`) return **hardcoded mock responses** with a fake JWT token
- Most "dual-mode" routes use `x-user-id` HTTP header to identify users, defaulting to `'user-1'`
- Frontend uses **localStorage** for authentication state (via `UserModeContext`)
- Login on the frontend stores organization data in localStorage; logout clears it
- There is no real password verification, JWT validation, or session management yet

---

## 6. Frontend - The User Interface

### How Pages Work (Next.js App Router)

Every folder inside `frontend/src/app/` with a `page.tsx` file becomes a URL route:

| File Path | URL | What It Shows |
|---|---|---|
| `app/page.tsx` | `/` | Landing page (public homepage) |
| `app/dashboard/page.tsx` | `/dashboard` | Main dashboard (after login) |
| `app/my-orders/page.tsx` | `/my-orders` | Order management |
| `app/cost-calculator/page.tsx` | `/cost-calculator` | Landed cost calculator |
| `app/cost-calculator/history/page.tsx` | `/cost-calculator/history` | Calculation history |
| `app/cost-calculator/results/[id]/page.tsx` | `/cost-calculator/results/abc123` | Single calculation result |
| `app/our-vendors/page.tsx` | `/our-vendors` | Saved suppliers |
| `app/smart-sourcing/page.tsx` | `/smart-sourcing` | AI supplier search |
| `app/track-shipment/page.tsx` | `/track-shipment` | Track shipments |
| `app/compliance-tools/page.tsx` | `/compliance-tools` | Compliance dashboard |
| `app/market-insights/page.tsx` | `/market-insights` | Market trends |
| `app/exim-data/page.tsx` | `/exim-data` | Import/export data browser |
| `app/chat-support/page.tsx` | `/chat-support` | Chat support |
| `app/ai-assistant/page.tsx` | `/ai-assistant` | AI trade assistant |
| `app/team-management/page.tsx` | `/team-management` | Team & roles |
| `app/settings/page.tsx` | `/settings` | Account settings |
| `app/reports/page.tsx` | `/reports` | Reports |
| `app/onboarding/page.tsx` | `/onboarding` | New user setup |
| `app/services/page.tsx` | `/services` | Services overview (public) |
| `app/about/page.tsx` | `/about` | About page (public) |
| `app/contact/page.tsx` | `/contact` | Contact page (public) |
| `app/payments/new/page.tsx` | `/payments/new` | Make a payment |
| `app/payments/history/page.tsx` | `/payments/history` | Payment history |
| `app/payments/fx-rates/page.tsx` | `/payments/fx-rates` | Foreign exchange rates |
| `app/payments/methods/page.tsx` | `/payments/methods` | Payment methods |

### Layout System

```
RootLayout (layout.tsx)
  │
  ├── ThemeProvider ─── Manages dark/light theme
  │     │
  │     └── UserProvider ─── Manages auth state, organization data
  │           │
  │           ├── PublicLayout ─── For public pages (homepage, services, about)
  │           │     ├── Header (with navigation)
  │           │     ├── Page content
  │           │     └── Footer
  │           │
  │           └── AppLayout ─── For authenticated pages (dashboard, orders, etc.)
  │                 ├── Sidebar (desktop, hidden below 1024px)
  │                 ├── TopBar (breadcrumb + actions)
  │                 ├── Page content
  │                 ├── MobileDrawer (shown below 1024px, slide-out menu)
  │                 └── BottomNav (shown below 768px, fixed bottom bar)
```

### Responsive Design (Mobile/Tablet/Desktop)

The app uses the `useMobile()` hook to detect screen size:

| Breakpoint | Classification | What Changes |
|---|---|---|
| > 1024px | **Desktop** | Full sidebar visible, multi-column layouts |
| 768px - 1024px | **Tablet** | Sidebar hidden, MobileDrawer for navigation, adapted layouts |
| < 768px | **Mobile** | BottomNav shown, single-column layouts, compact cards |
| < 480px | **Small Mobile** | Extra compact, reduced padding/margins |

### Styling Approach

The frontend uses **three** styling methods together:

1. **Tailwind CSS** (`globals.css`) - For global utility classes and base styles. Uses `@apply` for reusable patterns
2. **styled-jsx** (`<style jsx>` blocks) - For page-specific styles. Each page has a `<style jsx>` block at the bottom with its own CSS, including media queries
3. **Radix UI + CVA** - For reusable UI components (buttons, inputs, cards) using the `class-variance-authority` pattern

### State Management

There is **no Redux or Zustand**. State is managed through:

1. **React Context** (`UserModeContext`) - Global auth state, organization data, sidebar preferences
2. **React `useState`** - Local component state (form inputs, modal open/close, filters)
3. **localStorage** - Persistent browser storage for:
   - User session data (`befach-user`)
   - Sidebar preferences (`befach-sidebar-prefs`)
   - Onboarding completion (`befach-onboarding`)
   - Tour completion (`befach-tour`)
   - Theme preference (`befach-theme`)
   - Calculator history backup (`befach-calculations-v2`)
   - Compliance BOE records, licenses, notifications
4. **Service classes** - `calculatorService`, `marketDataService`, `eximDataService` encapsulate data fetching logic

---

## 7. How Frontend Talks to Backend (API Calls)

### The Connection

```
Frontend (localhost:3000)  ──── HTTP requests ────>  Backend (localhost:5000)
       Next.js                     (fetch API)              Express.js
```

- Frontend uses the browser's native **`fetch()` API** to make HTTP requests
- The base URL is configured via the environment variable `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:5000/api`
- Backend has **CORS** configured to accept requests from `http://localhost:3000`

### The Service Layer Pattern

The frontend doesn't call the backend directly from page components. Instead, it uses **service files** that act as middlemen:

```
Page Component
    │
    ▼
Service File (e.g., calculatorService.ts)
    │
    ├── Try: fetch() to backend API
    │         │
    │         ├── Success: Return data
    │         └── Failure: Fall back to localStorage
    │
    └── Return data to component
```

**Example flow for saving a calculation:**

```typescript
// In the component:
const result = await calculatorService.saveCalculation(input, result);

// Inside calculatorService.saveCalculation():
// 1. Try POST to http://localhost:5000/api/calculator/calculations
// 2. If successful, also save to localStorage as backup
// 3. If backend fails, save to localStorage only and return that
```

### Which Pages Call the Backend vs. Use Mock Data

| Page | Data Source | How |
|---|---|---|
| Cost Calculator | **Backend API** (with localStorage fallback) | `calculatorService.ts` calls `/api/calculator/*` |
| Orders (my-orders) | **Backend API** | Direct `fetch()` to `/api/orders` |
| Suppliers (our-vendors) | **Backend API** | Direct `fetch()` to `/api/suppliers` |
| Market Insights | **Frontend mock data** | `marketData.ts` returns hardcoded data with simulated delays |
| EXIM Data | **Frontend mock data** | `eximDataService.ts` has 50 hardcoded shipment records |
| Compliance Tools | **Frontend localStorage** | `complianceService.ts` reads/writes localStorage + static compliance database |
| Shipment Tracking | **Backend mock API** | Calls `/api/shipments` which returns hardcoded shipments |
| Chat Support | **Backend in-memory** | Calls `/api/chat/messages` (lost on restart) |
| AI Assistant | **Backend mock** | Calls `/api/ai/chat` which does simple keyword matching |
| Team Management | **Backend in-memory** | Calls `/api/team/*` (lost on restart) |
| User Profile | **Backend in-memory** + **Frontend localStorage** | Mixed approach |
| Dashboard | **Mixed** | Aggregates data from multiple sources |

---

## 8. What Happens When You Click Things

### Clicking "Get Started" on the Homepage

```
1. User clicks "Get Started" button on landing page (app/page.tsx)
2. Router navigates to /onboarding
3. Onboarding page shows a multi-step form:
   Step 1: Enter company name and type (individual/company)
   Step 2: Select team size
   Step 3: Choose primary goals (source products, track shipments, etc.)
4. On submit:
   - login() is called from UserModeContext
   - Organization data is saved to localStorage
   - isAuthenticated becomes true
   - completeOnboarding() is called
   - Router navigates to /dashboard
5. Dashboard loads, showing welcome message and summary stats
```

### Clicking "Calculate" in the Cost Calculator

```
1. User fills the landed cost form:
   - Product name, HSN code, FOB value, origin country, shipping method
2. User clicks "Calculate Landed Cost" button
3. Frontend calculates locally:
   - Looks up duty rates from the built-in HSN database
   - Calculates: CIF = FOB + Freight + Insurance
   - Calculates: Basic Duty = CIF x BCD rate
   - Calculates: Social Welfare = Basic Duty x 10%
   - Calculates: IGST = (CIF + Basic Duty + SWS) x IGST rate
   - Calculates: Landed Cost = CIF + Total Duty
4. Results page shows with a waterfall chart and pie chart breakdown
5. calculatorService.saveCalculation() is called:
   - Sends POST to /api/calculator/calculations
   - Backend saves to data/calculations.json file
   - Also saves to localStorage as backup
6. User can view history at /cost-calculator/history
```

### Clicking "Create Order" in My Orders

```
1. User clicks "Create Order" button
2. A modal/form opens asking for:
   - Product name, HSN code, quantity, unit
   - Supplier (dropdown from saved suppliers)
   - FOB value, currency, origin country, destination port
3. On submit:
   - Frontend sends POST /api/orders with form data
   - Backend validates (product and quantity required)
   - Backend generates order number (e.g., "ORD-4523001")
   - Prisma creates a new row in the orders table
   - Backend returns the created order
4. Order appears in the list with status "Processing"
5. User can update status by clicking on the order
```

### Clicking "Search" in Smart Sourcing (Supplier Search)

```
1. User types a product query (e.g., "LED bulbs")
2. User selects filters (country, category)
3. On search:
   - Frontend displays supplier cards from its local search data
   - Results show supplier name, country, rating, specialization
4. User can click "View Details" to see full supplier profile
5. User can click "Save Supplier" to add to their vendor list:
   - Sends POST /api/suppliers with supplier details
   - Prisma creates a new row in the suppliers table
6. Saved supplier appears in /our-vendors page
```

### Clicking a Sidebar Navigation Item

```
1. User clicks "Market Insights" in the sidebar
2. Next.js router navigates to /market-insights (client-side navigation, no full page reload)
3. Page component mounts
4. useEffect fires on mount:
   - marketDataService.getMarketData() is called
   - Returns mock commodity data with simulated 500ms delay
5. Loading skeleton shows during the delay
6. Data populates: market overview cards, trending commodities table, price charts
7. User can filter by category, origin, sort by price/change/volume
```

### Clicking "Track" in Shipment Tracking

```
1. User enters a tracking number (e.g., "MSKU4523789012")
2. Clicks "Track Shipment"
3. Frontend sends POST /api/shipments/track with the tracking number
4. Backend searches its mock shipment array
5. If found: returns shipment details + timeline (Order Placed -> Shipped -> In Transit -> Customs -> Delivered)
6. If not found: returns a generic "Tracking initiated" response
7. Frontend displays the shipment card with status timeline
```

### Clicking "Log Out"

```
1. User clicks logout button (in sidebar or settings)
2. logout() function from UserModeContext fires:
   - Sets isAuthenticated to false
   - Clears organization, subscription state
   - Removes all localStorage keys:
     - befach-user
     - befach-sidebar-prefs
     - befach-onboarding
     - befach-tour
   - Router navigates to / (homepage)
3. Since isAuthenticated is false, any attempt to visit /dashboard
   triggers a redirect back to /
```

---

## 9. All API Endpoints (Complete List)

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Returns server status and timestamp |

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Mock (TODO) |
| POST | `/api/auth/login` | Login | Mock (TODO) |
| POST | `/api/auth/logout` | Logout | Mock (TODO) |
| GET | `/api/auth/me` | Get current user | Mock (TODO) |

### Orders (`/api/orders`) - LIVE DATABASE

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List all orders + stats (total, by status, total value) |
| GET | `/api/orders/:id` | Get single order with supplier and user details |
| POST | `/api/orders` | Create new order (requires: product, quantity) |
| PUT | `/api/orders/:id` | Update order (any fields) |
| DELETE | `/api/orders/:id` | Delete an order |

### Suppliers (`/api/suppliers`) - LIVE DATABASE

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/suppliers` | List all suppliers sorted by rating + stats |
| GET | `/api/suppliers/:id` | Get supplier with recent orders |
| POST | `/api/suppliers` | Add new supplier (requires: name) |
| PUT | `/api/suppliers/:id` | Update supplier details |
| DELETE | `/api/suppliers/:id` | Delete supplier |
| POST | `/api/suppliers/match` | Find matching suppliers by product/category/countries |

### Calculator (`/api/calculator`) - FILE-BASED STORAGE

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/calculator/landed-cost` | Calculate landed cost (uses HSN duty rates) |
| GET | `/api/calculator/duty-rates/:hsnCode` | Get duty rates for an HSN code |
| GET | `/api/calculator/stats` | Get calculator usage statistics |
| POST | `/api/calculator/calculations` | Save a calculation |
| GET | `/api/calculator/calculations` | List calculations (paginated, searchable, sortable) |
| GET | `/api/calculator/calculations/:id` | Get single calculation |
| PUT | `/api/calculator/calculations/:id` | Update a calculation |
| DELETE | `/api/calculator/calculations/:id` | Delete a calculation |
| GET | `/api/calculator/recent` | Get recent calculations |
| GET | `/api/calculator/dashboard-stats` | Get dashboard summary stats |
| POST | `/api/calculator/calculations/sync` | Sync localStorage data to backend |

### Shipments (`/api/shipments`) - MOCK DATA

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shipments` | List all shipments + stats |
| GET | `/api/shipments/:id` | Get single shipment |
| POST | `/api/shipments/track` | Track a shipment by tracking number |

### Compliance (`/api/compliance`) - MOCK DATA

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compliance/boe` | List all BOE records + stats |
| GET | `/api/compliance/boe/:id` | Get single BOE record |
| POST | `/api/compliance/boe` | File a new Bill of Entry |
| GET | `/api/compliance/regulations` | Get current regulatory alerts |

### Market (`/api/market`) - MOCK DATA

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/market/insights` | Get market insights + trending products |
| GET | `/api/market/products/:hsn` | Get market data for a product by HSN code |
| GET | `/api/market/opportunities` | Get market opportunities and alerts |

### AI Assistant (`/api/ai`) - MOCK RESPONSES

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Ask a trade question (keyword-matched responses) |
| GET | `/api/ai/recent` | Get recent AI queries |
| GET | `/api/ai/stats` | Get AI assistant usage stats |
| GET | `/api/ai/popular` | Get popular questions |

### User (`/api/user`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get user profile |
| POST | `/api/user/login` | Create/login user (simplified) |
| POST | `/api/user/logout` | Logout |
| PUT | `/api/user/profile` | Update profile (name, email, phone) |
| PUT | `/api/user/organization` | Update organization details |
| GET | `/api/user/preferences` | Get user preferences |
| PUT | `/api/user/preferences/sidebar` | Update sidebar preferences |
| PUT | `/api/user/preferences/notifications` | Update notification preferences |
| POST | `/api/user/onboarding/complete` | Mark onboarding as complete |
| POST | `/api/user/onboarding/complete-tour` | Mark guided tour as complete |
| GET | `/api/user/subscription` | Get subscription details |
| POST | `/api/user/subscription/upgrade` | Upgrade subscription plan |

### Requirements (`/api/requirements`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requirements` | Submit a new sourcing requirement |
| GET | `/api/requirements` | List user's requirements (filterable, paginated) |
| GET | `/api/requirements/:id` | Get requirement details with quotes |
| POST | `/api/requirements/:id/quotes/:quoteId/accept` | Accept a supplier quote |
| DELETE | `/api/requirements/:id` | Cancel a requirement |

### Chat (`/api/chat`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/messages` | Send a message (returns bot response) |
| GET | `/api/chat/messages` | Get chat history |
| GET | `/api/chat/quick-actions` | Get available quick action buttons |
| DELETE | `/api/chat/messages` | Clear chat history |
| POST | `/api/chat/request-agent` | Request a human support agent |

### Team (`/api/team`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/team/members` | List team members |
| POST | `/api/team/invite` | Invite a new team member |
| GET | `/api/team/invitations` | List pending invitations |
| PUT | `/api/team/members/:id/role` | Change member role |
| DELETE | `/api/team/members/:id` | Remove a team member |
| DELETE | `/api/team/invitations/:id` | Cancel an invitation |
| POST | `/api/team/invitations/:id/resend` | Resend an invitation |

### Reports (`/api/reports`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports` | List saved reports |
| GET | `/api/reports/summary` | Get summary statistics |
| POST | `/api/reports/generate` | Generate a new report (orders, spending, suppliers, compliance) |
| GET | `/api/reports/:id` | Get report status |
| GET | `/api/reports/:id/download` | Download report as CSV |
| DELETE | `/api/reports/:id` | Delete a report |

### API Keys (`/api/api-keys`) - IN-MEMORY

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/api-keys` | Create a new API key |
| GET | `/api/api-keys` | List API keys (masked) |
| DELETE | `/api/api-keys/:id` | Revoke an API key |
| POST | `/api/api-keys/:id/regenerate` | Regenerate an API key |
| GET | `/api/api-keys/webhooks` | Get webhook settings |
| PUT | `/api/api-keys/webhooks` | Update webhook settings |
| POST | `/api/api-keys/webhooks/test` | Send a test webhook |
| POST | `/api/api-keys/webhooks/reveal-secret` | Reveal webhook secret |

---

## 10. Current Status & Known Issues

### What's Working (Production-Ready)

- Landing page and public pages
- Onboarding flow
- Dashboard layout with responsive design
- Orders CRUD (full database integration)
- Suppliers CRUD (full database integration)
- Cost Calculator (with backend storage + localStorage fallback)
- Sidebar navigation with pinning, collapsing, responsive drawer
- Dark/Light theme toggle
- Mobile-responsive layouts across all pages
- EXIM data browser with filtering, sorting, pagination
- Market insights with charts
- Compliance tools with HSN lookup and license tracking

### What's Partially Working (Mock/Demo Data)

- **Authentication** - No real login. Frontend uses localStorage; backend returns hardcoded responses
- **Shipment Tracking** - Backend returns 5 hardcoded shipments
- **AI Assistant** - Simple keyword matching, not connected to a real AI model
- **Chat Support** - Bot responses are pre-written, no real AI or human agent connection
- **Market Data** - All commodity prices, trends, and news are mock data generated in the frontend
- **EXIM Data** - 50 hardcoded shipment records; no real trade data API connection

### What's Not Persistent (Lost on Server Restart)

The following features use **in-memory storage** on the backend. Data is lost every time the server restarts:

- User profiles and preferences
- Chat message history
- Sourcing requirements and quotes
- Team member data and invitations
- Generated reports
- API keys and webhook configurations

### Known Technical Issues

1. **No real authentication** - Anyone can access any data. No password hashing, no JWT validation
2. **TypeScript build errors ignored** - `next.config.js` has `ignoreBuildErrors: true`
3. **ESLint errors ignored** - `next.config.js` has `ignoreDuringBuilds: true`
4. **No rate limiting** - Config exists but isn't applied as middleware
5. **No input sanitization** - Backend doesn't sanitize user input against XSS
6. **No file upload** - No mechanism for uploading documents/images
7. **Calculator has limited HSN codes** - Only 7 HSN codes have duty rates; others use defaults
8. **No email integration** - Team invitations, notifications don't actually send emails
9. **No payment processing** - Payment pages are UI-only, no Razorpay/Stripe integration

---

## 11. How to Run the Project

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A **PostgreSQL** database (or Supabase account)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

Generate Prisma client and start the server:

```bash
npx prisma generate
npx prisma db push        # Creates tables in your database
npm run dev                # Starts with nodemon (auto-restart on changes)
```

The backend will be running at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder (optional, defaults to localhost):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`.

### Quick Verification

1. Open `http://localhost:5000/api/health` - Should show `{"status":"ok"}`
2. Open `http://localhost:3000` - Should show the landing page
3. Click "Get Started" and complete onboarding
4. Navigate to Dashboard, Orders, Suppliers, Cost Calculator

---

*This document was last updated on February 10, 2026. As features are added or migrated to the database, this document should be updated accordingly.*
