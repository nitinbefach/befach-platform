# Cursor Prompt: Implement Dual-Mode Platform Architecture

## Project Context

This is a trade intelligence platform (BEFACH International) built with React frontend and Node.js backend. We need to implement a **"One Platform, Two Modes"** architecture to serve two distinct user segments:

1. **Service Mode** - For MSMEs who want hand-holding and outcomes
2. **Platform Mode** - For corporate/growing companies who want tools and control

## Core Implementation Requirements

### 1. User Mode Selection System

Create a mode selection system that determines user experience throughout the app.

**A. Add User Mode Context (`src/context/UserModeContext.jsx`):**

```jsx
// Create a context that stores:
// - userMode: 'service' | 'platform' | null
// - setUserMode: function to switch modes
// - organization: { name, type, teamSize }
// - userRole: 'owner' | 'admin' | 'member' | 'viewer' (for platform mode)

// Persist mode selection in localStorage
// On first visit, userMode should be null (triggers mode selection)
```

**B. Create Mode Selection Page (`src/pages/ModeSelection.jsx`):**

Display after signup/first visit with two clear options:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         How would you like to use Befach?                   │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐        │
│  │  🚀 BEFACH SERVICE  │    │  🛠️ BEFACH PLATFORM │        │
│  │                     │    │                     │        │
│  │  "I need help       │    │  "I want to manage  │        │
│  │   importing"        │    │   my imports"       │        │
│  │                     │    │                     │        │
│  │  • Submit your      │    │  • Full dashboard   │        │
│  │    requirements     │    │  • Team management  │        │
│  │  • We find          │    │  • Market insights  │        │
│  │    suppliers        │    │  • Cost calculators │        │
│  │  • We handle        │    │  • Compliance tools │        │
│  │    logistics        │    │  • API access       │        │
│  │  • Pay per order    │    │  • Monthly plans    │        │
│  │                     │    │                     │        │
│  │  Best for: Small    │    │  Best for: Teams    │        │
│  │  businesses, first  │    │  with dedicated     │        │
│  │  time importers     │    │  import operations  │        │
│  │                     │    │                     │        │
│  │  [Select Service]   │    │  [Select Platform]  │        │
│  └─────────────────────┘    └─────────────────────┘        │
│                                                             │
│         Not sure? Start with Service - upgrade anytime      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Conditional Navigation/Sidebar

**Modify the Sidebar component to show different menu items based on userMode:**

**Service Mode Navigation:**
```
MAIN
├── Dashboard (simplified)
├── My Orders
└── Submit Requirement (NEW)

SUPPORT
├── Chat with Expert (NEW)
├── Track Shipment (simplified)
└── Documents

ACCOUNT
├── Profile
├── Billing History (NEW)
└── Settings (simplified)
```

**Platform Mode Navigation:**
```
MAIN
├── Dashboard (full analytics)
├── Market Insights
├── Smart Sourcing
└── My Orders

SOLUTIONS
├── Logistics Tracking
├── Cost Calculator
├── Compliance Tools
└── AI Assistant

TEAM (NEW)
├── Team Members (NEW)
├── Roles & Permissions (NEW)
└── Activity Log (NEW)

ACCOUNT
├── Saved Suppliers
├── Reports (NEW)
├── API Settings (NEW)
└── Settings (full)
```

**Implementation in Sidebar:**
```jsx
// In Sidebar.jsx or Layout component
const { userMode } = useUserMode();

const serviceMenuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'My Orders', path: '/my-orders' },
  { icon: FileText, label: 'Submit Requirement', path: '/submit-requirement' },
  { icon: MessageCircle, label: 'Chat with Expert', path: '/chat-support' },
  { icon: Truck, label: 'Track Shipment', path: '/track-simple' },
  { icon: File, label: 'Documents', path: '/documents' },
  // ... account items
];

const platformMenuItems = [
  // Full existing menu + new items
];

const menuItems = userMode === 'service' ? serviceMenuItems : platformMenuItems;
```

---

### 3. New Pages to Create

#### A. Submit Requirement Page (`src/pages/SubmitRequirement.jsx`) - SERVICE MODE

Simple form for MSMEs to submit sourcing requests:

