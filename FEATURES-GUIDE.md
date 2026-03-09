# BEFACH International — Feature Guide

> **Who this is for:** Anyone who wants to understand what Befach International does and how each feature works — from business users to developers joining the project.

---

## Table of Contents

1. [What is Befach International?](#1-what-is-befach-international)
2. [Landed Cost Calculator](#2-landed-cost-calculator)
3. [Order Management](#3-order-management)
4. [Smart Sourcing (Supplier Search)](#4-smart-sourcing-supplier-search)
5. [Vendor Directory](#5-vendor-directory)
6. [Shipment Tracking](#6-shipment-tracking)
7. [Shipment Booking](#7-shipment-booking)
8. [Compliance Tools](#8-compliance-tools)
9. [Market Insights](#9-market-insights)
10. [EXIM Data Browser](#10-exim-data-browser)
11. [Payments & FX Rates](#11-payments--fx-rates)
12. [AI Assistant](#12-ai-assistant)
13. [Chat Support](#13-chat-support)
14. [Team Management](#14-team-management)
15. [Reports](#15-reports)
16. [Dashboard](#16-dashboard)
17. [Onboarding & Guided Tour](#17-onboarding--guided-tour)
18. [Feedback System](#18-feedback-system)
19. [Account & Settings](#19-account--settings)
20. [Dark Mode & Theming](#20-dark-mode--theming)

---

## 1. What is Befach International?

**Befach International** is an all-in-one **trade intelligence platform** built for Indian importers and exporters. It unifies all the tools a trade business needs into a single command centre.

**The core problem it solves:**  
Indian SMEs dealing in international trade have to juggle multiple tools — spreadsheets for cost calculations, separate portals for customs compliance, email threads with suppliers, and different tracking websites for shipments. Befach brings all of this together in one place.

**Target Users:**
- Indian businesses **importing goods** from China, Vietnam, Bangladesh, etc. (electronics, textiles, raw materials)
- Indian businesses **exporting manufactured goods**
- Trade managers, procurement heads, logistics coordinators

---

## 2. Landed Cost Calculator

> **URL:** `/cost-calculator`

### What it does
The Landed Cost Calculator answers one of the most important questions in trade: **"How much will this product actually cost me after it reaches India?"**

The price you pay a foreign supplier (called the FOB — Free On Board — price) is just the starting point. By the time the goods arrive in India, you also pay:
- **Freight** (shipping cost)
- **Insurance**
- **Basic Customs Duty (BCD)**
- **Social Welfare Surcharge (SWS)** — 10% of the basic duty
- **Integrated GST (IGST)**

The calculator computes all of these automatically.

### How to use it
1. Enter the **product name** and **HSN code** (the 8-digit customs classification code for your product)
2. Enter the **FOB value** in USD (the price you pay the supplier)
3. Select the **country of origin** (where the goods are manufactured)
4. Choose the **shipping method** — Sea or Air
   - Sea freight is estimated at **8% of FOB value**
   - Air freight is estimated at **15% of FOB value**
5. Click **Calculate Landed Cost**

### What you get
- A **waterfall chart** showing how the cost builds up step by step
- A **pie chart** breaking down each cost component
- A detailed **cost breakdown table** with every figure
- The option to **save** the calculation for future reference
- The option to **export as PDF**

### How the calculation works internally
```
FOB Value (what you pay the supplier)
  + Freight (8% sea / 15% air)
  + Insurance (1.25% of FOB + Freight)
= CIF Value (Cost, Insurance, Freight)
  + Basic Customs Duty (BCD) — from HSN duty rate database
  + Social Welfare Surcharge (10% of BCD)
  + IGST (on CIF + BCD + SWS)
= LANDED COST (what the product truly costs you in India)
```

### Calculation History
All past calculations are saved and accessible at `/cost-calculator/history`. You can search, sort, and re-open any previous calculation. Each result has its own shareable URL at `/cost-calculator/results/[id]`.

---

## 3. Order Management

> **URL:** `/my-orders`

### What it does
Tracks all your import orders from the moment you place them to the moment the goods are delivered.

### Order Lifecycle
Each order moves through these statuses:

| Status | Meaning |
|---|---|
| **Processing** | Order has been created, waiting for confirmation |
| **Confirmed** | Supplier has confirmed the order |
| **In Transit** | Goods are on the way |
| **Customs** | Shipment is at customs clearance |
| **Delivered** | Goods have been received |
| **Cancelled** | Order has been cancelled |

### What you can do
- **Create** a new import order with product details, quantity, supplier, FOB value, and destination port
- **View** all orders in a sortable, filterable list
- **Update** the status of any order as it progresses
- **Delete** orders that are no longer relevant
- Each order automatically gets a unique **order number** (e.g., `ORD-4523001`) for tracking

### Information captured per order
- Product name and HSN code
- Quantity and unit (pieces, kg, meters, etc.)
- FOB value and currency
- Supplying country and destination Indian port
- Linked supplier from your vendor directory

---

## 4. Smart Sourcing (Supplier Search)

> **URL:** `/smart-sourcing`

### What it does
Helps you **find the right supplier** for any product. Instead of spending hours searching on Alibaba or other directories, Smart Sourcing lets you search across a curated supplier database and get ranked, relevant results instantly.

### How the search works
The search engine scores suppliers on multiple criteria:
- **Keyword match** — does the supplier deal in your product?
- **Category match** — does their specialization align with what you need?
- **Country filter** — are they in the country you want to source from?
- **Certifications** — do they hold required quality certifications?
- **Rating** — what is their supplier rating?
- **Lead time** — can they deliver within your required timeframe?
- **Price range** — does their pricing fit your budget?
- **MOQ (Minimum Order Quantity)** — can you meet their minimum order?

### What you get
- A ranked list of suppliers with a **match score** shown for each
- Each result shows: supplier name, country, specialization, rating, and matched products
- Click any result to see the full supplier profile with contact details
- **Save a supplier** directly to your Vendor Directory with one click

---

## 5. Vendor Directory

> **URL:** `/our-vendors`

### What it does
Your personal, saved list of suppliers — a private directory that your organization builds over time. Every supplier you save from Smart Sourcing appears here.

### Features
- View all saved suppliers with their ratings and specializations
- Access full supplier profiles including contact information
- See how many orders you have placed with each supplier
- Manage and update supplier details
- Remove suppliers you no longer work with

---

## 6. Shipment Tracking

> **URL:** `/track-shipment`

### What it does
Track the real-time status of any shipment using its tracking number. The tracker shows you **exactly where your shipment is** in its journey from the origin country to your doorstep.

### Tracking timeline
Each tracked shipment shows its progress through these milestones:
1. **Order Placed**
2. **Shipment Booked**
3. **Goods Picked Up**
4. **Departed Origin Port**
5. **In Transit (Ocean/Air)**
6. **Arrived at Destination Port**
7. **Customs Clearance**
8. **Out for Delivery**
9. **Delivered**

### How to use it
1. Enter your **tracking number** (e.g., `MSKU4523789012`)
2. Click **Track Shipment**
3. View the shipment's full journey with dates at each stage

---

## 7. Shipment Booking

> **URL:** `/book-shipment`

### What it does
Book new international or domestic freight shipments directly within Befach. Instead of calling freight forwarders, you can get quotes and book shipments from within the platform.

### Booking options
- **International freight** — sea or air shipments from origin countries to Indian ports
- **Local/domestic logistics** — last-mile delivery from Indian ports to your warehouse or customer

### Booking process
1. Select origin and destination (country, city, port)
2. Enter shipment details (weight, volume, cargo type)
3. Select a carrier and service level
4. Get a quote
5. Confirm the booking

All bookings are saved and accessible for future reference.

---

## 8. Compliance Tools

> **URL:** `/compliance-tools`

### What it does
Handles all the customs and regulatory paperwork that comes with international trade. Compliance failures can lead to shipment delays, fines, or goods being seized — this tool helps you stay on top of all requirements.

### Key features

#### HSN Code Lookup
- Search for the correct **HSN (Harmonized System of Nomenclature)** code for any product
- See the exact **customs duty rate** and **IGST rate** applicable to that product
- Understand the regulatory requirements before you even place an order

#### Bill of Entry (BOE) Management
- **File a new Bill of Entry** for each shipment arriving in India (a mandatory customs document)
- Track the status of all BOE filings
- View past BOE records with all details (port, date, value, duty paid)

#### Compliance Database
- A built-in database of HSN codes with applicable duty rates and trade regulations
- Stay informed about **regulatory alerts** and recent changes in customs rules

#### License Management
- Track import/export licenses and their validity dates
- Get alerts when licenses are approaching expiry

---

## 9. Market Insights

> **URL:** `/market-insights`

### What it does
Gives you a real-time view of **commodity prices, trends, and trade opportunities** — the intelligence you need to make smart sourcing and selling decisions.

### What you can see
- **Market overview** — key indicators like total trade volume, average price changes
- **Commodity price table** — live-style pricing for commodities relevant to your trade
- **Price charts** — historical price trends over different time periods (7 days, 30 days, 90 days, 1 year)
- **Trending products** — which products are seeing increased demand or price movement
- **Market opportunities** — alerts about favorable buying or selling conditions

### Watchlist & Alerts
- **Add any commodity to your Watchlist** — track the specific products you care about
- **Set price alerts** — get notified when a commodity crosses a price threshold you define
- **Compare multiple commodities** side by side (up to 5 at a time)

### Filtering & Sorting
- Filter by product category (metals, polymers, textiles, electronics, etc.)
- Filter by country of origin
- Sort by price, price change %, trading volume, or trend direction
- Adjust the time range for all charts

---

## 10. EXIM Data Browser

> **URL:** `/exim-data`

### What it does
EXIM (Export-Import) data is **actual recorded shipment data** from Indian customs — it shows you what goods were imported or exported, by whom, from where, at what price, and in what quantities.

This is one of the most powerful tools for trade intelligence:
- Research what competitors are importing and at what price
- Verify whether a potential supplier actually exports the goods they claim
- Understand market demand patterns for any product

### How to use it
1. Search by **product name or HSN code**
2. Filter by **country** (origin for imports, destination for exports)
3. Filter by **port of entry/exit**
4. Filter by **date range**
5. Sort by value, quantity, or date

### What each record shows
- Shipper and consignee names
- Product description and HSN code
- Quantity and unit of measurement
- Declared value (in INR and USD)
- Country of origin/destination
- Port of loading and Indian port
- Shipment date

### Export options
- Export filtered results to a spreadsheet for further analysis

---

## 11. Payments & FX Rates

> **URL:** `/payments`

### What it does
Manages all outgoing payments to international suppliers and gives you visibility into foreign exchange rates.

### Payment Management
- **Make a new payment** — initiate a payment to a supplier
- **View payment history** — all past payments with status (pending, processed, failed)
- **Payment methods** — manage which payment gateways or bank accounts you use

### Foreign Exchange (FX) Rates
- View real-time exchange rates for major trading currencies (USD, CNY, EUR, GBP, AED, etc.)
- See rates against INR (Indian Rupee)
- **Set FX rate alerts** — get notified when a currency pair crosses a rate you define
- Historical rate charts to time your payments better

### CSV Export
- Export payment history as a CSV file for accounting or reconciliation

---

## 12. AI Assistant

> **URL:** `/ai-assistant`

### What it does
An always-available trade expert you can ask any question to — without waiting for a human to respond. The AI assistant is specialized in **international trade, customs, and logistics** questions.

### What you can ask
- "What is the customs duty on LED televisions imported from China?"
- "How do I calculate IGST for imports?"
- "What documents are required for importing textiles?"
- "What is the HSN code for stainless steel kitchen utensils?"
- "How does the RoDTEP scheme benefit exporters?"

### How it works
The assistant understands trade-specific terminology and responds with accurate, contextual answers. It keeps a history of your recent queries so you can refer back to previous answers.

---

## 13. Chat Support

> **URL:** `/chat-support`

### What it does
Connects you to Befach's support team directly within the platform. Instead of sending emails or calling, you can resolve issues, ask questions, and get assistance through a live chat interface.

### Features
- Send and receive messages in real time
- Access **quick actions** — predefined shortcuts for the most common support requests (e.g., "Track my shipment", "Billing question", "Report a bug")
- Request a **human agent** if you need to speak with a specialist
- Full chat history preserved for the session

---

## 14. Team Management

> **URL:** `/team-management`

### What it does
Allows you to add team members to your Befach organization and control what each person can access.

### Roles

| Role | What they can do |
|---|---|
| **Owner** | Full access to everything, including billing and team settings |
| **Admin** | Can manage all features and team members (except billing) |
| **Member** | Can use all trade features, cannot manage team |
| **Viewer** | Read-only access — can view data but not make changes |

### How to manage your team
1. Go to **Team Management**
2. Click **Invite Member** and enter their email address
3. Assign them a role
4. They receive an invitation email to join

You can:
- View all current team members and their roles
- Change a member's role at any time
- Remove members from your organization
- View and manage pending invitations
- Resend or cancel invitations

---

## 15. Reports

> **URL:** `/reports`

### What it does
Generates structured reports on your trade activity — giving you shareable, formatted summaries of your business performance.

### Report types
- **Order Summary** — overview of all orders, statuses, and values
- **Cost Analysis** — aggregated landed costing data across all calculations
- **Supplier Performance** — ratings and order history by supplier

### What you can do
- **Generate** a report on demand
- **Track generation status** (reports may take a moment to compile)
- **Download as CSV** for use in Excel or accounting tools
- **Delete** old reports

---

## 16. Dashboard

> **URL:** `/dashboard`

### What it does
The main home screen after you log in. The dashboard gives you an **at-a-glance view of your entire trade activity** — designed so you can understand the health of your business in under 60 seconds.

### What's on the dashboard
- **Business Health Score** — a single number (0–100) representing your overall trade performance
- **Active orders** — count and value of open import orders
- **Recent calculations** — your latest landed cost calculations
- **Shipment status** — quick overview of in-transit shipments
- **Recent activity feed** — a chronological log of actions taken on the platform
- **Quick links** — shortcuts to your most-used features
- **AI Nudges** — smart suggestions from the platform (e.g., "You haven't calculated costs for your last 3 orders")

---

## 17. Onboarding & Guided Tour

> **URL:** `/onboarding`

### What it does
Helps new users get set up quickly and understand the platform through a step-by-step process.

### Onboarding Flow
When you first sign up, the onboarding wizard collects key information:

1. **Company details** — your company name and whether you're a company or individual
2. **Team size** — how big your team is (so the platform personalizes the experience)
3. **Primary goals** — what you mainly want to use Befach for (e.g., sourcing, tracking, compliance)

This information is saved to your organization profile and used to personalize your dashboard.

### Guided Tour
After onboarding, you get a **step-by-step guided tour** of the platform. It highlights each major feature with tooltips and walkthroughs, so you know exactly where everything is without having to explore on your own.

- The tour can be re-triggered from Settings
- Progress is saved, so you can pause and continue later

---

## 18. Feedback System

> **URL:** `/feedback` (and triggered contextually throughout the platform)

### What it does
Collects structured feedback from users to help improve the platform. Befach uses multiple feedback mechanisms to get the most useful signals.

### Feedback types

#### NPS Survey (Net Promoter Score)
- Asks: *"How likely are you to recommend Befach to a friend or colleague?"* on a scale of 0–10
- Appears after key milestones (e.g., after your 5th order, after using the calculator)

#### Micro-feedback
- Quick thumbs up / thumbs down after completing an action
- "Was this calculation helpful?"

#### Feature Ratings
- Rate specific features out of 5 stars
- Leave an optional comment

### What happens to your feedback
- Feedback is stored in the platform's database
- It is **automatically synced to a Google Sheets spreadsheet** for the Befach team to review
- The feedback dashboard at `/feedback` shows all collected feedback with analytics

---

## 19. Account & Settings

> **URL:** `/settings`

### What it does
Central place to manage everything about your account and preferences.

### Settings available
- **Profile** — update your name, email, and phone number
- **Organization** — update your company name, industry, and website
- **Sidebar** — pin or hide specific navigation items to customize your sidebar
- **Notifications** — control which in-app notifications you receive
- **Subscription** — view your current plan and upgrade if needed
- **API Keys** — generate and manage API keys if you want to integrate Befach data with external tools
- **Webhooks** — configure webhooks to send Befach events to your own systems

---

## 20. Dark Mode & Theming

### What it does
Befach fully supports both **Light Mode** and **Dark Mode** to suit your working environment and reduce eye strain during long sessions.

### How to switch
- Click the **moon/sun icon** in the top bar of any authenticated page
- Your preference is saved automatically and remembered on your next visit

---

## Quick Reference: All Features at a Glance

| Feature | Page | Primary Benefit |
|---|---|---|
| Landed Cost Calculator | `/cost-calculator` | Know the true cost of any import before you commit |
| Order Management | `/my-orders` | Track all import orders in one place |
| Smart Sourcing | `/smart-sourcing` | Find verified, rated suppliers for any product |
| Vendor Directory | `/our-vendors` | Your saved supplier rolodex |
| Shipment Tracking | `/track-shipment` | Know where your goods are at all times |
| Shipment Booking | `/book-shipment` | Book freight directly from the platform |
| Compliance Tools | `/compliance-tools` | Stay compliant with customs regulations |
| Market Insights | `/market-insights` | Monitor commodity prices and trends |
| EXIM Data | `/exim-data` | Real trade shipment intelligence |
| Payments & FX | `/payments` | Manage supplier payments and watch exchange rates |
| AI Assistant | `/ai-assistant` | Instant answers to any trade question |
| Chat Support | `/chat-support` | Get help from the Befach team |
| Team Management | `/team-management` | Invite teammates and control their access |
| Reports | `/reports` | Generate and download trade reports |
| Dashboard | `/dashboard` | Your business health at a glance |
| Onboarding | `/onboarding` | Get started quickly with guided setup |
| Feedback | `/feedback` | Share what's working (and what isn't) |
| Settings | `/settings` | Manage account, org, and preferences |

---

*This document is intended to give users and stakeholders a clear, jargon-light understanding of what Befach International does and how each feature serves the trade business. For technical implementation details, refer to `structure.md` and `HOW-IT-WORKS.md`.*
