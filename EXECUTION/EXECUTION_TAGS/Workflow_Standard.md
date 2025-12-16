# BEFACH Project - Execution Tags & Daily Workflow

**Purpose:** Quick reference for day-to-day development  
**Last Updated:** November 27, 2025

---

## 🏷️ Execution Tags Reference

### Tag Format
```
[TAG] Component/Feature: Brief description
```

### Complete Tag List

#### 1. Implementation Tags
```
[IMPL] - New feature implementation
[IMPL-FRONTEND] - Frontend implementation
[IMPL-BACKEND] - Backend implementation
[IMPL-DB] - Database schema/query implementation
[IMPL-API] - API endpoint implementation
[IMPL-INTEGRATION] - Third-party integration
```

**Example Usage:**
```
[IMPL-BACKEND] Cost Calculator: Create /api/calculator endpoint with landed cost logic
[IMPL-DB] Orders: Add orders table with foreign key to users
[IMPL-FRONTEND] Dashboard: Create main dashboard layout with stat cards
```

---

#### 2. Bug Fix Tags
```
[BUG-CRITICAL] - Application breaking, must fix immediately
[BUG-MAJOR] - Feature broken, impacts user
[BUG-MINOR] - Non-critical issue, low impact
[BUG-UI] - Frontend display issue
[BUG-API] - API endpoint not working
[BUG-DB] - Database query issue
[BUG-SECURITY] - Security vulnerability
```

**Example Usage:**
```
[BUG-CRITICAL] API: CORS error prevents authentication on production
[BUG-MINOR] UI: Sidebar collapse animation stutters on mobile
[BUG-SECURITY] Auth: API key exposed in error logs
```

---

#### 3. Enhancement Tags
```
[ENH] - General improvement
[ENH-PERF] - Performance optimization
[ENH-UX] - User experience improvement
[ENH-ACCESSIBILITY] - Accessibility enhancement
[ENH-SECURITY] - Security hardening
[ENH-CODE] - Code quality improvement
```

**Example Usage:**
```
[ENH-PERF] Database: Add indexing to orders query (currently 2s, target <200ms)
[ENH-UX] Dashboard: Add loading skeleton for better perceived performance
[ENH-ACCESSIBILITY] Forms: Add proper ARIA labels and focus states
```

---

#### 4. Documentation Tags
```
[DOC] - Documentation writing/updating
[DOC-API] - API documentation
[DOC-CODE] - Code documentation/comments
[DOC-GUIDE] - Setup/deployment guide
[DOC-ARCH] - Architecture documentation
```

**Example Usage:**
```
[DOC-API] Cost Calculator: Document /api/calculator endpoint (request/response)
[DOC-GUIDE] Deployment: Write Vercel + Railway deployment guide
[DOC-CODE] Orders: Add JSDoc comments to order service functions
```

---

#### 5. Testing Tags
```
[TEST] - Testing task
[TEST-UNIT] - Unit testing
[TEST-INTEGRATION] - Integration testing
[TEST-E2E] - End-to-end testing
[TEST-SECURITY] - Security testing
[TEST-PERF] - Performance/load testing
```

**Example Usage:**
```
[TEST-UNIT] Calculator: Write tests for landed cost calculation logic
[TEST-E2E] Orders: Test complete flow from creation to tracking
[TEST-SECURITY] API: Vulnerability scan with OWASP Top 10 checklist
```

---

#### 6. Deployment Tags
```
[DEPLOY] - Deployment related
[DEPLOY-STAGING] - Deploy to staging environment
[DEPLOY-PRODUCTION] - Deploy to production
[DEPLOY-MIGRATION] - Database migration
[DEPLOY-CONFIG] - Environment/configuration change
```

**Example Usage:**
```
[DEPLOY-STAGING] Frontend: Deploy v0.3.0 to Vercel staging
[DEPLOY-MIGRATION] Database: Run migration for orders table schema change
[DEPLOY-PRODUCTION] Release: Deploy v1.0.0 beta to production
```

---

#### 7. Dependency/Blocking Tags
```
[BLOCKED] - Task blocked by dependency
[DEPENDS-ON] - Task depends on something else
[WAITING] - Waiting for third-party (API response, approval, etc.)
[UNBLOCKED] - Previously blocked task is now unblocked
```

**Example Usage:**
```
[BLOCKED] Orders API: Waiting on Supabase schema setup
[DEPENDS-ON] Market Insights: Requires integration with Zauba API
[WAITING] Payment Integration: Waiting for Razorpay sandbox credentials
```

---

