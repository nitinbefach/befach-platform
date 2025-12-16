# Component Inventory

**Framework:** React 18 + Next.js 14  
**Language:** TypeScript  
**Last Updated:** November 27, 2025

---

## Overview

Reusable UI components located in `frontend/src/components/`.

---

## Component Categories

| Category | Location | Description |
|----------|----------|-------------|
| Layout | `components/layout/` | Page structure components |
| UI | `components/ui/` | Reusable UI elements |
| Onboarding | `components/onboarding/` | User onboarding components |

---

## Layout Components

### AppLayout.tsx

**Purpose:** Main application wrapper with sidebar and top bar.

**Props:**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
}
```

**Features:**
- Sidebar (collapsible)
- TopBar with search
- Modal management
- Responsive design

**Usage:**
```tsx
<AppLayout searchPlaceholder="Search orders...">
  <OrdersPage />
</AppLayout>
```

---

### TopBar.tsx

**Purpose:** Application header with navigation actions.

**Props:**
```typescript
interface TopBarProps {
  onMenuToggle: () => void;
  onGetStarted: () => void;
  searchPlaceholder?: string;
}
```

**Features:**
- Logo (links to homepage)
- Search bar
- Dark mode toggle
- Get Started button
- Mobile menu toggle

---

### Sidebar.tsx

**Purpose:** Navigation sidebar with collapsible sections.

**Props:**
```typescript
interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}
```

**Features:**
- Organization badge
- Collapsible sections
- Pin/unpin items to Quick Access
- SVG icons (no emojis)
- Collapse/expand toggle (260px / 68px)
- Logout button
- Active route highlighting

**Navigation Sections:**
- Main (Dashboard, My Orders)
- Source & Buy (Submit Requirement, Smart Sourcing, Saved Suppliers)
- Tools (Market Insights, Cost Calculator, Compliance, AI)
- Track & Documents (Logistics, Documents)
- Team (Team Management, Reports, API Settings)
- Account (Billing, Settings)

---

## UI Components

### Modal.tsx

**Purpose:** Reusable modal dialog.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**Features:**
- Overlay backdrop (click to close)
- Close button (X)
- Custom title
- Scrollable content
- Keyboard escape support

**Usage:**
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Create Order"
>
  <OrderForm />
</Modal>
```

---

### DataTable.tsx

**Purpose:** Generic data table for displaying records.

**Props:**
```typescript
interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}
```

**Features:**
- Column definitions
- Custom cell rendering
- Status badges
- Empty state message
- Responsive design

**Usage:**
```tsx
<DataTable
  columns={[
    { key: 'id', label: 'Order ID' },
    { key: 'product', label: 'Product' },
    { key: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> }
  ]}
  data={orders}
  emptyMessage="No orders found"
/>
```

---

### StatCard.tsx

**Purpose:** KPI display card with icon and trend.

**Props:**
```typescript
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}
```

**Features:**
- Icon display
- Label and value
- Optional trend indicator
- Gradient background colors

**Usage:**
```tsx
<StatCard
  icon={<OrderIcon />}
  label="Active Orders"
  value="1,245"
  trend="+12.5%"
  color="blue"
/>
```

---

### FeatureCard.tsx

**Purpose:** Feature showcase card for dashboard.

**Props:**
```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}
```

**Features:**
- Icon display
- Title and description
- Link to feature page
- Optional badge (e.g., "NEW")

---

### ThemeProvider.tsx

**Purpose:** Theme context for dark/light mode.

**Context:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**Features:**
- Light/dark mode state
- localStorage persistence
- System preference detection
- CSS variable updates

**Usage:**
```tsx
// In layout
<ThemeProvider>
  {children}
</ThemeProvider>

// In component
const { theme, toggleTheme } = useTheme();
```

---

### DarkModeToggle.tsx

**Purpose:** Theme toggle button.

**Features:**
- Sun/moon icon
- Click to toggle theme
- Smooth animation
- Uses ThemeProvider context

---

## Onboarding Components

### GuidedTour.tsx

**Purpose:** Interactive product tour for new users.

**Props:**
```typescript
interface GuidedTourProps {
  onComplete: () => void;
  onSkip: () => void;
}
```

**Features:**
- 7-step tour
- Highlight target elements
- Next/Previous navigation
- Skip option
- Progress indicator

**Tour Steps:**
1. Dashboard overview
2. Submit requirement
3. Smart sourcing
4. Cost calculator
5. Logistics tracking
6. AI assistant
7. Settings

---

## Context Providers

### UserModeContext.tsx

**Purpose:** User state management.

**Location:** `frontend/src/context/`

**Context:**
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

**Features:**
- Organization profile
- Subscription tier
- Sidebar customization (pinned items, collapsed sections)
- Tour completion status
- localStorage persistence
- Logout functionality

---

## Utilities

### routeGuards.ts

**Purpose:** Route protection utilities.

**Location:** `frontend/src/utils/`

**Functions:**
- Check authentication status
- Redirect unauthenticated users
- Check user permissions

---

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| AppLayout | Complete | Fully functional |
| TopBar | Complete | All features working |
| Sidebar | Complete | Collapsible, customizable |
| Modal | Complete | Reusable |
| DataTable | Complete | Needs sorting/filtering |
| StatCard | Complete | Reusable |
| FeatureCard | Complete | Reusable |
| ThemeProvider | Complete | localStorage persistence |
| DarkModeToggle | Complete | Working |
| GuidedTour | Complete | 7 steps |
| UserModeContext | Complete | State management |

---

## Styling Conventions

### CSS Variables
All components use CSS variables from `globals.css`:
- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`
- `--accent-primary`, `--accent-gradient`
- `--border-color`
- `--radius-sm`, `--radius-md`, `--radius-lg`

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

### Icons
- SVG icons (no emojis)
- Consistent stroke width (1.75)
- 20x20px default size