```
┌─────────────────────────────────────────────────────────────┐
│  Submit Your Import Requirement                             │
│                                                             │
│  Tell us what you need, and we'll handle the rest          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ What product do you want to import? *                 │ │
│  │ [LED Bulbs 9W, E27 Base                            ]  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Quantity Required *                                   │ │
│  │ [5000                    ] [Units ▼]                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Target Price (Optional)                               │ │
│  │ [₹ ] [45        ] per unit                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ When do you need it? *                                │ │
│  │ ( ) Urgent - Within 2 weeks                          │ │
│  │ (•) Normal - Within 4-6 weeks                        │ │
│  │ ( ) Flexible - No rush                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Additional Details                                    │ │
│  │ [                                                   ] │ │
│  │ [                                                   ] │ │
│  │ [Attach reference images or specifications       📎] │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Preferred Contact Method                              │ │
│  │ [•] WhatsApp  [ ] Email  [ ] Phone Call              │ │
│  │ [+91 98765 43210                                   ]  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│           [Submit Requirement]                              │
│                                                             │
│  ✓ Free quote within 24 hours                              │
│  ✓ No commitment required                                  │
│  ✓ Expert guidance included                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. Chat Support Page (`src/pages/ChatSupport.jsx`) - SERVICE MODE

```
┌─────────────────────────────────────────────────────────────┐
│  Chat with Import Expert                        [WhatsApp]  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  👋 Hi! I'm your Befach trade assistant.             │ │
│  │  How can I help you today?                           │ │
│  │                                                       │ │
│  │  Quick Actions:                                       │ │
│  │  [Check Order Status] [Get Quote] [Track Shipment]   │ │
│  │                                                       │ │
│  │                                                       │ │
│  │                              What's the status of    │ │
│  │                              my LED bulbs order?     │ │
│  │                                                       │ │
│  │  Your order ORD-2847 is currently in transit.        │ │
│  │  Expected delivery: Dec 3, 2025                      │ │
│  │  [View Details] [Track on Map]                       │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Type your message...                          ] [➤] │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  💡 Prefer WhatsApp? [Chat on WhatsApp →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### C. Team Management Page (`src/pages/TeamManagement.jsx`) - PLATFORM MODE

```
┌─────────────────────────────────────────────────────────────┐
│  Team Management                          [+ Invite Member] │
│                                                             │
│  Your Plan: Growth (5 seats) - 3 seats used                │
│  ████████████░░░░░░░░ 3/5 seats                            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ TEAM MEMBERS                                          │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ 👤 Rajesh Sharma (You)           Admin    [Manage]    │ │
│  │    rajesh@electromart.in         Owner                │ │
│  │    Last active: Now                                   │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ 👤 Priya Patel                   Member   [Manage]    │ │
│  │    priya@electromart.in          Sourcing             │ │
│  │    Last active: 2 hours ago                           │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ 👤 Amit Kumar                    Viewer   [Manage]    │ │
│  │    amit@electromart.in           Finance              │ │
│  │    Last active: Yesterday                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  PENDING INVITATIONS                                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ✉️ rahul@electromart.in          Sent 2 days ago      │ │
│  │   Role: Member                   [Resend] [Cancel]    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### D. Reports Page (`src/pages/Reports.jsx`) - PLATFORM MODE

```
┌─────────────────────────────────────────────────────────────┐
│  Reports & Analytics                      [+ Create Report] │
│                                                             │
│  ┌─────────┬─────────┬─────────┬─────────┐                 │
│  │ Orders  │ Costs   │ Savings │ Suppliers│                 │
│  │   45    │ $234K   │ ₹18.2L  │   12     │                 │
│  │ +12%    │ +8%     │ +22%    │ +3       │                 │
│  └─────────┴─────────┴─────────┴─────────┘                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Monthly Import Summary ▼] [Last 6 Months ▼] [Export] │ │
│  │                                                       │ │
│  │     📊 [Chart showing import trends over time]        │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  SAVED REPORTS                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📄 Q3 Import Analysis          Nov 15    [Download]   │ │
│  │ 📄 Supplier Performance        Nov 10    [Download]   │ │
│  │ 📄 Cost Savings Report         Nov 1     [Download]   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### E. API Settings Page (`src/pages/ApiSettings.jsx`) - PLATFORM MODE

