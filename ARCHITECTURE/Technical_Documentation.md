# BEFACH International - Project Documentation

## Overview

BEFACH International is a **full-stack AI-powered trade intelligence platform** designed for B2B import/export operations. The platform enables users to discover suppliers, calculate import costs with duties and taxes, track shipments, manage customs compliance, and get AI-assisted trade intelligence.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 14.0.4 |
| UI Library | React | 18.2.0 |
| Language (Frontend) | TypeScript | 5.3.0 |
| Styling | Custom CSS | - |
| Backend Framework | Express.js | 4.18.2 |
| Runtime | Node.js | 18+ |
| Security | Helmet.js | 7.1.0 |
| CORS | cors | 2.8.5 |
| Logging | Morgan | 1.10.0 |
| Env Config | dotenv | 16.3.1 |

---

## Project Structure

```
befach/
├── frontend/                 # Next.js 14 React application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   └── components/      # Reusable React components
│   │       ├── layout/      # Layout components (AppLayout, TopBar, Sidebar)
│   │       └── ui/          # UI components (Modal, DataTable, StatCard)
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                  # Express.js Node.js API server
│   ├── src/
│   │   ├── routes/          # API endpoint handlers
│   │   ├── config/          # Configuration files
│   │   └── index.js         # Main server entry point
│   └── package.json
│
└── README.md
```

---

## Frontend Architecture

### Pages & Routes

All pages use Next.js 14 App Router and are located in `frontend/src/app/`:

| Route | Purpose |
|-------|---------|
| `/` | Landing page with features, testimonials, and stats |
| `/dashboard` | Main user dashboard with KPIs and analytics |
| `/market-insights` | Trade intelligence and market data visualization |
| `/smart-sourcing` | Supplier matching and RFQ generation |
| `/logistics-tracking` | Shipment tracking across multiple carriers |
| `/cost-calculator` | Landed cost calculation tool |
| `/compliance-tools` | BOE filing and customs clearance management |
| `/ai-assistant` | AI chatbot for trade queries |
| `/my-orders` | Order management interface |
| `/saved-suppliers` | Supplier network management |
| `/settings` | User account settings |

### Component Architecture

**Layout Components:**
- **AppLayout.tsx** - Main wrapper with TopBar, Sidebar, and modal management
- **TopBar.tsx** - Header with search, dark mode toggle, and user auth
- **Sidebar.tsx** - Navigation sidebar with dynamic route highlighting

**UI Components:**
- **ThemeProvider.tsx** - Light/dark theme context with localStorage persistence
- **DataTable.tsx** - Generic table with custom column definitions
- **Modal.tsx** - Reusable modal dialog for forms
- **StatCard.tsx** - KPI display cards with gradient backgrounds
- **DarkModeToggle.tsx** - Theme switcher button

### State Management

- Local state via React `useState` for UI interactions
- Context API for theme management (`ThemeProvider`/`useTheme`)
- Server-side rendering with `'use client'` directives for interactive components

### Styling

- Global CSS in `globals.css`
- CSS Grid/Flexbox for layouts
- Responsive breakpoints: Desktop (1200px+), Tablet (768-1199px), Mobile (<768px)
- Status badges with color-coded states
- Inter font from Google Fonts

---

## Backend Architecture

### Server Configuration

**Entry Point:** `backend/src/index.js`

- **Port:** 5000 (configurable via `PORT` env var)
- **CORS:** Configured for `http://localhost:3000` (development)

**Middleware Stack:**
1. `helmet()` - Security headers
2. `cors()` - Cross-origin requests
3. `morgan('dev')` - HTTP request logging
4. `express.json()` - JSON body parsing
5. `express.urlencoded()` - Form data parsing

### API Routes

#### Authentication (`/api/auth`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/logout` | Logout user |
| GET | `/me` | Get current user |

