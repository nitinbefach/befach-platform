# Phase 1 - Foundation Tasks

**Duration:** 4 weeks (Dec 1 - Dec 29, 2025)  
**Goal:** Working MVP with core features  
**Status:** Planning phase

---

## Overview

Phase 1 focuses on establishing the core infrastructure needed to make the platform functional. This includes database setup, user authentication, and connecting the frontend forms to backend APIs.

---

## Week 1: Setup & Authentication

### Database Setup
- [ ] [IMPL] Create Supabase project
- [ ] [IMPL-DB] Design database schema
- [ ] [IMPL-DB] Create users table
- [ ] [IMPL-DB] Create organizations table
- [ ] [IMPL-DB] Create orders table
- [ ] [IMPL-DB] Create suppliers table
- [ ] [DOC] Document database schema

### Authentication
- [ ] [IMPL] Set up Clerk OR Supabase Auth
- [ ] [IMPL-FRONTEND] Create login page
- [ ] [IMPL-FRONTEND] Create registration page
- [ ] [IMPL] Implement session management
- [ ] [IMPL] Add protected routes
- [ ] [TEST] Test auth flow end-to-end
- [ ] [DEPLOY-STAGING] Deploy auth to staging

---

## Week 2: Cost Calculator Backend

### API Development
- [ ] [IMPL-API] Create `/api/calculator/landed-cost` endpoint
- [ ] [IMPL-API] Create `/api/calculator/duty-rates/:hsn` endpoint
- [ ] [IMPL-BACKEND] Implement landed cost calculation logic
- [ ] [IMPL-BACKEND] Add HSN code database/lookup
- [ ] [IMPL-BACKEND] Add currency conversion
- [ ] [IMPL-BACKEND] Add freight rate calculation

### Testing & Documentation
- [ ] [TEST-UNIT] Write calculation tests
- [ ] [DOC-API] Document calculator endpoints
- [ ] [DEPLOY-STAGING] Deploy to staging

---

## Week 3: Database & Orders

### Order Management
- [ ] [IMPL-DB] Create orders table with relationships
- [ ] [IMPL-API] Order CRUD endpoints
  - [ ] GET /api/orders
  - [ ] GET /api/orders/:id
  - [ ] POST /api/orders
  - [ ] PUT /api/orders/:id
  - [ ] DELETE /api/orders/:id

### Frontend Integration
- [ ] [IMPL-FRONTEND] Connect order form to API
- [ ] [IMPL-FRONTEND] Add form validation
- [ ] [IMPL-FRONTEND] Add success/error notifications
- [ ] [IMPL-FRONTEND] Update order list with real data

### Testing
- [ ] [TEST-E2E] End-to-end order flow testing
- [ ] [DEPLOY-STAGING] Staging deploy

---

## Week 4: Polish & Production

### Performance & Security
- [ ] [ENH-PERF] Optimize database queries
- [ ] [ENH-PERF] Add loading states
- [ ] [SEC] Security review
- [ ] [SEC] Input validation audit
- [ ] [SEC] API rate limiting

### Documentation & Deployment
- [ ] [DOC] Complete API documentation
- [ ] [DOC] Update user guides
- [ ] [DEPLOY-PRODUCTION] Production deploy
- [ ] [TEST] Beta user testing (5-10 users)

---

## Dependencies

| Task | Depends On |
|------|-----------|
| Authentication | Supabase/Clerk account setup |
| Orders API | Database schema complete |
| Frontend forms | Backend APIs complete |
| Production deploy | All tests passing |

---

## Blockers (Current)

None identified yet.

---

## Deliverables

By end of Phase 1:
1. Users can register and login
2. Users can calculate landed costs (real calculation)
3. Users can create and view orders
4. Data persists in database
5. Deployed to production

---

## Success Criteria

- [ ] 5 beta users successfully using the platform
- [ ] Cost calculator returns accurate results
- [ ] Zero critical bugs in production
- [ ] < 2 second page load time
- [ ] API response time < 500ms

---

## Resources Needed

- Supabase account (free tier)
- Clerk account (free tier) OR use Supabase Auth
- Vercel account (free tier)
- Railway account ($5/month) for backend

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Auth integration issues | Medium | High | Use Supabase Auth (simpler) |
| Database schema changes | Low | Medium | Design carefully upfront |
| API performance issues | Low | Medium | Add caching early |
| Scope creep | High | Medium | Stick to MVP features only |