```
┌─────────────────────────────────────────────────────────────┐
│  API Settings                                               │
│                                                             │
│  Integrate Befach with your existing systems               │
│                                                             │
│  API KEYS                                        [+ New Key]│
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Production Key                                        │ │
│  │ bfch_live_xxxxxxxxxxxxxxxxxxxx          [Show] [Copy] │ │
│  │ Created: Nov 1, 2025  •  Last used: 2 hours ago       │ │
│  │                                         [Regenerate]  │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Test Key                                              │ │
│  │ bfch_test_xxxxxxxxxxxxxxxxxxxx          [Show] [Copy] │ │
│  │ Created: Nov 1, 2025  •  Last used: 5 days ago        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  WEBHOOKS                                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Endpoint URL                                          │ │
│  │ [https://your-erp.com/webhooks/befach              ]  │ │
│  │                                                       │ │
│  │ Events to send:                                       │ │
│  │ [✓] Order status changed                             │ │
│  │ [✓] Shipment updated                                 │ │
│  │ [ ] New quote received                               │ │
│  │ [✓] Document ready                                   │ │
│  │                                         [Save]        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  📚 [View API Documentation]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Modified Dashboards

#### A. Service Mode Dashboard (`src/pages/DashboardService.jsx`)

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, Rajesh! 👋                                   │
│                                                             │
│  YOUR ACTIVE ORDERS                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ 📦 LED Bulbs - 5000 pcs │  │ 📦 Mobile Cases - 2000  │  │
│  │                         │  │                         │  │
│  │ Status: In Transit 🚢   │  │ Status: Finding         │  │
│  │ ETA: Dec 3, 2025        │  │ Suppliers 🔍            │  │
│  │                         │  │                         │  │
│  │ [Track] [Documents]     │  │ [View Quotes]           │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [+ Submit New Requirement]              │   │
│  │                                                      │   │
│  │         Tell us what you need, we'll handle it      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  RECENT ACTIVITY                                            │
│  • Quote received for Mobile Cases - ₹45/unit (3 quotes)   │
│  • LED Bulbs shipment departed Shanghai                     │
│  • Invoice ready for download - ORD-2845                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💬 Need help? Chat with our trade expert            │   │
│  │                                    [Start Chat →]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Ready for more control? [Upgrade to Platform Mode →]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### B. Platform Mode Dashboard (`src/pages/DashboardPlatform.jsx`)

Keep the existing full dashboard but enhance with:
- Team activity feed
- Quick stats for the organization
- Recent activity from all team members
- Shortcuts to frequently used tools

---

### 5. Settings Page Modifications

#### Service Mode Settings (Simplified)
```
- Profile Information (name, email, phone, company)
- Notification Preferences (WhatsApp, Email, SMS)
- Billing & Invoices
- Switch to Platform Mode
```

#### Platform Mode Settings (Full)
```
- Organization Profile
- Team Management (link)
- Billing & Subscription
- API Settings (link)
- Notification Preferences
- Security (2FA, Sessions)
- Data Export
- Switch to Service Mode
```

---

### 6. Mode Switching Component

Create a component that allows users to switch between modes:

**`src/components/ModeSwitcher.jsx`**

```jsx
// Show in Settings page and as a banner for upgrade prompts
// Service → Platform: Show benefits, pricing info
// Platform → Service: Confirm downgrade, explain what they'll lose access to

// Upgrade prompt conditions (show to Service Mode users):
// - After 5+ orders completed
// - When they try to access Platform-only features
// - After 30 days of active use
```

---

### 7. Route Protection

**`src/utils/routeGuards.js`**

```javascript
// Define which routes are accessible in which mode

const serviceOnlyRoutes = [
  '/submit-requirement',
  '/chat-support',
  '/track-simple',
];

const platformOnlyRoutes = [
  '/market-insights',
  '/smart-sourcing',
  '/cost-calculator',
  '/compliance-tools',
  '/ai-assistant',
  '/saved-suppliers',
  '/team-management',
  '/reports',
  '/api-settings',
];

const sharedRoutes = [
  '/dashboard',
  '/my-orders',
  '/settings',
  '/documents',
];