#### 8. Code Review Tags
```
[REVIEW] - Needs code review
[REVIEW-APPROVED] - Code review passed
[REVIEW-CHANGES] - Requested changes from review
[REFACTOR] - Code refactoring needed
```

**Example Usage:**
```
[REVIEW] Backend: Cost calculator API needs review before merge
[REFACTOR] Frontend: Sidebar component is too large (500+ lines), split into subcomponents
```

---

#### 9. Investigation Tags
```
[INVESTIGATE] - Need to research/investigate
[RESEARCH] - Technology/approach research
[SPIKE] - Time-boxed investigation
```

**Example Usage:**
```
[INVESTIGATE] Performance: Why is cost calculator slow? (Database query or calculation?)
[RESEARCH] AI Integration: Compare Claude vs OpenAI vs Anthropic for this use case
[SPIKE] Mobile: 2-day investigation on React Native vs Flutter viability
```

---

#### 10. Administrative Tags
```
[ADMIN] - Administrative/process task
[MEETING] - Meeting or discussion
[PLANNING] - Planning/roadmap work
[TECH-DEBT] - Technical debt that needs addressing
```

**Example Usage:**
```
[ADMIN] Onboarding: Set up new team member with access
[PLANNING] Phase 2 Planning: Schedule feature prioritization meeting
[TECH-DEBT] Backend: Replace in-memory storage with database (currently critical)
```

---

## 📝 Daily Execution Log Template

Create file: `EXECUTION/EXECUTION_UNDER_PROCESS/Daily_Log_[DATE].md`

```markdown
# Daily Execution Log - November 27, 2025

## 🎯 Today's Goals
- [ ] [IMPL-DB] Create orders table schema
- [ ] [IMPL-BACKEND] Wire up cost calculator API
- [ ] [DOC-API] Document cost calculator endpoint
- [ ] [TEST-UNIT] Write calculator tests

## ⚡ In Progress
- [IMPL-FRONTEND] Dashboard stat cards (50% complete)
  - Started 9:00 AM
  - Blockers: None
  - ETA: 2 more hours

## ✅ Completed Today
- [IMPL-FRONTEND] Sidebar collapsible functionality
- [ENH-PERF] Optimize sidebar re-renders

## 🚫 Blocked/Issues
- [BLOCKED] Cost Calculator API - Waiting on database schema setup
  - Dependency: [IMPL-DB] Create orders table
  - Workaround: Using mock data for now
  - Blocker Since: 10:30 AM
  - Solution ETA: 1 hour (when DB setup done)

## 📊 Time Tracking
- Coding: 4 hours
- Debugging: 1 hour
- Documentation: 30 mins
- Meetings: 30 mins
- Total: 6 hours

## 📋 Notes
- [RESEARCH] Need to understand Supabase relationships better
- [TECH-DEBT] Consider refactoring calculator logic into separate file
- [ENH-CODE] Could optimize component rendering with useMemo

## 🔄 Carry Over to Tomorrow
- [ ] [IMPL-DB] Orders table setup
- [ ] [IMPL-BACKEND] Cost calculator API
- [ ] [TEST-UNIT] Write unit tests
```

---

## 📊 Weekly Status Report Template

Create file: `EXECUTION/EXECUTION_UNDER_PROCESS/Weekly_Status_[WEEK].md`

```markdown
# Weekly Status Report - Week of Nov 25-29, 2025

## 🎯 Week's Goals vs. Actual

| Goal | Status | Notes |
|------|--------|-------|
| [IMPL-DB] Database schema | 100% ✅ | Completed ahead of schedule |
| [IMPL-BACKEND] Cost calc API | 50% 🟡 | On track, finishing Monday |
| [IMPL-FRONTEND] Dashboard | 75% 🟡 | Minor delay due to design changes |
| [IMPL-API] 5 endpoints | 40% 🟡 | 2 of 5 completed |
| Phase 1 docs | 60% 🟡 | Architecture docs done, API docs pending |

## 📊 Metrics
- **Velocity:** 13 story points / 40 hours = 32.5 points/week
- **Blocked Time:** 4 hours (Supabase setup)
- **Unplanned Work:** 3 hours (debug CORS issue)
- **Code Quality:** 2 PRs, both approved with no major issues

## 🎉 Wins This Week
- [IMPL-DB] Entire database schema completed and tested
- [ENH-PERF] Optimized dashboard rendering (200ms → 50ms)
- [UNBLOCKED] Supabase setup unblocked 3 dependent tasks
- [REVIEW-APPROVED] Backend API passed code review

## 🚫 Blockers & Issues

| Issue | Severity | Dependency | ETA |
|-------|----------|-----------|-----|
| API CORS error | 🔴 Critical | Auth implementation | Mon Nov 27 |
| Zauba API rate limit | 🟡 Major | Market insights feature | Wed Nov 29 |
| Design feedback pending | 🟡 Major | UI finalization | Fri Dec 1 |

## 📈 Next Week's Focus
- [ ] Complete cost calculator API (Phase 1 critical path)
- [ ] Implement Clerk authentication
- [ ] Start supplier matching logic
- [ ] Begin Phase 2 planning

## 👥 Team Capacity
- Befach: 100% (40 hours)
- [Other team members if any]

## 📝 Learnings & Improvements
1. **Learning:** Supabase relationships are powerful - could use row-level security
2. **Improvement:** Block out time for unplanned work (buffer 10% of sprint)
3. **Process:** Daily standup helped identify blockers early

## 🎯 Risk Assessment
- **Low Risk:** Database setup, auth implementation
- **Medium Risk:** Third-party API integrations
- **High Risk:** Complex business logic in cost calculator
```

