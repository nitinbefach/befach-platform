# Frontend Architecture

**Framework:** Next.js 14 (App Router)  
**Language:** TypeScript  
**Styling:** Custom CSS with CSS Variables  
**Last Updated:** November 27, 2025

---

## Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── globals.css        # Global styles and CSS variables
│   │   ├── dashboard/         # Main dashboard
│   │   ├── market-insights/   # Trade intelligence
│   │   ├── smart-sourcing/    # Supplier matching
│   │   ├── logistics-tracking/# Shipment tracking
│   │   ├── cost-calculator/   # Cost calculation
│   │   ├── compliance-tools/  # BOE filing
│   │   ├── ai-assistant/      # AI chat
│   │   ├── my-orders/         # Order management
│   │   ├── saved-suppliers/   # Supplier network
│   │   ├── settings/          # User settings
│   │   ├── onboarding/        # New user onboarding
│   │   ├── team-management/   # Team members
│   │   ├── reports/           # Analytics reports
│   │   ├── documents/         # Document management
│   │   ├── billing-history/   # Billing records
│   │   ├── api-settings/      # API configuration
│   │   ├── chat-support/      # Support chat
│   │   ├── submit-requirement/# Submit sourcing request
│   │   └── track-simple/      # Simple tracking page
│   │
│   ├── components/            # Reusable React components
│   │   ├── layout/           # Layout components
│   │   │   ├── AppLayout.tsx # Main app wrapper
│   │   │   ├── TopBar.tsx    # Header with search
│   │   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   │   └── index.ts      # Exports
│   │   │
│   │   ├── ui/               # UI components
│   │   │   ├── Modal.tsx     # Dialog component
│   │   │   ├── DataTable.tsx # Data table
│   │   │   ├── StatCard.tsx  # KPI cards
│   │   │   ├── FeatureCard.tsx# Feature showcase
│   │   │   ├── ThemeProvider.tsx # Theme context
│   │   │   ├── DarkModeToggle.tsx # Theme switcher
│   │   │   └── index.ts      # Exports
│   │   │
│   │   └── onboarding/       # Onboarding components
│   │       ├── GuidedTour.tsx # Interactive tour
│   │       └── index.ts      # Exports
│   │
│   ├── context/              # React Context providers
│   │   └── UserModeContext.tsx # User state management
│   │
│   └── utils/                # Utility functions
│       └── routeGuards.ts    # Route protection
│
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
└── next-env.d.ts            # Next.js types
```

---

## Pages & Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page with features |
| `/dashboard` | `dashboard/page.tsx` | Main user dashboard |
| `/market-insights` | `market-insights/page.tsx` | Trade data visualization |
| `/smart-sourcing` | `smart-sourcing/page.tsx` | Supplier matching |
| `/logistics-tracking` | `logistics-tracking/page.tsx` | Shipment tracking |
| `/cost-calculator` | `cost-calculator/page.tsx` | Landed cost calculation |
| `/compliance-tools` | `compliance-tools/page.tsx` | BOE filing |
| `/ai-assistant` | `ai-assistant/page.tsx` | AI chatbot |
| `/my-orders` | `my-orders/page.tsx` | Order management |
| `/saved-suppliers` | `saved-suppliers/page.tsx` | Supplier network |
| `/settings` | `settings/page.tsx` | User settings |
| `/onboarding` | `onboarding/page.tsx` | New user setup |
| `/team-management` | `team-management/page.tsx` | Team members |
| `/reports` | `reports/page.tsx` | Analytics |
| `/documents` | `documents/page.tsx` | Document management |
| `/billing-history` | `billing-history/page.tsx` | Billing records |
| `/api-settings` | `api-settings/page.tsx` | API configuration |

---

## Component Architecture

### Layout Components

#### AppLayout.tsx
Main application wrapper that includes:
- TopBar (header)
- Sidebar (navigation)
- Main content area
- Modal management
- Sidebar collapse state

#### TopBar.tsx
Header component with:
- Logo
- Search bar
- Dark mode toggle
- Get Started button
- User menu

#### Sidebar.tsx
Navigation sidebar with:
- Organization badge
- Collapsible sections
- Quick Access (pinned items)
- Navigation items with SVG icons
- Logout button
- Collapse/expand toggle

### UI Components

#### Modal.tsx
Reusable modal dialog:
- Overlay backdrop
- Close button
- Custom content
- Keyboard escape support

#### DataTable.tsx
Generic data table:
- Column definitions
- Row data
- Status badges
- Responsive design

#### StatCard.tsx
KPI display card:
- Icon
- Label
- Value
- Trend indicator
- Gradient background

#### ThemeProvider.tsx
Theme management:
- Light/dark mode context
- localStorage persistence
- System preference detection
- CSS variable updates

---

## State Management

### UserModeContext
Central user state management:

```typescript
interface UserContextType {
  organization: Organization | null;
  subscription: Subscription | null;
  sidebarPreferences: SidebarPreferences;
  hasCompletedTour: boolean;
  updateOrganization: (org: Organization) => void;
  updateSidebarPreferences: (prefs: Partial<SidebarPreferences>) => void;
  completeTour: () => void;
  logout: () => void;
}
```

### Local State
- Component-level state via `useState`
- Form state in page components
- Modal open/close state

---

## Styling

### CSS Variables (globals.css)
```css
:root {
  --bg-primary: #fafbfc;
  --bg-secondary: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a5568;
  --accent-primary: #ff6b35;
  --accent-gradient: linear-gradient(135deg, #ff6b35 0%, #e85a2a 100%);
  --border-color: #e8eaed;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}

[data-theme="dark"] {
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --border-color: #2a2a4a;
}
```

### Font
- **Inter** from Google Fonts
- Weights: 300, 400, 500, 600, 700
- CSS Variable: `--font-inter`

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

---

## Key Features

### Dark Mode
- Toggle in TopBar
- Persists in localStorage
- Respects system preference
- Smooth transitions

### Collapsible Sidebar
- 260px expanded, 68px collapsed
- Persists in localStorage
- Icons only when collapsed
- Tooltips on hover

### Onboarding Flow
1. Company profile setup
2. Goal selection
3. Optional guided tour

### Guided Tour
7-step interactive tour:
1. Dashboard overview
2. Submit requirement
3. Smart sourcing
4. Cost calculator
5. Logistics tracking
6. AI assistant
7. Settings

---

## Dependencies

```json
{
  "next": "14.0.4",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5"
}
```

---

## Build & Deploy

### Development
```bash
npm run dev    # http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
vercel --prod
```

