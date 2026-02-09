# Befach International

AI-powered B2B trade intelligence platform for global import/export operations.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js 18+ |
| Database | PostgreSQL (Supabase) via Prisma ORM |
| Security | Helmet.js, CORS |

## Project Structure

```
befach/
├── frontend/          # Next.js 14 App Router (32+ routes, 80+ components)
├── backend/           # Express.js API server (14 route files, Prisma)
└── docs/              # Architecture, API reference, setup guide
```

## Quick Start

### 1. Clone & install

```bash
git clone <repo-url>
cd befach

cd frontend && npm install
cd ../backend && npm install
```

### 2. Set up environment

```bash
# Copy example env files and fill in your values
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 3. Run dev servers

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd frontend && npm run dev

# Terminal 2 — Backend (http://localhost:5000)
cd backend && npm run dev
```

## Features

- **Dashboard** — KPIs, recent orders, market insights
- **Smart Sourcing** — AI-powered supplier discovery with HSN code search
- **Cost Calculator** — Landed cost estimation with duty rates
- **Book Shipment** — International & local freight booking wizard
- **Track Shipment** — Real-time shipment tracking
- **Payments** — Payment processing, FX rates, payment methods
- **EX-IM Data** — Trade intelligence and shipment records
- **Vendor Management** — Supplier pipeline with relationship stages
- **Compliance Tools** — BOE filing and document management
- **AI Assistant** — Conversational trade intelligence
- **Feedback System** — In-app surveys, NPS, and micro-feedback

## API

All endpoints are served at `/api/`:

| Route | Description |
|-------|-------------|
| `/api/auth` | Authentication (stub) |
| `/api/orders` | Order management (Prisma) |
| `/api/suppliers` | Supplier network (Prisma) |
| `/api/calculator` | Cost calculations |
| `/api/shipments` | Shipment tracking |
| `/api/chat` | AI chat |
| `/api/market` | Market insights |
| `/api/compliance` | BOE & compliance |

See [docs/api-reference.md](docs/api-reference.md) for full documentation.

## Documentation

- [Frontend Architecture](docs/frontend-architecture.md)
- [Backend Architecture](docs/backend-architecture.md)
- [Database Schema](docs/database-schema.md)
- [API Reference](docs/api-reference.md)
- [Setup Guide](docs/setup-guide.md)
- [Product Details](docs/product-details.md)

## License

MIT