---

## 🔍 Execution Tag Statistics Template

Create file: `EXECUTION/EXECUTION_UNDER_PROCESS/Tag_Statistics.md`

```markdown
# Execution Tag Statistics - November 2025

## 📊 Tags by Category

| Category | Count | % of Total | Status |
|----------|-------|-----------|--------|
| IMPL | 24 | 40% | Active |
| BUG | 8 | 13% | 5 fixed, 3 pending |
| ENH | 9 | 15% | 4 done, 5 pending |
| DOC | 12 | 20% | 8 done, 4 pending |
| TEST | 5 | 8% | 3 done, 2 pending |
| DEPLOY | 3 | 5% | 2 staging, 1 prod |
| BLOCKED | 2 | 3% | Both being resolved |
| **Total** | **63** | **100%** | |

## 🎯 Implementation Progress

### By Subsystem
```
Frontend: [████████░░] 80% (12/15 components)
Backend:  [████░░░░░░] 40% (8/20 endpoints)
Database: [██████░░░░] 60% (6/10 schemas)
Auth:     [░░░░░░░░░░] 0% (blocked)
Integration: [██░░░░░░░░] 20% (1/5 systems)
```

### Critical Path
```
[IMPL-DB] Database Schema        ✅ Done
[IMPL-BACKEND] Auth API          🟡 In Progress
[IMPL-BACKEND] Cost Calc API     🟡 In Progress
[IMPL-FRONTEND] Cost Calc UI     ⏳ Waiting
[DEPLOY-STAGING] Staging Deploy  ⏳ Waiting
```

## 🐛 Bug Status

### Critical (🔴)
- [BUG-CRITICAL] CORS error on /api/auth
  - Status: Fixed, testing
  - Time Spent: 2 hours
  - ETA to close: 2 hours

### Major (🟡)
- [BUG-API] Timeout on cost calculator with large datasets
  - Status: Under investigation
  - Time Spent: 1 hour
  - ETA to close: 3 hours

### Minor (🟢)
- [BUG-UI] Sidebar animation stutter
- [BUG-UI] Modal close button alignment

## 📈 Velocity Trend
```
Week 1: 12 story points (setup)
Week 2: 18 story points (+50%)
Week 3: 20 story points (+11%)
Week 4: 16 story points (-20%, blocked by API)
Avg:    16.5 story points
```

## 🎯 Burndown Chart
```
Sprint Total: 60 story points
Completed:    40 story points (66%)
Remaining:    20 story points (34%)
Days Left:     5 days
Daily Rate:    4 points/day
On Track:      YES ✅
```

## ⏰ Time Distribution

| Activity | Hours | % |
|----------|-------|---|
| New Feature Implementation | 32 | 53% |
| Bug Fixing | 12 | 20% |
| Code Review | 8 | 13% |
| Documentation | 6 | 10% |
| Meetings | 4 | 7% |
| Investigation/Research | 3 | 5% |

## 🔮 Forecast
- **Phase 1 Completion:** Dec 15, 2025
- **Confidence:** 85% (blocked by external APIs)
- **Risk Items:** 2 (Zauba API, payment integration)
```

---

## 🚀 Execution Workflow

### Start of Day
1. Open `EXECUTION/EXECUTION_UNDER_PROCESS/Daily_Log_[TODAY].md`
2. Review yesterday's carry-over tasks
3. Check BLOCKED tasks - any unblocked?
4. Review dependencies - what's your critical path?