#### Orders (`/api/orders`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all orders with stats |
| GET | `/:id` | Get single order |
| POST | `/` | Create new order |
| PUT | `/:id` | Update order status |
| DELETE | `/:id` | Delete order |

#### Suppliers (`/api/suppliers`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all suppliers with stats |
| GET | `/:id` | Get single supplier |
| POST | `/` | Add new supplier |
| POST | `/match` | Match suppliers to product |

#### Shipments (`/api/shipments`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all shipments with stats |
| GET | `/:id` | Get single shipment |
| POST | `/track` | Track shipment with timeline |

#### Cost Calculator (`/api/calculator`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/landed-cost` | Calculate final landed cost |
| GET | `/duty-rates/:hsn` | Get HSN duty rates |
| GET | `/stats` | Get calculator statistics |

**Cost Calculation Breakdown:**
- FOB Value (base price)
- Freight (8% sea, 15% air)
- Insurance (1%)
- CIF Value (FOB + Freight + Insurance)
- Basic Customs Duty (BCD by HSN)
- Social Welfare Surcharge (10% of BCD)
- IGST (18% or 5% by HSN)
- Total Duty + Landed Cost

#### Compliance (`/api/compliance`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/boe` | Get all BOE records |
| GET | `/boe/:id` | Get single BOE record |
| POST | `/boe` | File new BOE |
| GET | `/regulations` | Get regulations & alerts |

#### Market Intelligence (`/api/market`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/insights` | Get trending products & global stats |
| GET | `/products/:hsn` | Get product market data with trends |
| GET | `/opportunities` | Get market opportunities & alerts |

#### AI Assistant (`/api/ai`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat` | Chat with AI assistant |
| GET | `/recent` | Get recent queries |
| GET | `/stats` | Get AI statistics |
| GET | `/popular` | Get popular questions |

---

## Key Processes & Workflows

### 1. Import Order Management Workflow

```
Create Order → Supplier Matching → Cost Calculation → Shipment → Customs Clearance → Delivery
```

**Process Flow:**
1. User creates an order via `POST /api/orders`
2. System matches suppliers via `POST /api/suppliers/match`
3. Landed cost calculated via `POST /api/calculator/landed-cost`
4. Shipment tracked via `POST /api/shipments/track`
5. BOE filed via `POST /api/compliance/boe`
6. Delivery confirmed via `GET /api/shipments/:id`

### 2. Supplier Discovery & Verification

```
Search by Product → Get Market Insights → Match Suppliers → View Details → Request Quote → Save
```

**Process Flow:**
1. Get market data via `GET /api/market/products/:hsn`
2. Match suppliers via `POST /api/suppliers/match`
3. View supplier details via `GET /api/suppliers/:id`
4. Add to saved suppliers

### 3. Compliance & Duty Calculation

```
Get HSN Code → Calculate Landed Cost → File BOE → Track Status → Receive Clearance
```

**Process Flow:**
1. Get duty rates via `GET /api/calculator/duty-rates/:hsn`
2. Calculate cost via `POST /api/calculator/landed-cost`
3. File BOE via `POST /api/compliance/boe`
4. Check status via `GET /api/compliance/boe/:id`
5. Monitor regulations via `GET /api/compliance/regulations`

### 4. Dashboard Intelligence

Real-time display of:
- Import value metrics
- Active orders count
- Verified supplier count
- Cost savings percentage
- Market trends
- Price alerts

### 5. AI-Assisted Query Resolution

```
User Question → Keyword Matching → FAQ Response → Related Topics → Query Logged
```

**Supported Topics:**
- Import duties
- Shipping methods
- Supplier verification
- BOE filing process
- Customs regulations

---

## Data Models

### Order
```javascript
{
  id: "ORD-XXXX",
  product: string,
  quantity: number,
  supplier: string,
  value: number,           // USD
  status: string,          // Processing, In Transit, Customs, Delivered
  date: string             // YYYY-MM-DD
}
```