// Redirect logic:
// - If Service user tries to access Platform route → Show upgrade modal
// - If Platform user accesses Service route → Redirect to Platform equivalent
```

---

### 8. Database/State Schema Updates

**User Model additions:**
```javascript
{
  // Existing fields...
  
  // New fields for dual-mode
  userMode: {
    type: String,
    enum: ['service', 'platform'],
    default: null // null means mode not yet selected
  },
  organization: {
    name: String,
    type: String, // 'individual', 'company'
    teamSize: String, // '1', '2-5', '6-20', '20+'
  },
  subscription: {
    plan: String, // 'pay-per-service', 'starter', 'growth', 'enterprise'
    seats: Number,
    validUntil: Date,
  },
  teamRole: {
    type: String,
    enum: ['owner', 'admin', 'member', 'viewer'],
    default: 'owner'
  },
  invitedBy: ObjectId, // Reference to user who invited (for team members)
}
```

---

### 9. Component Library Additions

Create these reusable components:

```
src/components/
├── ModeGate.jsx          // Conditionally render based on mode
├── UpgradePrompt.jsx     // Modal/banner for upgrade suggestions
├── ModeSwitcher.jsx      // Switch between modes
├── ServiceCard.jsx       // Card component for service mode
├── PlatformCard.jsx      // Card component with more data
├── TeamMemberCard.jsx    // Display team member info
├── QuickAction.jsx       // Big action buttons for service mode
└── StatCard.jsx          // Statistics display (different for each mode)
```

**ModeGate Usage:**
```jsx
<ModeGate mode="platform" fallback={<UpgradePrompt />}>
  <MarketInsights />
</ModeGate>
```

---

### 10. API Endpoint Additions

```
POST /api/user/select-mode        // Set initial mode selection
POST /api/user/switch-mode        // Switch between modes
GET  /api/user/mode               // Get current mode and permissions

POST /api/requirements            // Submit requirement (service mode)
GET  /api/requirements            // List user's requirements
GET  /api/requirements/:id        // Get requirement details

POST /api/team/invite             // Invite team member (platform mode)
GET  /api/team/members            // List team members
PUT  /api/team/members/:id/role   // Update member role
DELETE /api/team/members/:id      // Remove team member

GET  /api/reports                 // List saved reports (platform mode)
POST /api/reports/generate        // Generate new report
GET  /api/reports/:id/download    // Download report

POST /api/api-keys                // Create API key (platform mode)
GET  /api/api-keys                // List API keys
DELETE /api/api-keys/:id          // Revoke API key
```

---

## Implementation Priority

### Phase 1: Core Mode System
1. UserModeContext and mode selection page
2. Conditional sidebar navigation
3. Mode-specific dashboard (simplified versions)
4. Route protection and redirects

### Phase 2: Service Mode Features
1. Submit Requirement page and flow
2. Chat Support integration
3. Simplified order tracking
4. Service mode settings

### Phase 3: Platform Mode Enhancements
1. Team Management
2. Reports page
3. API Settings
4. Enhanced existing features with team context

### Phase 4: Polish
1. Upgrade prompts and flows
2. Mode switching with data migration
3. Onboarding flows for each mode
4. Analytics for mode usage

---

## Design Guidelines

### Service Mode
- Larger buttons, more whitespace
- Fewer options, clearer CTAs
- Prominent support/chat options
- Progress indicators for orders
- Green/friendly color accents
- Mobile-first design

### Platform Mode
- Data-dense layouts
- Tables with sorting/filtering
- Multiple quick actions
- Keyboard shortcuts
- Professional/corporate feel
- Dashboard customization options

---

## Files to Modify

1. `src/App.jsx` - Add mode context provider, route guards
2. `src/components/Sidebar.jsx` - Conditional menu items
3. `src/pages/Dashboard.jsx` - Split into two versions or conditional rendering
4. `src/pages/Settings.jsx` - Mode-specific settings
5. `src/components/Layout.jsx` - Add mode indicator in header

## Files to Create

1. `src/context/UserModeContext.jsx`
2. `src/pages/ModeSelection.jsx`
3. `src/pages/SubmitRequirement.jsx`
4. `src/pages/ChatSupport.jsx`
5. `src/pages/TeamManagement.jsx`
6. `src/pages/Reports.jsx`
7. `src/pages/ApiSettings.jsx`
8. `src/pages/DashboardService.jsx`
9. `src/pages/DashboardPlatform.jsx`
10. `src/components/ModeGate.jsx`
11. `src/components/UpgradePrompt.jsx`
12. `src/components/ModeSwitcher.jsx`
13. `src/utils/routeGuards.js`

---

## Important Notes

- Maintain consistent branding across both modes
- Service mode should feel simpler, not cheaper
- Platform mode should feel powerful, not overwhelming
- Always provide clear upgrade/downgrade paths
- Track which features users try to access for upgrade insights
- Consider A/B testing mode selection copy

Generate all the necessary code following the existing project's coding style, component patterns, and design system. Use the existing UI components and styling approach (Tailwind CSS with the current color scheme and component structure).
