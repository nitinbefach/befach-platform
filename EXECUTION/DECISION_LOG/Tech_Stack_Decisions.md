# Tech Stack Decisions

**Last Updated:** November 27, 2025

---

## Decision 001: Database & Authentication Provider

**Date:** November 27, 2025  
**Decision Maker:** Project Owner  
**Status:** APPROVED

### Context
Need to select database and authentication providers for the Befach platform. Options considered:
- Supabase (all-in-one)
- Supabase + Clerk
- PlanetScale + Clerk
- Neon + Clerk

### Decision
**Selected: Supabase All-in-One**

### Rationale
1. **Simplicity** - Single service for database + auth + storage
2. **Cost Efficiency** - Great free tier, $25/month for Pro
3. **Speed** - Faster to set up and integrate (1 service vs 2)
4. **PostgreSQL** - Perfect for structured trade data (orders, suppliers, calculations)
5. **Built-in Features** - Row Level Security, Real-time, Storage included
6. **Future Ready** - Auth can be added when needed without migration

### Implementation Plan
1. Phase 1: Database setup (NOW)
2. Phase 2: Authentication (LATER)
3. Phase 3: Storage for documents (LATER)

### Trade-offs Accepted
- Supabase Auth UI is less polished than Clerk
- Less advanced auth features (acceptable for MVP)
- Vendor lock-in to Supabase ecosystem

### Alternatives Rejected

| Option | Why Rejected |
|--------|--------------|
| Supabase + Clerk | Unnecessary complexity, two services to manage |
| PlanetScale | MySQL instead of PostgreSQL, no built-in auth |
| Neon | Newer service, less mature ecosystem |
| MongoDB | NoSQL not ideal for relational trade data |

### Success Metrics
- Database connected and working
- Orders/suppliers persist after restart
- < 500ms query response time
- Zero data loss

---

## Decision 002: ORM Selection

**Date:** November 27, 2025  
**Decision Maker:** Tech Lead  
**Status:** APPROVED

### Decision
**Selected: Prisma ORM**

### Rationale
1. Type-safe queries (works great with TypeScript)
2. Easy migrations and schema management
3. Auto-generated client
4. Great Supabase integration
5. Excellent documentation

### Alternatives Rejected
- Raw SQL (too verbose, error-prone)
- Knex.js (less type safety)
- Drizzle (newer, less documentation)
- Supabase JS Client (less control over queries)