### Supplier
```javascript
{
  id: number,
  name: string,
  location: string,        // City, Country
  specialization: string,  // Product categories
  rating: number,          // 4.5 - 4.9
  orders: number,          // Historical order count
  status: string,          // Active, Pending Quote, Pending Verification
  verified: boolean
}
```

### Shipment
```javascript
{
  id: string,              // Tracking number
  orderId: string,
  origin: string,
  destination: string,
  carrier: string,         // Maersk, CMA CGM, OOCL, Hapag-Lloyd, MSC
  eta: string,
  status: string,          // In Transit, Customs Clearance, Port Arrival, Delivered
  timeline: [{
    status: string,
    date: string,
    completed: boolean
  }]
}
```

### Cost Calculation Result
```javascript
{
  productName: string,
  hsnCode: string,
  hsnDescription: string,
  originCountry: string,
  shippingMethod: string,  // "air" | "sea"
  breakdown: {
    fobValue: number,
    freight: number,
    insurance: number,
    cifValue: number,
    basicDuty: number,
    socialWelfareSurcharge: number,
    igst: number,
    totalDuty: number,
    landedCost: number
  },
  rates: {
    bcd: number,           // Basic Customs Duty %
    igst: number           // IGST %
  }
}
```

### BOE (Bill of Entry)
```javascript
{
  boeNumber: string,
  importId: string,
  product: string,
  hsnCode: string,
  port: string,
  invoiceValue: number,
  dutyPaid: number,
  filedDate: string,
  status: string           // Cleared, Under Review, Pending Docs, Filed
}
```

---

## Frontend-Backend Communication

### API Response Format
All API responses follow a consistent structure:
```javascript
{
  success: true/false,
  data: { /* response data */ },
  message: "Optional message",
  timestamp: "ISO datetime",
  stats: { /* optional statistics */ }
}
```

### Communication Flow
1. Frontend pages use `fetch()` API for HTTP requests
2. Backend runs on `http://localhost:5000`
3. CORS configured to accept requests from `http://localhost:3000`
4. JSON format for request/response bodies

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=mongodb://...     # Not yet implemented
JWT_SECRET=your-secret-key     # Not yet implemented
```

---

## Running the Project

### Frontend
```bash
cd frontend
npm install
npm run dev    # Development server on http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev    # Development server on http://localhost:5000
```

---

## Current Development Status

### Completed
- Full frontend UI with 11 main pages
- All API route structures defined
- Mock data for all endpoints
- Component architecture
- Theme switching (light/dark mode)
- Responsive design
- Form modals for user interactions
- Dashboard with KPIs

### Pending Implementation
- User authentication (JWT tokens, sessions)
- Database integration (MongoDB)
- Data persistence (currently mock data only)
- Real AI integration (currently keyword matching)
- Email notifications
- Pagination for data tables
- Advanced search/filtering
- User profile management

---

## Supported HSN Codes

| HSN Code | Description | BCD | IGST |
|----------|-------------|-----|------|
| 8539 | LED Bulbs | 10% | 18% |
| 8504 | Power Banks | 15% | 18% |
| 5208 | Textiles | 20% | 5% |
| 8518 | Audio Equipment | 15% | 18% |
| 8541 | Solar Cells | 0% | 5% |
| 8517 | Mobile Accessories | 15% | 18% |
| 8542 | Electronic ICs | 0% | 18% |

---

## Key Features

1. **Market Intelligence** - Real-time trade data, price trends, and market opportunities
2. **Smart Sourcing** - AI-powered supplier matching and RFQ generation
3. **Logistics Tracking** - Multi-carrier shipment tracking with timeline visualization
4. **Cost Calculator** - Comprehensive landed cost calculation with duty breakdown
5. **Compliance Tools** - BOE filing and customs regulation management
6. **AI Assistant** - Intelligent chatbot for trade-related queries
7. **Order Management** - End-to-end order tracking and management
8. **Supplier Network** - Verified supplier database with ratings and history
