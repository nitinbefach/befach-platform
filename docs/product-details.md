# BEFACH International - Product Details Document

## Executive Summary

**Product Name:** BEFACH International
**Product Type:** AI-Powered B2B Trade Intelligence Platform
**Target Market:** Indian Importers & International Trade Businesses
**Current Status:** Foundation Phase (UI Complete, Backend Structure Ready)

BEFACH International is a comprehensive trade intelligence platform designed to streamline B2B import/export operations. The platform combines landed cost calculation, supplier relationship management, shipment tracking, market intelligence, and compliance tools into a unified solution.

---

## Table of Contents

1. [Product Vision & Goals](#1-product-vision--goals)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Feature Modules](#4-feature-modules)
5. [User Flows](#5-user-flows)
6. [Component Library](#6-component-library)
7. [Data Models & Types](#7-data-models--types)
8. [API Specifications](#8-api-specifications)
9. [Page Structure](#9-page-structure)
10. [State Management](#10-state-management)
11. [Third-Party Integrations](#11-third-party-integrations)
12. [Security & Compliance](#12-security--compliance)
13. [Performance Metrics](#13-performance-metrics)
14. [Future Roadmap](#14-future-roadmap)

---

## 1. Product Vision & Goals

### Vision Statement
To become the leading trade intelligence platform for Indian importers, providing AI-powered insights and tools that simplify international trade operations.

### Core Value Propositions
1. **Cost Transparency** - Accurate landed cost calculations before importing
2. **Supplier Discovery** - AI-powered matching with verified suppliers
3. **Compliance Automation** - Simplified customs documentation and BOE filing
4. **Real-time Tracking** - Multi-carrier shipment visibility
5. **Market Intelligence** - EXIM data and commodity trends

### Target Users
| User Type | Description | Primary Needs |
|-----------|-------------|---------------|
| **Importers** | Small to large Indian import businesses | Cost calculation, supplier sourcing, compliance |
| **Trade Managers** | Professionals managing import operations | Order tracking, vendor management, reports |
| **Compliance Officers** | Staff handling customs documentation | BOE filing, HS codes, duty rates |
| **Procurement Teams** | Teams sourcing international suppliers | Supplier matching, RFQ management |

### Success Metrics
- 500K+ shipments tracked
- 200+ countries covered
- 50+ carrier integrations
- 99.8% calculation accuracy
- 4.7/5 average supplier rating

---

## 2. Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with App Router |
| **React** | 18.2.0 | UI component library |
| **TypeScript** | 5.3.0 | Type-safe JavaScript |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **CSS Variables** | - | Theme management (dark/light) |
| **Recharts** | 3.5.1 | Data visualization |
| **jsPDF** | 3.0.4 | PDF generation and export |
| **Radix UI** | Latest | Accessible UI primitives |
| **Lucide React** | Latest | Icon library |
| **Inter Font** | Google | Typography |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.18.2 | REST API framework |
| **Node.js** | 18+ | JavaScript runtime |
| **Helmet.js** | 7.1.0 | Security headers |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Morgan** | 1.10.0 | HTTP request logging |
| **dotenv** | 16.6.1 | Environment configuration |
| **Prisma** | 7.0.1 | ORM (planned) |
| **PostgreSQL** | - | Database (Supabase planned) |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Git** | Version control |
| **npm** | Package management |

---

## 3. System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Frontend (Port 3000)              │  │
│  │  - 40+ Pages (App Router)                                 │  │
│  │  - 90+ React Components                                   │  │
│  │  - TypeScript + Tailwind CSS                              │  │
│  │  - localStorage State Management                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Express.js Backend (Port 5000)               │  │
│  │  - 14 Route Modules                                       │  │
│  │  - 80+ API Endpoints                                      │  │
│  │  - Middleware: Helmet, CORS, Morgan                       │  │
│  │  - JWT Authentication (planned)                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌─────────────────────┐    ┌─────────────────────────────┐    │
│  │   PostgreSQL        │    │   External Services         │    │
│  │   (Supabase)        │    │   - Carrier APIs            │    │
│  │   - Users           │    │   - Currency Exchange       │    │
│  │   - Orders          │    │   - HS Code Database        │    │
│  │   - Suppliers       │    │   - Port Database           │    │
│  │   - Calculations    │    │   - Payment Gateway         │    │
│  └─────────────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture
```
frontend/src/
├── app/                    # Next.js 14 App Router Pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── cost-calculator/   # Calculator module
│   ├── our-vendors/       # Vendor management
│   ├── my-orders/         # Order management
│   └── ...                # 40+ page directories
├── components/            # React Components
│   ├── layout/           # Layout components
│   ├── ui/               # Base UI components
│   ├── vendors/          # Vendor-specific components
│   ├── calculator/       # Calculator components
│   └── ...               # Feature-specific components
├── lib/                   # Utilities & Business Logic
│   ├── vendors.ts        # Vendor operations
│   ├── suppliers.ts      # Supplier database
│   ├── historyStorage.ts # Calculation storage
│   └── ...               # Other utilities
└── types/                 # TypeScript definitions
    ├── calculator.ts
    ├── market.ts
    └── compliance.ts
```

### Backend Architecture
```
backend/src/
├── index.js              # Application entry point
├── routes/               # API Route Handlers
│   ├── auth.js          # Authentication routes
│   ├── orders.js        # Order management
│   ├── suppliers.js     # Supplier operations
│   ├── shipments.js     # Shipment tracking
│   ├── calculator.js    # Cost calculations
│   ├── compliance.js    # BOE & regulations
│   ├── market.js        # Market intelligence
│   ├── ai.js            # AI assistant
│   └── ...              # 14 route modules
├── middleware/           # Express middleware
├── config/              # Configuration
└── prisma/              # Database schema (planned)
```

---

## 4. Feature Modules

### 4.1 Landed Cost Calculator

**Purpose:** Calculate total import costs including duties, taxes, and charges

#### Features
- Multi-step calculation wizard (4 steps)
- HSN code autocomplete with duty rates
- Multiple shipping modes (Sea, Air, Road)
- Currency conversion support
- Cost breakdown visualization (Pie chart, Waterfall chart)
- Calculation history with search and filters
- PDF export and sharing
- Template saving and loading
- CSV import/export
- Cost comparison tool

#### Calculation Formula
```
Landed Cost = CIF Value + Duties + Taxes

Where:
  CIF Value = FOB + Freight + Insurance

  Duties = Basic Customs Duty (BCD)
         + Social Welfare Surcharge (10% of BCD)
         + Anti-dumping Duty (if applicable)

  Taxes = IGST (on CIF + Duties)
```

#### HSN Code Duty Rates
| HSN Code | Product Category | BCD | IGST |
|----------|-----------------|-----|------|
| 8539 | LED Bulbs | 10% | 18% |
| 8504 | Power Banks | 15% | 18% |
| 5208 | Textiles | 20% | 5% |
| 8518 | Audio Equipment | 15% | 18% |
| 8541 | Solar Cells | 0% | 5% |
| 8517 | Mobile Accessories | 15% | 18% |
| 8542 | Electronic ICs | 0% | 18% |

### 4.2 Vendor Management (SRM)

**Purpose:** Manage supplier relationships with health scoring and pipeline tracking

#### Features
- Kanban board view by relationship stage
- Table view with expandable details
- Health score calculation (0-100 with A-F grades)
- Document management (contracts, certificates, quotes)
- Activity timeline tracking
- Performance history charts
- Stage transition workflow
- Tag management
- RFQ sending
- Notes and communication logs
- Bulk actions (export, delete)

#### Health Score System
```
Health Score = (Quality × 0.40) + (Delivery × 0.30)
             + (Response × 0.20) + (Compliance × 0.10)

Grades:
  A = 90-100 (Excellent)
  B = 75-89 (Good)
  C = 60-74 (Average)
  D = 40-59 (Below Average)
  F = 0-39 (Poor)
```

#### Relationship Stages
| Stage | Description |
|-------|-------------|
| `contacted` | Initial contact made |
| `negotiating` | Active negotiations |
| `deal_active` | Ongoing business relationship |
| `deal_completed` | Completed transactions |
| `on_hold` | Temporarily paused |
| `blocked` | Relationship terminated |

### 4.3 Smart Sourcing

**Purpose:** AI-powered supplier discovery and matching

#### Features
- Keyword-based supplier search
- Advanced filtering (category, country, certifications, ratings)
- Relevance scoring algorithm
- Supplier cards with key metrics
- Product catalogue browsing
- Bulk pricing tiers
- Direct messaging/chat
- Supplier comparison
- Invitation system for external suppliers
- Requirement broadcasting

#### Supplier Database
- **100+ verified suppliers** across 3 categories:
  - Electronics (35 suppliers) - LEDs, PCBs, batteries, solar panels
  - Health Supplements (33 suppliers) - Vitamins, protein, supplements
  - Consumer Electronics (32 suppliers) - Smartwatches, speakers, cables

#### Search Algorithm
```javascript
Relevance Score = (
  Keyword Match Weight +
  Category Match Bonus +
  Certification Match Bonus +
  Rating Factor +
  Lead Time Factor +
  Price Competitiveness
) / Max Possible Score × 100
```

### 4.4 Order Management

**Purpose:** Track and manage import orders end-to-end

#### Features
- Order creation and tracking
- Status management (Processing, In Transit, Customs, Delivered)
- Supplier linkage
- Value tracking with trends
- Order timeline
- Invoice management
- Smart alerts and notifications
- Export and reporting

#### Order Statistics
- Total Orders tracking
- In-Progress orders
- Completed orders
- Total spend/value
- On-time delivery percentage

### 4.5 Shipment Tracking

**Purpose:** Real-time multi-carrier shipment visibility

#### Features
- Universal tracking number lookup
- Multi-carrier support (DHL, FedEx, UPS, Shiprocket, Aramex)
- Real-time status updates
- Estimated delivery dates
- Route visualization
- Delay notifications
- Customs clearance status
- Proof of delivery

#### Supported Carriers
| Carrier | Type | Coverage |
|---------|------|----------|
| DHL | Express | Global |
| FedEx | Express | Global |
| UPS | Express | Global |
| Shiprocket | Domestic | India |
| Aramex | Express | Middle East, Asia |

### 4.6 Market Intelligence

**Purpose:** EXIM trade data and commodity insights

#### Features
- Trade data search by HS code, product, company
- Market volume and value statistics
- Price trend charts (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
- Top exporters/importers lists
- Commodity watchlist
- Price alerts
- Trade route analysis
- Market news and events
- Trend analysis (bullish/bearish)

#### Market Data Types
- Commodity prices and volumes
- Historical price data
- Trade route statistics
- Market overview metrics

### 4.7 Compliance Tools

**Purpose:** Customs documentation and regulatory compliance

#### Features
- Bill of Entry (BOE) creation and filing
- HS code lookup and classification
- Duty rate calculator
- License requirement checker
- Certificate management
- Regulatory updates
- Compliance checklist
- Document templates
- Query management

#### BOE Status Workflow
| Status | Description |
|--------|-------------|
| `draft` | BOE being prepared |
| `filed` | Submitted to customs |
| `under_assessment` | Being reviewed |
| `query_raised` | Additional info needed |
| `cleared` | Customs approved |
| `released` | Goods released |

#### Document Categories
- Licenses
- Certificates
- Commercial Invoices
- Bills of Lading
- Packing Lists
- Insurance Documents

### 4.8 AI Assistant

**Purpose:** Intelligent trade query assistant

#### Features
- Natural language query processing
- HS code classification help
- Duty rate inquiries
- Document generation assistance
- Trade regulation queries
- Supplier recommendations
- Cost estimation
- Compliance guidance
- Chat history

#### Query Types
- "What's the duty rate for HSN 8517?"
- "Help me classify my product"
- "What documents do I need for importing electronics?"
- "Find me LED bulb suppliers in China"

### 4.9 Requirements Management

**Purpose:** Manage sourcing requirements and supplier matches

#### Features
- Requirement creation with specifications
- Supplier matching (3-5 matches per requirement)
- Status tracking (matching → quoted → negotiating → completed)
- Timeline event logging
- Estimated time to completion
- Urgency levels
- Country preferences
- Quantity and price targets

#### Requirement Lifecycle
```
Create Requirement
      ↓
   Matching (Finding suppliers)
      ↓
   Quoted (Suppliers send quotes)
      ↓
   Negotiating (Price discussions)
      ↓
   Completed / Cancelled
```

### 4.10 Communication Hub

**Purpose:** Centralized supplier communication

#### Features
- Conversation management
- Message types (text, RFQ, quote, attachment, system)
- RFQ (Request for Quote) workflow
- Quote tracking
- Read receipts
- Conversation archiving
- Favorites
- Search and filtering

---

## 5. User Flows

### 5.1 New User Onboarding
```
Landing Page
    ↓
Sign Up / Login
    ↓
Onboarding Wizard
  ├── Company Profile Setup
  ├── Import Categories Selection
  ├── Notification Preferences
  └── Feature Tour
    ↓
Dashboard
```

### 5.2 Cost Calculation Flow
```
Cost Calculator Landing
    ↓
New Calculation
    ↓
Step 1: Product Details
  ├── Product Name
  ├── HSN Code (autocomplete)
  ├── FOB Value
  └── Currency
    ↓
Step 2: Shipping Information
  ├── Shipping Mode (Sea/Air/Road)
  ├── Origin Port
  ├── Destination Port
  ├── Freight Cost
  └── Insurance
    ↓
Step 3: Additional Costs
  ├── Packing Charges
  ├── Inland Freight
  ├── Bank Charges
  └── Custom Charges
    ↓
Step 4: Review & Calculate
  ├── Summary Review
  ├── Validation
  └── Calculate
    ↓
Results Page
  ├── Total Landed Cost
  ├── Cost Breakdown Chart
  ├── Detailed Components
  └── Export/Share/Save
    ↓
History (saved for future reference)
```

### 5.3 Supplier Sourcing Flow
```
Smart Sourcing
    ↓
Search (keyword/category)
    ↓
Filter Results
  ├── Country
  ├── Certifications
  ├── Rating
  ├── Lead Time
  └── Price Range
    ↓
View Supplier Cards
    ↓
Select Supplier
    ↓
┌─────────────────┬─────────────────┐
│  View Details   │   Start Chat    │
│  Modal          │   Window        │
└────────┬────────┴────────┬────────┘
         │                 │
         ↓                 ↓
   Save Supplier    Send RFQ / Message
         │                 │
         ↓                 ↓
   Our Vendors      Conversations
```

### 5.4 Vendor Management Flow
```
Our Vendors
    ↓
┌─────────────────┬─────────────────┐
│  Kanban View    │   Table View    │
└────────┬────────┴────────┬────────┘
         │                 │
         ↓                 ↓
   Drag & Drop       Expand Row
   Stage Change      View Details
         │                 │
         └────────┬────────┘
                  ↓
         Vendor Detail Drawer
           ├── Scorecard & Health
           ├── Activity Timeline
           ├── Documents
           ├── Performance Chart
           └── Actions (Message, RFQ, Notes)
                  ↓
         Stage Transition Modal
           ├── Select New Stage
           ├── Add Notes
           └── Confirm
```

### 5.5 Order Tracking Flow
```
My Orders
    ↓
View Order List
  ├── Filter by Status
  ├── Search
  └── Sort
    ↓
Select Order
    ↓
Order Details
  ├── Products
  ├── Supplier Info
  ├── Timeline
  └── Documents
    ↓
Track Shipment (if in transit)
    ↓
Shipment Tracking Page
  ├── Real-time Status
  ├── Route Map
  ├── ETA
  └── Carrier Info
```

### 5.6 Compliance Flow
```
Compliance Tools
    ↓
┌─────────────┬──────────────┬─────────────┐
│ BOE Filing  │ HS Lookup    │ Regulations │
└──────┬──────┴──────┬───────┴──────┬──────┘
       │             │              │
       ↓             ↓              ↓
  Create BOE    Search HS Code  View Rules
       │             │              │
       ↓             ↓              │
  Add Items    Get Duty Rates     │
       │             │              │
       ↓             ↓              │
  Calculate    View Requirements  │
  Duties            │              │
       │             │              │
       ↓             │              │
  Submit BOE ←───────┴──────────────┘
       │
       ↓
  Track Status
```

---

## 6. Component Library

### 6.1 Layout Components
| Component | File | Purpose |
|-----------|------|---------|
| AppLayout | `layout/AppLayout.tsx` | Main app wrapper with sidebar & header |
| PublicLayout | `layout/PublicLayout.tsx` | Public pages wrapper |
| Header | `layout/Header.tsx` | Top navigation bar |
| Sidebar | `layout/Sidebar.tsx` | Main navigation menu |
| TopBar | `layout/TopBar.tsx` | Secondary navigation |
| Footer | `layout/Footer.tsx` | Application footer |

### 6.2 Base UI Components
| Component | File | Purpose |
|-----------|------|---------|
| Button | `ui/Button.tsx` | Action buttons |
| Input | `ui/Input.tsx` | Text inputs |
| Card | `ui/Card.tsx` | Container cards |
| Modal | `ui/Modal.tsx` | Dialog modals |
| Table | `ui/Table.tsx` | Data tables |
| Badge | `ui/Badge.tsx` | Status badges |
| Tabs | `ui/Tabs.tsx` | Tabbed interfaces |
| Select | `ui/Select.tsx` | Dropdown selectors |
| Checkbox | `ui/Checkbox.tsx` | Checkboxes |
| Slider | `ui/Slider.tsx` | Range sliders |
| Toggle | `ui/Toggle.tsx` | Toggle switches |
| Popover | `ui/Popover.tsx` | Floating popovers |
| StatCard | `ui/StatCard.tsx` | Statistics cards |
| DataTable | `ui/DataTable.tsx` | Advanced data tables |
| FeatureCard | `ui/FeatureCard.tsx` | Feature showcases |
| Logo | `ui/Logo.tsx` | Brand logo |
| ThemeProvider | `ui/ThemeProvider.tsx` | Theme context |
| DarkModeToggle | `ui/DarkModeToggle.tsx` | Theme switcher |

### 6.3 Feature Components

#### Calculator Components
| Component | Purpose |
|-----------|---------|
| LandedCostForm | Main calculation form |
| CostBreakdown | Cost component breakdown |
| CalculationHistory | Saved calculations list |
| WizardProvider | Wizard state management |
| WizardProgress | Step progress indicator |
| WizardNavigation | Step navigation |
| CostPieChart | Cost distribution chart |
| WaterfallChart | Waterfall visualization |

#### Vendor Components
| Component | Purpose |
|-----------|---------|
| VendorDetailDrawer | Detailed vendor panel |
| VendorScorecard | Health metrics overview |
| HealthScoreBadge | Visual health display |
| PipelineKanban | Kanban board |
| KanbanColumn | Kanban column |
| KanbanCard | Kanban card |
| PerformanceChart | Performance trends |
| ActivityTimeline | Activity history |
| DocumentManager | Document management |

#### Supplier Components
| Component | Purpose |
|-----------|---------|
| SupplierFilters | Advanced filtering |
| SupplierPipelineStats | Pipeline metrics |
| StageTransitionModal | Stage change modal |
| RelationshipStageBadge | Stage status badge |

#### Search Components
| Component | Purpose |
|-----------|---------|
| HeroSearch | Large search interface |
| SearchFilters | Search criteria |
| SupplierCard | Supplier result card |
| SupplierModal | Supplier details |
| ContactModal | Contact information |
| ChatWindow | Real-time messaging |
| InviteSupplierModal | Invite suppliers |
| SubmitRequirementModal | Create requirement |

#### Market Components
| Component | Purpose |
|-----------|---------|
| MarketOverviewCard | Market summary |
| TrendingCommoditiesTable | Commodity trends |
| PriceChart | Price visualization |
| WatchlistWidget | Watchlist management |
| MarketFilters | Data filters |

#### Requirements Components
| Component | Purpose |
|-----------|---------|
| RequirementCard | Requirement display |
| RequirementFilters | Requirement filters |
| RequirementStats | Statistics dashboard |
| StatusBadge | Requirement status |
| EstimatedTime | Time estimation |

#### Other Components
| Component | Purpose |
|-----------|---------|
| ComplianceSearch | Compliance search |
| ComplianceResultCard | Compliance details |
| GuidedTour | Onboarding tour |
| DeleteConfirmModal | Deletion confirmation |
| ErrorBoundary | Error handling |

---

## 7. Data Models & Types

### 7.1 Core Entities

#### Calculation Record
```typescript
interface CalculationRecord {
  id: string;
  productName: string;
  hsnCode: string;
  fobValue: number;
  currency: string;
  shippingMode: 'sea' | 'air' | 'road';
  originPort: string;
  destinationPort: string;
  freightCost: number;
  insurance: number;
  basicCustomsDuty: number;
  socialWelfareSurcharge: number;
  igst: number;
  additionalCharges: AdditionalCharge[];
  totalLandedCost: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}
```

#### Vendor
```typescript
interface Vendor {
  id: string;
  name: string;
  company: string;
  location: string;
  country: string;
  category: string;
  stage: RelationshipStage;
  healthScore: number;
  rating: number;
  ordersCount: number;
  totalValue: number;
  lastOrderDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  specialization: string;
  tags: string[];
  notes: string;
  createdAt: string;
  stageHistory: StageHistoryEntry[];
}
```

#### Supplier
```typescript
interface Supplier {
  id: string;
  name: string;
  companyName: string;
  country: string;
  city: string;
  category: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  leadTime: string;
  minOrderValue: number;
  certifications: string[];
  catalogue: CatalogueProduct[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
  yearEstablished: number;
  employeeCount: string;
  exportCountries: string[];
  verified: boolean;
}
```

#### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  supplierId: string;
  supplierName: string;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  notes: string;
}
```

#### Requirement
```typescript
interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  targetPrice: number;
  currency: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  preferredCountries: string[];
  status: RequirementStatus;
  supplierMatches: SupplierMatch[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
```

### 7.2 Compliance Types

#### BOE Record
```typescript
interface BOERecord {
  id: string;
  boeNumber: string;
  date: string;
  importerName: string;
  importerIEC: string;
  portOfImport: string;
  countryOfOrigin: string;
  items: BOEItem[];
  totalCIF: number;
  totalDuty: number;
  totalIGST: number;
  totalAmount: number;
  status: BOEStatus;
  queries: BOEQuery[];
  documents: string[];
}
```

#### Compliance Requirement
```typescript
interface ComplianceRequirement {
  hsnCode: string;
  productDescription: string;
  requiredLicenses: License[];
  requiredCertificates: Certificate[];
  dutyRates: DutyRates;
  preferentialRates?: PreferentialRate[];
  restrictions?: string[];
  additionalRequirements?: string[];
}
```

### 7.3 Market Types

#### Commodity
```typescript
interface Commodity {
  id: string;
  hsnCode: string;
  name: string;
  category: CommodityCategory;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  priceHistory: PricePoint[];
  unit: string;
}
```

#### Market Overview
```typescript
interface MarketOverview {
  totalVolume: number;
  totalValue: number;
  activeMarkets: number;
  topExporters: string[];
  topImporters: string[];
  growthRate: number;
  lastUpdated: string;
}
```

---

## 8. API Specifications

### 8.1 Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### 8.2 Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |

### 8.3 Supplier APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | List suppliers |
| GET | `/api/suppliers/:id` | Get supplier details |
| POST | `/api/suppliers` | Add supplier |
| POST | `/api/suppliers/match` | AI supplier matching |

### 8.4 Shipment APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipments` | List shipments |
| GET | `/api/shipments/:id` | Get shipment details |
| POST | `/api/shipments/track` | Track shipment |

### 8.5 Calculator APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/calculator/landed-cost` | Calculate landed cost |
| GET | `/api/calculator/duty-rates/:hsn` | Get duty rates |
| GET | `/api/calculator/stats` | Get calculation stats |

### 8.6 Compliance APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/compliance/boe` | List BOE records |
| GET | `/api/compliance/boe/:id` | Get BOE details |
| POST | `/api/compliance/boe` | Create BOE |
| GET | `/api/compliance/regulations` | Get regulations |

### 8.7 Market APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/insights` | Market insights |
| GET | `/api/market/products/:hsn` | Product market data |
| GET | `/api/market/opportunities` | Trade opportunities |

### 8.8 AI Assistant APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send chat message |
| GET | `/api/ai/recent` | Recent conversations |
| GET | `/api/ai/stats` | AI usage stats |
| GET | `/api/ai/popular` | Popular queries |

### 8.9 Other APIs
| Module | Endpoints |
|--------|-----------|
| User | `/api/user/profile`, `/api/user/preferences` |
| Requirements | `/api/requirements`, `/api/requirements/:id` |
| Team | `/api/team/members`, `/api/team/invite` |
| Reports | `/api/reports`, `/api/reports/analytics` |
| API Keys | `/api/apikeys` |
| Chat | `/api/chat/conversations`, `/api/chat/message` |

### 8.10 API Response Format
```json
{
  "success": true,
  "data": { },
  "message": "Optional message",
  "timestamp": "2025-01-23T10:30:00Z",
  "stats": { }
}
```

---

## 9. Page Structure

### 9.1 Main Navigation Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Marketing landing page |
| Dashboard | `/dashboard` | Main analytics dashboard |
| About | `/about` | Company information |
| Contact | `/contact` | Contact form |

### 9.2 Solutions Pages
| Page | Route | Description |
|------|-------|-------------|
| Cost Calculator | `/cost-calculator` | Calculator landing |
| Calculator Step 1 | `/cost-calculator/new/step-1` | Product details |
| Calculator Step 2 | `/cost-calculator/new/step-2` | Shipping info |
| Calculator Step 3 | `/cost-calculator/new/step-3` | Additional costs |
| Calculator Step 4 | `/cost-calculator/new/step-4` | Review & calculate |
| Calculator Results | `/cost-calculator/results/[id]` | Result details |
| Calculator History | `/cost-calculator/history` | Saved calculations |
| Compliance Tools | `/compliance-tools` | Compliance hub |
| Market Insights | `/market-insights` | Trade data |
| Smart Sourcing | `/smart-sourcing` | Supplier search |
| AI Assistant | `/ai-assistant` | Trade chatbot |
| Logistics Tracking | `/logistics-tracking` | Shipment tracking |

### 9.3 Account Pages
| Page | Route | Description |
|------|-------|-------------|
| My Orders | `/my-orders` | Order management |
| Our Vendors | `/our-vendors` | Vendor SRM |
| Saved Suppliers | `/saved-suppliers` | Supplier network |
| My Requirements | `/my-requirements` | Sourcing requirements |
| Documents | `/documents` | Document management |
| Billing History | `/billing-history` | Payment records |
| Team Management | `/team-management` | Team members |
| Settings | `/settings` | User settings |
| API Settings | `/api-settings` | API configuration |
| Reports | `/reports` | Analytics |

### 9.4 Utility Pages
| Page | Route | Description |
|------|-------|-------------|
| Onboarding | `/onboarding` | New user setup |
| Track Shipment | `/track-shipment` | Shipment tracking |
| Track Simple | `/track-simple` | Simple tracking |
| Invite Supplier | `/invite-supplier` | Supplier invitations |
| Chat Support | `/chat-support` | Customer support |
| Products | `/products` | Product catalog |
| Recycle Bin | `/recycle-bin` | Deleted items |

---

## 10. State Management

### 10.1 Storage Strategy
- **Primary:** localStorage (browser-based)
- **Pattern:** Singleton storage instances
- **Migration:** Legacy data auto-upgrade support

### 10.2 Storage Keys
| Key | Purpose |
|-----|---------|
| `befach-calculations-v2` | Calculation history |
| `befach-vendors` | Vendor records |
| `befach-vendor-documents` | Vendor documents |
| `befach-vendor-activities` | Activity timeline |
| `befach-supplier-relationships` | Saved suppliers |
| `befach-conversations` | Chat messages |
| `befach-requirements` | Sourcing requirements |
| `befach-market-watchlist` | Market tracking |
| `befach-theme` | Theme preference |
| `befach-sidebar-collapsed` | Sidebar state |

### 10.3 Context Providers
| Context | Purpose |
|---------|---------|
| ThemeProvider | Light/dark theme management |
| UserModeContext | User state and preferences |
| WizardProvider | Calculator wizard state |

### 10.4 Data Flow
```
User Action
    ↓
React Component
    ↓
Hook (useState/useEffect)
    ↓
Library Utility Function
    ↓
localStorage
    ↓
Component Re-render
```

---

## 11. Third-Party Integrations

### 11.1 Planned Carrier Integrations
| Carrier | Type | API Status |
|---------|------|------------|
| DHL | Express | Planned |
| FedEx | Express | Planned |
| UPS | Express | Planned |
| Shiprocket | Domestic | Planned |
| Aramex | Express | Planned |

### 11.2 Data Integrations
| Integration | Purpose | Status |
|-------------|---------|--------|
| Currency API | Exchange rates | Planned |
| HS Code DB | Duty rates | Planned |
| Port Database | Shipping routes | Planned |
| ICEGATE | Customs data | Planned |

### 11.3 Payment Integrations
| Provider | Purpose | Status |
|----------|---------|--------|
| Razorpay | Payments | Planned |
| Stripe | International | Planned |

---

## 12. Security & Compliance

### 12.1 Security Measures
| Measure | Implementation |
|---------|----------------|
| HTTPS | Enforced in production |
| CORS | Configured whitelist |
| Helmet.js | Security headers |
| Input Validation | Server-side validation |
| JWT | Token-based auth (planned) |
| Data Encryption | Sensitive data encrypted |

### 12.2 Data Privacy
- GDPR compliance considerations
- Data retention policies
- User consent management
- Export/delete user data capability

### 12.3 Compliance Standards
- ICEGATE integration for customs
- IEC (Import Export Code) validation
- GST compliance for Indian market
- PCI DSS for payment data (planned)

---

## 13. Performance Metrics

### 13.1 Frontend Performance
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Bundle Size | < 500KB gzipped |

### 13.2 Backend Performance
| Metric | Target |
|--------|--------|
| API Response Time | < 200ms |
| Throughput | 1000 req/s |
| Error Rate | < 0.1% |
| Uptime | 99.9% |

### 13.3 Business Metrics
| Metric | Current/Target |
|--------|----------------|
| Shipments Tracked | 500K+ |
| Countries Covered | 200+ |
| Carrier Integrations | 50+ |
| Calculation Accuracy | 99.8% |

---

## 14. Future Roadmap

### Phase 1: Foundation (Current)
- [x] Complete UI prototype
- [x] Backend API structure
- [x] Component library
- [ ] Database integration (PostgreSQL)
- [ ] User authentication

### Phase 2: Core Features
- [ ] Real cost calculations with live duty rates
- [ ] Carrier API integrations
- [ ] Payment gateway
- [ ] Email notifications
- [ ] File uploads

### Phase 3: Intelligence
- [ ] AI supplier matching
- [ ] Price prediction models
- [ ] Market trend analysis
- [ ] Automated compliance checks
- [ ] Smart alerts

### Phase 4: Scale
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Enterprise features
- [ ] API marketplace
- [ ] Partner integrations

### Phase 5: Expansion
- [ ] Additional markets (SEA, Middle East)
- [ ] Export features
- [ ] Trade finance integration
- [ ] Blockchain documentation

---

## Appendix

### A. Color Scheme
```css
/* Primary */
--primary: #ff6b35 (Orange)
--primary-dark: #e55a2b
--primary-light: #ff8c5a

/* Neutral */
--background-light: #ffffff
--background-dark: #0f0f0f
--text-light: #1a1a1a
--text-dark: #f5f5f5

/* Status */
--success: #22c55e
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### B. Typography
```css
/* Font Family */
font-family: 'Inter', sans-serif

/* Weights */
Light: 300
Regular: 400
Medium: 500
Semibold: 600
Bold: 700

/* Sizes */
xs: 0.75rem
sm: 0.875rem
base: 1rem
lg: 1.125rem
xl: 1.25rem
2xl: 1.5rem
3xl: 1.875rem
```

### C. Spacing System
```css
/* Border Radius */
sm: 6px
md: 10px
lg: 14px
xl: 18px
full: 9999px

/* Spacing Scale */
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
```

### D. Breakpoints
```css
/* Responsive */
Mobile: < 768px
Tablet: 768px - 1023px
Desktop: 1024px - 1279px
Large: >= 1280px
```

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Author:** BEFACH Development Team