### During Day
1. When starting new task, add tag:
   ```
   [IMPL-BACKEND] Cost Calculator API: Started at 10:30
   Current Task: Implement /api/calculator/landed-cost endpoint
   Estimated Time: 3 hours
   Blockers: None
   ```

2. When blocked, update tag:
   ```
   [BLOCKED] Cost Calculator API: Waiting on Supabase schema
   Blocker Since: 2:15 PM (45 mins)
   Workaround: Using mock data in meantime
   Expected Resolution: 3:00 PM
   ```

3. When completed, mark and note time:
   ```
   ✅ [IMPL-BACKEND] Cost Calculator API - COMPLETED at 3:00 PM
   Actual Time: 4.5 hours (Est: 3 hours)
   Notes: Had to debug one edge case
   ```

### End of Day
1. Update Daily Log with completed tasks
2. Note any blockers for tomorrow
3. Update carry-over tasks
4. Log time spent

### End of Week
1. Fill out Weekly Status Report
2. Update Tag Statistics
3. Review what went well/poorly
4. Plan next week in PROCESS_FLOW/

---

## 📌 Integration with Other Folders

### EXECUTION → PROCESS_FLOW
Daily [IMPL] tags should match PROCESS_FLOW timeline

### EXECUTION → CHANGELOG
Weekly summary becomes entries in CHANGELOG/

### EXECUTION → AGENT_USAGE
When you [BLOCKED], consider asking Claude for help
Log what help you got in AGENT_USAGE/

### EXECUTION → RESOURCES
Track time spent by tag in RESOURCES/Team_Members.md

---

## 🎯 Example: Multi-Day Implementation

### Day 1
```
[IMPL-DB] Orders Table Schema
- Time: 2 hours
- Created table, defined columns, set constraints
- Status: 80% done (need to add relationships)
```

### Day 2
```
[IMPL-DB] Orders Table Schema (continued)
- Time: 1.5 hours
- Added foreign keys to users and suppliers
- Added indexes for performance
- Status: 100% COMPLETE ✅

[IMPL-BACKEND] Order CRUD API
- Time: 3 hours (started 10am, finished 1pm)
- Implemented GET, POST, PUT, DELETE /api/orders
- Status: 100% COMPLETE ✅

[TEST-UNIT] Order API Tests
- Time: 2 hours
- Wrote 12 test cases
- Status: 90% (need to test error cases)
```

### Day 3
```
[TEST-UNIT] Order API Tests (continued)
- Time: 1 hour
- Completed error case tests
- All 15 tests passing
- Status: 100% COMPLETE ✅

[REVIEW] Order API PR
- Status: Submitted for review
- ETA for approval: Tomorrow

[DOC-API] Order API Documentation
- Time: 1 hour
- Documented all endpoints with examples
- Status: 100% COMPLETE ✅
```

### Summary for Weekly Report
```
Feature: Order Management API
Tags Used:
- [IMPL-DB]: 3.5 hours
- [IMPL-BACKEND]: 3 hours
- [TEST-UNIT]: 3 hours
- [DOC-API]: 1 hour
- [REVIEW]: 0 hours (just submitted)
Total Time: 10.5 hours
Status: Code complete, under review
Quality: All tests passing, documented
Impact: Unblocks 4 dependent features
```

---

## ✨ Pro Tips

### Tip 1: Atomic Tags
Keep tasks small enough to complete in one day.
```
BAD:  [IMPL-BACKEND] Entire Orders system (too large)
GOOD: [IMPL-BACKEND] Create orders GET endpoint (1-2 hours)
```

### Tip 2: Clear Blockers
If blocked, specify exactly what you're waiting for.
```
BAD:  [BLOCKED] Something is waiting
GOOD: [BLOCKED] API - Waiting for Clerk API keys from team lead
```

### Tip 3: Time Estimates
Always estimate time. Learn from differences.
```
[IMPL-FRONTEND] Dashboard (Est: 3h, Actual: 4.5h)
Reason: More complex responsive design than expected
Learning: Need more buffer for design-heavy tasks
```

### Tip 4: Link Related Tags
Cross-reference related work.
```
[IMPL-BACKEND] Order API
Depends On: [IMPL-DB] Orders table (✅ done)
Blocks: [IMPL-FRONTEND] Order list page
Related: [TEST-UNIT] Order API tests, [DOC-API] Order docs
```

### Tip 5: Regular Review
Review tag statistics weekly to see patterns.
```
If you see: Too many [BUG] tags → code quality issue
If you see: Too many [BLOCKED] → planning issue
If you see: [ENH] never get done → prioritization issue
```

---

**Ready to start tracking your execution!** 🚀

