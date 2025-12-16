# Befach International - Import Services Platform

**AI-powered trade intelligence platform for global import/export operations.**

---

## Project Status

| Area | Status | Progress |
|------|--------|----------|
| UI/Frontend | Complete | 100% |
| Backend Structure | Complete | 100% |
| Database | Pending | 0% |
| Authentication | Pending | 0% |
| API Integration | Pending | 0% |

**Current Phase:** 1 - Foundation  
**Launch Target:** Beta Dec 2025

---

## Quick Start

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

### Backend (Express.js)
```bash
cd backend
npm install
npm run dev    # http://localhost:5000
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Custom CSS (Inter font) |
| Backend | Express.js, Node.js 18+ |
| Security | Helmet.js, CORS |

---

## Project Structure

```
befach/
├── frontend/                    # Next.js React application
├── backend/                     # Express.js API server
├── ARCHITECTURE/                # System design docs
├── PROCESS_FLOW/               # Development roadmap
├── EXECUTION/                  # Daily work tracking
├── SECURITY_LOGS/              # Security documentation
├── FEATURES_ROADMAP/           # Feature plans
├── POSTPONED_FEATURES/         # Deferred features
├── POSTPONEMENT_REASONS/       # Why features were delayed
├── SOURCES_AND_INSPIRATION/    # Research & inspiration
├── RESOURCES/                  # Team & tools
├── REFERENCES/                 # Standards & APIs
├── CHANGELOG/                  # Version history
├── AGENT_USAGE/               # AI assistance logs
├── CLAUDE_SKILLS_USAGE/       # AI skills tracking
└── INTEGRATIONS/              # Third-party integrations
```

---

## Documentation

### Architecture
- [System Overview](ARCHITECTURE/System_Overview.md) - Platform capabilities
- [Technical Documentation](ARCHITECTURE/Technical_Documentation.md) - Tech specs
- [Frontend Architecture](ARCHITECTURE/Frontend_Architecture.md) - Next.js structure
- [Backend Architecture](ARCHITECTURE/Backend_Architecture.md) - Express.js structure

### Process & Execution
- [Phase 1 Tasks](PROCESS_FLOW/Phase_1_Foundation/Tasks.md) - Current sprint
- [Execution Plan](EXECUTION/EXECUTION_PLAN.md) - Daily workflow
- [Changelog](CHANGELOG/CHANGELOG_MASTER.md) - Version history

### References
- [Project Guide](REFERENCES/Project_Comprehensive_Guide.md) - Complete guide
- [API Inventory](REFERENCES/INTERNAL_APIS/API_Inventory.md) - All endpoints
- [Component Inventory](REFERENCES/CODE_STANDARDS/Component_Inventory.md) - UI components

---

## Features

### Implemented (UI Complete)
- Dashboard with KPIs
- Market Insights
- Smart Sourcing
- Logistics Tracking
- Cost Calculator
- Compliance Tools
- AI Assistant
- Order Management
- Supplier Network
- Team Management
- Settings & Billing

### Coming Soon (Phase 1)
- User authentication
- Database integration
- Real cost calculations
- Order persistence

---

## API Endpoints

### Core APIs (40+ endpoints)
- `/api/auth` - Authentication
- `/api/orders` - Order management
- `/api/suppliers` - Supplier network
- `/api/shipments` - Shipment tracking
- `/api/calculator` - Cost calculation
- `/api/compliance` - BOE filing
- `/api/market` - Market insights
- `/api/ai` - AI assistant

See [API Inventory](REFERENCES/INTERNAL_APIS/API_Inventory.md) for full documentation.

---

## This Week's Goals

- [ ] Set up Supabase database
- [ ] Implement Clerk authentication
- [ ] Wire up cost calculator to backend
- [ ] Deploy to staging

---

## Team

- Befach (CEO, Tech Lead)

---

## Quick Links

| Link | Description |
|------|-------------|
| [Current Phase Plan](PROCESS_FLOW/Phase_1_Foundation/Tasks.md) | What we're building |
| [Today's Tasks](EXECUTION/EXECUTION_UNDER_PROCESS/) | Daily logs |
| [Blockers](EXECUTION/EXECUTION_UNDER_PROCESS/Blockers.md) | What's blocked |
| [Changelog](CHANGELOG/CHANGELOG_MASTER.md) | What's changed |

---

## License

MIT License - see LICENSE file for details.

---

Built with AI assistance by BEFACH International
